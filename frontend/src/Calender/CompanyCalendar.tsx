import React, { useState } from "react";
import {
  Calendar,
  TrendingUp,
  FileText,
  FolderOpen,
  HelpCircle,
  LogOut,
  Bell,
  Moon,
  Plus,
  Download,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
} from "lucide-react";
import { Link } from "react-router-dom";

interface CalendarEvent {
  date: number;
  title: string;
  type: "holiday" | "event" | "festival" | "vacation";
  color: string;
}

interface UpcomingEvent {
  day: string;
  date: string;
  title: string;
  subtitle: string;
  month: string;
}

interface CompanyCalendarProps {
  onNavigate?: (page: string) => void;
}

const CompanyCalendar: React.FC<CompanyCalendarProps> = ({ onNavigate }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [currentMonth] = useState("October 2023");
  const [filterType, setFilterType] = useState("All");

  const handleNavigation = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  // Calendar events
  const events: CalendarEvent[] = [
    {
      date: 2,
      title: "Gandhi Jayanti",
      type: "holiday",
      color: "bg-green-100 text-green-700",
    },
    {
      date: 5,
      title: "Q3 Review",
      type: "event",
      color: "bg-blue-100 text-blue-700",
    },
    {
      date: 14,
      title: "Team Outing",
      type: "event",
      color: "bg-blue-100 text-blue-700",
    },
    {
      date: 24,
      title: "Dussehra",
      type: "festival",
      color: "bg-purple-100 text-purple-700",
    },
    {
      date: 31,
      title: "Halloween",
      type: "festival",
      color: "bg-orange-100 text-orange-700",
    },
  ];

  // Upcoming events
  const upcomingEvents: UpcomingEvent[] = [
    {
      month: "OCT",
      date: "02",
      day: "Mon",
      title: "Gandhi Jayanti",
      subtitle: "National Holiday",
    },
    {
      month: "OCT",
      date: "24",
      day: "Tue",
      title: "Dussehra",
      subtitle: "Festival Holiday",
    },
    {
      month: "NOV",
      date: "10",
      day: "Fri",
      title: "Diwali Vacation",
      subtitle: "Office Closed (3 Days)",
    },
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
      const event = events.find((e) => e.date === day);
      const isToday = day === 26;

      days.push(
        <div
          key={day}
          className={`p-4 min-h-24 border border-gray-100 hover:bg-gray-50 transition-colors ${
            isToday ? "bg-indigo-50" : "bg-white"
          }`}
        >
          <div
            className={`text-sm font-medium mb-2 ${
              isToday ? "text-indigo-600" : "text-gray-700"
            }`}
          >
            {day}
          </div>
          {event && (
            <div
              className={`text-xs px-2 py-1 rounded ${event.color} font-medium`}
            >
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
        <nav className="flex-1 p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Main Menu
          </p>
          <div className="space-y-1">
            <Link
              to="/employee-dashboard"
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-left"
            >
              <TrendingUp className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/attendance-history"
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
            >
              <FolderOpen className="w-5 h-5" />
              <span>Attendance History</span>
            </Link>
            <Link
              to="/leave"
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-left"
            >
              <FileText className="w-5 h-5" />
              <span>Leaves</span>
            </Link>
            <button className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-left">
              <Calendar className="w-5 h-5" />
              <span>Calendar</span>
            </button>
          </div>

          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-6 mb-3">
            Support
          </p>
          <button
            onClick={() => handleNavigation("helpdesk")}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-left"
          >
            <HelpCircle className="w-5 h-5" />
            <span>Helpdesk</span>
          </button>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <Link to="/profile" className="flex items-center space-x-3 mb-3 ">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
              SJ
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">
                Sarah Johnson
              </p>
              <p className="text-xs text-gray-500">Senior Engineer</p>
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
              <h2 className="text-2xl font-bold text-gray-900">
                Company Calendar
              </h2>
              <p className="text-gray-600 mt-1">
                Manage your calendar and records.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Moon className="w-5 h-5 text-gray-600" />
              </button>
              <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
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
                    <h3 className="text-lg font-bold text-gray-900">
                      Company Events & Holidays
                    </h3>
                    <p className="text-sm text-gray-500">
                      Manage schedules, vacations, and official holidays.
                    </p>
                  </div>
                </div>
              </div>

              {/* Month Navigation and Filters */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <h4 className="text-lg font-bold text-gray-900">
                    {currentMonth}
                  </h4>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                <div className="flex space-x-2">
                  {["All", "Holiday", "Event", "Festival"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filterType === type
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
                  {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map(
                    (day) => (
                      <div
                        key={day}
                        className="p-3 text-center text-xs font-semibold text-gray-600 border-b border-r border-gray-200 last:border-r-0"
                      >
                        {day}
                      </div>
                    )
                  )}
                </div>
                {/* Calendar Days */}
                <div className="grid grid-cols-7">{generateCalendar()}</div>
              </div>
            </div>

            {/* Upcoming Events Sidebar */}
            <div className="space-y-6">
              {/* Upcoming Agenda */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <CalendarDays className="w-5 h-5 text-orange-500" />
                  <h3 className="text-lg font-bold text-gray-900">
                    Upcoming Agenda
                  </h3>
                </div>

                <div className="space-y-4">
                  {upcomingEvents.map((event, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="text-center">
                        <div className="text-xs font-medium text-gray-500">
                          {event.month}
                        </div>
                        <div className="text-2xl font-bold text-indigo-600">
                          {event.date}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-gray-900">
                          {event.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {event.subtitle}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CompanyCalendar;
