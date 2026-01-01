import React, { useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import {
  Calendar,
  TrendingUp,
  FileText,
  FolderOpen,
  HelpCircle,
  LogOut,
  Bell,
  Moon,
  Sun,
  Menu,
  X
} from "lucide-react";
import { useUserProfile } from "../context/UserProfileContext";
import { supabase } from "../../supabase/supabase";

const Layout = () => {
  const { userProfile } = useUserProfile();
  const navigate = useNavigate();
  const location = useLocation();

  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/signup", { replace: true });
  };

  // Helper to check active route
  const isActive = (path) => location.pathname === path;

  return (
    <div className={`flex min-h-screen ${darkMode ? "dark bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 ease-in-out lg:transform-none flex flex-col border-r ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          } ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className={`p-6 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold">SmartAttend</h1>
              <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>EMPLOYEE PORTAL</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <Link
            to="/employee-dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${isActive('/employee-dashboard')
                ? "bg-indigo-50 text-indigo-600"
                : darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-50"
              }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/attendance-history"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${isActive('/attendance-history')
                ? "bg-indigo-50 text-indigo-600"
                : darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-50"
              }`}
          >
            <FolderOpen className="w-5 h-5" />
            <span>Attendance History</span>
          </Link>
          <Link
            to="/leave"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${isActive('/leave')
                ? "bg-indigo-50 text-indigo-600"
                : darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-50"
              }`}
          >
            <FileText className="w-5 h-5" />
            <span>Leaves</span>
          </Link>
          <Link
            to="/helpdesk"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${isActive('/helpdesk')
                ? "bg-indigo-50 text-indigo-600"
                : darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-50"
              }`}
          >
            <HelpCircle className="w-5 h-5" />
            <span>Helpdesk</span>
          </Link>
        </nav>

        <div className={`p-4 border-t ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
          <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
              {userProfile?.initials || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{userProfile?.full_name || "User"}</p>
              <p className={`text-xs truncate ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{userProfile?.email}</p>
            </div>
          </Link>
          <button onClick={handleSignOut} className={`flex w-full items-center space-x-2 text-sm font-medium p-2 rounded-lg transition-colors ${darkMode ? "text-gray-400 hover:text-white hover:bg-gray-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`}>
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto w-full flex flex-col">
        {/* Header */}
        <header className={`sticky top-0 z-40 border-b w-full ${darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Menu className="w-6 h-6" />
                </button>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold">
                    {/* Dynamic Title based on route? Or just generic greeting? */}
                    {/* Let's keep the greeting for Dashboard, but maybe change for others? */}
                    {/* For now, let's keep the greeting logic or make it generic */}
                    {isActive('/employee-dashboard') ? (
                      <>Good Morning, {userProfile?.full_name?.split(" ")[0]}!</>
                    ) : isActive('/attendance-history') ? (
                      "Attendance History"
                    ) : isActive('/leave') ? (
                      "Leave Management"
                    ) : isActive('/helpdesk') ? (
                      "Helpdesk Support"
                    ) : isActive('/profile') ? (
                      "My Profile"
                    ) : (
                      "SmartAttend"
                    )}
                  </h2>
                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    {new Date().toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button onClick={() => setDarkMode(!darkMode)} className={`p-2 rounded-lg transition-colors ${darkMode ? "hover:bg-gray-800 text-yellow-400" : "hover:bg-gray-100 text-gray-600"}`}>
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                <button className={`p-2 rounded-full relative ${darkMode ? "hover:bg-gray-800 text-gray-300" : "hover:bg-gray-100 text-gray-600"}`}>
                  <Bell className="w-6 h-6" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Pass darkMode prop to children if they need it */}
          <Outlet context={{ darkMode }} />
        </div>
      </main>
    </div>
  );
};

export default Layout;
