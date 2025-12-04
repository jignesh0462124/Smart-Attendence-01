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
  AlertTriangle,
  Clock,
  CheckCircle,
  ShieldAlert,
  Calendar,
} from 'lucide-react';
import { Link } from 'react-router-dom';

// --- MOCK DATA ---
const notifications = [
  {
    id: 1,
    icon: AlertTriangle,
    iconColor: 'text-orange-500',
    bgColor: 'bg-orange-50',
    title: 'New Leave Request',
    description: 'Sarah Johnson has requested sick leave for Oct 28.',
    time: '10 minutes ago',
    read: false,
  },
  {
    id: 2,
    icon: Clock,
    iconColor: 'text-blue-500',
    bgColor: 'bg-blue-50',
    title: 'System Update Scheduled',
    description: 'Maintenance scheduled for Sunday at 2:00 AM.',
    time: '2 hours ago',
    read: false,
  },
  {
    id: 3,
    icon: CheckCircle,
    iconColor: 'text-green-500',
    bgColor: 'bg-green-50',
    title: 'Attendance Report Ready',
    description: 'The monthly attendance report for September is available for download.',
    time: '5 hours ago',
    read: true,
  },
  {
    id: 4,
    icon: ShieldAlert,
    iconColor: 'text-red-500',
    bgColor: 'bg-red-50',
    title: 'Security Alert',
    description: 'Multiple failed login attempts detected from IP 192.168.1.55.',
    time: '1 day ago',
    read: true,
  },
  {
    id: 5,
    icon: Calendar,
    iconColor: 'text-indigo-500',
    bgColor: 'bg-indigo-50',
    title: 'Festival Holiday Reminder',
    description: 'Office will be closed on Oct 24 for Dussehra.',
    time: '3 days ago',
    read: true,
  },
];

// --- COMPONENT ---
const NotificationsPage = () => {
  // State for sidebar dropdowns
  const [isEmpMenuOpen, setIsEmpMenuOpen] = useState(false);
  const [isAttendanceMenuOpen, setIsAttendanceMenuOpen] = useState(false);
  const [notificationsList, setNotificationsList] = useState(notifications);

  // Mock handlers
  const handleMarkAllAsRead = () => {
    const updatedList = notificationsList.map(n => ({ ...n, read: true }));
    setNotificationsList(updatedList);
  };

  const handleUnread = () => {
    // Filter to show only unread items
    const unreadList = notificationsList.filter(n => !n.read);
    setNotificationsList(unreadList.length > 0 ? unreadList : notifications);
  };
  
  const handleAll = () => {
    setNotificationsList(notifications);
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
            <Link to="/" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 font-medium group">
              <LayoutDashboard className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
              <span>Dashboard Overview</span>
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

        {/* Page Content Container (Max Width 960px equivalent on desktop) */}
        <div className="p-8 mx-auto max-w-7xl">
          
          {/* Notifications Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            
            {/* Title and Controls */}
            <div className="flex items-start justify-between mb-8 pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                  <Bell className="w-5 h-5 text-indigo-600" />
                  <span>Notifications</span>
                </h3>
                <p className="text-sm text-gray-500 mt-1">Stay updated with alerts and activities.</p>
              </div>
              
              {/* Filter and Action Buttons */}
              <div className="flex space-x-2 text-sm">
                <button onClick={handleAll} className="px-3 py-1 text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition-colors">
                  All
                </button>
                <button onClick={handleUnread} className="px-3 py-1 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors">
                  Unread
                </button>
                <button onClick={handleMarkAllAsRead} className="px-3 py-1 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors">
                  Mark all as read
                </button>
              </div>
            </div>

            {/* Notification List */}
            <div className="space-y-4">
              {notificationsList.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`flex justify-between items-center p-4 border border-gray-200 rounded-lg transition-shadow ${!notification.read ? 'bg-white hover:shadow-md' : 'bg-gray-50'}`}
                >
                  
                  {/* Icon and Content */}
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-full ${notification.bgColor}`}>
                      <notification.icon className={`w-5 h-5 ${notification.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className={`text-sm font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                        {notification.title}
                        {!notification.read && <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full ml-2"></span>}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">{notification.description}</p>
                    </div>
                  </div>
                  
                  {/* Time Stamp */}
                  <div className="text-xs text-gray-500 flex-shrink-0 ml-4">
                    {notification.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotificationsPage;