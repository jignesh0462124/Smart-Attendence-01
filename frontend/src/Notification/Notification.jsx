import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  ShieldAlert,
  Calendar,
  Bell,
  Info,
  XCircle,
  Mail
} from 'lucide-react';
import { useUserProfile } from '../context/UserProfileContext';
import { getMyNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../services/notificationService';

const NotificationsPage = () => {
  const { userProfile } = useUserProfile();
  const { darkMode } = useOutletContext();
  const [notificationsList, setNotificationsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'unread'

  useEffect(() => {
    if (userProfile) {
      fetchNotifications();
    }
  }, [userProfile]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await getMyNotifications(userProfile.id);
      setNotificationsList(data || []);
    } catch (error) {
      console.error("Failed to load notifications", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotificationsList(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead(userProfile.id);
      setNotificationsList(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error("Failed to mark all as read", error);
    }
  };

  const filteredNotifications = notificationsList.filter(n => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error': return <ShieldAlert className="w-5 h-5 text-red-500" />;
      case 'info': default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBgColor = (type, read) => {
    if (read) return darkMode ? 'bg-gray-800' : 'bg-white';
    switch (type) {
      case 'warning': return darkMode ? 'bg-orange-900/10' : 'bg-orange-50';
      case 'success': return darkMode ? 'bg-green-900/10' : 'bg-green-50';
      case 'error': return darkMode ? 'bg-red-900/10' : 'bg-red-50';
      case 'info': default: return darkMode ? 'bg-blue-900/10' : 'bg-blue-50';
    }
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-3xl font-extrabold tracking-tight ${darkMode ? "text-white" : "text-gray-900"}`}>
            Notifications
          </h2>
          <p className={`mt-2 text-lg ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Stay updated with alerts and activities.
          </p>
        </div>
        <div className={`px-4 py-2 rounded-full text-sm font-semibold border flex items-center gap-2 ${darkMode ? "bg-gray-800 border-gray-700 text-indigo-400" : "bg-white border-gray-200 text-indigo-600"}`}>
          <Bell className="w-4 h-4" />
          {notificationsList.filter(n => !n.read).length} Unread
        </div>
      </div>

      {/* Notifications Card */}
      <div className={`rounded-xl shadow-lg border overflow-hidden ${darkMode ? "bg-gray-800 border-gray-700 shadow-gray-900/50" : "bg-white border-gray-100 shadow-slate-200/50"}`}>

        {/* Action Bar */}
        <div className={`flex flex-col sm:flex-row items-center justify-between p-6 border-b ${darkMode ? "border-gray-700 bg-gray-800/50" : "border-gray-50 bg-gray-50/50"}`}>
          <div className="flex gap-2 mb-4 sm:mb-0 w-full sm:w-auto">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'all'
                ? (darkMode ? "bg-indigo-600 text-white" : "bg-indigo-100 text-indigo-700")
                : (darkMode ? "text-gray-400 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100")}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'unread'
                ? (darkMode ? "bg-indigo-600 text-white" : "bg-indigo-100 text-indigo-700")
                : (darkMode ? "text-gray-400 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100")}`}
            >
              Unread
            </button>
          </div>

          {notificationsList.some(n => !n.read) && (
            <button
              onClick={handleMarkAllAsRead}
              className={`text-sm font-medium transition-colors flex items-center gap-2 ${darkMode ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-700"}`}
            >
              <CheckCircle className="w-4 h-4" /> Mark all as read
            </button>
          )}
        </div>

        {/* List */}
        <div className="divide-y text-sm"> {/* Removed p-4 to let items flush */}
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className={darkMode ? "text-gray-400" : "text-gray-500"}>Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <div className={`p-4 rounded-full mb-4 ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                <Bell className={`w-8 h-8 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
              </div>
              <h3 className={`text-lg font-bold mb-1 ${darkMode ? "text-white" : "text-gray-900"}`}>No notifications</h3>
              <p className={`max-w-xs mx-auto ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                {filter === 'unread' ? "You're all caught up! No unread messages." : "You have no notifications yet."}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                className={`flex gap-4 p-5 transition-all cursor-pointer group ${getBgColor(notification.type, notification.read)} ${darkMode ? "hover:bg-gray-700/50 border-gray-700" : "hover:bg-gray-50 border-gray-100"}`}
              >
                <div className={`mt-1 flex-shrink-0`}>
                  {getIcon(notification.type)}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className={`text-base font-semibold mb-1 ${!notification.read ? (darkMode ? "text-white" : "text-gray-900") : (darkMode ? "text-gray-400" : "text-gray-600")}`}>
                      {notification.title}
                      {!notification.read && <span className="inline-block w-2 h-2 bg-red-500 rounded-full ml-2 animate-pulse"></span>}
                    </h4>
                    <span className={`text-xs whitespace-nowrap ${darkMode ? "text-gray-500 px-2 py-1 bg-gray-900 rounded-md" : "text-gray-400 bg-gray-100 px-2 py-1 rounded-md"}`}>
                      {getTimeAgo(notification.created_at)}
                    </span>
                  </div>
                  <p className={`text-sm leading-relaxed ${darkMode ? "text-gray-400 group-hover:text-gray-300" : "text-gray-600 group-hover:text-gray-800"}`}>
                    {notification.description}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
