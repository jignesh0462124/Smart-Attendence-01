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
  MapPin,
  Building,
  Edit2
} from 'lucide-react';
import { Link } from "react-router-dom";

// Mock Admin Profile Data
const adminData = {
  name: 'John Admin',
  role: 'System Administrator',
  id: 'ADM-001',
  department: 'IT Department',
  location: 'New York, USA',
  avatar: 'https://i.pravatar.cc/300?u=admin_john_profile', // Larger avatar for profile page
  email: 'john.admin@company.com',
  phone: '+1 (555) 987-6543',
  address: '456 Corporate Blvd, Suite 100, New York, NY 10001'
};

// Removed : React.FC
const AdminProfile = () => {
  // State for sidebar dropdowns (kept closed for this view as per usual practice)
  const [isEmpMenuOpen, setIsEmpMenuOpen] = useState(false);
  const [isAttendanceMenuOpen, setIsAttendanceMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Personal Info');

  // State for form fields
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Admin',
    email: adminData.email,
    phone: adminData.phone,
    address: adminData.address
  });

  // Removed explicit type annotation for the event handler
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const tabs = ['Personal Info', 'Account Security', 'Preferences'];

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* --- SIDEBAR (Consistent with Employee Dashboard) --- */}
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
              <span>Dashboard</span>
             </Link>
                     
            <Link to="/admin-dashboard" >
              
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
                   <Link to="/leave-request" className="block text-sm text-gray-500 hover:text-gray-700 py-1.5">Approve Entries</Link>
                   <Link to="/leave-request" className="block text-sm text-gray-500 hover:text-gray-700 py-1.5">Leave Requests</Link>
                </div>
              )}
            </div>

            <Link to="/reportsandanalytics" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 font-medium group mt-2">
              <BarChart2 className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
              <span>Reports & Analytics</span>
            </Link>

            <a href="#" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 font-medium group mt-2">
              <Settings className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
              <span>System Settings</span>
            </a>
          </div>
        </nav>

        {/* User Profile (Sidebar Bottom) - Active Link is here */}
        <Link to="/admin-profile" className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-3 bg-indigo-50 p-2 rounded-lg"> {/* Highlight profile link */}
            <img
              src={adminData.avatar}
              alt="Admin Avatar"
              className="w-10 h-10 rounded-full border-2 border-indigo-600 shadow-sm"
            />
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">{adminData.name}</p>
              <p className="text-xs text-indigo-600 font-medium">{adminData.role}</p>
            </div>
          </div>
          <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 text-sm font-medium w-full px-2 py-1 rounded hover:bg-gray-100 transition-colors">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </Link>
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
              {/* Profile button is now active (same element used in sidebar) */}
              <div className="flex items-center space-x-2 text-indigo-600 bg-indigo-50 font-medium p-1 pr-3 rounded-lg transition-colors">
                <UserCircle className="w-6 h-6" />
                <span>Profile</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Container */}
        <div className="p-8 max-w-4xl mx-auto">
            
          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              
            {/* 1. Profile Header Section */}
            <div className="p-8 border-b border-gray-200 flex items-start space-x-6">
                <div className="relative">
                    <img src={adminData.avatar} alt={adminData.name} className="w-24 h-24 rounded-full border-4 border-white shadow-md" />
                    <button className="absolute bottom-0 right-0 p-1.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors shadow-sm">
                        <Edit2 className="w-4 h-4" />
                    </button>
                </div>
                <div className="pt-2">
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{adminData.name}</h3>
                    <p className="text-indigo-600 font-medium mb-3">{adminData.role}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                            <Briefcase className="w-4 h-4" />
                            <span>ID: {adminData.id}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Building className="w-4 h-4" />
                            <span>{adminData.department}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{adminData.location}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Tabs Navigation */}
            <div className="px-8 pt-6 border-b border-gray-200">
                <nav className="flex space-x-8" aria-label="Tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 px-1 text-sm font-medium border-b-2 transition-colors ${
                                activeTab === tab
                                    ? 'border-indigo-600 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>

            {/* 3. Form Content (Personal Info Tab) */}
            <div className="p-8">
                {activeTab === 'Personal Info' && (
                    <form>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 cursor-not-allowed"
                                    readOnly
                                />
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div className="mb-8">
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <textarea
                                id="address"
                                name="address"
                                rows={3}
                                value={formData.address}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                            />
                        </div>
                        <div className="flex justify-end">
                            <button type="button" className="px-6 py-2.5 bg-indigo-600 text-white font-medium text-sm rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
                                Save Changes
                            </button>
                        </div>
                    </form>
                )}
                {/* Placeholders for other tabs */}
                {activeTab === 'Account Security' && <div className="text-gray-500">Security settings content goes here...</div>}
                {activeTab === 'Preferences' && <div className="text-gray-500">Preferences content goes here...</div>}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminProfile;