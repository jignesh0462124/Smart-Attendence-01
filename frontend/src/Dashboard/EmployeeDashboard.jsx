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

// 🛰️ Geolocation + Webcam
import { useGeolocated } from "react-geolocated";
import Webcam from "react-webcam";

// 🔧 Change this if your bucket name is different in Supabase Storage
const ATTENDANCE_BUCKET = "attendance";

const EmployeeDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [darkMode, setDarkMode] = useState(false);

  // Attendance UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attendanceMessage, setAttendanceMessage] = useState("");
  const [attendanceError, setAttendanceError] = useState("");

  // 🔐 If not logged in, go to /signup (Signup.jsx)
  const { user, loading } = useAuthGuard({ redirectTo: "/signup" });

  const navigate = useNavigate();

  // Webcam ref
  const webcamRef = useRef(null);

  // Geolocation hook
  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: true,
      },
      userDecisionTimeout: 10000,
    });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) =>
    date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  const formatDate = (date) =>
    date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });

  // Display name & initials from Supabase user
  const displayName =
    user?.user_metadata?.full_name || user?.email || "Employee";

  const initials = useMemo(() => {
    const name = user?.user_metadata?.full_name || "";
    if (!name) return "EM";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }, [user]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/signup", { replace: true });
  };

  // 🔁 Helper: convert dataURL to Blob
  const dataUrlToBlob = async (dataUrl) => {
    const res = await fetch(dataUrl);
    return await res.blob();
  };

  // ⭐ Core function: mark attendance (clock_in / clock_out)
  const markAttendance = async (type = "clock_in") => {
    setAttendanceError("");
    setAttendanceMessage("");

    if (!user) {
      setAttendanceError("User not found. Please log in again.");
      return;
    }

    if (!isGeolocationAvailable) {
      setAttendanceError("Geolocation is not available in this browser.");
      return;
    }

    if (!isGeolocationEnabled || !coords) {
      setAttendanceError("Please allow location access to mark attendance.");
      return;
    }

    if (!webcamRef.current) {
      setAttendanceError("Webcam not ready. Please allow camera access.");
      return;
    }

    try {
      setIsSubmitting(true);

      // 1️⃣ Capture webcam photo
      const screenshot = webcamRef.current.getScreenshot();
      if (!screenshot) {
        throw new Error("Could not capture photo from webcam.");
      }

      const blob = await dataUrlToBlob(screenshot);

      // 2️⃣ Upload to Supabase Storage
      const fileName = `${user.id}-${Date.now()}.jpg`;
      const filePath = `attendance-photos/${fileName}`; // path inside bucket

      const { data: uploadData, error: storageError } = await supabase.storage
        .from(ATTENDANCE_BUCKET)
        .upload(filePath, blob, {
          contentType: "image/jpeg",
          upsert: false,
        });

      if (storageError) {
        console.error("Storage upload error:", storageError);
        // show Supabase's real message to help debugging
        setAttendanceError(
          `Storage error: ${storageError.message || "Upload failed"}`
        );
        setIsSubmitting(false);
        return;
      }

      // 3️⃣ Get public URL of the uploaded photo
      const { data: publicUrlData } = supabase.storage
        .from(ATTENDANCE_BUCKET)
        .getPublicUrl(filePath);

      const photoUrl = publicUrlData?.publicUrl || null;

      // 4️⃣ Insert row into attendance table
      const { error: insertError } = await supabase.from("attendance").insert({
        user_id: user.id,
        full_name: user.user_metadata?.full_name || null,
        email: user.email,
        latitude: coords.latitude,
        longitude: coords.longitude,
        type,
        photo_url: photoUrl,
        photo_path: filePath, // optional column if you added it
      });

      if (insertError) {
        console.error("Insert error:", insertError);
        setAttendanceError(
          insertError.message || "Failed to save attendance in database."
        );
        setIsSubmitting(false);
        return;
      }

      setAttendanceMessage(
        type === "clock_in"
          ? "Clock-in recorded successfully ✅"
          : "Clock-out recorded successfully ✅"
      );
    } catch (err) {
      console.error("Attendance error:", err);
      setAttendanceError(
        err?.message || "Something went wrong while marking attendance."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const stats = [
    {
      title: "Working Days",
      value: "20",
      subtitle: "Total 26 days this month",
      icon: "📅",
    },
    {
      title: "Attendance",
      value: "95%",
      subtitle: "95% over 10 days",
      icon: "✓",
    },
    {
      title: "Leave Balance",
      value: "12",
      subtitle: "Annual leaves remaining",
      icon: "🔑",
    },
    {
      title: "Next Holiday",
      value: "Diwali",
      subtitle: "Nov 12 - 5 days to go",
      icon: "🎉",
    },
  ];

  const announcements = [
    {
      title: "Q4 All Hands Meeting",
      description:
        "Join us for the quarterly review at 2:00 PM in the main hall or via Zoom.",
      date: "Today",
      dateColor: "bg-blue-100 text-blue-700",
    },
    {
      title: "Office Maintenance",
      description:
        "The 2nd-floor cafeteria will be closed for renovation this weekend.",
      date: "Yesterday",
      dateColor: "bg-gray-100 text-gray-600",
    },
    {
      title: "New Health Benefits",
      description:
        "We have updated our insurance policy to include dental coverage.",
      date: "Oct 28",
      dateColor: "bg-gray-100 text-gray-600",
    },
  ];

  const whosAway = [
    {
      name: "Alex Morgan",
      leave: "Sick Leave (1 Day)",
      avatar: "AM",
      color: "bg-purple-500",
    },
    {
      name: "Justin Case",
      leave: "Annual Leave (Till Oct 28)",
      avatar: "JC",
      color: "bg-blue-500",
    },
  ];

  // 🔄 Fast loader while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-sm text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // If not logged in, useAuthGuard already redirected to /signup
  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Fixed width */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-gray-200 flex-col">
        {/* Logo */}
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

        {/* Main Menu */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Main Menu
          </p>
          <div className="space-y-1">
            <Link
              to="/employee-dashboard"
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg bg-indigo-50 text-indigo-600 font-medium"
            >
              <TrendingUp className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/attendance-history"
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
            >
              <FolderOpen className="w-5 h-5" />
              <span>Attendance History</span>
            </Link>
            <Link
              to="/leave"
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
            >
              <FileText className="w-5 h-5" />
              <span>Leaves</span>
            </Link>
            <Link
              to="/calendar"
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
            >
              <Calendar className="w-5 h-5" />
              <span>Calendar</span>
            </Link>
          </div>

          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-6 mb-3">
            Support
          </p>
          <Link
            to="/helpdesk"
            className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
          >
            <HelpCircle className="w-5 h-5" />
            <span>Helpdesk</span>
          </Link>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <Link to="/profile" className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
              {initials}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">
                {displayName}
              </p>
              <p className="text-xs text-gray-500">Employee</p>
            </div>
          </Link>
          <button
            onClick={handleSignOut}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 w-full">
          <div className="max-w-[960px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Good Morning, {displayName.split(" ")[0] || "there"}!
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                  Here&apos;s what&apos;s happening with your work today.
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  {darkMode ? (
                    <Sun className="w-5 h-5 text-gray-600" />
                  ) : (
                    <Moon className="w-5 h-5 text-gray-600" />
                  )}
                </button>
                <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="w-full">
          <div className="max-w-[960px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100"
                >
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600 font-medium mb-1">
                        {stat.title}
                      </p>
                      <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        {stat.value}
                      </h3>
                    </div>
                    <div className="text-xl sm:text-2xl">{stat.icon}</div>
                  </div>
                  <p className="text-xs text-gray-500">{stat.subtitle}</p>
                </div>
              ))}
            </div>

            {/* Mark Attendance Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-8 mb-6 sm:mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                {/* Left: title + status */}
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                    Mark Attendance
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Don&apos;t forget to clock in before 9:30 AM to avoid late
                    marking.
                  </p>

                  {/* Location status */}
                  <div className="mt-3 text-xs sm:text-sm text-gray-500 space-y-1">
                    {!isGeolocationAvailable && (
                      <p>Geolocation is not available in this browser.</p>
                    )}
                    {isGeolocationAvailable && !isGeolocationEnabled && (
                      <p>Please enable location access in your browser.</p>
                    )}
                    {coords && (
                      <p>
                        Location:{" "}
                        <span className="font-medium text-gray-700">
                          {coords.latitude.toFixed(5)},{" "}
                          {coords.longitude.toFixed(5)}
                        </span>
                      </p>
                    )}
                  </div>

                  {/* Success / error messages */}
                  {attendanceError && (
                    <p className="mt-3 text-xs sm:text-sm text-red-600">
                      {attendanceError}
                    </p>
                  )}
                  {attendanceMessage && (
                    <p className="mt-3 text-xs sm:text-sm text-green-600">
                      {attendanceMessage}
                    </p>
                  )}
                </div>

                {/* Center: Time + Date */}
                <div className="text-center lg:mx-8">
                  <div className="text-2xl sm:text-4xl font-bold text-gray-900">
                    {formatTime(currentTime)}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500 mt-1">
                    {formatDate(currentTime)}
                  </div>
                </div>

                {/* Right: Webcam + Buttons */}
                <div className="flex flex-col items-center gap-3">
                  {/* Webcam preview */}
                  <div className="w-40 h-40 bg-gray-900 rounded-xl overflow-hidden flex items-center justify-center">
                    <Webcam
                      ref={webcamRef}
                      audio={false}
                      screenshotFormat="image/jpeg"
                      className="w-full h-full object-cover"
                      videoConstraints={{ facingMode: "user" }}
                    />
                  </div>
                  {/* Buttons */}
                  <div className="flex gap-3 sm:gap-4 w-full">
                    <button
                      onClick={() => markAttendance("clock_in")}
                      disabled={isSubmitting}
                      className="flex-1 px-4 sm:px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex flex-col items-center text-xs sm:text-sm"
                    >
                      <span className="text-lg sm:text-xl mb-1">→</span>
                      <span>Clock In</span>
                      <span className="text-[10px] sm:text-xs opacity-90 mt-1">
                        Face + Location
                      </span>
                    </button>
                    <button
                      onClick={() => markAttendance("clock_out")}
                      disabled={isSubmitting}
                      className="flex-1 px-4 sm:px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold flex flex-col items-center text-xs sm:text-sm border border-gray-200"
                    >
                      <span className="text-lg sm:text-xl mb-1">←</span>
                      <span>Clock Out</span>
                      <span className="text-[10px] sm:text-xs mt-1">
                        Face + Location
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Announcements and Who's Away */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {/* Announcements */}
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center">
                    <span className="mr-2">📢</span>
                    Announcements
                  </h3>
                  <button className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                    View All
                  </button>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  {announcements.map((announcement, index) => (
                    <div
                      key={index}
                      className="border-l-4 border-indigo-500 bg-gray-50 p-3 sm:p-4 rounded-r-lg"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-sm sm:text-base font-semibold text-gray-900">
                          {announcement.title}
                        </h4>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded whitespace-nowrap ml-2 ${announcement.dateColor}`}
                        >
                          {announcement.date}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {announcement.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Who's Away */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-6">
                  Who&apos;s Away
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  {whosAway.map((person, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 ${person.color} rounded-full flex items-center justify-center text-white font-semibold text-sm`}
                      >
                        {person.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {person.name}
                        </p>
                        <p className="text-xs text-gray-500">{person.leave}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 text-center text-xs sm:text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                  View Team Calendar
                </button>
              </div>
            </div>

            {/* Recent Attendance (static demo) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">
                    Recent Attendance
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    A brief overview of your last few days.
                  </p>
                </div>
                <Link
                  to="/attendance-history"
                  className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  View full history
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-xs text-gray-500">2023-10-26</div>
                    <div className="text-xs text-green-600 font-semibold">
                      Present
                    </div>
                  </div>
                  <div className="text-xs text-gray-600">
                    09:02 AM — 06:00 PM (8h 58m)
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-xs text-gray-500">2023-10-25</div>
                    <div className="text-xs text-yellow-600 font-semibold">
                      Late
                    </div>
                  </div>
                  <div className="text-xs text-gray-600">
                    09:15 AM — 06:30 PM (9h 15m)
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-xs text-gray-500">2023-10-24</div>
                    <div className="text-xs text-green-600 font-semibold">
                      Present
                    </div>
                  </div>
                  <div className="text-xs text-gray-600">
                    08:55 AM — 05:55 PM (9h 00m)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployeeDashboard;
