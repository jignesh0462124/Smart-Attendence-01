// src/Employee/EmployeeDashboard.jsx
import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Calendar,
  TrendingUp,
  FileText,
  FolderOpen,
  HelpCircle,
  LogOut,
  Bell,
  Moon,
  Sun,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthGuard } from "../Authentication/useAuthGuard.jsx";
import { supabase } from "../../supabase/supabase.js";
import { useUserProfile } from "../Authentication/useUserProfile"; 

import { useGeolocated } from "react-geolocated";
import Webcam from "react-webcam";

const ATTENDANCE_BUCKET = "attendance";

import { markAttendanceLogic } from "../utils/attendanceLogic";
import { hasAttendanceToday, getMonthlyAttendance } from "../services/attendanceService";
import { calculateAttendancePercentage } from "../utils/attendancePercentage";

const EmployeeDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [darkMode, setDarkMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attendanceMessage, setAttendanceMessage] = useState("");
  const [attendanceError, setAttendanceError] = useState("");
  const [attendancePercentage, setAttendancePercentage] = useState("0");

  // --- Dynamic History States ---
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const { user, loading: authLoading } = useAuthGuard({ redirectTo: "/signup" });
  const { profile, loadingProfile } = useUserProfile(); 
  const navigate = useNavigate();
  const webcamRef = useRef(null);

  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated({
      positionOptions: { enableHighAccuracy: true },
      userDecisionTimeout: 10000,
    });

  // Fetch only this employee's history
  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      try {
        setLoadingHistory(true);
        
        // 1. Fetch only the 3 most recent records for THIS specific user
        const { data, error } = await supabase
          .from("attendance")
          .select("*")
          .eq("user_id", user.id) 
          .order("date", { ascending: false })
          .limit(3);

        if (error) throw error;
        setRecentAttendance(data || []);

        // 2. Monthly Attendance Rate
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const startDate = `${year}-${String(month + 1).padStart(2, "0")}-01`;
        const endDate = new Date(year, month + 1, 0).toISOString().split("T")[0];

        const records = await getMonthlyAttendance(user.id, startDate, endDate);
        const percentage = calculateAttendancePercentage(records, year, month);
        setAttendancePercentage(percentage);

      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) =>
    date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });

  const formatDate = (date) =>
    date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/signup", { replace: true });
  };

  const markAttendance = async () => {
    setAttendanceError("");
    setAttendanceMessage("");
    if (!user || !coords || !webcamRef.current) return;

    try {
      setIsSubmitting(true);
      const today = new Date().toISOString().split("T")[0];
      const alreadyMarked = await hasAttendanceToday(user.id, today);
      const attendance = markAttendanceLogic(user.id, alreadyMarked);

      const screenshot = webcamRef.current.getScreenshot();
      const res = await fetch(screenshot);
      const blob = await res.blob();

      const fileName = `${user.id}-${Date.now()}.jpg`;
      const filePath = `attendance-photos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(ATTENDANCE_BUCKET)
        .upload(filePath, blob);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from(ATTENDANCE_BUCKET)
        .getPublicUrl(filePath);

      const { error: insertError } = await supabase.from("attendance").insert({
        user_id: user.id,
        full_name: profile.name,
        email: user.email,
        date: attendance.date,
        check_in_time: attendance.checkInTime,
        status: attendance.status,
        latitude: coords.latitude,
        longitude: coords.longitude,
        photo_url: publicUrlData.publicUrl,
      });

      if (insertError) throw insertError;

      setAttendanceMessage("Attendance marked successfully ✅");
      
      // Refresh the history view
      const { data: updated } = await supabase
        .from("attendance")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false })
        .limit(3);
      setRecentAttendance(updated || []);

    } catch (err) {
      setAttendanceError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mock data for static sections
  const stats = [
    { title: "Working Days", value: "20", subtitle: "Total 26 days this month", icon: "📅" },
    { title: "Attendance", value: `${attendancePercentage}%`, subtitle: "This month", icon: "✓" },
    { title: "Leave Balance", value: "12", subtitle: "Annual leaves remaining", icon: "🔑" },
  ];

  if (authLoading || loadingProfile) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - RESTORED ORIGINAL UI */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-gray-200 flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">HRMS Portal</h1>
              <p className="text-xs text-gray-500">EMPLOYEE</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Main Menu</p>
          <div className="space-y-1">
            <Link to="/employee-dashboard" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg bg-indigo-50 text-indigo-600 font-medium">
              <TrendingUp className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            <Link to="/attendance-history" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">
              <FolderOpen className="w-5 h-5" />
              <span>Attendance History</span>
            </Link>
            <Link to="/leave" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">
              <FileText className="w-5 h-5" />
              <span>Leaves</span>
            </Link>
            <Link to="/calendar" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">
              <Calendar className="w-5 h-5" />
              <span>Calendar</span>
            </Link>
          </div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-6 mb-3">Support</p>
          <Link to="/helpdesk" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">
            <HelpCircle className="w-5 h-5" />
            <span>Helpdesk</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <Link to="/profile" className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden">
              {profile.profile_image ? <img src={profile.profile_image} className="w-full h-full object-cover" /> : profile.initials}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900 truncate">{profile.name}</p>
              <p className="text-xs text-gray-500">Employee</p>
            </div>
          </Link>
          <button onClick={handleSignOut} className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 text-sm font-medium">
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content - RESTORED ORIGINAL UI */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 w-full">
          <div className="max-w-[960px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Good Morning, {profile.name.split(" ")[0]}!
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mt-1">Check your work today.</p>
              </div>
              <div className="flex items-center space-x-3">
                <button onClick={() => setDarkMode(!darkMode)} className="p-2 hover:bg-gray-100 rounded-lg">
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                <Link to="/notification">
                  <button className="relative p-2 hover:bg-gray-100 rounded-full">
                    <Bell className="w-6 h-6 text-gray-600" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-[960px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Stats Cards - RESTORED ORIGINAL UI */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600 font-medium mb-1">{stat.title}</p>
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</h3>
                  </div>
                  <div className="text-xl sm:text-2xl">{stat.icon}</div>
                </div>
                <p className="text-xs text-gray-500">{stat.subtitle}</p>
              </div>
            ))}
          </div>

          {/* Mark Attendance Section - RESTORED ORIGINAL UI */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-8 mb-6 sm:mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex-1">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Mark Attendance</h3>
                <p className="text-xs sm:text-sm text-gray-600">Clock in before 9:30 AM.</p>
                {attendanceError && <p className="mt-3 text-xs text-red-600">{attendanceError}</p>}
                {attendanceMessage && <p className="mt-3 text-xs text-green-600">{attendanceMessage}</p>}
              </div>

              <div className="text-center lg:mx-8">
                <div className="text-2xl sm:text-4xl font-bold text-gray-900">{formatTime(currentTime)}</div>
                <div className="text-xs sm:text-sm text-gray-500 mt-1">{formatDate(currentTime)}</div>
              </div>

              <div className="flex flex-col items-center gap-3">
                <div className="w-40 h-40 bg-gray-900 rounded-xl overflow-hidden">
                  <Webcam ref={webcamRef} audio={false} screenshotFormat="image/jpeg" className="w-full h-full object-cover" />
                </div>
                <div className="flex gap-3 w-full">
                  <button onClick={() => markAttendance()} disabled={isSubmitting} className="flex-1 py-3 bg-green-500 text-white rounded-xl font-semibold shadow-lg text-xs sm:text-sm">
                    Clock In
                  </button>
                  <button className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold border text-xs sm:text-sm">
                    Clock Out
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Attendance Section - DYNAMICALLY FILTERED FOR THIS USER */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
              <h3 className="text-lg font-bold text-gray-900">Recent Attendance</h3>
              <Link to="/attendance-history" className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                View full history
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {loadingHistory ? (
                <div className="col-span-3 py-4 text-center text-gray-400">Loading your history...</div>
              ) : recentAttendance.length > 0 ? (
                recentAttendance.map((record, index) => (
                  <div key={index} className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-xs text-gray-500">{record.date}</div>
                      <div className={`text-xs font-semibold ${record.status === 'Present' ? 'text-green-600' : 'text-yellow-600'}`}>
                        {record.status}
                      </div>
                    </div>
                    <div className="text-xs text-gray-600">
                      {record.check_in_time} {record.check_out_time ? `— ${record.check_out_time}` : ''}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 py-4 text-center text-gray-500">No attendance records found for you.</div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployeeDashboard;