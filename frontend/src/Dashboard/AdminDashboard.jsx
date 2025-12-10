// src/Admin/AdminDashboard.jsx
import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  BarChart2,
  Settings,
  LogOut,
  Bell,
  UserCircle,
  Search,
  Filter,
  ChevronDown,
  CheckCircle,
  AlertCircle,
  Clock,
  Briefcase,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthGuard } from "../Authentication/useAuthGuard.jsx"; // ✅ auth guard hook

// --- MOCK DATA FOR THE ADMIN DASHBOARD ---

// Stats Cards Data
const adminStats = [
  {
    title: "Total Employees",
    value: "142",
    icon: <Users className="w-6 h-6 text-indigo-600" />,
    bgColor: "bg-indigo-50",
    textColor: "text-indigo-600",
  },
  {
    title: "Present Today",
    value: "128",
    icon: <CheckCircle className="w-6 h-6 text-green-600" />,
    bgColor: "bg-green-50",
    textColor: "text-green-600",
  },
  {
    title: "On Leave",
    value: "8",
    icon: <Clock className="w-6 h-6 text-orange-600" />,
    bgColor: "bg-orange-50",
    textColor: "text-orange-600",
  },
  {
    title: "Absent/Late",
    value: "6",
    icon: <AlertCircle className="w-6 h-6 text-red-600" />,
    bgColor: "bg-red-50",
    textColor: "text-red-600",
  },
];

// Today's Logs Table Data
const todaysLogs = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "https://i.pravatar.cc/150?u=sarah",
    department: "Engineering",
    checkIn: "09:00 AM",
    checkOut: "06:00 PM",
    status: "Present",
    statusColor: "bg-green-100 text-green-700",
  },
  {
    id: 2,
    name: "Michael Chen",
    avatar: "https://i.pravatar.cc/150?u=michael",
    department: "Marketing",
    checkIn: "--",
    checkOut: "--",
    status: "Absent",
    statusColor: "bg-red-100 text-red-700",
  },
  {
    id: 3,
    name: "Jessica Lee",
    avatar: "https://i.pravatar.cc/150?u=jessica",
    department: "HR",
    checkIn: "09:15 AM",
    checkOut: "05:45 PM",
    status: "Present",
    statusColor: "bg-green-100 text-green-700",
  },
  {
    id: 4,
    name: "Chris Evans",
    avatar: "https://i.pravatar.cc/150?u=chris",
    department: "Sales",
    checkIn: "10:30 AM",
    checkOut: "02:30 PM",
    status: "Half Day",
    statusColor: "bg-yellow-100 text-yellow-700",
  },
  {
    id: 5,
    name: "David Wilson",
    avatar: "https://i.pravatar.cc/150?u=david",
    department: "Logistics",
    checkIn: "--",
    checkOut: "--",
    status: "On Leave",
    statusColor: "bg-orange-100 text-orange-700",
  },
];

