import React, { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  TrendingUp,
  FileText,
  FolderOpen,
  HelpCircle,
  LogOut,
  MapPin,
  ShieldCheck,
  Bell,
  Moon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabase/supabase";

/* ===============================
   ATTENDANCE CONSTANTS & HELPERS
================================ */

export const CHECK_IN_TIME = "09:30";
export const LATE_LIMIT_MINUTES = 10;

function isWeekday(date) {
  const day = date.getDay();
  return day !== 0 && day !== 6;
}

function timeToMinutes(time) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function getWorkingDaysInMonth(year, month) {
  let count = 0;
  const days = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= days; d++) {
    const date = new Date(year, month, d);
    if (isWeekday(date)) count++;
  }
  return count;
}

function calculateAttendancePercentage(records, year, month) {
  const workingDays = getWorkingDaysInMonth(year, month);

  const attended = records.filter((r) => {
    const d = new Date(r.date);
    return (
      d.getFullYear() === year &&
      d.getMonth() === month &&
      (r.status === "Present" || r.status === "Late")
    );
  }).length;

  if (workingDays === 0) return "0";
  return ((attended / workingDays) * 100).toFixed(1);
}

/* ===============================
   MAIN COMPONENT
================================ */

export default function AttendanceHistory() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const isMonthCompleted =
    today.getDate() === new Date(year, month + 1, 0).getDate();

  /* ===============================
     FETCH ATTENDANCE FROM SUPABASE
  ================================ */

  useEffect(() => {
    fetchAttendance();
  }, []);

  async function fetchAttendance() {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("User not logged in");

      const { data, error } = await supabase
        .from("attendance")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (error) throw error;

      const grouped = groupAttendanceByDay(data);
      setRecords(grouped);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  /* ===============================
     GROUP CLOCK_IN / CLOCK_OUT
  ================================ */

  function groupAttendanceByDay(rows) {
    const map = {};

    rows.forEach((r) => {
      const date = r.created_at.split("T")[0];
      if (!map[date]) {
        map[date] = {
          date,
          checkIn: "-",
          checkOut: "-",
          hours: "-",
          location: r.latitude ? "Office" : "Remote",
          verification: r.photo_url ? "Face Scan" : "Geofence",
          status: "Absent",
          type: "absent",
        };
      }

      if (r.type === "clock_in") {
        map[date].checkIn = new Date(r.created_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        const checkInMinutes = timeToMinutes(map[date].checkIn);
        const fixed = timeToMinutes(CHECK_IN_TIME);

        if (checkInMinutes <= fixed) {
          map[date].status = "Present";
          map[date].type = "present";
        } else if (checkInMinutes <= fixed + LATE_LIMIT_MINUTES) {
          map[date].status = "Late";
          map[date].type = "late";
        }
      }

      if (r.type === "clock_out") {
        map[date].checkOut = new Date(r.created_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      }
    });

    return Object.values(map).reverse();
  }

  /* ===============================
     SUMMARY CALCULATIONS
  ================================ */

  const summary = useMemo(() => {
    const present = records.filter((r) => r.status === "Present").length;
    const late = records.filter((r) => r.status === "Late").length;
    const absent = getWorkingDaysInMonth(year, month) - (present + late);
    const percentage = calculateAttendancePercentage(records, year, month);

    return { present, late, absent, percentage };
  }, [records]);

  /* ===============================
     STATUS COLOR
  ================================ */

  const getStatusColor = (type) => {
    if (type === "present") return "bg-green-100 text-green-700";
    if (type === "late") return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  /* ===============================
     RENDER
  ================================ */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading attendance...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* =================== SIDEBAR =================== */}
      <aside className="w-64 bg-white border-r">
        <div className="p-6 border-b">
          <h1 className="text-lg font-bold">HRMS Portal</h1>
          <p className="text-xs text-gray-500">EMPLOYEE</p>
        </div>

        <nav className="p-4 space-y-2">
          <Link to="/employee-dashboard" className="flex gap-2">
            <TrendingUp /> Dashboard
          </Link>
          <div className="font-semibold text-indigo-600">
            <FolderOpen /> Attendance History
          </div>
        </nav>
      </aside>

      {/* =================== MAIN =================== */}
      <main className="flex-1 p-8">
        <header className="mb-8 flex justify-between">
          <h2 className="text-2xl font-bold">Attendance History</h2>
          <button onClick={() => setDarkMode(!darkMode)}>
            <Moon />
          </button>
        </header>

        {/* =================== SUMMARY =================== */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <SummaryCard title="Present" value={summary.present} color="green" />
          <SummaryCard title="Absent" value={summary.absent} color="red" />
          <SummaryCard title="Late" value={summary.late} color="yellow" />
          <SummaryCard
            title="Attendance %"
            value={`${summary.percentage}%`}
            color="blue"
          />
        </div>

        {/* =================== MONTH COMPLETED VIEW =================== */}
        {isMonthCompleted && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg text-blue-700 font-medium">
            Monthly attendance finalized. Summary locked.
          </div>
        )}

        {/* =================== TABLE =================== */}
        <div className="bg-white rounded-xl shadow border">
          <table className="w-full">
            <thead className="border-b">
              <tr>
                <th className="p-3 text-left">Date</th>
                <th className="p-3">Status</th>
                <th className="p-3">Check In / Out</th>
                <th className="p-3">Location</th>
                <th className="p-3">Verification</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="p-3">{r.date}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        r.type
                      )}`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="p-3">
                    {r.checkIn} / {r.checkOut}
                  </td>
                  <td className="p-3 flex gap-1 items-center">
                    <MapPin className="w-4 h-4" /> {r.location}
                  </td>
                  <td className="p-3 flex gap-1 items-center">
                    <ShieldCheck className="w-4 h-4 text-green-600" />
                    {r.verification}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

/* ===============================
   SUMMARY CARD COMPONENT
================================ */

function SummaryCard({ title, value, color }) {
  const colors = {
    green: "text-green-600 border-l-green-500",
    red: "text-red-600 border-l-red-500",
    yellow: "text-yellow-600 border-l-yellow-500",
    blue: "text-blue-600 border-l-blue-500",
  };

  return (
    <div
      className={`bg-white p-6 rounded-xl shadow border-l-4 ${colors[color]}`}
    >
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-3xl font-bold">{value}</h3>
    </div>
  );
}
