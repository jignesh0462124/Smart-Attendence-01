import React, { useState } from 'react';
import {
    LayoutDashboard,
    Users,
    ChevronRight,
    CheckSquare,
    Clock,
    Bell,
    Settings,
    LogOut,
    UserCircle,
    Calendar,
    ClipboardCheck,
    BarChart2,
    Search,
    Pencil,
    X,
} from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";

// --- MOCK DATA ---
const attendanceRecords = [
    {
        id: 1,
        name: 'Sarah Johnson',
        role: 'Software Engineer',
        avatar: 'https://i.pravatar.cc/150?u=sarahj',
        status: 'Present',
        statusColor: 'bg-green-100 text-green-700',
        checkIn: '08:52 AM',
        checkOut: '---',
    },
    {
        id: 2,
        name: 'Michael Chen',
        role: 'Marketing Lead',
        avatar: 'https://i.pravatar.cc/150?u=michaelc',
        status: 'Absent',
        statusColor: 'bg-red-100 text-red-700',
        checkIn: '---',
        checkOut: '---',
    },
    {
        id: 3,
        name: 'Jessica Lee',
        role: 'HR Specialist',
        avatar: 'https://i.pravatar.cc/150?u=jessical',
        status: 'On Leave',
        statusColor: 'bg-orange-100 text-orange-700',
        checkIn: '---',
        checkOut: '---',
    },
    {
        id: 4,
        name: 'Emily Davis',
        role: 'Sales Manager',
        avatar: 'https://i.pravatar.cc/150?u=emilyd',
        status: 'Completed',
        statusColor: 'bg-blue-100 text-blue-700',
        checkIn: '08:55 AM',
        checkOut: '05:05 PM',
    },
];