const AdminDashboard = () => {
  // ✅ Auth guard: if not logged in, user is redirected to /auth
  const { user, loading } = useAuthGuard({ redirectTo: "/signup" });

  // State for UI elements
  const [isEmpMenuOpen, setIsEmpMenuOpen] = useState(false);
  const [isAttendanceMenuOpen, setIsAttendanceMenuOpen] = useState(true); // Open by default

  // 🔄 Loader while checking auth (fast, minimal)
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-sm text-gray-600">Checking access...</p>
        </div>
      </div>
    );
  }

  // If loading is false and user is null, we've already navigated to /auth
  // due to useAuthGuard, so we can safely render nothing here.
  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm z-10 fixed h-full">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">
                HRMS Control
              </h1>
              <p className="text-xs text-gray-500">Advanced Management</p>
            </div>
          </div>
        </div>

        {/* Main Menu */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1 mb-6">
            {/* Dashboard Overview - Active Link */}
            <Link
              to="/admin-dashboard"
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg bg-indigo-50 text-indigo-600 font-medium"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard Overview</span>
            </Link>

            {/* Employee Management Dropdown */}
            <div className="space-y-1 pt-2">
              <button
                onClick={() => setIsEmpMenuOpen(!isEmpMenuOpen)}
                className="w-full flex items-center justify-between space-x-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 font-medium group"
              >
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                  <span>Employee Management</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform ${isEmpMenuOpen ? "rotate-180" : ""
                    }`}
                />
              </button>
              {isEmpMenuOpen && (
                <div className="pl-11 space-y-1">
                  <Link
                    to="/all-employees"
                    className="block text-sm text-gray-500 hover:text-gray-700 py-1.5"
                  >
                    All Employees
                  </Link>
                  <Link to="/id-creation" className="block text-sm text-gray-500 hover:text-gray-700 py-1.5">
                                                        <span>Employee ID Creation</span>
                                                      </Link>
                </div>
              )}
            </div>

            {/* Attendance & Leave Dropdown */}
            <div className="space-y-1 pt-2">
              <button
                onClick={() => setIsAttendanceMenuOpen(!isAttendanceMenuOpen)}
                className="w-full flex items-center justify-between space-x-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 font-medium group"
              >
                <div className="flex items-center space-x-3">
                  <ClipboardCheck className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                  <span>Attendance &amp; Leave</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform ${isAttendanceMenuOpen ? "rotate-180" : ""
                    }`}
                />
              </button>
              {isAttendanceMenuOpen && (
                <div className="pl-11 space-y-1">
                  <Link
                    to="/aprove-entries"
                    className="block text-sm text-gray-500 hover:text-gray-700 py-1.5"
                  >
                    Approve Entries
                  </Link>
                  <Link
                    to="/leave-request"
                    className="block text-sm text-gray-500 hover:text-gray-700 py-1.5"
                  >
                    Leave Requests
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/reportsandanalytics"
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 font-medium group mt-2"
            >
              <BarChart2 className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
              <span>Reports &amp; Analytics</span>
            </Link>

            <Link
              to="/settings"
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 font-medium group mt-2"
            >
              <Settings className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
              <span>System Settings</span>
            </Link>

          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <Link to="/admin-profile">
            <div className="flex items-center space-x-3 mb-3">
              <img
                src="https://i.pravatar.cc/150?u=admin_john"
                alt="Admin Avatar"
                className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">
                  {user.user_metadata?.full_name || "John Admin"}
                </p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
          </Link>
          <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 text-sm font-medium w-full px-2 py-1 rounded hover:bg-gray-100 transition-colors">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 ml-64 bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              Detailed Management View
            </h2>
            <div className="flex items-center space-x-4">
              <Link to="/notification">
                <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Bell className="w-6 h-6 text-gray-600" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
              </Link>
              <Link to="/admin-profile" className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 font-medium p-1 rounded-lg hover:bg-gray-100 transition-colors">
                <UserCircle className="w-6 h-6 text-gray-400" />
                <span>Profile</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Dashboard Content Container */}
        <div className="px-8 py-8 max-w-7xl mx-auto">
          {/* Page Title */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900">
              Employee Attendance Overview
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              Real-time attendance tracking for today.
            </p>
          </div>

          {/* Stats Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {adminStats.map((stat, index) => (
              <div
                key={index}
                className={`rounded-xl p-6 shadow-sm border border-gray-100 flex items-center justify-between ${stat.bgColor}`}
              >
                <div>
                  <h4 className={`text-sm font-medium mb-1 ${stat.textColor}`}>
                    {stat.title}
                  </h4>
                  <span className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </span>
                </div>
                <div className="p-3 rounded-full bg-white bg-opacity-60">
                  {stat.icon}
                </div>
              </div>
            ))}
          </div>

          {/* Today's Logs Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {/* Section Header with Search and Filter */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
              <h3 className="text-lg font-bold text-gray-900">
                Today&apos;s Logs
              </h3>
              <div className="flex items-center space-x-3">
                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search employee..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                {/* Filter Button */}
                <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50 flex items-center">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </button>
              </div>
            </div>

            {/* Logs Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 text-left">
                    <th className="px-4 py-3">Employee Name</th>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3">Check In</th>
                    <th className="px-4 py-3">Check Out</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {todaysLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            className="w-8 h-8 rounded-full mr-3"
                            src={log.avatar}
                            alt={log.name}
                          />
                          <span className="text-sm font-medium text-gray-900">
                            {log.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.department}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.checkIn}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.checkOut}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        <span
                          className={`px-2.5 py-1 text-xs font-medium rounded-full ${log.statusColor}`}
                        >
                          {log.status === "Present" && "● "}
                          {log.status === "Absent" && "● "}
                          {log.status === "Half Day" && "● "}
                          {log.status === "On Leave" && "● "}
                          {log.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-gray-400 hover:text-indigo-600 mx-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-eye"
                          >
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </button>
                        <button className="text-gray-400 hover:text-indigo-600 mx-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-pencil"
                          >
                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                            <path d="m15 5 4 4" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer / Pagination */}
            <div className="flex items-center justify-between mt-6 border-t border-gray-100 pt-4">
              <p className="text-sm text-gray-500">
                Showing 5 of 142 employees
              </p>
              <div className="flex space-x-2">
                <button
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  disabled
                >
                  Previous
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* End Dashboard Content Container */}
      </main>
    </div>
  );
};

export default AdminDashboard;
