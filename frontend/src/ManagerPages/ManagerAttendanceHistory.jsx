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
    ClipboardCheck, 
    BarChart2,
    Calendar,
    MapPin,
    Download,
    Eye,
} from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";

// --- MOCK DATA ---
const attendanceHistoryRecords = [
    {
        date: '2023-10-24',
        checkIn: '08:58 AM',
        checkOut: '05:35 PM',
        location: '40.7128, -74.0060', // Mock GPS coordinates
        status: 'Completed',
        statusColor: 'text-green-700 bg-green-100',
        snapshotUrl: 'https://i.pravatar.cc/150?u=snap1', 
    },
    {
        date: '2023-10-23',
        checkIn: '09:05 AM',
        checkOut: '05:55 PM',
        location: '40.7128, -74.0060',
        status: 'Completed',
        statusColor: 'text-green-700 bg-green-100',
        snapshotUrl: 'https://i.pravatar.cc/150?u=snap2',
    },
    {
        date: '2023-10-22',
        checkIn: '08:45 AM',
        checkOut: '06:00 PM',
        location: '40.7128, -74.0060',
        status: 'Completed',
        statusColor: 'text-green-700 bg-green-100',
        snapshotUrl: 'https://i.pravatar.cc/150?u=snap3',
    },
    {
        date: '2023-10-21',
        checkIn: '09:12 AM',
        checkOut: '05:05 PM',
        location: '40.7128, -74.0060',
        status: 'Completed',
        statusColor: 'text-green-700 bg-green-100',
        snapshotUrl: 'https://i.pravatar.cc/150?u=snap4',
    },
];

const MyAttendanceHistory = () => {
    // State for sidebar dropdowns
    const [expandedMenu, setExpandedMenu] = useState('attendance'); // Active on Attendance
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
    
    // Handler for viewing location or snapshot details
    const handleViewDetail = (type, data) => {
        console.log(`Viewing detail: ${type}`, data);
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
                                    <Link to="/manual-attendance" className="w-full block text-left px-3 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50">
                                        Manual Attendance Marking
                                    </Link>
                                   
                                    <button className="w-full block text-left px-3 py-2 text-sm text-indigo-600 bg-indigo-50 rounded-lg font-medium">
                                        My Attendance History
                                    </button>
                                </div>
                            )}
                        </div>
                        
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
                            <h2 className="text-2xl font-bold text-gray-900">My Attendance History</h2>
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
                            
                            {/* Card Header and Actions */}
                            <div className="mb-6 flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">My Attendance History</h3>
                                    <p className="text-sm text-gray-500 mt-1">Detailed records of your past clock-in and clock-out activity.</p>
                                </div>
                                <button className="px-4 py-2 bg-indigo-50 text-indigo-600 text-sm font-medium rounded-lg hover:bg-indigo-100 transition-colors flex items-center">
                                    <Download className="w-4 h-4 mr-2" />
                                    Export
                                </button>
                            </div>

                            {/* Attendance Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[700px] divide-y divide-gray-200">
                                    <thead>
                                        <tr className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-left bg-gray-50">
                                            <th className="px-4 py-3">Date</th>
                                            <th className="px-4 py-3">Check In</th>
                                            <th className="px-4 py-3">Check Out</th>
                                            <th className="px-4 py-3">Location (GPS)</th>
                                            <th className="px-4 py-3">Status</th>
                                            <th className="px-4 py-3">Snapshots</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {attendanceHistoryRecords.map((record, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.date}</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{record.checkIn}</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{record.checkOut}</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 flex items-center">
                                                    <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                                                    <span 
                                                        className="hover:text-indigo-600 cursor-pointer"
                                                        onClick={() => handleViewDetail('Location', record.location)}
                                                    >
                                                        {record.location}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${record.statusColor}`}>
                                                        {record.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <button 
                                                        className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200 hover:border-indigo-500 transition-colors"
                                                        onClick={() => handleViewDetail('Snapshot', record.snapshotUrl)}
                                                    >
                                                        <img 
                                                            src={record.snapshotUrl} 
                                                            alt="Snapshot" 
                                                            className="w-full h-full object-cover" 
                                                        />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Pagination Placeholder */}
                            <div className="mt-6 text-sm text-gray-500">
                                Showing 1 to 4 of 32 records
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MyAttendanceHistory;