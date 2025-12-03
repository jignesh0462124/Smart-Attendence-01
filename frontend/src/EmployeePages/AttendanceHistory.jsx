import React, { useState, useEffect } from "react";
import {
  Calendar,
  TrendingUp,
  FileText,
  FolderOpen,
  HelpCircle,
  LogOut,
  MapPin,
  ShieldCheck,
  Bell,
  Moon,
} from "lucide-react";
import { Link } from "react-router-dom";
// Assuming UseAuthGuard is a custom hook and available in JS environment
// import { UseAuthGuard } from "../AuthGuard/UseAuthGuard";

// Removed TypeScript interface
// interface AttendanceRecord {
//   date: string;
//   status: string;
//   checkIn: string;
//   checkOut: string;
//   hours: string;
//   location: string;
//   verification: string;
//   type: string;
// }

// Removed : React.FC
const AttendanceHistory = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [view, setView] = useState("list");
  // Removed type annotation for records state
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  // Removed type annotation for error state
  const [error, setError] = useState(null);

  // 🔐 Mock Auth guard check (replace with actual hook if needed)
  // const { isLoading: authLoading } = UseAuthGuard("/");
  const authLoading = false; 

  // Mock records (Removed type annotation)
  const initialRecords = [
    {
      date: "2023-10-26",
      status: "Present",
      checkIn: "09:02 AM",
      checkOut: "06:00 PM",
      hours: "8h 58m",
      location: "Office HQ",
      verification: "Face Scan",
      type: "present",
    },
    {
      date: "2023-10-25",
      status: "Late",
      checkIn: "09:15 AM",
      checkOut: "06:30 PM",
      hours: "9h 15m",
      location: "Office HQ",
      verification: "Face Scan",
      type: "late",
    },
    {
      date: "2023-10-24",
      status: "Present",
      checkIn: "08:55 AM",
      checkOut: "05:55 PM",
      hours: "9h 00m",
      location: "Remote",
      verification: "Geofence",
      type: "present",
    },
    {
      date: "2023-10-23",
      status: "Present",
      checkIn: "09:00 AM",
      checkOut: "06:00 PM",
      hours: "9h 00m",
      location: "Office HQ",
      verification: "Face Scan",
      type: "present",
    },
    {
      date: "2023-10-20",
      status: "Leave",
      checkIn: "-",
      checkOut: "-",
      hours: "-",
      location: "-",
      verification: "-",
      type: "leave",
    },
  ];

  useEffect(() => {
    setRecords(initialRecords);
  }, []);

  // Removed type annotation for parameter 'type'
  const getStatusColor = (type) => {
    if (type === "present") return "bg-green-100 text-green-700";
    if (type === "late") return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  // ⏳ Show loader while auth is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-sm text-gray-600">Checking authentication...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
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
        <nav className="flex-1 p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Main Menu
          </p>
          <div className="space-y-1">
            <Link
              to="/employee-dashboard"
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-left"
            >
              <TrendingUp className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            <button className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg bg-indigo-50 text-indigo-600 font-medium text-left">
              <FolderOpen className="w-5 h-5" />
              <span>Attendance History</span>
            </button>
            <Link
              to="/leave"
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-left"
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
          <button className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-left">
            <HelpCircle className="w-5 h-5" />
            <span>Helpdesk</span>
          </button>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <Link to="/profile" className="flex items-center space-x-3 mb-3 ">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
              SJ
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">
                Sarah Johnson
              </p>
              <p className="text-xs text-gray-500">Senior Engineer</p>
            </div>
          </Link>
          {loading && (
            <div className="text-xs text-gray-500 mb-2">Loading...</div>
          )}
          {error && (
            <div className="text-xs text-red-600 mb-2">Error: {error}</div>
          )}
          <div className="flex items-center justify-between">
            <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 text-sm font-medium">
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Attendance History
              </h2>
              <p className="text-gray-600 mt-1">
                Manage your attendance history and records.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                {/* Note: In EmployeeDashboard.jsx they used a ternary for Moon/Sun based on darkMode, here it was hardcoded to Moon. I'll stick to Moon/Sun for consistency */}
                {darkMode ? (
                  <Moon className="w-5 h-5 text-gray-600" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600" />
                )}
              </button>
              <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          {/* Summary Cards */}
          <div className="flex gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 border-l-4 border-l-green-500 flex-1">
              <p className="text-sm text-gray-600 font-medium mb-2">Present</p>
              <h3 className="text-3xl font-bold text-green-600">4</h3>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 border-l-4 border-l-red-500 flex-1">
              <p className="text-sm text-gray-600 font-medium mb-2">Absent</p>
              <h3 className="text-3xl font-bold text-red-600">1</h3>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 border-l-4 border-l-yellow-500 flex-1">
              <p className="text-sm text-gray-600 font-medium mb-2">Late</p>
              <h3 className="text-3xl font-bold text-yellow-600">1</h3>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 border-l-4 border-l-blue-500 flex-1">
              <p className="text-sm text-gray-600 font-medium mb-2">
                Avg Hours
              </p>
              <h3 className="text-3xl font-bold text-blue-600">8.5</h3>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">
                Attendance Records
              </h3>

              <div className="flex space-x-2">
                <button
                  onClick={() => setView("list")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    view === "list"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  List
                </button>
                <button
                  onClick={() => setView("calendar")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    view === "calendar"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Calendar
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                      Check In / Out
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                      Work Hours
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                      Location
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                      Verification
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {record.date}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            record.type
                          )}`}
                        >
                          {record.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        <div>{record.checkIn}</div>
                        <div className="text-gray-500">{record.checkOut}</div>
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                        {record.hours}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span>{record.location}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          {record.verification === "Face Scan" ||
                          record.verification === "Geofence" ? (
                            <ShieldCheck className="w-4 h-4 text-green-600" />
                          ) : (
                            <span className="w-4 h-4"></span>
                          )}
                          <span>{record.verification}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AttendanceHistory;