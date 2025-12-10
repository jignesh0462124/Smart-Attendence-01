import React, { useState } from 'react';
import { LayoutDashboard, Users, CheckSquare, Clock, Settings, LogOut, ChevronRight, ExternalLink, Calendar, ClipboardCheck, BarChart2, Briefcase, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const CreateEmployeeID = ({ onNavigate }) => {
    // State from the original component (retained)
    const [expandedMenu, setExpandedMenu] = useState('employee');
    const [formData, setFormData] = useState({
        fullName: '',
        designation: '',
        department: '',
        email: '',
        phone: '',
        joiningDate: ''
    });

    // States adopted from the provided Admin sidebar structure:
    const [isEmpMenuOpen, setIsEmpMenuOpen] = useState(true); // Active for this page
    const [isAttendanceMenuOpen, setIsAttendanceMenuOpen] = useState(false);

    const navigate = useNavigate();

    const handleNavigation = (page) => {
        if (onNavigate) {
            onNavigate(page);
            return;
        }

        const map = {
            dashboard: '/admin-dashboard', // Changed to admin-dashboard for consistency with the new sidebar
            tasks: '/tasks',
            reports: '/reportsandanalytics',
            settings: '/settings',
        };

        const path = map[page] ?? '/';
        try {
            navigate(path);
        } catch (err) {
            console.warn('Navigation failed', err, page);
        }
    };
    
    const toggleMenu = (menu) => {
        // Toggle specific menu, ensuring it doesn't conflict with local 'expandedMenu' if both are used
        if (menu === 'employee') setIsEmpMenuOpen(prev => !prev);
        if (menu === 'attendance') setIsAttendanceMenuOpen(prev => !prev);
        // Note: expandedMenu state (from old component) is managed locally only for the 'employee' group display here, 
        // but we'll prioritize the logic from the new structure's states.
    };

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
            {/* --- REPLACED SIDEBAR --- */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm fixed h-full z-10">
                {/* Logo */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <Briefcase className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900 leading-tight">HRMS Control</h1>
                            <p className="text-xs text-gray-500">Advanced Management</p>
                        </div>
                    </div>
                </div>

                {/* Main Menu */}
                <nav className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-1">
                        <Link to="/admin-dashboard" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 font-medium group">
                            <LayoutDashboard className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                            <span>Dashboard Overview</span>
                        </Link>

                        {/* Employee Management Dropdown (Active Menu Item) */}
                        <div className="space-y-1 pt-2">
                            <button
                                onClick={() => setIsEmpMenuOpen(!isEmpMenuOpen)}
                                className="w-full flex items-center justify-between space-x-3 px-3 py-2.5 rounded-lg bg-indigo-50 text-indigo-600 font-medium group"
                            >
                                <div className="flex items-center space-x-3">
                                    <Users className="w-5 h-5" />
                                    <span>Employee Management</span>
                                </div>
                                <ChevronDown className={`w-4 h-4 transition-transform ${isEmpMenuOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isEmpMenuOpen && (
                                <div className="pl-11 space-y-1">
                                    <Link to="/all-employees" className="block text-sm text-gray-500 hover:text-gray-700 py-1.5">All Employees</Link>
                                    {/* Active Sub-link */}
                                    <Link to="/id-creation" className="block text-sm text-indigo-600 font-medium py-1.5">
                                        <span>Employee ID Creation</span>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Attendance & Leave Dropdown */}
                        <div className="space-y-1 pt-2">
                            <button
                                onClick={() => setIsAttendanceMenuOpen(!isAttendanceMenuOpen)}
                                className="w-full flex items-center justify-between space-x-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 font-medium group"
                            >
                                <div className="flex items-center space-x-3">
                                    <ClipboardCheck className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                                    <span>Attendance & Leave</span>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isAttendanceMenuOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isAttendanceMenuOpen && (
                                <div className="pl-11 space-y-1">
                                    <Link to="/aprove-entries" className="block text-sm text-gray-500 hover:text-gray-700 py-1.5">Approve Entries</Link>
                                    <Link to="/leave-request" className="block text-sm text-gray-500 hover:text-gray-700 py-1.5">Leave Requests</Link>
                                </div>
                            )}
                        </div>

                        <Link to="/reportsandanalytics" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 font-medium group mt-2">
                            <BarChart2 className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                            <span>Reports & Analytics</span>
                        </Link>

                        <Link to="/settings" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 font-medium group mt-2">
                            <Settings className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                            <span>System Settings</span>
                        </Link>
                    </div>
                </nav>

                {/* User Profile */}
                <div className="p-4 border-t border-gray-200">
                    <Link to="/admin-profile">
                        <div className="flex items-center space-x-3 mb-3">
                            <img
                                src="https://i.pravatar.cc/150?u=admin_john" // Placeholder image
                                alt="Admin Avatar"
                                className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                            />
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-900">John Admin</p>
                                <p className="text-xs text-gray-500">Administrator</p>
                            </div>
                        </div>
                    </Link>
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 text-sm font-medium w-full px-2 py-1 rounded hover:bg-gray-100 transition-colors">
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 overflow-auto">
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