import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  LogOut,
  Bell,
  Settings,
  MapPin,
  Briefcase,
  Camera,
  LayoutDashboard,
  Users,
  ChevronRight,
  CheckSquare,
  Clock,
} from 'lucide-react';

// Removed interface for props
const ProfilePage = ({ onNavigate }) => { // Removed interface and React.FC
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Admin',
    email: 'john.admin@company.com',
    phone: '+1 (555) 987-6543',
    address: '456 Corporate Blvd, Suite 100, New York, NY 10001'
  });

  const navigate = useNavigate();

  // Removed type annotation for parameter 'page' and map
  const handleNavigation = (page) => {
    if (onNavigate) {
      onNavigate(page);
      return;
    }

    const map = {
      dashboard: '/manager-dashboard',
      attendance: '/attendance-history',
      tasks: '/tasks',
      notifications: '/notifications',
      settings: '/profile',
    };

    const path = map[page] ?? '/';
    try {
      navigate(path);
    } catch (err) {
      console.warn('Navigation failed', err, page);
    }
  };

  // local UI state for expandable sidebar groups (Removed type annotation)
  const [expandedMenu, setExpandedMenu] = useState(null);
  // Removed type annotation for parameter 'menu'
  const toggleMenu = (menu) => setExpandedMenu(prev => (prev === menu ? null : menu));

  // Removed explicit type annotation for event handler
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveChanges = () => {
    console.log('Saving changes:', formData);
    // Add your API call here
  };

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
              <h1 className="text-lg font-bold text-gray-900">HRMS</h1>
              <p className="text-xs text-gray-500">Control</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-1">Advanced Management</p>
        </div>

        {/* Main Menu */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            <button
              onClick={() => handleNavigation('dashboard')}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-left text-sm"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </button>

            {/* Employee Management with submenu */}
            <div>
              <button
                onClick={() => toggleMenu('employee')}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-left text-sm"
              >
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5" />
                  <span>Employee Management</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${expandedMenu === 'employee' ? 'rotate-90' : ''}`} />
              </button>

              {expandedMenu === 'employee' && (
                <div className="ml-8 mt-1 space-y-1">
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50">
                    <Link
                      to="/view-employee"
                      className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50"
                    >
                      <span>All employees</span>
                    </Link>
                  </button>
                  <Link
                    to="/id-creation"
                    className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50"
                  >
                    <span>Employee ID Creation</span>
                  </Link>
                </div>
              )}
            </div>

            <button
              onClick={() => handleNavigation('tasks')}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-left text-sm"
            >
              <CheckSquare className="w-5 h-5" />
              <span>Tasks</span>
            </button>

            {/* Attendance with submenu */}
            <div>
              <button
                onClick={() => toggleMenu('attendance')}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-left text-sm"
              >
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5" />
                  <span>Attendance</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${expandedMenu === 'attendance' ? 'rotate-90' : ''}`} />
              </button>

              {expandedMenu === 'attendance' && (
                <div className="ml-8 mt-1 space-y-1">
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50">
                    Manual Attendance Marking
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50">
                    Leave Requests
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50">
                    My Attendance History
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => handleNavigation('notifications')}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-left text-sm"
            >
              <Bell className="w-5 h-5" />
              <span>Leave Approvals
              </span>
            </button>

            <Link
              to="/manager-calendar"
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
            >
              <Calendar className="w-5 h-5" />
              <span>Calendar</span>
            </Link>

            <button
              onClick={() => handleNavigation('settings')}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-left text-sm"
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </button>
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
              JA
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">John Admin</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
          <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 text-sm font-medium">
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Detailed Management View</h2>
            </div>
            <div className="flex items-center space-x-3">
              <Link to="/notification">
                <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
              </Link>
            </div>
          </div>
        </header>

        {/* Profile Content */}
        <div className="p-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            {/* Profile Header with Avatar */}
            <div className="flex items-center space-x-6 mb-8">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <img
                    src="https://ui-avatars.com/api/?name=John+Admin&size=96&background=4F46E5&color=fff"
                    alt="Profile"
                    className="w-24 h-24 rounded-full"
                  />
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white hover:bg-indigo-700 shadow-lg">
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900">John Manager</h3>
                <p className="text-indigo-600 font-medium mt-1">System Administrator</p>
                <div className="flex items-center space-x-4 mt-3 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Briefcase className="w-4 h-4" />
                    <span>ID: ADM-001</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>IT Department</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>New York, USA</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <div className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('personal')}
                  className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'personal'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                >
                  Personal Info
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'security'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                >
                  Account Security
                </button>
                <button
                  onClick={() => setActiveTab('preferences')}
                  className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'preferences'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                >
                  Preferences
                </button>
              </div>
            </div>

            {/* Form Content */}
            {activeTab === 'personal' && (
              <div className="space-y-6">
                {/* First Name and Last Name */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 text-sm"
                    />
                  </div>
                </div>

                {/* Email and Phone */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 text-sm"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-gray-900 text-sm"
                  />
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-4">
                  <button
                    onClick={handleSaveChanges}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors text-sm"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="text-center py-12 text-gray-500">
                Account Security settings coming soon...
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="text-center py-12 text-gray-500">
                Preferences settings coming soon...
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;