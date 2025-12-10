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
  Download,
  FileText,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  Briefcase
} from 'lucide-react';
import { Link } from "react-router-dom";

const Reportsandanalytics = () => {
  // State for UI elements
  const [dateRange] = useState('Last 30 Days');
  const [expandedMenu, setExpandedMenu] = useState('reports'); // Active on Reports
  const [isEmpMenuOpen, setIsEmpMenuOpen] = useState(false);
  const [isAttendanceMenuOpen, setIsAttendanceMenuOpen] = useState(false);

  // Mock Data
  const stats = [
    {
      title: 'Retention Rate',
      value: '96%',
      trend: '+2.4%',
      trendUp: true,
    },
    {
      title: 'Avg. Attendance',
      value: '92%',
      trend: '-1.2%',
      trendUp: false,
    },
    {
      title: 'Total Payroll',
      value: '$142k',
      trend: 'Oct 2023',
      trendUp: false,
      isBadge: true
    },
    {
      title: 'New Hires',
      value: '12',
      trend: '+4 this month',
      trendUp: true,
      isBadge: true
    }
  ];

  const attendanceChartData = [
    { day: 'Mon', height: 'h-32', color: 'bg-indigo-600' },
    { day: 'Tue', height: 'h-40', color: 'bg-indigo-600' },
    { day: 'Wed', height: 'h-36', color: 'bg-indigo-600' },
    { day: 'Thu', height: 'h-44', color: 'bg-indigo-600' },
    { day: 'Fri', height: 'h-36', color: 'bg-indigo-600' },
    { day: 'Sat', height: 'h-16', color: 'bg-indigo-300' },
    { day: 'Sun', height: 'h-8', color: 'bg-indigo-200' },
  ];

  const costDistribution = [
    { department: 'Engineering', headcount: 45, cost: '42%' },
    { department: 'Sales', headcount: 32, cost: '28%' },
    { department: 'Marketing', headcount: 18, cost: '15%' },
    { department: 'HR & Admin', headcount: 12, cost: '10%' },
    { department: 'Support', headcount: 35, cost: '5%' },
  ];

  const generatedReports = [
    { name: 'Monthly Payroll - Oct 2023', date: 'Oct 29, 2023', type: 'PDF' },
    { name: 'Q3 Attendance Logs', date: 'Oct 01, 2023', type: 'CSV' },
    { name: 'Employee Satisfaction Survey', date: 'Sep 15, 2023', type: 'PDF' },
  ];

  // Handlers
  const toggleMenu = (menu) => setExpandedMenu(expandedMenu === menu ? null : menu);
  
  const handleNavigation = (page) => {
    // Basic navigation logic (can be expanded with useNavigate if needed)
    console.log(`Navigating to ${page}`);
  };

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
              <h1 className="text-lg font-bold text-gray-900 leading-tight">HRMS Control</h1>
              <p className="text-xs text-gray-500">Advanced Management</p>
            </div>
          </div>
        </div>

        {/* Main Menu */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1 mb-6">
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
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 font-medium group"
              >
                <div className="flex items-center space-x-3">
                  <ClipboardCheck className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                  <span>Attendance & Leave</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isAttendanceMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              {isAttendanceMenuOpen && (
                <div className="pl-11 space-y-1">
                  <Link to="/aprove-entries" className="block text-sm text-gray-500 hover:text-gray-700 py-1.5">Approve Entries</Link>
                  <Link to="/leave-request" className="block text-sm text-gray-500 hover:text-gray-700 py-1.5">Leave Requests</Link>
                </div>
              )}
            </div>

            {/* Reports & Analytics - Active Link */}
            <Link
              to="/reportsandanalytics"
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg bg-indigo-50 text-indigo-600 font-medium group mt-2"
            >
              <BarChart2 className="w-5 h-5" />
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

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 ml-64 bg-gray-50">
        {/* Header - Full Width Banner */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Detailed Management View</h2>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Bell className="w-6 h-6 text-gray-600" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <Link to="/admin-profile" className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 font-medium p-1 rounded-lg hover:bg-gray-100 transition-colors">
                <UserCircle className="w-6 h-6 text-gray-400" />
                <span>Profile</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Dashboard Content Container (Max Width 960px equivalent on desktop) */}
        <div className="px-8 py-8 max-w-7xl mx-auto">

          {/* Page Title & Actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Reports & Analytics</h3>
              <p className="text-gray-500 text-sm">Company-wide insights and data exports.</p>
            </div>

            <div className="flex items-center space-x-3">
              {/* Date Range Picker Placeholder */}
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50 flex items-center">
                <span>{dateRange}</span>
                <ChevronDown className="w-4 h-4 ml-2" />
              </button>
              <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Export Dashboard
              </button>
            </div>
          </div>

          {/* Stats Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 card-row">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between h-32">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-gray-500">{stat.title}</h4>
                  {stat.trend && !stat.isBadge && (
                    <div className={`flex items-center text-xs font-bold px-2 py-0.5 rounded-full ${stat.trendUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {stat.trendUp ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                      {stat.trend}
                    </div>
                  )}
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-4xl font-bold text-gray-900 tracking-tight">{stat.value}</span>
                  {stat.isBadge && (
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-lg">
                      {stat.trend}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Middle Row: Charts & Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Attendance Trends Chart (Simulated) */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Attendance Trends (Last 7 Days)</h3>
              {/* Simulated Bar Chart Container */}
              <div className="flex items-end justify-between h-64 px-4 pb-4 border-b border-gray-100">
                {attendanceChartData.map((data, index) => (
                  <div key={index} className="flex flex-col items-center group">
                    <div className="relative flex items-end h-full w-6 md:w-10 bg-gray-50 rounded-t-lg overflow-hidden">
                      <div className={`w-full ${data.height} ${data.color} rounded-t-lg transition-all duration-300 group-hover:opacity-80`}></div>
                    </div>
                    <span className="text-xs text-gray-500 mt-3 font-medium">{data.day}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-400 px-4 mt-2">
                <span>Mon</span><span>Sun</span>
              </div>
            </div>
            
            {/* Department Cost Distribution */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Department Cost Distribution</h3>
              <div className="space-y-4">
                {costDistribution.map((dept, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-sm text-gray-700">
                      <div className="flex items-center space-x-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-indigo-500"></span>
                        <span className="font-medium">{dept.department}</span>
                      </div>
                      <span className="font-semibold">{dept.cost}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 pl-4">
                      <span>Headcount: {dept.headcount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Generated Reports Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Generated Reports</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] divide-y divide-gray-200">
                <thead>
                  <tr className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-left bg-gray-50">
                    <th className="px-4 py-3">Report Name</th>
                    <th className="px-4 py-3">Date Generated</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {generatedReports.map((report, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm font-medium text-gray-900 flex items-center space-x-2">
                        <FileText className="w-5 h-5 text-indigo-500" />
                        <span>{report.name}</span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">{report.date}</td>
                      <td className="px-4 py-4 text-sm text-gray-600">{report.type}</td>
                      <td className="px-4 py-4 text-right text-sm">
                        <button className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center justify-end">
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </button>
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

export default Reportsandanalytics;