const ManualAttendanceMarking = () => {
    const [expandedMenu, setExpandedMenu] = useState('attendance'); // Active on Attendance
    const [records, setRecords] = useState(attendanceRecords);
    const navigate = useNavigate();

    const handleNavigation = (page) => {
        const map = {
            dashboard: '/manager-dashboard',
            tasks: '/tasks',
            notifications: '/notifications',
            settings: '/profile',
        };
        const path = map[page] ?? '/';
        navigate(path);
    };

    const toggleMenu = (menu) => {
        setExpandedMenu(expandedMenu === menu ? null : menu);
    };

    const handleMarkIn = (id) => {
        console.log(`Marking Check-In for ID: ${id}`);
        // In a real app, this would open a modal to enter time/notes
    };

    const handleMarkOut = (id) => {
        console.log(`Marking Check-Out for ID: ${id}`);
        // In a real app, this would open a modal to enter time/notes
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* --- SIDEBAR --- */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
                {/* Logo */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <Clock className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900">SMART Attend</h1>
                            <p className="text-xs text-gray-500">Manager Dashboard</p>
                        </div>
                    </div>
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
                                    <Link to="/view-employee" className="w-full block text-left px-3 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50">
                                        <span>All Employees</span>
                                    </Link>
                                    <Link to="/id-creation" className="w-full block text-left px-3 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50">
                                        <span>Employee ID Creation</span>
                                    </Link>
                                </div>
                            )}
                        </div>

                        <Link
                            to="/tasks"
                            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-left text-sm"
                        >
                            <CheckSquare className="w-5 h-5" />
                            <span>Tasks</span>
                        </Link>
                        <Link
                            to="/send-notification"
                            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-left text-sm"
                        >
                            <CheckSquare className="w-5 h-5" />
                            <span>Send Notification</span>
                        </Link>

                        {/* Attendance Section (Active) */}
                        <div>
                            <button
                                onClick={() => toggleMenu('attendance')}
                                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-indigo-50 text-indigo-600 font-medium text-left text-sm"
                            >
                                <div className="flex items-center space-x-3">
                                    <Clock className="w-5 h-5" />
                                    <span>Attendance</span>
                                </div>
                                <ChevronRight className={`w-4 h-4 transition-transform ${expandedMenu === 'attendance' ? 'rotate-90' : ''}`} />
                            </button>

                            {expandedMenu === 'attendance' && (
                                <div className="ml-8 mt-1 space-y-1">
                                    <Link
                                        to="/manual-attendance"
                                        className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50">
                                        Manual Attendance Marking
                                    </Link>
                                    <Link
                                                      to="/manager-attendance-history"
                                                      className="w-full block text-left px-3 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50">
                                                        <span>My Attendance History</span>
                                                      </Link>
                                </div>
                            )}
                        </div>
                        <Link
                            to="/leave-approvel"
                            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-left text-sm"
                        >
                            <Bell className="w-5 h-5" />
                            <span>Leave request and Approvals</span>
                        </Link>
                        <Link
                            to="/manager-calendar"
                            className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                        >
                            <Calendar className="w-5 h-5" />
                            <span>Calendar</span>
                        </Link>



                    </div>
                </nav>

                {/* User Profile */}
                <div className="p-4 border-t border-gray-200">
                    <Link to="/manager-profile" className="flex items-center space-x-3 mb-3 ">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                            JM
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900">John Manager</p>
                            <p className="text-xs text-gray-500">Team Manager</p>
                        </div>
                    </Link>
                    <div className="flex items-center justify-between">
                        <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 text-sm font-medium">
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 overflow-auto">
                {/* Header - Full Width Banner */}
                <header className="bg-white border-b border-gray-200 px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Manual Attendance</h2>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                                <Bell className="w-5 h-5 text-gray-600" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>
                            <Link to="/manager-profile" className="p-2 hover:bg-gray-100 rounded-lg">
                                <UserCircle className="w-6 h-6 text-gray-600" />
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Content Area (Constrained to 960px max width) */}
                <div className="p-8 flex justify-center">
                    <div className="w-full max-w-4xl"> {/* Using max-w-4xl for table readability */}
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8">

                            {/* Card Header */}
                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-gray-900">Manual Attendance Marking</h3>
                                <p className="text-sm text-gray-500 mt-1">Manage daily clock-in and clock-out times for all employees.</p>
                            </div>

                            {/* Search and Filter */}
                            <div className="flex justify-between items-center mb-6 space-x-4">
                                <div className="relative flex-1 max-w-sm">
                                    <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search employee or ID..."
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <button className="px-4 py-2 bg-indigo-50 text-indigo-600 text-sm font-medium rounded-lg hover:bg-indigo-100 transition-colors flex items-center">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    Filter Date
                                </button>
                            </div>

                            {/* Attendance Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[700px] divide-y divide-gray-200">
                                    <thead>
                                        <tr className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-left bg-gray-50">
                                            <th className="px-4 py-3">Employee</th>
                                            <th className="px-4 py-3">Status</th>
                                            <th className="px-4 py-3">Clock In</th>
                                            <th className="px-4 py-3">Clock Out</th>
                                            <th className="px-4 py-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {records.map((record) => (
                                            <tr key={record.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <img className="w-8 h-8 rounded-full mr-3" src={record.avatar} alt={record.name} />
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">{record.name}</div>
                                                            <div className="text-xs text-gray-500">{record.role}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${record.statusColor}`}>
                                                        {record.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                                    {record.checkIn}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                                    {record.checkOut === '---' ? (
                                                        <span className="text-gray-400">---</span>
                                                    ) : (
                                                        record.checkOut
                                                    )}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-right">
                                                    <div className="inline-flex space-x-2">
                                                        {/* Check In Button */}
                                                        <button
                                                            onClick={() => handleMarkIn(record.id)}
                                                            disabled={record.checkIn !== '---' && record.checkOut === '---'}
                                                            className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${record.checkIn === '---'
                                                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                                }`}
                                                        >
                                                            Check In
                                                        </button>

                                                        {/* Check Out Button */}
                                                        <button
                                                            onClick={() => handleMarkOut(record.id)}
                                                            disabled={record.checkOut !== '---' || record.checkIn === '---'}
                                                            className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${record.checkIn !== '---' && record.checkOut === '---'
                                                                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                                }`}
                                                        >
                                                            Check Out
                                                        </button>

                                                        {/* Edit/Correct Button (for completed records) */}
                                                        <button
                                                            className="p-2 text-gray-400 hover:text-indigo-600 rounded-full"
                                                            title="Edit Entry"
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ManualAttendanceMarking;