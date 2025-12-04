import React, { useState } from 'react';
import { LayoutDashboard, Users, CheckSquare, Clock, Bell, Settings, LogOut, ChevronRight, Plus, Calendar } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";

// Removed TypeScript interfaces
const AllEmployees = ({ onNavigate }) => { // Removed interface and React.FC
    // Removed type annotation for useState
    const [expandedMenu, setExpandedMenu] = useState('employee');
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

    // Employee data (Removed type annotation)
    const employees = [
        {
            id: 1,
            name: 'Sarah Johnson',
            role: 'Software Engineer',
            department: 'Engineering',
            employeeId: 'EMP-001',
            status: 'Active',
            statusColor: 'text-green-600',
            avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&size=96&background=E0E7FF&color=4F46E5',
            avatarColor: 'bg-indigo-100'
        },
        {
            id: 2,
            name: 'Michael Chen',
            role: 'Marketing Lead',
            department: 'Marketing',
            employeeId: 'EMP-002',
            status: 'Absent',
            statusColor: 'text-red-600',
            avatar: 'https://ui-avatars.com/api/?name=Michael+Chen&size=96&background=DBEAFE&color=2563EB',
            avatarColor: 'bg-blue-100'
        },
        {
            id: 3,
            name: 'Jessica Lee',
            role: 'HR Executive',
            department: 'Human Resources',
            employeeId: 'EMP-003',
            status: 'On Leave',
            statusColor: 'text-yellow-600',
            avatar: 'https://ui-avatars.com/api/?name=Jessica+Lee&size=96&background=F3E8FF&color=9333EA',
            avatarColor: 'bg-purple-100'
        },
        {
            id: 4,
            name: 'Emily Davis',
            role: 'Sales Manager',
            department: 'Sales',
            employeeId: 'EMP-004',
            status: 'Active',
            statusColor: 'text-blue-600',
            avatar: 'https://ui-avatars.com/api/?name=Emily+Davis&size=96&background=FEE2E2&color=DC2626',
            avatarColor: 'bg-red-100'
        }
    ];

    // Removed type annotation for parameter 'employeeId'
    const handleViewProfile = (employeeId) => {
        console.log('View profile:', employeeId);
        // Navigate to employee profile
    };

    const handleAddEmployee = () => {
        if (onNavigate) {
            onNavigate('create-employee');
        }
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
                                    <button className="w-full text-left px-3 py-2 text-sm text-indigo-600 bg-indigo-50 rounded-lg font-medium">
                                        All employees
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
                                <ChevronRight className={`w-4 h-4 transition-transform ${expandedMenu === 'attendance' ? 'rotate-90' : ''}`} />
                            </button>

                            {expandedMenu === 'attendance' && (
                                <div className="ml-8 mt-1 space-y-1">
                                    <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50">
                                        Manual Attendance Marking
                                    </button>
                                    <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50">
                                        View Logs
                                    </button>
                                    <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50">
                                        My Attendance History
                                    </button>
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
                            <h2 className="text-2xl font-bold text-gray-900">All Employees</h2>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Link to="/notification">
                                <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                                    <Bell className="w-5 h-5 text-gray-600" />
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                                </button>
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Employee Cards Grid */}
                <div className="p-8">
                    <div className="flex flex-wrap gap-6">
                        {/* Employee Cards */}
                        {employees.map((employee) => (
                            <div key={employee.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow flex-1 min-w-80">
                                {/* Avatar */}
                                <div className="flex justify-center mb-4">
                                    <div className="relative">
                                        <img
                                            src={employee.avatar}
                                            alt={employee.name}
                                            className="w-20 h-20 rounded-full"
                                        />
                                        <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                                    </div>
                                </div>

                                {/* Employee Info */}
                                <div className="text-center mb-4">
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">{employee.name}</h3>
                                    <p className="text-sm text-gray-600 mb-1">{employee.role}</p>
                                    <p className="text-xs text-gray-500">{employee.department}</p>
                                </div>

                                {/* Employee ID and Status */}
                                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">ID</p>
                                        <p className="text-sm font-semibold text-gray-900">{employee.employeeId}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500 mb-1">Status</p>
                                        <p className={`text-sm font-semibold ${employee.statusColor}`}>{employee.status}</p>
                                    </div>
                                </div>

                                {/* View Profile Button */}
                                <button
                                    onClick={() => handleViewProfile(employee.id)}
                                    className="w-full py-2.5 border border-indigo-600 text-indigo-600 rounded-lg font-medium text-sm hover:bg-indigo-50 transition-colors"
                                >
                                    View Profile
                                </button>
                            </div>
                        ))}

                        {/* Add New Employee Card */}
                        <button
                            onClick={handleAddEmployee}
                            className="bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-300 p-6 hover:border-indigo-400 hover:bg-indigo-50 transition-all flex flex-col items-center justify-center flex-1 min-w-80 min-h-80"
                        >
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <Plus className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Add New Employee</h3>
                            <p className="text-sm text-gray-500">Click here to add a new team member</p>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AllEmployees;