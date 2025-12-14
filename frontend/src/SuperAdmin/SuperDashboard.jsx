import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabase/supabase";
import { LogOut, Briefcase, RefreshCw } from "lucide-react";

const SuperDashboard = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState([]);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    date: "",
  });

  /* ================================
      SUPERADMIN AUTH GUARD
  ================================= */
  useEffect(() => {
    checkSuperAdmin();
    // eslint-disable-next-line
  }, []);

  const checkSuperAdmin = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        navigate("/super-login");
        return;
      }

      const user = session.user;

      const { data: superadmin, error } = await supabase
        .from("superadmins")
        .select("id")
        .eq("auth_uid", user.id)
        .single();

      if (error || !superadmin) {
        navigate("/super-login");
        return;
      }

      await loadAttendance();
    } catch (err) {
      console.error(err);
      navigate("/super-login");
    } finally {
      setLoading(false);
    }
  };

  /* ================================
      LOAD ATTENDANCE
  ================================= */
  const loadAttendance = async () => {
    setError("");

    let query = supabase
      .from("attendance")
      .select(
        `
        id,
        date,
        status,
        check_in_time,
        check_out_time,
        latitude,
        longitude,
        photo_url,
        created_at,
        employees (
          full_name,
          email
        )
      `
      )
      .order("created_at", { ascending: false });

    if (filters.date) {
      query = query.eq("date", filters.date);
    }

    const { data, error } = await query;

    if (error) {
      setError(error.message);
      setAttendance([]);
    } else {
      setAttendance(data || []);
    }
  };

  /* ================================
      LOGOUT
  ================================= */
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/super-login");
  };

  /* ================================
      LOADING STATE
  ================================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Validating SuperAdmin…
      </div>
    );
  }

  /* ================================
      UI
  ================================= */
  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="flex justify-between items-center px-6 py-4 bg-white border-b">
        <div className="flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-indigo-600" />
          <h1 className="text-xl font-bold">SuperAdmin Dashboard</h1>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1 bg-red-600 text-white px-4 py-2 rounded"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </header>

      {/* MAIN */}
      <main className="p-6 max-w-7xl mx-auto">
        {/* FILTERS */}
        <div className="bg-white p-4 rounded shadow mb-6 flex items-center gap-4">
          <input
            type="date"
            className="border p-2 rounded"
            value={filters.date}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, date: e.target.value }))
            }
          />

          <button
            onClick={loadAttendance}
            className="border px-4 py-2 rounded flex items-center gap-1"
          >
            <RefreshCw className="w-4 h-4" />
            Apply
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* ATTENDANCE TABLE */}
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Employee</th>
                <th className="p-3">Status</th>
                <th className="p-3">Check In</th>
                <th className="p-3">Check Out</th>
                <th className="p-3">Date</th>
                <th className="p-3">Location</th>
              </tr>
            </thead>

            <tbody>
              {attendance.map((row) => (
                <tr key={row.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    {row.employees?.full_name || "Unknown"}
                    <div className="text-xs text-gray-500">
                      {row.employees?.email || ""}
                    </div>
                  </td>

                  <td className="p-3 font-semibold">{row.status}</td>

                  <td className="p-3">
                    {row.check_in_time || "—"}
                  </td>

                  <td className="p-3">
                    {row.check_out_time || "—"}
                  </td>

                  <td className="p-3">{row.date}</td>

                  <td className="p-3">
                    {row.latitude
                      ? `${row.latitude.toFixed(4)}, ${row.longitude.toFixed(4)}`
                      : "—"}
                  </td>
                </tr>
              ))}

              {attendance.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="p-6 text-center text-gray-500"
                  >
                    No attendance records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default SuperDashboard;
