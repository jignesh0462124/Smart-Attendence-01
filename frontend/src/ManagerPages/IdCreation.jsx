import React, { useState } from 'react';
import { LayoutDashboard, Users, CheckSquare, Clock, Settings, LogOut, UserPlus, ChevronRight, ExternalLink, Calendar } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const CreateEmployeeID = ({ onNavigate }) => { // Removed interface and React.FC
    // Removed type annotation for useState
    const [expandedMenu, setExpandedMenu] = useState('employee');
    const [formData, setFormData] = useState({
        fullName: '',
        designation: '',
        department: '',
        email: '',
        phone: '',
        joiningDate: ''
    });

    const navigate = useNavigate();

    // Removed type annotation for parameter 'page' and map
    const handleNavigation = (page) => {
        if (onNavigate) {
            onNavigate(page);
            return;
        }

        const map = {
            dashboard: '/manager-dashboard',
            attendance: '/attendance-history',
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
    // Removed type annotation for parameter 'menu'
    const toggleMenu = (menu) => {
        setExpandedMenu(expandedMenu === menu ? null : menu);
    };

    // Removed explicit type annotation for event handler
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = () => {
        console.log('Onboarding employee:', formData);
        // Add your API call here
    };

    const handleRegenerateLater = () => {
        console.log('Regenerate ID later');
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
                {/* Logo */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <CheckSquare className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900">SMART Attend</h1>
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
                                    <button className="w-full text-left px-3 py-2 text-sm text-indigo-600 bg-indigo-50 rounded-lg font-medium">
                                        Employee ID Creation
                                    </button>
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
                                    <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50">
                                        Manual Attendance Marking
                                    </button>
                                
                                    <Link
                                                      to="/manager-attendance-history"
                                                      className="w-full block text-left px-3 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50">
                                                        <span>My Attendance History</span>
                                                      </Link>
                                </div>
                            )}
                        </div>

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
                            <h2 className="text-2xl font-bold text-gray-900">Create Employee ID</h2>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button className="p-2 hover:bg-gray-100 rounded-lg">
                                <ExternalLink className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Form Content */}
                <div className="p-8 flex justify-center">
                    <div className="w-full max-w-2xl">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                            {/* Form Header */}
                            <div className="flex items-start justify-between mb-8">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">New Employee Onboarding</h3>
                                    <p className="text-sm text-gray-500">Please submit to generate a new profile</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500 mb-1">GENERATED ID</p>
                                    <div className="px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-lg">
                                        <span className="text-sm font-bold text-indigo-600">EMP-2023-3491</span>
                                    </div>
                                </div>
                            </div>

                            {/* Form Fields */}
                            <div className="space-y-5">
                                {/* Full Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Robert Lee"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 text-sm placeholder-gray-400"
                                    />
                                </div>

                                {/* Designation and Department */}
                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Designation
                                        </label>
                                        <input
                                            type="text"
                                            name="designation"
                                            value={formData.designation}
                                            onChange={handleInputChange}
                                            placeholder="e.g. Senior Developer"
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 text-sm placeholder-gray-400"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Department
                                        </label>
                                        <select
                                            name="department"
                                            value={formData.department}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 text-sm bg-white"
                                        >
                                            <option value="">Select department</option>
                                            <option value="Engineering">Engineering</option>
                                            <option value="Marketing">Marketing</option>
                                            <option value="Sales">Sales</option>
                                            <option value="HR">HR</option>
                                            <option value="Finance">Finance</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Email Address and Phone Number */}
                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="email@company.com"
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 text-sm placeholder-gray-400"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="+1 (555) 000-0000"
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 text-sm placeholder-gray-400"
                                        />
                                    </div>
                                </div>

                                {/* Joining Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Joining Date
                                    </label>
                                    <input
                                        type="date"
                                        name="joiningDate"
                                        value={formData.joiningDate}
                                        onChange={handleInputChange}
                                        placeholder="dd/mm/yyyy"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 text-sm"
                                    />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-3 mt-8">
                                <button
                                    onClick={handleRegenerateLater}
                                    className="px-6 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors text-sm"
                                >
                                    Regenerate ID
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors text-sm"
                                >
                                    Onboard Employee
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CreateEmployeeID;