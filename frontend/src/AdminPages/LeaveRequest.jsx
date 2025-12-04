import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  BarChart2,
  Settings,
  LogOut,
  Bell,
  UserCircle,
  Briefcase,
  ChevronDown,
  Check,
  X,
  MessageSquare,
} from 'lucide-react';
import { Link } from 'react-router-dom';

// --- MOCK DATA ---
const leaveRequestsData = [
  {
    id: 1,
    employee: {
      name: 'Emily Davis',
      avatar: 'https://i.pravatar.cc/150?u=emily',
      balance: '3/12',
    },
    leaveType: 'Sick Leave',
    leaveColor: 'bg-red-100 text-red-600',
    dates: 'Oct 28 - Oct 29',
    duration: '2 Days',
    reason: 'High fever and flu symptoms',
  },
  {
    id: 2,
    employee: {
      name: 'David Wilson',
      avatar: 'https://i.pravatar.cc/150?u=david',
      balance: '8/12',
    },
    leaveType: 'Casual Leave',
    leaveColor: 'bg-blue-100 text-blue-600',
    dates: 'Nov 02',
    duration: '1 Day',
    reason: 'Personal family matters',
  },
  {
    id: 3,
    employee: {
      name: 'Sophia Martinez',
      avatar: 'https://i.pravatar.cc/150?u=sophia',
      balance: '10/20',
    },
    leaveType: 'Annual Leave',
    leaveColor: 'bg-purple-100 text-purple-600',
    dates: 'Nov 15 - Nov 20',
    duration: '5 Days',
    reason: 'Planned family vacation to Europe',
  },
];

// --- COMPONENT ---
// Removed : React.FC
const LeaveRequestApprovals = () => {
  // State for sidebar dropdowns and active tab
  const [isEmpMenuOpen, setIsEmpMenuOpen] = useState(false);
  const [isAttendanceMenuOpen, setIsAttendanceMenuOpen] = useState(true); // Open by default for this page
  // Removed type annotation for useState
  const [activeTab, setActiveTab] = useState('Pending');

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm fixed h-full z-10">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">HRMS Control</h1>
              <p className="text-xs text-gray-500">Advanced Management</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            <Link to="/admin-dashboard" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 font-medium group">
              <LayoutDashboard className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
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
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isEmpMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              {isEmpMenuOpen && (
                <div className="pl-11 space-y-1">
                  <Link to="/all-employees" className="block text-sm text-gray-500 hover:text-gray-700 py-1.5">All Employees</Link>
                </div>
              )}
            </div>

            {/* Attendance & Leave Dropdown (Active) */}
            <div className="space-y-1 pt-2">
              <button
                onClick={() => setIsAttendanceMenuOpen(!isAttendanceMenuOpen)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-indigo-50 text-indigo-600 font-medium group"
              >
                <div className="flex items-center space-x-3">
                  <ClipboardCheck className="w-5 h-5" />
                  <span>Attendance & Leave</span>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${isAttendanceMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              {isAttendanceMenuOpen && (
                <div className="pl-11 space-y-1">
                  <Link to="/aprove-entries" className="block text-sm text-gray-500 hover:text-gray-700 py-1.5">Approve Entries</Link>
                  {/* Active Link */}
                  <Link to="/leave-requests" className="block text-sm text-indigo-600 font-medium py-1.5">Leave Requests</Link>
                </div>
              )}
            </div>

            <Link to="/reportsandanalytics" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 font-medium group mt-2">
              <BarChart2 className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
              <span>Reports & Analytics</span>
            </Link>

            <Link to="/settings" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 font-medium group mt-2">
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
                src="https://i.pravatar.cc/150?u=admin_john" // Placeholder image
                alt="Admin Avatar"
                className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">John Admin</p>
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
        <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Detailed Management View</h2>
            <div className="flex items-center space-x-4">
              <Link
                to="/notification"
              >
                <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Bell className="w-6 h-6 text-gray-600" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
              </Link>
              <button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 font-medium p-1 rounded-lg hover:bg-gray-100 transition-colors">
                <UserCircle className="w-6 h-6 text-gray-400" />
                <span>Profile</span>
              </button>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {/* Page Content Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {/* Card Header */}
            <div className="px-8 py-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Leave Request Approvals</h3>
                <p className="text-sm text-gray-500 mt-1">Manage employee time-off and permissions.</p>
              </div>
              <span className="px-3 py-1 text-xs font-medium text-orange-700 bg-orange-100 rounded-full">
                3 Pending Requests
              </span>
            </div>

            {/* Tabs & Table Container */}
            <div className="p-8">
              {/* Tabs */}
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit mb-6">
                {/* Removed 'as const' type assertion */}
                {['Pending', 'Approved', 'Rejected'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tab
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                  <thead>
                    <tr className="text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 text-left">
                      <th className="px-6 py-3">Employee</th>
                      <th className="px-6 py-3">Leave Details</th>
                      <th className="px-6 py-3">Dates & Duration</th>
                      <th className="px-6 py-3">Reason</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {leaveRequestsData.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-6 whitespace-nowrap">
                          <div className="flex items-center">
                            <img className="w-10 h-10 rounded-full mr-4" src={request.employee.avatar} alt={request.employee.name} />
                            <div>
                              <div className="text-sm font-bold text-gray-900">{request.employee.name}</div>
                              <div className="text-xs text-gray-500">Balance: {request.employee.balance}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6 whitespace-nowrap">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${request.leaveColor}`}>
                            {request.leaveType}
                          </span>
                        </td>
                        <td className="px-6 py-6 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{request.dates}</div>
                          <div className="text-xs text-gray-500">{request.duration}</div>
                        </td>
                        <td className="px-6 py-6 text-sm text-gray-500 max-w-xs truncate">
                          {request.reason}
                        </td>
                        <td className="px-6 py-6 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end space-x-3">
                            <button className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors">
                              <Check className="w-5 h-5" />
                            </button>
                            <button className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors">
                              <X className="w-5 h-5" />
                            </button>
                            <button className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors">
                              <MessageSquare className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* View All History Button */}
              <button className="w-full mt-8 py-3 bg-indigo-50 text-indigo-600 font-medium rounded-xl hover:bg-indigo-100 transition-colors">
                View All History
              </button>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LeaveRequestApprovals;