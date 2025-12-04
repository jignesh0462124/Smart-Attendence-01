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
  Search,
  ChevronDown,
  Download,
  Eye,
  Edit,
  Trash2,
  Briefcase
} from 'lucide-react';
import { Link } from "react-router-dom";

// Mock Data for the Employee Directory
const employees = [
  {
    id: 1,
    name: 'Sarah Johnson',
    empId: 'EMP001',
    avatar: 'https://i.pravatar.cc/150?u=sarah', // Using placeholder avatars
    role: 'Senior Engineer',
    department: 'Engineering',
    email: 'sarah.j@company.com',
    phone: '+1 (555) 123-4567',
    joiningDate: 'Jan 12, 2020',
    status: 'Active',
    statusBg: 'bg-green-100',
    statusText: 'text-green-800'
  },
  {
    id: 2,
    name: 'Michael Chen',
    empId: 'EMP002',
    avatar: 'https://i.pravatar.cc/150?u=michael',
    role: 'Marketing Manager',
    department: 'Marketing',
    email: 'michael.c@company.com',
    phone: '+1 (555) 234-5678',
    joiningDate: 'Mar 15, 2021',
    status: 'Active',
    statusBg: 'bg-green-100',
    statusText: 'text-green-800'
  },
  {
    id: 3,
    name: 'Jessica Lee',
    empId: 'EMP003',
    avatar: 'https://i.pravatar.cc/150?u=jessica',
    role: 'HR Specialist',
    department: 'Human Resources',
    email: 'jessica.l@company.com',
    phone: '+1 (555) 345-6789',
    joiningDate: 'Jun 01, 2019',
    status: 'Active',
    statusBg: 'bg-green-100',
    statusText: 'text-green-800'
  },
  {
    id: 4,
    name: 'Chris Evans',
    empId: 'EMP004',
    avatar: 'https://i.pravatar.cc/150?u=chris',
    role: 'Sales Executive',
    department: 'Sales',
    email: 'chris.e@company.com',
    phone: '+1 (555) 456-7890',
    joiningDate: 'Sep 23, 2022',
    status: 'Inactive',
    statusBg: 'bg-red-100',
    statusText: 'text-red-800'
  },
  {
    id: 5,
    name: 'David Wilson',
    empId: 'EMP005',
    avatar: 'https://i.pravatar.cc/150?u=david',
    role: 'Logistics Coordinator',
    department: 'Logistics',
    email: 'david.w@company.com',
    phone: '+1 (555) 567-8901',
    joiningDate: 'Nov 11, 2021',
    status: 'Active',
    statusBg: 'bg-green-100',
    statusText: 'text-green-800'
  },
  {
    id: 6,
    name: 'Emily Davis',
    empId: 'EMP006',
    avatar: 'https://i.pravatar.cc/150?u=emily',
    role: 'UI Designer',
    department: 'Design',
    email: 'emily.d@company.com',
    phone: '+1 (555) 678-9012',
    joiningDate: 'Feb 14, 2023',
    status: 'Active',
    statusBg: 'bg-green-100',
    statusText: 'text-green-800'
  },
  {
    id: 7,
    name: 'James Bond',
    empId: 'EMP007',
    avatar: 'https://i.pravatar.cc/150?u=james',
    role: 'Security Chief',
    department: 'Security',
    email: 'james.b@company.com',
    phone: '+1 (555) 007-0007',
    joiningDate: 'Jul 07, 2018',
    status: 'On Leave',
    statusBg: 'bg-orange-100',
    statusText: 'text-orange-800'
  },
];


// Removed : React.FC
const AllEmployees = () => {
  // State for sidebar dropdowns
  const [isEmpMenuOpen, setIsEmpMenuOpen] = useState(true); // Open by default for this page
  const [isAttendanceMenuOpen, setIsAttendanceMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm fixed h-full z-10">
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
          <div className="space-y-1">
            <Link to="/admin-dashboard" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 font-medium group">
              <LayoutDashboard className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
              <span>Dashboard Overview</span>
            </Link>

            {/* Employee Management Dropdown (Active) */}
            <div className="space-y-1 pt-2">
              <button
                onClick={() => setIsEmpMenuOpen(!isEmpMenuOpen)}
                className="w-full flex items-center justify-between space-x-3 px-3 py-2.5 rounded-lg bg-indigo-50 text-indigo-600 font-medium group"
              >
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5" />
                  <span>Employee Management</span>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${isEmpMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              {isEmpMenuOpen && (
                <div className="pl-11 space-y-1">
                  {/* Active Link */}
                  <Link to="/all-employees" className="block text-sm text-indigo-600 font-medium py-1.5">All Employees</Link>
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
                  <span>Attendance & Leave</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isAttendanceMenuOpen ? 'rotate-180' : ''}`} />
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
                  </Link>  </div>
              )}
            </div>

            <Link to="/reportsandanalytics"
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 font-medium group mt-2">
              <BarChart2 className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
              <span>Reports & Analytics</span>
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
        {/* Header */}
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

        {/* Page Content Container */}
        <div className="p-8 max-w-7xl mx-auto">

          {/* Page Header & Actions */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Employee Directory</h3>
              <p className="text-gray-500 text-sm mt-1">View and manage all employee records.</p>
            </div>
            <button className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </button>
          </div>

          {/* Filters and Search Bar */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, ID, or role..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Department Filter */}
            <div className="relative w-full md:w-48">
              <select className="w-full appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>All Departments</option>
                <option>Engineering</option>
                <option>Marketing</option>
                <option>Sales</option>
              </select>
              <ChevronDown className="absolute right-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Status Filter */}
            <div className="relative w-full md:w-48">
              <select className="w-full appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
                <option>On Leave</option>
              </select>
              <ChevronDown className="absolute right-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Employee Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 text-left bg-gray-50">
                    <th className="px-6 py-3">Employee</th>
                    <th className="px-6 py-3">Role & Dept</th>
                    <th className="px-6 py-3">Contact Info</th>
                    <th className="px-6 py-3">Joining Date</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {employees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img className="w-10 h-10 rounded-full mr-4" src={emp.avatar} alt={emp.name} />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{emp.name}</div>
                            <div className="text-xs text-gray-500">ID: {emp.empId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{emp.role}</div>
                        <div className="text-xs text-gray-500">{emp.department}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{emp.email}</div>
                        <div className="text-xs text-gray-500">{emp.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {emp.joiningDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${emp.statusBg} ${emp.statusText}`}>
                          {emp.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-3 text-gray-400">
                          <button className="hover:text-indigo-600 transition-colors"><Eye className="w-5 h-5" /></button>
                          <button className="hover:text-indigo-600 transition-colors"><Edit className="w-5 h-5" /></button>
                          <button className="hover:text-red-600 transition-colors"><Trash2 className="w-5 h-5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="bg-white px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <div className="text-sm text-gray-500">
                Showing 1 to 7 of 42 results
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-500 hover:bg-gray-50">
                  &lt;
                </button>
                <button className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm font-medium">
                  1
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                  2
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                  3
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                  &gt;
                </button>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
};

export default AllEmployees;