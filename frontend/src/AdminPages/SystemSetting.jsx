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
  Lock,
  Mail,
  CreditCard,
  Globe,
  DollarSign,
  ToggleLeft,
  CheckSquare,
  FileText,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const SystemSettings = () => {
  // State to manage the active tab: 'General', 'Security', 'Notifications', 'Billing'
  const [activeTab, setActiveTab] = useState('General');

  // State for sidebar dropdowns (Active by default for this page)
  const [isEmpMenuOpen, setIsEmpMenuOpen] = useState(false);
  const [isAttendanceMenuOpen, setIsAttendanceMenuOpen] = useState(false);

  // State for form data (Mock data initialization)
  const [generalSettings, setGeneralSettings] = useState({
    companyName: 'Acme Corp',
    supportEmail: 'support@acmecorp.com',
    website: 'https://acmecorp.com',
    fiscalYearStart: 'January',
    defaultTimeZone: 'GMT (-05:00) Eastern Time (US & Canada)',
    dateFormat: 'MM/DD/YYYY',
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    ssoEnabled: false,
    sessionTimeout: '15 Minutes',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailAdminLeaveRequest: true,
    sendWeeklyAttendance: true,
    notifyPublicHolidays: false,
  });

  // Simple handler for general input changes
  const handleGeneralChange = (e) => {
    setGeneralSettings({
      ...generalSettings,
      [e.target.name]: e.target.value,
    });
  };

  // Simple handler for checkbox/toggle changes
  const handleToggleChange = (name, value) => {
    setSecuritySettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Simple handler for notification checkboxes
  const handleNotificationChange = (e) => {
    setNotificationSettings({
      ...notificationSettings,
      [e.target.name]: e.target.checked
    });
  };

  const tabs = ['General', 'Security', 'Notifications', 'Billing'];

  // --- TAB CONTENT RENDERING FUNCTIONS ---

  const renderGeneralTab = () => (
    <div className="space-y-8 pt-4">
      <h4 className="text-lg font-bold text-gray-800 border-b pb-3 mb-4">Company Details</h4>

      {/* Company Name & Support Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
          <input
            type="text"
            name="companyName"
            value={generalSettings.companyName}
            onChange={handleGeneralChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
          <input
            type="email"
            name="supportEmail"
            value={generalSettings.supportEmail}
            onChange={handleGeneralChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Website & Fiscal Year Start */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
          <input
            type="url"
            name="website"
            value={generalSettings.website}
            onChange={handleGeneralChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fiscal Year Start</label>
          <select
            name="fiscalYearStart"
            value={generalSettings.fiscalYearStart}
            onChange={handleGeneralChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white"
          >
            <option>January</option>
            <option>April</option>
            <option>July</option>
            <option>October</option>
          </select>
        </div>
      </div>

      <h4 className="text-lg font-bold text-gray-800 border-b pb-3 mb-4 pt-4">Localization</h4>

      {/* Time Zone & Date Format */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Default Time Zone</label>
          <select
            name="defaultTimeZone"
            value={generalSettings.defaultTimeZone}
            onChange={handleGeneralChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white"
          >
            <option>GMT (-05:00) Eastern Time (US & Canada)</option>
            <option>GMT (+05:30) India Standard Time</option>
            <option>GMT (00:00) Greenwich Mean Time</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date Format</label>
          <select
            name="dateFormat"
            value={generalSettings.dateFormat}
            onChange={handleGeneralChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white"
          >
            <option>MM/DD/YYYY</option>
            <option>DD/MM/YYYY</option>
            <option>YYYY-MM-DD</option>
          </select>
        </div>
      </div>

      <div className="pt-6">
        <button
          onClick={() => console.log('Saving General Settings:', generalSettings)}
          className="px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
        >
          Save General Settings
        </button>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-8 pt-4">
      {/* 2FA Toggle */}
      <div className="flex items-center justify-between border-b pb-5">
        <div>
          <h4 className="text-base font-semibold text-gray-900">Two-Factor Authentication (2FA)</h4>
          <p className="text-sm text-gray-500 mt-1">Require all administrators to use 2FA for login.</p>
        </div>
        <button
          onClick={() => handleToggleChange('twoFactorAuth', !securitySettings.twoFactorAuth)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${securitySettings.twoFactorAuth ? 'bg-indigo-600' : 'bg-gray-200'}`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${securitySettings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'}`}
          />
        </button>
      </div>

      {/* SSO */}
      <div className="flex items-center justify-between border-b pb-5">
        <div>
          <h4 className="text-base font-semibold text-gray-900">Single Sign-On (SSO)</h4>
          <p className="text-sm text-gray-500 mt-1">Enable Google Workspace or Azure AD login.</p>
        </div>
        <button className="text-indigo-600 font-medium hover:text-indigo-800 text-sm">
          Configure
        </button>
      </div>

      {/* Session Timeout */}
      <div className="pb-5">
        <h4 className="text-base font-semibold text-gray-900 mb-3">Session Timeout</h4>
        <div className="w-56">
          <select
            name="sessionTimeout"
            value={securitySettings.sessionTimeout}
            onChange={(e) => handleToggleChange('sessionTimeout', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white"
          >
            <option>15 Minutes</option>
            <option>30 Minutes</option>
            <option>1 Hour</option>
            <option>Never</option>
          </select>
          <p className="text-xs text-gray-500 mt-2">Automatically log out inactive users.</p>
        </div>
      </div>

      <div className="pt-6">
        <button
          onClick={() => console.log('Saving Security Policy:', securitySettings)}
          className="px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
        >
          Save Security Policy
        </button>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-8 pt-4">
      <h4 className="text-lg font-bold text-gray-800 border-b pb-3 mb-4">System Alerts</h4>

      {/* Email Admin Leave Request */}
      <div className="flex items-start space-x-3">
        <input
          id="emailAdminLeaveRequest"
          type="checkbox"
          name="emailAdminLeaveRequest"
          checked={notificationSettings.emailAdminLeaveRequest}
          onChange={handleNotificationChange}
          className="mt-1 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
        />
        <label htmlFor="emailAdminLeaveRequest" className="text-sm font-medium text-gray-700">
          Email admins when a new leave request is submitted.
        </label>
      </div>

      {/* Send Weekly Attendance Reports */}
      <div className="flex items-start space-x-3">
        <input
          id="sendWeeklyAttendance"
          type="checkbox"
          name="sendWeeklyAttendance"
          checked={notificationSettings.sendWeeklyAttendance}
          onChange={handleNotificationChange}
          className="mt-1 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
        />
        <label htmlFor="sendWeeklyAttendance" className="text-sm font-medium text-gray-700">
          Send weekly attendance reports to department heads.
        </label>
      </div>

      {/* Notify Holidays */}
      <div className="flex items-start space-x-3">
        <input
          id="notifyPublicHolidays"
          type="checkbox"
          name="notifyPublicHolidays"
          checked={notificationSettings.notifyPublicHolidays}
          onChange={handleNotificationChange}
          className="mt-1 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
        />
        <label htmlFor="notifyPublicHolidays" className="text-sm font-medium text-gray-700">
          Notify all employees of public holidays 2 days in advance.
        </label>
      </div>

      <div className="pt-6">
        <button
          onClick={() => console.log('Saving Notification Preferences:', notificationSettings)}
          className="px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );

  const renderBillingTab = () => (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <CreditCard className="w-16 h-16 text-gray-400 mb-6" />
      <h4 className="text-xl font-bold text-gray-900 mb-2 flex items-center space-x-2">
        <DollarSign className="w-6 h-6 text-green-600" />
        <span>Plan Management</span>
      </h4>
      <p className="text-gray-600 max-w-sm">
        You are currently on the <span className="font-semibold text-indigo-600">Enterprise Plan</span>. Your next billing date is Nov 01, 2024.
      </p>

      <div className="flex space-x-4 mt-6">
        <button
          onClick={() => console.log('View Invoices')}
          className="px-6 py-2.5 text-gray-700 font-medium border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors shadow-sm"
        >
          View Invoices
        </button>
        <button
          onClick={() => console.log('Upgrade Plan')}
          className="px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
        >
          Upgrade Plan
        </button>
      </div>
    </div>
  );

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'General':
        return renderGeneralTab();
      case 'Security':
        return renderSecurityTab();
      case 'Notifications':
        return renderNotificationsTab();
      case 'Billing':
        return renderBillingTab();
      default:
        return null;
    }
  };


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

            <Link to="/reportsandanalytics" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 font-medium group mt-2">
              <BarChart2 className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
              <span>Reports & Analytics</span>
            </Link>

            <button className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg bg-indigo-50 text-indigo-600 font-medium group mt-2">
              <Settings className="w-5 h-5" />
              <span>System Settings</span>
            </button>
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

          {/* System Configuration Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">

            {/* Title and Description */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900">System Configuration</h3>
              <p className="text-sm text-gray-500 mt-1">Manage global settings, security policies, and integrations.</p>
            </div>

            {/* Tabs Navigation */}
            <div className="border-b border-gray-200 mb-8">
              <nav className="flex space-x-6" aria-label="Tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-sm font-medium transition-colors ${activeTab === tab
                        ? 'border-b-2 border-indigo-600 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            {/* Render Active Tab Content */}
            <div className="p-4">
              {renderActiveTabContent()}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default SystemSettings;