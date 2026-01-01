import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  ShieldAlert,
  Calendar,
  Bell,
} from 'lucide-react';

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
  const { darkMode } = useOutletContext();
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
            Notifications
          </h2>
          <p className={`mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Stay updated with alerts and activities.
          </p>
        </div>
      </div>

      {/* Notifications Card */}
      <div className={`rounded-xl shadow-sm border p-8 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>

        {/* Title and Controls */}
        <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-4 border-b ${darkMode ? "border-gray-700" : "border-gray-100"}`}>
          <div className="mb-4 sm:mb-0">
            <h3 className={`text-xl font-bold flex items-center space-x-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
              <Bell className="w-5 h-5 text-indigo-600" />
              <span>Recent Alerts</span>
            </h3>
          </div>

          {/* Filter and Action Buttons */}
          <div className="flex space-x-2 text-sm">
            <button
              onClick={handleAll}
              className={`px-3 py-1 font-medium rounded-lg transition-colors ${darkMode ? "text-indigo-400 hover:bg-gray-700" : "text-indigo-600 hover:bg-indigo-50"}`}
            >
              All
            </button>
            <button
              onClick={handleUnread}
              className={`px-3 py-1 font-medium rounded-lg transition-colors ${darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100"}`}
            >
              Unread
            </button>
            <button
              onClick={handleMarkAllAsRead}
              className={`px-3 py-1 font-medium rounded-lg transition-colors ${darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100"}`}
            >
              Mark all as read
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="space-y-4">
          {notificationsList.map((notification) => (
            <div
              key={notification.id}
              className={`flex justify-between items-center p-4 border rounded-lg transition-shadow ${!notification.read
                ? (darkMode ? 'bg-gray-700 border-gray-600 hover:shadow-md' : 'bg-white border-gray-200 hover:shadow-md')
                : (darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200')
                }`}
            >

              {/* Icon and Content */}
              <div className="flex items-start space-x-4">
                <div className={`p-2 rounded-full ${darkMode ? "bg-gray-900" : notification.bgColor}`}>
                  <notification.icon className={`w-5 h-5 ${notification.iconColor}`} />
                </div>
                <div className="flex-1">
                  <h4 className={`text-sm font-semibold ${!notification.read
                    ? (darkMode ? 'text-white' : 'text-gray-900')
                    : (darkMode ? 'text-gray-400' : 'text-gray-700')
                    }`}>
                    {notification.title}
                    {!notification.read && <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full ml-2"></span>}
                  </h4>
                  <p className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{notification.description}</p>
                </div>
              </div>

              {/* Time Stamp */}
              <div className={`text-xs flex-shrink-0 ml-4 ${darkMode ? "text-gray-500" : "text-gray-500"}`}>
                {notification.time}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;