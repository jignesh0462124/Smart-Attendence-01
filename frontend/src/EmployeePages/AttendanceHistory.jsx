// src/EmployeePages/AttendanceHistory.jsx
import React, { useEffect, useState, useMemo } from "react";
import {
  Filter,
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

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Present': return 'bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
      case 'Late': return 'bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800';
      case 'Leave': return 'bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800';
      case 'Absent': return 'bg-red-100 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
      default: return 'bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Attendance History</h1>
          <p className={darkMode ? "text-gray-400" : "text-gray-500"}>View and track your monthly attendance.</p>
        </div>

        <div className={`flex items-center gap-3 p-2 rounded-lg border shadow-sm ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
          <Filter className={`w-5 h-5 ml-2 ${darkMode ? "text-gray-400" : "text-gray-400"}`} />
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className={`bg-transparent border-none focus:ring-0 text-sm font-medium cursor-pointer ${darkMode ? "text-gray-200" : "text-gray-700"}`}
          >
            {months.map((m, i) => (
              <option key={i} value={i + 1} className={darkMode ? "bg-gray-800" : ""}>{m}</option>
            ))}
          </select>
          <div className={`h-4 w-px ${darkMode ? "bg-gray-600" : "bg-gray-300"}`}></div>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className={`bg-transparent border-none focus:ring-0 text-sm font-medium cursor-pointer ${darkMode ? "text-gray-200" : "text-gray-700"}`}
          >
            {[2023, 2024, 2025, 2026].map(y => (
              <option key={y} value={y} className={darkMode ? "bg-gray-800" : ""}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Present Days", value: stats.present, color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/20" },
          { label: "Late Arrivals", value: stats.late, color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-50 dark:bg-yellow-900/20" },
          { label: "Leaves Taken", value: stats.leaves, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20" },
          { label: "Total Logs", value: stats.total, color: "text-gray-600 dark:text-gray-400", bg: "bg-gray-50 dark:bg-gray-800" },
        ].map((s, i) => (
          <div key={i} className={`p-4 rounded-xl border ${darkMode ? "border-gray-700" : "border-gray-100"} ${s.bg}`}>
            <p className={`text-sm font-medium opacity-80 ${s.color}`}>{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className={`rounded-xl shadow-sm border overflow-hidden ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className={`text-xs uppercase font-semibold ${darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-50 text-gray-500"}`}>
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Day</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Clock In</th>
                <th className="px-6 py-4">Clock Out</th>
                <th className="px-6 py-4">Total Hrs</th>
              </tr>
            </thead>
            <tbody className={`divide-y text-sm ${darkMode ? "divide-gray-700" : "divide-gray-100"}`}>
              {loading ? (
                <tr><td colSpan="6" className={`px-6 py-12 text-center ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Loading history...</td></tr>
              ) : records.length === 0 ? (
                <tr><td colSpan="6" className={`px-6 py-12 text-center ${darkMode ? "text-gray-400" : "text-gray-500"}`}>No records found for {months[selectedMonth - 1]} {selectedYear}.</td></tr>
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
                    <tr key={record.id} className={`transition-colors ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"}`}>
                      <td className={`px-6 py-4 font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                        {dateObj.toLocaleDateString()}
                      </td>
                      <td className={`px-6 py-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        {dateObj.toLocaleDateString('en-US', { weekday: 'long' })}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusStyle(record.status)}`}>
                          {record.status}
                        </span>
                      </td>
                      <td className={`px-6 py-4 font-mono ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                        {checkIn ? checkIn.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                      </td>
                      <td className={`px-6 py-4 font-mono ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                        {checkOut ? checkOut.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                      </td>
                      <td className={`px-6 py-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
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
        <div className={`px-6 py-4 border-t text-xs flex justify-between ${darkMode ? "border-gray-700 bg-gray-800 text-gray-400" : "border-gray-100 bg-gray-50 text-gray-500"}`}>
          <span>Showing {records.length} records</span>
        </div>
      </div>
    </div>
  );
}

