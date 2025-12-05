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
    Send,
} from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";

const SendNotification = () => {
    // State for sidebar dropdowns
    const [expandedMenu, setExpandedMenu] = useState('notifications'); // Active on Notifications
    const [formData, setFormData] = useState({
        recipient: 'All Employees',
        title: '',
        message: '',
        priority: 'Normal',
    });

    const navigate = useNavigate();

    const handleNavigation = (page) => {
        const map = {
            dashboard: '/manager-dashboard',
            tasks: '/tasks',
            notifications: '/notifications',
            settings: '/profile',
        };

        const path = map[page] ?? '/';
        try {
            navigate(path);
        } catch (err) {
            console.warn('Navigation failed', err, page);
        }
    };

    const toggleMenu = (menu) => {
        setExpandedMenu(expandedMenu === menu ? null : menu);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'radio' ? value : value // Assuming only radio buttons are used for priority
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Sending Notification:', formData);
        // Add your API call here
    };

    // Mock Data
    const mockRecipients = [
        { value: 'All Employees', label: 'All Employees' },
        { value: 'Engineering', label: 'Engineering Team' },
        { value: 'Sales', label: 'Sales Department' },
        { value: 'Individual', label: 'Specific Employee (ID/Name)' },
    ];


    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* --- SIDEBAR --- */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
                {/* Logo */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <Bell className="w-6 h-6 text-white" />
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
                            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg bg-indigo-50 text-indigo-600 font-medium text-left text-sm"
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
                                    <Link to="/manual-attendance" className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50">
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
                            <h2 className="text-2xl font-bold text-gray-900">Send Notification</h2>
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
                    <div className="w-full max-w-xl"> {/* Constrained max-width for the form */}
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8">

                            {/* Card Header */}
                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-gray-900">Send Notification</h3>
                                <p className="text-sm text-gray-500 mt-1">Broadcast messages to your team or specific employees.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">

                                {/* Recipient */}
                                <div>
                                    <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 mb-2">
                                        Recipient
                                    </label>
                                    <select
                                        id="recipient"
                                        name="recipient"
                                        value={formData.recipient}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                                    >
                                        {mockRecipients.map((rec) => (
                                            <option key={rec.value} value={rec.value}>{rec.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Title */}
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        placeholder="Brief subject of the message"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400"
                                    />
                                </div>

                                {/* Message */}
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        placeholder="Type your message here..."
                                        rows={5}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 resize-none placeholder-gray-400"
                                    />
                                </div>

                                {/* Priority */}
                                <div className="pt-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Priority
                                    </label>
                                    <div className="flex space-x-6">
                                        <label className="flex items-center space-x-2 text-sm text-gray-700">
                                            <input
                                                type="radio"
                                                name="priority"
                                                value="Normal"
                                                checked={formData.priority === 'Normal'}
                                                onChange={handleInputChange}
                                                className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                            />
                                            <span>Normal</span>
                                        </label>
                                        <label className="flex items-center space-x-2 text-sm text-gray-700">
                                            <input
                                                type="radio"
                                                name="priority"
                                                value="Urgent"
                                                checked={formData.priority === 'Urgent'}
                                                onChange={handleInputChange}
                                                className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                            />
                                            <span>Urgent</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-end pt-4">
                                    <button
                                        type="submit"
                                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors flex items-center space-x-2 shadow-lg"
                                    >
                                        <Send className="w-5 h-5" />
                                        <span>Send Notification</span>
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SendNotification;