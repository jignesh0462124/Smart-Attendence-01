import React, { useState } from 'react';
import { Calendar, Download, ChevronLeft, ChevronRight, CalendarDays, LayoutDashboard, Users, CheckSquare, Clock, Settings, LogOut, Moon, ChevronRight as IconChevronRight, Plus, Bell } from 'lucide-react';
import { Link } from "react-router-dom";

// Removed TypeScript interfaces
const CompanyCalendar = ({ onNavigate }) => { // Removed interface and React.FC
  const [darkMode, setDarkMode] = useState(false);
  const [currentMonth] = useState('October 2023');
  const [filterType, setFilterType] = useState('All');
  // Removed type annotation for useState
  const [expandedMenu, setExpandedMenu] = useState(null);

  // Removed type annotation for parameter 'menu'
  const toggleMenu = (menu) => setExpandedMenu(prev => (prev === menu ? null : menu));

  // Removed type annotation for parameter 'page'
  const handleNavigation = (page) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  // Calendar events (Removed type annotation)
  const events = [
    { date: 2, title: 'Gandhi Jayanti', type: 'holiday', color: 'bg-green-100 text-green-700' },
    { date: 5, title: 'Q3 Review', type: 'event', color: 'bg-blue-100 text-blue-700' },
    { date: 14, title: 'Team Outing', type: 'event', color: 'bg-blue-100 text-blue-700' },
    { date: 24, title: 'Dussehra', type: 'festival', color: 'bg-purple-100 text-purple-700' },
    { date: 31, title: 'Halloween', type: 'festival', color: 'bg-orange-100 text-orange-700' },
  ];

  // Upcoming events (Removed type annotation)
  const upcomingEvents = [
    { month: 'OCT', date: '02', day: 'Mon', title: 'Gandhi Jayanti', subtitle: 'National Holiday' },
    { month: 'OCT', date: '24', day: 'Tue', title: 'Dussehra', subtitle: 'Festival Holiday' },
    { month: 'NOV', date: '10', day: 'Fri', title: 'Diwali Vacation', subtitle: 'Office Closed (3 Days)' },
  ];

  // Generate calendar days
  const generateCalendar = () => {
    const days = [];
    const daysInMonth = 31;
    const startDay = 0; // Sunday

    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-4"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const event = events.find(e => e.date === day);
      const isToday = day === 26;

      days.push(
        <div
          key={day}
          className={`p-4 min-h-24 border border-gray-100 hover:bg-gray-50 transition-colors ${isToday ? 'bg-indigo-50' : 'bg-white'
            }`}
        >
          <div className={`text-sm font-medium mb-2 ${isToday ? 'text-indigo-600' : 'text-gray-700'}`}>
            {day}
          </div>
          {event && (
            <div className={`text-xs px-2 py-1 rounded ${event.color} font-medium`}>
              {event.title}
            </div>
          )}
          {isToday && (
            <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-2">
              Today
            </div>
          )}
        </div>
      );
    }

    return days;
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
              <h1 className="text-lg font-bold text-gray-900">HRMS Portal</h1>
              <p className="text-xs text-gray-500">EMPLOYEE</p>
            </div>
          </div>
        </div>

        {/* Main Menu */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            <Link
              to="/manager-dashboard"
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>

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
                <IconChevronRight className={`w-4 h-4 transition-transform ${expandedMenu === 'employee' ? 'rotate-90' : ''}`} />
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
                <IconChevronRight className={`w-4 h-4 transition-transform ${expandedMenu === 'attendance' ? 'rotate-90' : ''}`} />
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
              to="/Managercalendar"
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg bg-indigo-50 text-indigo-600 font-medium"
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
          <Link to="/manager-profile" className="flex items-center space-x-3 mb-3 ">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
              SJ
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">John Manager</p>
              <p className="text-xs text-gray-500">Manager</p>
            </div>
          </Link>
          <div className="flex items-center justify-between">
            <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 text-sm font-medium">
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Company Calendar</h2>
              <p className="text-gray-600 mt-1">Manage your calendar and records.</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Moon className="w-5 h-5 text-gray-600" />
              </button>
              <Link to="/notification">
                <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
              </Link>
            </div>
          </div>
        </header>

        {/* Calendar Content */}
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Calendar Section */}
            <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <CalendarDays className="w-6 h-6 text-indigo-600" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Company Events & Holidays</h3>
                    <p className="text-sm text-gray-500">Manage schedules, vacations, and official holidays.</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-sm flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Add Event</span>
                </button>
              </div>

              {/* Month Navigation and Filters */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <h4 className="text-lg font-bold text-gray-900">{currentMonth}</h4>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                <div className="flex space-x-2">
                  {['All', 'Holiday', 'Event', 'Festival'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterType === type
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Days of Week */}
                <div className="grid grid-cols-7 bg-gray-50">
                  {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
                    <div key={day} className="p-3 text-center text-xs font-semibold text-gray-600 border-b border-r border-gray-200 last:border-r-0">
                      {day}
                    </div>
                  ))}
                </div>
                {/* Calendar Days */}
                <div className="grid grid-cols-7">
                  {generateCalendar()}
                </div>
              </div>
            </div>

            {/* Upcoming Events Sidebar */}
            <div className="space-y-6">
              {/* Upcoming Agenda */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <CalendarDays className="w-5 h-5 text-orange-500" />
                  <h3 className="text-lg font-bold text-gray-900">Upcoming Agenda</h3>
                </div>

                <div className="space-y-4">
                  {upcomingEvents.map((event, index) => (
                    <div key={index} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-b-0">
                      <div className="text-center">
                        <div className="text-xs font-medium text-gray-500">{event.month}</div>
                        <div className="text-2xl font-bold text-indigo-600">{event.date}</div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-gray-900">{event.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">{event.subtitle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Download Schedule */}
              <button className="w-full px-4 py-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg font-medium text-sm text-gray-700 flex items-center justify-center space-x-2 transition-colors">
                <Download className="w-4 h-4" />
                <span>Download Schedule</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CompanyCalendar;