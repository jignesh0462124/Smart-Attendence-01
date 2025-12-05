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
  ChevronDown,
  Briefcase,
  Check,
  X,
  Clock,
  MapPin,
} from 'lucide-react';
import { Link } from 'react-router-dom';

// --- MOCK DATA ---
const pendingEntries = [
  {
    id: 1,
    name: 'Emily Davis',
    avatar: 'https://i.pravatar.cc/150?u=emilydavis',
    date: '2023-10-26',
    location: 'Main Office',
    gpsStatus: 'GPS Verified',
    timeIn: '09:05',
    timeOut: '17:00',
    reason: 'Late check-in due to traffic.',
  },
  {
    id: 2,
    name: 'David Wilson',
    avatar: 'https://i.pravatar.cc/150?u=davidwilson',
    date: '2023-10-26',
    location: 'Warehouse A',
    gpsStatus: 'GPS Confirmed',
    timeIn: '08:58',
    timeOut: '17:02',
    reason: 'No issues',
  },
  {
    id: 3,
    name: 'Jessica Lee',
    avatar: 'https://i.pravatar.cc/150?u=jessicalee',
    date: '2023-10-25',
    location: 'Remote Work',
    gpsStatus: 'GPS Disabled',
    timeIn: '09:15',
    timeOut: '17:30',
    reason: 'Approved WFH',
  },
];

// --- COMPONENT ---
const ApproveEntries = () => {
  // State for sidebar dropdowns
  const [isEmpMenuOpen, setIsEmpMenuOpen] = useState(false);
  const [isAttendanceMenuOpen, setIsAttendanceMenuOpen] = useState(true); // Open by default for this page

  // Mock action handlers
  const handleApprove = (id) => console.log(`Approved entry ${id}`);
  const handleReject = (id) => console.log(`Rejected entry ${id}`);

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">

      {/* --- SIDEBAR (Fixed Width) --- */}
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
                className="w-full flex items-center justify-between space-x-3 px-3 py-2.5 rounded-lg bg-indigo-50 text-indigo-600 font-medium group"
              >
                <div className="flex items-center space-x-3">
                  <ClipboardCheck className="w-5 h-5" />
                  <span>Attendance & Leave</span>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${isAttendanceMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              {isAttendanceMenuOpen && (
                <div className="pl-11 space-y-1">
                  {/* Active Link */}
                  <Link to="/aprove-entries" className="block text-sm text-indigo-600 font-medium py-1.5">Approve Entries</Link>
                  <Link to="/leave-request" className="block text-sm text-gray-500 hover:text-gray-700 py-1.5">Leave Requests</Link>
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
                src="https://i.pravatar.cc/150?u=admin_john"
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

      {/* --- MAIN CONTENT (Responsive to 960px max width) --- */}
      <main className="flex-1 ml-64 bg-gray-50">

        {/* Header - Full Width Banner */}
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
              <Link to="/admin-profile" className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 font-medium p-1 rounded-lg hover:bg-gray-100 transition-colors">
                <UserCircle className="w-6 h-6 text-gray-400" />
                <span>Profile</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content Container (Max Width 960px equivalent on desktop) */}
        <div className="p-8 mx-auto max-w-7xl">

          {/* Pending Attendance Approvals Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">

            {/* Card Header */}
            <div className="px-8 py-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Pending Attendance Approvals</h3>
              <p className="text-sm text-gray-500 mt-1">Review, adjust, and approve attendance entities with full context.</p>
            </div>

            {/* Table Container */}
            <div className="p-8">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px]">
                  <thead>
                    <tr className="text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 text-left">
                      <th className="px-6 py-3">Employee</th>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3">Location (GPS)</th>
                      <th className="px-6 py-3">Time In</th>
                      <th className="px-6 py-3">Time Out</th>
                      <th className="px-6 py-3">Reason/Notes</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {pendingEntries.map((entry) => (
                      <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img className="w-8 h-8 rounded-full mr-3" src={entry.avatar} alt={entry.name} />
                            <div className="text-sm font-medium text-gray-900">{entry.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{entry.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span>{entry.location}</span>
                          </div>
                          <span className={`text-xs font-medium ${entry.gpsStatus.includes('Verified') ? 'text-green-600' : 'text-red-600'}`}>
                            ({entry.gpsStatus})
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex items-center space-x-2">
                          {entry.timeIn} <Clock className="w-4 h-4 text-gray-400" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex items-center space-x-2">
                          {entry.timeOut} <Clock className="w-4 h-4 text-gray-400" />
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">
                          <input
                            type="text"
                            defaultValue={entry.reason}
                            className="p-2 border border-gray-200 rounded-lg w-full text-sm focus:border-indigo-500 focus:ring-0"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleApprove(entry.id)}
                              className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors"
                            >
                              <Check className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleReject(entry.id)}
                              className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button className="w-full mt-8 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors text-sm">
                Load More Attendance Records
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default ApproveEntries;