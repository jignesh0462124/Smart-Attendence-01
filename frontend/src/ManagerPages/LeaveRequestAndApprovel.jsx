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
    Check,
    X,
} from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";

// --- MOCK DATA ---
const pendingRequests = [
    {
        id: 1,
        name: 'Sarah Johnson',
        avatar: 'https://i.pravatar.cc/150?u=sarahj',
        leaveType: 'Sick Leave',
        reason: 'Severe fever and flu symptoms.',
        dateRange: '2023-9-16 to 2023-9-18',
    },
    {
        id: 2,
        name: 'Jessica Lee',
        avatar: 'https://i.pravatar.cc/150?u=jessical',
        leaveType: 'Casual Leave',
        reason: 'Personal family matter.',
        dateRange: '2023-9-20 to 2023-9-20',
    },
];

const requestHistory = [
    {
        id: 3,
        name: 'Emily Davis',
        avatar: 'https://i.pravatar.cc/150?u=emilyd',
        leaveType: 'Vacation',
        duration: '7 Days',
        dateRange: '2023-12-20 to 2023-12-28',
        status: 'Approved',
        statusColor: 'text-green-600 bg-green-100',
    },
];

// --- MODAL Component Placeholder ---
// This modal structure is based on the image "WhatsApp Image 2025-12-05 at 14.32.34_1c3ed7c2.jpg"
const RequestLeaveModal = ({ isVisible, onClose }) => {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Request Leave (To Admin)</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 p-1">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                            <option>Casual Leave</option>
                            <option>Sick Leave</option>
                            <option>Annual Leave</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                            <input type="text" placeholder="dd/mm/yyyy" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                            <input type="text" placeholder="dd/mm/yyyy" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                        <textarea placeholder="Please explain why you need leave..." rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"></textarea>
                    </div>

                    <div className="flex justify-end space-x-3 pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 font-medium rounded-lg hover:bg-gray-100">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700">
                            Submit Request
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---
const LeaveRequests = () => {
    const [expandedMenu, setExpandedMenu] = useState('attendance');
    const [isModalVisible, setIsModalVisible] = useState(false);
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

    const handleApproval = (id, action) => {
        console.log(`${action} request ID: ${id}`);
        // Logic to update state/call API
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
                            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg bg-indigo-50 text-indigo-600 font-medium text-left text-sm"
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
                            <h2 className="text-2xl font-bold text-gray-900">Leave Requests</h2>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => setIsModalVisible(true)}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center"
                            >
                                Apply for Leave
                            </button>
                        </div>
                    </div>
                </header>

                {/* Content Area (Constrained to 960px max width) */}
                <div className="p-8 max-w-7xl mx-auto">

                    {/* 1. Employee Pending Requests */}
                    <div className="mb-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Employee Pending Requests</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {pendingRequests.map((request) => (
                                <div key={request.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                    {/* Request Header */}
                                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                                        <div className="flex items-center space-x-3">
                                            <img className="w-10 h-10 rounded-full" src={request.avatar} alt={request.name} />
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">{request.name}</p>
                                                <p className="text-xs text-gray-500">{request.leaveType}</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-medium text-gray-500">{request.dateRange}</span>
                                    </div>

                                    {/* Reason */}
                                    <p className="text-sm text-gray-700 mb-4">
                                        <span className="font-medium text-gray-500 mr-2">Reason:</span>
                                        {request.reason}
                                    </p>

                                    {/* Actions */}
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={() => handleApproval(request.id, 'Approve')}
                                            className="flex-1 py-2 bg-green-100 text-green-700 font-medium rounded-lg hover:bg-green-200 transition-colors flex items-center justify-center space-x-1"
                                        >
                                            <Check className="w-4 h-4" />
                                            <span>Approve</span>
                                        </button>
                                        <button
                                            onClick={() => handleApproval(request.id, 'Reject')}
                                            className="flex-1 py-2 bg-red-100 text-red-700 font-medium rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center space-x-1"
                                        >
                                            <X className="w-4 h-4" />
                                            <span>Reject</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 2. Request History */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Request History</h3>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[700px] divide-y divide-gray-200">
                                <thead>
                                    <tr className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-left bg-gray-50">
                                        <th className="px-4 py-3">Employee</th>
                                        <th className="px-4 py-3">Leave Type</th>
                                        <th className="px-4 py-3">Duration</th>
                                        <th className="px-4 py-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {requestHistory.map((history) => (
                                        <tr key={history.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-4 whitespace-nowrap flex items-center space-x-3">
                                                <img className="w-8 h-8 rounded-full" src={history.avatar} alt={history.name} />
                                                <span className="text-sm font-medium text-gray-900">{history.name}</span>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{history.leaveType}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{history.dateRange}</td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${history.statusColor}`}>
                                                    {history.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>

            {/* Modal for new Leave Request */}
            <RequestLeaveModal
                isVisible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
            />
        </div>
    );
};

export default LeaveRequests;