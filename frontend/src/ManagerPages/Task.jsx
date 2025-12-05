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
    Calendar,
    Send,
    UserCircle,
    UserPlus, // Icon for Employee ID Creation
    ClipboardCheck, // Icon for Attendance & Leave
    BarChart2, // Icon for Reports & Analytics
} from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";

const TaskAssignment = () => {
    // State for sidebar dropdowns
    const [expandedMenu, setExpandedMenu] = useState('tasks'); // Active on Tasks
    const [formData, setFormData] = useState({
        employee: '',
        taskName: '',
        taskType: 'Development',
        taskDescription: '',
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
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Assigning Task:', formData);
        // Add your API call here
    };

    // Mock Data
    const mockEmployees = [
        { id: 1, name: 'Sarah Johnson' },
        { id: 2, name: 'Michael Chen' },
        { id: 3, name: 'Jessica Lee' },
    ];

    const mockTaskTypes = [
        'Development',
        'Analysis',
        'Testing',
        'Documentation',
        'Support',
    ];

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* --- SIDEBAR --- */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
                {/* Logo */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <CheckSquare className="w-6 h-6 text-white" />
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
                            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-indigo-600 bg-indigo-50 hover:bg-gray-50 font-medium text-left text-sm"
                        >
                            <CheckSquare className="w-5 h-5" />
                            <span>Tasks</span>
                        </button>
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
                            <h2 className="text-2xl font-bold text-gray-900">Task Assignment</h2>
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
                    <div className="w-full max-w-2xl"> {/* This max-width container keeps the form centralized and readable */}
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8">

                            {/* Card Header */}
                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-gray-900">Assign New Task</h3>
                                <p className="text-sm text-gray-500 mt-1">Delegate responsibilities to your team members.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">

                                {/* Select Employee */}
                                <div>
                                    <label htmlFor="employee" className="block text-sm font-medium text-gray-700 mb-2">
                                        Select Employee
                                    </label>
                                    <select
                                        id="employee"
                                        name="employee"
                                        value={formData.employee}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                                    >
                                        <option value="" disabled>-- Select an Employee --</option>
                                        {mockEmployees.map((emp) => (
                                            <option key={emp.id} value={emp.id}>{emp.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Task Name and Task Type */}
                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <label htmlFor="taskName" className="block text-sm font-medium text-gray-700 mb-2">
                                            Task Name
                                        </label>
                                        <input
                                            type="text"
                                            id="taskName"
                                            name="taskName"
                                            value={formData.taskName}
                                            onChange={handleInputChange}
                                            placeholder="e.g. Q3 Report Analysis"
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="taskType" className="block text-sm font-medium text-gray-700 mb-2">
                                            Task Type
                                        </label>
                                        <select
                                            id="taskType"
                                            name="taskType"
                                            value={formData.taskType}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                                        >
                                            {mockTaskTypes.map((type) => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Task Description */}
                                <div>
                                    <label htmlFor="taskDescription" className="block text-sm font-medium text-gray-700 mb-2">
                                        Task Description
                                    </label>
                                    <textarea
                                        id="taskDescription"
                                        name="taskDescription"
                                        value={formData.taskDescription}
                                        onChange={handleInputChange}
                                        placeholder="Provide detailed instructions for the task..."
                                        rows={4}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 resize-none placeholder-gray-400"
                                    />
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-end pt-4">
                                    <button
                                        type="submit"
                                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors flex items-center space-x-2 shadow-md"
                                    >
                                        <Send className="w-5 h-5" />
                                        <span>Notify Employee</span>
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

export default TaskAssignment;