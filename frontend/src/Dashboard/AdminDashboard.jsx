// src/Admin/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  BarChart2,
  Settings,
  LogOut,
  Bell,
  UserCircle,
  Search,
  Filter,
  ChevronDown,
  CheckCircle,
  AlertCircle,
  Clock,
  Briefcase,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../supabase/supabase.js";
import { signOutAdmin } from "../AdminPages/Admin.js";

const adminStats = [
  {
    title: "Total Employees",
    value: "142",
    icon: <Users className="w-6 h-6 text-indigo-600" />,
    bgColor: "bg-indigo-50",
    textColor: "text-indigo-600",
  },
  {
    title: "Present Today",
    value: "128",
    icon: <CheckCircle className="w-6 h-6 text-green-600" />,
    bgColor: "bg-green-50",
    textColor: "text-green-600",
  },
  {
    title: "On Leave",
    value: "8",
    icon: <Clock className="w-6 h-6 text-orange-600" />,
    bgColor: "bg-orange-50",
    textColor: "text-orange-600",
  },
  {
    title: "Absent/Late",
    value: "6",
    icon: <AlertCircle className="w-6 h-6 text-red-600" />,
    bgColor: "bg-red-50",
    textColor: "text-red-600",
  },
];

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(null);
  const [attendanceRows, setAttendanceRows] = useState([]);
  const [attendanceLoading, setAttendanceLoading] = useState(true);

  const [isEmpMenuOpen, setIsEmpMenuOpen] = useState(false);
  const [isAttendanceMenuOpen, setIsAttendanceMenuOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Load adminInfo
  useEffect(() => {
    const saved = localStorage.getItem("adminInfo");
    if (saved) setAdmin(JSON.parse(saved));
  }, []);

  // Fetch attendance safely
  useEffect(() => {
    if (!admin?.admin_uid) return;

    const loadAttendance = async () => {
      try {
        setAttendanceLoading(true);

        const { data, error } = await supabase
          .from("attendance")
          .select(
            "id, full_name, email, marked_at, type, latitude, longitude, photo_url"
          )
          .eq("admin_uid", admin.admin_uid)
          .order("marked_at", { ascending: false })
          .limit(50);

        if (!error) setAttendanceRows(data || []);
      } catch (e) {
        console.error("Attendance fetch error", e);
      } finally {
        setAttendanceLoading(false);
      }
    };

    loadAttendance();
  }, [admin]);

  const handleLogout = async () => {
    try {
      // Works even if auth session does not exist
      await signOutAdmin();
    } catch (e) {
      console.warn("Sign-out (non-auth) fallback:", e);
    }

    localStorage.removeItem("adminInfo");
    navigate("/admin-login", { replace: true });
  };

  const getStatusBadge = (type) => {
    if (type === "clock_in")
      return { label: "Clock In", classes: "bg-green-100 text-green-700" };
    if (type === "clock_out")
      return { label: "Clock Out", classes: "bg-blue-100 text-blue-700" };
    return { label: "Unknown", classes: "bg-gray-100 text-gray-700" };
  };

  const filteredRows = attendanceRows.filter((row) => {
    const q = searchTerm.toLowerCase();
    return (
      row.full_name?.toLowerCase().includes(q) ||
      row.email?.toLowerCase().includes(q)
    );
  });

  if (!admin) return null;

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm z-10 fixed h-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">
                HRMS Control
              </h1>
              <p className="text-xs text-gray-500">Advanced Management</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1 mb-6">
            <Link
              to="/admin-dashboard"
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg bg-indigo-50 text-indigo-600 font-medium"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard Overview</span>
            </Link>

            {/* Employee Management */}
            <div className="space-y-1 pt-2">
              <button
                onClick={() => setIsEmpMenuOpen(!isEmpMenuOpen)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 font-medium group"
              >
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                  <span>Employee Management</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 ${
                    isEmpMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isEmpMenuOpen && (
                <div className="pl-11 space-y-1">
                  <Link
                    to="/all-employees"
                    className="block text-sm text-gray-500 hover:text-gray-700 py-1.5"
                  >
                    All Employees
                  </Link>
                  <Link
                    to="/id-creation"
                    className="block text-sm text-gray-500 hover:text-gray-700 py-1.5"
                  >
                    Employee ID Creation
                  </Link>
                </div>
              )}
            </div>

            {/* Attendance */}
            <div className="space-y-1 pt-2">
              <button
                onClick={() =>
                  setIsAttendanceMenuOpen(!isAttendanceMenuOpen)
                }
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 font-medium group"
              >
                <div className="flex items-center space-x-3">
                  <ClipboardCheck className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                  <span>Attendance & Leave</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 ${
                    isAttendanceMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isAttendanceMenuOpen && (
                <div className="pl-11 space-y-1">
                  <Link
                    to="/aprove-entries"
                    className="block text-sm text-gray-500 hover:text-gray-700 py-1.5"
                  >
                    Approve Entries
                  </Link>
                  <Link
                    to="/leave-request"
                    className="block text-sm text-gray-500 hover:text-gray-700 py-1.5"
                  >
                    Leave Requests
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/reportsandanalytics"
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 font-medium mt-2"
            >
              <BarChart2 className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
              <span>Reports & Analytics</span>
            </Link>

            <Link
              to="/settings"
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 font-medium mt-2"
            >
              <Settings className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
              <span>System Settings</span>
            </Link>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <Link to="/admin-profile">
            <div className="flex items-center space-x-3 mb-3">
              <img
                src="https://i.pravatar.cc/150?u=admin_avatar"
                alt="Admin Avatar"
                className="w-10 h-10 rounded-full border-2 border-white"
              />
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {admin?.name}
                </p>
                <p className="text-xs text-gray-500">{admin?.email}</p>
              </div>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 text-sm font-medium w-full px-2 py-1 rounded hover:bg-gray-100"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-64 bg-gray-50">
        <header className="bg-white border-b px-8 py-4 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Detailed Management View
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Admin ID: {admin.admin_uid}
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <Link to="/notification">
                <button className="relative p-2 hover:bg-gray-100 rounded-full">
                  <Bell className="w-6 h-6 text-gray-600" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
              </Link>

              <Link
                to="/admin-profile"
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 font-medium p-1 rounded-lg"
              >
                <UserCircle className="w-6 h-6 text-gray-400" />
                <span>{admin?.name}</span>
              </Link>
            </div>
          </div>
        </header>

        <div className="px-8 py-8 max-w-7xl mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {adminStats.map((stat, index) => (
              <div
                key={index}
                className={`rounded-xl p-6 border shadow-sm flex items-center justify-between ${stat.bgColor}`}
              >
                <div>
                  <h4 className={`text-sm font-medium mb-1 ${stat.textColor}`}>
                    {stat.title}
                  </h4>
                  <span className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </span>
                </div>

                <div className="p-3 rounded-full bg-white bg-opacity-60">
                  {stat.icon}
                </div>
              </div>
            ))}
          </div>

          {/* Attendance Logs */}
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex flex-col md:flex-row justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">
                Latest Attendance Logs
              </h3>

              <div className="flex items-center space-x-3 mt-3 md:mt-0">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search employee..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <button className="px-4 py-2 border rounded-lg text-gray-700 text-sm">
                  <Filter className="w-4 h-4 inline mr-2" />
                  Filter
                </button>
              </div>
            </div>

            {attendanceLoading ? (
              <div className="py-8 flex justify-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                  <p className="text-sm text-gray-500">
                    Loading attendance records...
                  </p>
                </div>
              </div>
            ) : filteredRows.length === 0 ? (
              <div className="py-8 text-center text-gray-500 text-sm">
                No attendance records found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="text-xs uppercase text-gray-500 border-b">
                      <th className="px-4 py-3">Employee Name</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Marked At</th>
                      <th className="px-4 py-3 text-center">Type</th>
                      <th className="px-4 py-3 text-right">Photo</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredRows.map((row) => {
                      const badge = getStatusBadge(row.type);

                      const initials = row.full_name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase();

                      return (
                        <tr key={row.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-semibold text-indigo-700 mr-3">
                                {initials}
                              </div>
                              <span className="text-sm font-medium text-gray-900">
                                {row.full_name}
                              </span>
                            </div>
                          </td>

                          <td className="px-4 py-4 text-sm text-gray-500">
                            {row.email}
                          </td>

                          <td className="px-4 py-4 text-sm text-gray-500">
                            {new Date(row.marked_at).toLocaleString()}
                          </td>

                          <td className="px-4 py-4 text-center">
                            <span
                              className={`px-2.5 py-1 text-xs rounded-full font-medium ${badge.classes}`}
                            >
                              {badge.label}
                            </span>
                          </td>

                          <td className="px-4 py-4 text-right">
                            {row.photo_url ? (
                              <a
                                href={row.photo_url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-indigo-600 underline text-xs"
                              >
                                View Photo
                              </a>
                            ) : (
                              <span className="text-xs text-gray-400">
                                No photo
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex justify-between mt-6 border-t pt-4">
              <p className="text-sm text-gray-500">
                Showing latest {filteredRows.length} records
              </p>
              <div className="flex space-x-2">
                <button className="px-3 py-1 border rounded-md text-sm" disabled>
                  Previous
                </button>
                <button className="px-3 py-1 border rounded-md text-sm" disabled>
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
