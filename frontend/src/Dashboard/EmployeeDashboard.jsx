// src/Dashboard/EmployeeDashboard.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  Calendar,
  TrendingUp,
  FileText,
  FolderOpen,
} from "lucide-react";
import { Link, useOutletContext } from "react-router-dom";
import { supabase } from "../../supabase/supabase.js";
import { useUserProfile } from "../context/UserProfileContext";
import {
  clockIn,
  clockOut,
  getTodayAttendance,
  getAttendanceStats
} from "../services/attendanceService";
import { useGeolocated } from "react-geolocated";
import Webcam from "react-webcam";
import { initializeFaceDetector, detectFaces } from "../services/faceDetectionService";

const ATTENDANCE_BUCKET = "attendance-photos";

const EmployeeDashboard = () => {
  const { userProfile } = useUserProfile();
  const { darkMode } = useOutletContext();

  const [currentTime, setCurrentTime] = useState(new Date());

  // States for attendance
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attendanceMessage, setAttendanceMessage] = useState("");
  const [attendanceError, setAttendanceError] = useState("");
  const [todayStatus, setTodayStatus] = useState(null);
  const [todayRecord, setTodayRecord] = useState(null);

  // Face Detection State
  const [isDetectorReady, setIsDetectorReady] = useState(false);
  const [faceCount, setFaceCount] = useState(0);

  // States for stats
  const [stats, setStats] = useState({
    workingDays: 0,
    presentDays: 0,
    leaves: 0,
    percentage: 0,
    attendanceHistory: []
  });

  const webcamRef = useRef(null);
  const { coords, isGeolocationEnabled } = useGeolocated({
    positionOptions: { enableHighAccuracy: true },
    userDecisionTimeout: 10000,
  });

  // Initialize Face Detector
  useEffect(() => {
    const init = async () => {
      const ready = await initializeFaceDetector();
      setIsDetectorReady(ready);
    };
    init();
  }, []);

  // Run Face Detection Loop
  useEffect(() => {
    let animationFrameId;

    const detectLoop = () => {
      if (isDetectorReady && webcamRef.current && webcamRef.current.video && webcamRef.current.video.readyState === 4) {
        const { numberOfFaces } = detectFaces(webcamRef.current.video);
        setFaceCount(numberOfFaces);
      }
      animationFrameId = requestAnimationFrame(detectLoop);
    };

    if (isDetectorReady) {
      detectLoop();
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [isDetectorReady]);

  // Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch Data
  useEffect(() => {
    if (!userProfile) return;

    const fetchData = async () => {
      try {
        // Today's Status
        const record = await getTodayAttendance(userProfile.id);
        setTodayRecord(record);
        if (record) {
          setTodayStatus(record.check_out ? "Clocked Out" : record.status);
        }

        // Monthly Stats
        const now = new Date();
        const data = await getAttendanceStats(userProfile.id, now.getMonth() + 1, now.getFullYear());
        setStats(data);

      } catch (err) {
        console.error("Dashboard data fetch error:", err);
      }
    };

    fetchData();
  }, [userProfile]);

  const dataUrlToBlob = async (dataUrl) => {
    const res = await fetch(dataUrl);
    return await res.blob();
  };

  const handleClockIn = async () => {
    setAttendanceError("");
    setAttendanceMessage("");

    if (!coords) {
      setAttendanceError("Waiting for location... Please ensure GPS is on.");
      return;
    }

    if (!webcamRef.current) {
      setAttendanceError("Webcam not ready.");
      return;
    }

    try {
      setIsSubmitting(true);

      // Capture Photo
      const screenshot = webcamRef.current.getScreenshot();
      if (!screenshot) throw new Error("Could not capture photo.");

      const blob = await dataUrlToBlob(screenshot);
      const fileName = `${userProfile.id}-${Date.now()}.jpg`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(ATTENDANCE_BUCKET)
        .upload(filePath, blob);

      let photoUrl = "";
      if (!uploadError) {
        const { data } = supabase.storage.from(ATTENDANCE_BUCKET).getPublicUrl(filePath);
        photoUrl = data.publicUrl;
      }

      const newRecord = await clockIn(userProfile.id, photoUrl, coords.latitude, coords.longitude);

      setTodayRecord(newRecord);
      setTodayStatus(newRecord.status);
      setAttendanceMessage("Clocked In Successfully! 🕒");

      const now = new Date();
      const updatedStats = await getAttendanceStats(userProfile.id, now.getMonth() + 1, now.getFullYear());
      setStats(updatedStats);

    } catch (err) {
      setAttendanceError(err.message || "Failed to clock in");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClockOut = async () => {
    setAttendanceError("");
    setAttendanceMessage("");
    try {
      setIsSubmitting(true);
      const updated = await clockOut(userProfile.id);
      setTodayRecord(updated);
      setTodayStatus("Clocked Out");
      setAttendanceMessage("Clocked Out Successfully! 👋");
    } catch (err) {
      setAttendanceError(err.message || "Failed to clock out");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Working Days", value: stats.workingDays, sub: `Total ${stats.totalDays || 30} days`, icon: <Calendar className="w-6 h-6 text-blue-600" />, color: "bg-blue-50" },
          { title: "Attendance", value: `${stats.percentage}%`, sub: "This Month", icon: <TrendingUp className="w-6 h-6 text-green-600" />, color: "bg-green-50" },
          { title: "Present", value: stats.presentDays, sub: "Days Present", icon: <FolderOpen className="w-6 h-6 text-purple-600" />, color: "bg-purple-50" },
          { title: "Leaves Taken", value: stats.leaves, sub: "Approved Leaves", icon: <FileText className="w-6 h-6 text-orange-600" />, color: "bg-orange-50" },
        ].map((stat, i) => (
          <div key={i} className={`rounded-xl p-6 border shadow-sm ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{stat.title}</p>
                <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-lg ${darkMode ? "bg-gray-700" : stat.color}`}>
                {stat.icon}
              </div>
            </div>
            <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Attendance Action */}
      <div className={`rounded-xl shadow-sm border p-6 sm:p-8 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Info Side */}
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">Mark Attendance</h3>
            <p className={`text-sm mb-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              Please clock in by 9:30 AM. Ensure your camera and location are enabled.
            </p>

            <div className="space-y-2 mb-4 text-sm">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isGeolocationEnabled ? "bg-green-500" : "bg-red-500"}`}></span>
                <span className={darkMode ? "text-gray-300" : "text-gray-600"}>
                  {isGeolocationEnabled ? "Location Enabled" : "Location Disabled"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isDetectorReady ? "bg-green-500" : "bg-yellow-500 animate-pulse"}`}></span>
                <span className={darkMode ? "text-gray-300" : "text-gray-600"}>
                  {isDetectorReady ? "Camera Ready" : "Initializing Camera..."}
                </span>
              </div>
              {/* Face Detection Status */}
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${faceCount === 1 ? "bg-green-500" : "bg-red-500"}`}></span>
                <span className={`font-medium ${faceCount === 1 ? "text-green-600" : "text-red-500"}`}>
                  {faceCount === 0 ? "No Face Detected" : faceCount === 1 ? "Face Detected (Ready)" : "Multiple Faces Detected!"}
                </span>
              </div>
              {coords && <div className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Lat: {coords.latitude.toFixed(4)}, Long: {coords.longitude.toFixed(4)}</div>}
            </div>

            {attendanceError && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm mb-4">
                {attendanceError}
              </div>
            )}
            {attendanceMessage && (
              <div className="bg-green-100 text-green-700 p-3 rounded-lg text-sm mb-4">
                {attendanceMessage}
              </div>
            )}
          </div>

          {/* Camera & Buttons */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-64 h-48 bg-black rounded-lg overflow-hidden relative shadow-lg">
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={{ facingMode: "user" }}
                className="w-full h-full object-cover"
                onUserMedia={() => { console.log("Webcam user media loaded"); }}
              />
              {/* Face Bounding Box Overlay (Optional visualization) */}

              {/* Time Overlay */}
              <div className="absolute bottom-0 inset-x-0 bg-black/60 p-2 text-center text-white text-sm font-mono z-10">
                {currentTime.toLocaleTimeString()}
              </div>
            </div>

            <div className="flex gap-4 w-full max-w-sm">
              <button
                onClick={handleClockIn}
                disabled={isSubmitting || (todayRecord && !todayRecord.check_out && todayStatus !== 'Clocked Out') || faceCount !== 1}
                className={`flex-1 py-3 rounded-xl font-bold shadow-md transition-all ${todayRecord || faceCount !== 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
              >
                {faceCount !== 1 ? "Face Check Failed" : "Clock In"}
              </button>
              <button
                onClick={handleClockOut}
                disabled={isSubmitting || !todayRecord || todayRecord.check_out || faceCount !== 1}
                className={`flex-1 py-3 rounded-xl font-bold shadow-md transition-all ${!todayRecord || todayRecord.check_out || faceCount !== 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700 text-white"
                  }`}
              >
                Clock Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent History Table */}
      <div className={`rounded-xl shadow-sm border overflow-hidden ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h3 className="font-bold text-lg">Recent Activity</h3>
          <Link to="/attendance-history" className="text-indigo-600 text-sm font-medium hover:underline">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className={`bg-gray-50 ${darkMode ? "bg-gray-700 text-gray-300" : "text-gray-500"}`}>
              <tr>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Check In</th>
                <th className="px-6 py-3 font-medium">Check Out</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? "divide-gray-700" : "divide-gray-100"}`}>
              {stats.attendanceHistory.slice(0, 5).map((record) => (
                <tr key={record.id} className={darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"}>
                  <td className="px-6 py-4">{new Date(record.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${record.status === 'Present' ? 'bg-green-100 text-green-700' :
                      record.status === 'Late' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{record.check_in ? new Date(record.check_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                  <td className="px-6 py-4">{record.check_out ? new Date(record.check_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                </tr>
              ))}
              {stats.attendanceHistory.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">No attendance records found this month.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;