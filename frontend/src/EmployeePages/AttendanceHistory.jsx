// src/EmployeePages/AttendanceHistory.jsx
import React, { useEffect, useState, useMemo } from "react";
import {
  Filter,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  History
} from "lucide-react";
import { useOutletContext } from "react-router-dom";
import { useUserProfile } from "../context/UserProfileContext";
import { getAttendanceHistory } from "../services/attendanceService";

export default function AttendanceHistory() {
  const { userProfile } = useUserProfile();
  const { darkMode } = useOutletContext();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (userProfile) {
      fetchHistory();
    }
  }, [userProfile, selectedMonth, selectedYear]);

  async function fetchHistory() {
    try {
      setLoading(true);
      setError("");
      const data = await getAttendanceHistory(userProfile.id, selectedMonth, selectedYear);
      setRecords(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load attendance history.");
    } finally {
      setLoading(false);
    }
  }

  const stats = useMemo(() => {
    const total = records.length;
    const present = records.filter(r => r.status === 'Present').length;
    const late = records.filter(r => r.status === 'Late').length;
    const leaves = records.filter(r => r.status === 'Leave').length;

    return { present, late, leaves, total };
  }, [records]);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Present': return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${darkMode ? "bg-green-900/30 text-green-400 border border-green-800" : "bg-green-100 text-green-700 border border-green-200"}`}>
          <CheckCircle className="w-3 h-3" /> Present
        </span>
      );
      case 'Late': return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${darkMode ? "bg-yellow-900/30 text-yellow-400 border border-yellow-800" : "bg-yellow-100 text-yellow-800 border border-yellow-200"}`}>
          <AlertTriangle className="w-3 h-3" /> Late
        </span>
      );
      case 'Leave': return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${darkMode ? "bg-blue-900/30 text-blue-400 border border-blue-800" : "bg-blue-100 text-blue-700 border border-blue-200"}`}>
          <Calendar className="w-3 h-3" /> On Leave
        </span>
      );
      case 'Absent': return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${darkMode ? "bg-red-900/30 text-red-400 border border-red-800" : "bg-red-100 text-red-700 border border-red-200"}`}>
          <XCircle className="w-3 h-3" /> Absent
        </span>
      );
      default: return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${darkMode ? "bg-gray-800 text-gray-300 border border-gray-700" : "bg-gray-100 text-gray-700 border border-gray-200"}`}>
          {status}
        </span>
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in-up">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className={`text-3xl font-extrabold tracking-tight flex items-center gap-3 ${darkMode ? "text-white" : "text-gray-900"}`}>
            <History className={`w-8 h-8 ${darkMode ? "text-indigo-400" : "text-indigo-600"}`} />
            Attendance History
          </h1>
          <p className={`mt-2 text-lg ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Review your detailed attendance logs and statistics.
          </p>
        </div>

        {/* Filter Controls */}
        <div className={`flex items-center gap-4 px-5 py-3 rounded-2xl shadow-sm border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
          <div className="flex items-center gap-2">
            <Filter className={`w-5 h-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
            <span className={`text-sm font-semibold ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Filter:</span>
          </div>

          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-2"></div>

          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className={`bg-transparent border-none focus:ring-0 text-sm font-medium cursor-pointer py-0 outline-none ${darkMode ? "text-gray-200" : "text-gray-700 hover:text-indigo-600"}`}
          >
            {months.map((m, i) => (
              <option key={i} value={i + 1} className={darkMode ? "bg-gray-800" : ""}>{m}</option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className={`bg-transparent border-none focus:ring-0 text-sm font-medium cursor-pointer py-0 outline-none ${darkMode ? "text-gray-200" : "text-gray-700 hover:text-indigo-600"}`}
          >
            {[2023, 2024, 2025, 2026].map(y => (
              <option key={y} value={y} className={darkMode ? "bg-gray-800" : ""}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: "Total Logs", value: stats.total, icon: History, color: "text-indigo-600", bg: "bg-indigo-50", darkColor: "text-indigo-400", darkBg: "bg-indigo-900/20" },
          { label: "Present Days", value: stats.present, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50", darkColor: "text-green-400", darkBg: "bg-green-900/20" },
          { label: "Late Arrivals", value: stats.late, icon: AlertTriangle, color: "text-yellow-600", bg: "bg-yellow-50", darkColor: "text-yellow-400", darkBg: "bg-yellow-900/20" },
          { label: "On Leave", value: stats.leaves, icon: Calendar, color: "text-blue-600", bg: "bg-blue-50", darkColor: "text-blue-400", darkBg: "bg-blue-900/20" },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className={`relative p-6 rounded-2xl shadow-sm border transition-all hover:shadow-md ${darkMode ? `border-gray-700 ${s.darkBg}` : `border-gray-100 ${s.bg}`}`}>
              <div className="flex items-center justify-between mb-4">
                <p className={`text-sm font-bold opacity-80 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{s.label}</p>
                <Icon className={`w-5 h-5 ${darkMode ? s.darkColor : s.color}`} />
              </div>
              <p className={`text-3xl font-extrabold ${darkMode ? "text-white" : "text-gray-900"}`}>{s.value}</p>
            </div>
          );
        })}
      </div>

      {/* Table Section */}
      <div className={`rounded-2xl shadow-lg border overflow-hidden ${darkMode ? "bg-gray-800 border-gray-700 shadow-gray-900/50" : "bg-white border-gray-100 shadow-slate-200/50"}`}>
        <div className={`px-6 py-4 border-b ${darkMode ? "border-gray-700 bg-gray-800/50" : "border-gray-50 bg-gray-50/50"}`}>
          <h3 className={`font-bold text-lg flex items-center gap-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
            <Calendar className="w-5 h-5 text-indigo-500" />
            Daily Logs
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className={`text-xs uppercase font-bold tracking-wider ${darkMode ? "bg-gray-900/50 text-gray-400" : "bg-gray-50 text-gray-500"}`}>
              <tr>
                <th className="px-6 py-5">Date</th>
                <th className="px-6 py-5">Day</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5">Check In</th>
                <th className="px-6 py-5">Check Out</th>
                <th className="px-6 py-5">Hours</th>
              </tr>
            </thead>
            <tbody className={`divide-y text-sm ${darkMode ? "divide-gray-700" : "divide-gray-100"}`}>
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                      <p className={`font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Fetching records...</p>
                    </div>
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-3 opacity-60">
                      <Calendar className={`w-12 h-12 ${darkMode ? "text-gray-600" : "text-gray-300"}`} />
                      <p className={`text-lg font-medium ${darkMode ? "text-gray-500" : "text-gray-400"}`}>No records found for {months[selectedMonth - 1]}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                records.map((record) => {
                  const dateObj = new Date(record.date);
                  const checkIn = record.check_in ? new Date(record.check_in) : null;
                  const checkOut = record.check_out ? new Date(record.check_out) : null;

                  let totalHours = "-";
                  if (checkIn && checkOut) {
                    const diff = (checkOut - checkIn) / (1000 * 60 * 60);
                    const h = Math.floor(diff);
                    const m = Math.floor((diff - h) * 60);
                    totalHours = `${h}h ${m}m`;
                  }

                  return (
                    <tr key={record.id} className={`transition-colors group ${darkMode ? "hover:bg-gray-700/50" : "hover:bg-indigo-50/30"}`}>
                      <td className={`px-6 py-4 font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                        {dateObj.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className={`px-6 py-4 font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                        {dateObj.toLocaleDateString('en-US', { weekday: 'long' })}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(record.status)}
                      </td>
                      <td className={`px-6 py-4 font-mono font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                        {checkIn ? (
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 opacity-50" />
                            {checkIn.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        ) : <span className="text-gray-400">--:--</span>}
                      </td>
                      <td className={`px-6 py-4 font-mono font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                        {checkOut ? (
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 opacity-50" />
                            {checkOut.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        ) : <span className="text-gray-400">--:--</span>}
                      </td>
                      <td className={`px-6 py-4 font-semibold ${darkMode ? "text-indigo-300" : "text-indigo-600"}`}>
                        {totalHours}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {/* Footer */}
        <div className={`px-6 py-4 border-t text-xs font-medium flex justify-between uppercase tracking-wide ${darkMode ? "border-gray-700 bg-gray-800 text-gray-500" : "border-gray-100 bg-gray-50 text-gray-400"}`}>
          <span>Showing {records.length} records</span>
          <span>Synced Just Now</span>
        </div>
      </div>
    </div>
  );
}

