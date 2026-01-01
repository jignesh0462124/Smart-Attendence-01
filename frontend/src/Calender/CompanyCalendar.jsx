import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
    Calendar,
    ChevronLeft,
    ChevronRight,
    CalendarDays,
} from "lucide-react";

const CompanyCalendar = () => {
    const { darkMode } = useOutletContext();
    const [currentMonth] = useState("October 2023"); // Ideally dynamic based on date
    const [filterType, setFilterType] = useState("All");

    // Calendar events
    const events = [
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
    const upcomingEvents = [
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
            days.push(<div key={`empty-${i}`} className={`p-4 ${darkMode ? "bg-gray-800" : "bg-white"}`}></div>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayEvents = events.filter((e) => e.date === day);
            // Filter by type if needed
            const filteredEvents = filterType === 'All'
                ? dayEvents
                : dayEvents.filter(e => e.type.toLowerCase() === filterType.toLowerCase());

            const isToday = day === 26; // Mock "Today"

            days.push(
                <div
                    key={day}
                    className={`p-4 min-h-24 border hover:bg-opacity-50 transition-colors flex flex-col gap-1 ${
                        darkMode 
                        ? (isToday ? "bg-indigo-900/20 border-indigo-500/30" : "bg-gray-800 border-gray-700 hover:bg-gray-700") 
                        : (isToday ? "bg-indigo-50 border-indigo-100" : "bg-white border-gray-100 hover:bg-gray-50")
                    }`}
                >
                    <div
                        className={`text-sm font-medium mb-1 ${
                            isToday 
                            ? "text-indigo-600" 
                            : (darkMode ? "text-gray-300" : "text-gray-700")
                        }`}
                    >
                        {day}
                    </div>
                    {filteredEvents.map((event, idx) => (
                        <div
                            key={idx}
                            className={`text-xs px-2 py-1 rounded ${event.color} font-medium leading-tight`}
                        >
                            {event.title}
                        </div>
                    ))}
                    {isToday && (
                        <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-auto self-center lg:self-start">
                            Today
                        </div>
                    )}
                </div>
            );
        }

        return days;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                        Company Calendar
                    </h2>
                    <p className={`mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                        Manage your calendar and records.
                    </p>
                </div>
            </div>

            {/* Calendar Content */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Calendar Section */}
                <div className={`lg:col-span-3 rounded-xl shadow-sm border p-6 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
                    {/* Calendar Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <CalendarDays className="w-6 h-6 text-indigo-600" />
                            <div>
                                <h3 className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                                    Company Events & Holidays
                                </h3>
                                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                    Manage schedules, vacations, and official holidays.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Month Navigation and Filters */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                        <div className="flex items-center space-x-4">
                            <button className={`p-2 rounded-lg ${darkMode ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-600"}`}>
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <h4 className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                                {currentMonth}
                            </h4>
                            <button className={`p-2 rounded-lg ${darkMode ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-600"}`}>
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex space-x-2">
                            {["All", "Holiday", "Event", "Festival"].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setFilterType(type)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterType === type
                                            ? "bg-indigo-600 text-white"
                                            : (darkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200")
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Calendar Grid */}
                    <div className={`border rounded-lg overflow-hidden ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                        {/* Days of Week */}
                        <div className={`grid grid-cols-7 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
                            {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map(
                                (day) => (
                                    <div
                                        key={day}
                                        className={`p-3 text-center text-xs font-semibold border-b border-r last:border-r-0 ${darkMode ? "text-gray-400 border-gray-700" : "text-gray-600 border-gray-200"}`}
                                    >
                                        {day}
                                    </div>
                                )
                            )}
                        </div>
                        {/* Calendar Days */}
                        <div className={`grid grid-cols-7 ${darkMode ? "bg-gray-800" : "bg-white"}`}>{generateCalendar()}</div>
                    </div>
                </div>

                {/* Upcoming Events Sidebar */}
                <div className="space-y-6">
                    {/* Upcoming Agenda */}
                    <div className={`rounded-xl shadow-sm border p-6 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
                        <div className="flex items-center space-x-2 mb-4">
                            <CalendarDays className="w-5 h-5 text-orange-500" />
                            <h3 className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                                Upcoming Agenda
                            </h3>
                        </div>

                        <div className="space-y-4">
                            {upcomingEvents.map((event, index) => (
                                <div
                                    key={index}
                                    className={`flex items-start space-x-3 pb-4 border-b last:border-b-0 ${darkMode ? "border-gray-700" : "border-gray-100"}`}
                                >
                                    <div className="text-center">
                                        <div className={`text-xs font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                            {event.month}
                                        </div>
                                        <div className="text-2xl font-bold text-indigo-600">
                                            {event.date}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                                            {event.title}
                                        </h4>
                                        <p className={`text-xs mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
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
    );
};

export default CompanyCalendar;
