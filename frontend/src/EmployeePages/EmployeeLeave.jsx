import React, { useState } from "react";
import {
  Calendar,
  TrendingUp,
  FileText,
  FolderOpen,
  HelpCircle,
  LogOut,
  Bell,
  Moon,
  Send,
} from "lucide-react";
import { Link } from "react-router-dom";
// Assuming UseAuthGuard is a custom hook and available in JS environment
// import { UseAuthGuard } from "../AuthGuard/UseAuthGuard";

// Removed TypeScript interface for LeaveRequest

// Removed : React.FC
const LeaveManagement = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [leaveType, setLeaveType] = useState("Annual Leave");
  const [durationType, setDurationType] = useState("Full Day");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  // 🔐 Mock Auth guard check
  // const { isLoading: authLoading } = UseAuthGuard("/");
  const authLoading = false; 

  // Leave balance data
  const leaveBalance = [
    {
      type: "Annual Leave",
      used: 12,
      total: 15,
      bgColor: "bg-blue-500",
      textColor: "text-white",
    },
    {
      type: "Sick Leave",
      used: 5,
      total: 10,
      bgColor: "bg-white",
      textColor: "text-gray-900",
    },
    {
      type: "Casual Leave",
      used: 3,
      total: 5,
      bgColor: "bg-white",
      textColor: "text-gray-900",
    },
  ];

  // Recent leave requests
  const recentRequests = [
    {
      id: 1,
      type: "Sick Leave",
      dateRange: "Oct 12 - Oct 15 (2 Days)",
      status: "PENDING",
      statusColor: "bg-yellow-100 text-yellow-700",
      dotColor: "bg-yellow-400",
    },
    {
      id: 2,
      type: "Casual Leave",
      dateRange: "Sep 05 (1 Day)",
      status: "APPROVED",
      statusColor: "bg-green-100 text-green-700",
      dotColor: "bg-green-400",
    },
    {
      id: 3,
      type: "Unpaid Leave",
      dateRange: "Aug 12 (1 Day)",
      status: "REJECTED",
      statusColor: "bg-red-100 text-red-700",
      dotColor: "bg-red-400",
    },
  ];

  const handleSubmit = () => {
    console.log({ leaveType, durationType, startDate, endDate, reason });
    // Add your API call here
  };

  const handleCancel = () => {
    setLeaveType("Annual Leave");
    setDurationType("Full Day");
    setStartDate("");
    setEndDate("");
    setReason("");
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
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
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
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg bg-indigo-50 text-indigo-600 font-medium"
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
          <a
            href="#"
            className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
          >
            <HelpCircle className="w-5 h-5" />
            <span>Helpdesk</span>
          </a>
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
                Leave Management
              </h2>
              <p className="text-gray-600 mt-1">
                Manage your leaves and records.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Moon className="w-5 h-5 text-gray-600" />
              </button>
              <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Leave Management Content */}
        <div className="p-8">
          {/* Leave Balance Cards */}
          <div className="flex gap-4 mb-6">
            {leaveBalance.map((leave, index) => (
              <div
                key={index}
                className={`${leave.bgColor} rounded-xl p-6 shadow-sm ${
                  index > 0 ? "border border-gray-200" : ""
                } flex-1`}
              >
                <p
                  className={`text-sm font-medium mb-3 ${leave.textColor} opacity-90`}
                >
                  {leave.type}
                </p>
                <div className="flex items-baseline space-x-1">
                  <h3 className={`text-4xl font-bold ${leave.textColor}`}>
                    {leave.used}
                  </h3>
                  <span
                    className={`text-xl ${leave.textColor} opacity-60`}
                  >{`/ ${leave.total}`}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Apply for Leave Form */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center mr-3">
                  <FileText className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Apply for Leave
                </h3>
              </div>

              <div className="space-y-5">
                {/* Leave Type and Duration */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Leave Type
                    </label>
                    <select
                      value={leaveType}
                      onChange={(e) => setLeaveType(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-900 text-sm"
                    >
                      <option>Annual Leave</option>
                      <option>Sick Leave</option>
                      <option>Casual Leave</option>
                      <option>Unpaid Leave</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration
                    </label>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setDurationType("Full Day")}
                        className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
                          durationType === "Full Day"
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-50 text-gray-700 border border-gray-300 hover:bg-gray-100"
                        }`}
                      >
                        Full Day
                      </button>
                      <button
                        onClick={() => setDurationType("Half Day")}
                        className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
                          durationType === "Half Day"
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-50 text-gray-700 border border-gray-300 hover:bg-gray-100"
                        }`}
                      >
                        Half Day
                      </button>
                    </div>
                  </div>
                </div>

                {/* Start Date and End Date */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="text"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      placeholder="mm/dd/yyyy"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 text-sm placeholder-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="text"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      placeholder="mm/dd/yyyy"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 text-sm placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Reason */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Describe the reason..."
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-gray-900 text-sm placeholder-gray-400"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    onClick={handleCancel}
                    className="px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors flex items-center space-x-2 text-sm"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Application</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Requests */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">
                  Recent Requests
                </h3>
                <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                  View All
                </button>
              </div>

              <div className="space-y-5">
                {recentRequests.map((request) => (
                  <div key={request.id} className="flex items-start space-x-3">
                    <div
                      className={`w-2.5 h-2.5 ${request.dotColor} rounded-full mt-1.5 flex-shrink-0`}
                    ></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900 text-sm">
                          {request.type}
                        </h4>
                        <span
                          className={`px-2.5 py-1 text-xs font-bold rounded whitespace-nowrap ${request.statusColor}`}
                        >
                          {request.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {request.dateRange}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LeaveManagement;