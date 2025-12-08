// src/pages/superadmin/SuperDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabase/supabase.js";
import {
  getCurrentUser,
  getAdmins,
  addAdmin,
  updateAdmin,
} from "./super.js";

const SuperDashboard = () => {
  const navigate = useNavigate();

  const [superUser, setSuperUser] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingAdmins, setLoadingAdmins] = useState(false);

  const [createForm, setCreateForm] = useState({
    email: "",
    name: "",
    phone: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    email: "",
    name: "",
    phone: "",
  });

  const [actionMsg, setActionMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Load current user + admins
  useEffect(() => {
    const init = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) {
          navigate("/super-login");
          return;
        }
        setSuperUser(user);

        setLoadingAdmins(true);
        const list = await getAdmins();
        setAdmins(list);
      } catch (err) {
        console.error(err);
        setErrorMsg(err.message || "Failed to load dashboard.");
      } finally {
        setLoadingPage(false);
        setLoadingAdmins(false);
      }
    };
    init();
  }, [navigate]);

  const refreshAdmins = async () => {
    setLoadingAdmins(true);
    try {
      const list = await getAdmins();
      setAdmins(list);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Failed to refresh admins.");
    } finally {
      setLoadingAdmins(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/super-login");
  };

  const handleCreateChange = (e) => {
    setCreateForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditChange = (e) => {
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setActionMsg("");

    try {
      const { email, name, phone } = createForm;
      if (!email || !name) {
        setErrorMsg("Email and Name are required.");
        return;
      }

      await addAdmin({ email, name, phone });
      setActionMsg("Admin created successfully.");
      setCreateForm({ email: "", name: "", phone: "" });
      await refreshAdmins();
    } catch (err) {
      setErrorMsg(err.message || "Failed to create admin.");
    }
  };

  const startEdit = (admin) => {
    setEditingId(admin.id);
    setEditForm({
      email: admin.email || "",
      name: admin.name || "",
      phone: admin.phone || "",
    });
    setActionMsg("");
    setErrorMsg("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ email: "", name: "", phone: "" });
  };

  const saveEdit = async (id) => {
    setErrorMsg("");
    setActionMsg("");

    try {
      const { email, name, phone } = editForm;
      if (!email || !name) {
        setErrorMsg("Email and Name are required.");
        return;
      }

      await updateAdmin(id, { email, name, phone });
      setActionMsg("Admin updated successfully.");
      setEditingId(null);
      setEditForm({ email: "", name: "", phone: "" });
      await refreshAdmins();
    } catch (err) {
      setErrorMsg(err.message || "Failed to update admin.");
    }
  };

  if (loadingPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
        <p className="text-sm">Loading SuperAdmin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* HEADER */}
      <header className="flex items-center justify-between px-6 md:px-10 py-4 border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
            SuperAdmin Dashboard
          </h1>
          {superUser && (
            <p className="mt-1 text-xs text-slate-400">
              Logged in as <span className="font-medium">{superUser.email}</span>
            </p>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="text-xs md:text-sm rounded-full border border-rose-500 px-4 py-1.5 
                     text-rose-100 hover:bg-rose-500 hover:text-slate-950 transition"
        >
          Logout
        </button>
      </header>

      {/* CONTENT */}
      <main className="flex-1 px-4 md:px-10 py-6 space-y-6">
        {/* STATUS MESSAGES */}
        {(actionMsg || errorMsg) && (
          <div className="max-w-4xl mx-auto space-y-2">
            {actionMsg && (
              <div className="text-xs md:text-sm bg-emerald-900/40 border border-emerald-500/60 rounded-xl px-4 py-2 text-emerald-100">
                {actionMsg}
              </div>
            )}
            {errorMsg && (
              <div className="text-xs md:text-sm bg-rose-900/40 border border-rose-500/60 rounded-xl px-4 py-2 text-rose-100">
                {errorMsg}
              </div>
            )}
          </div>
        )}

        {/* GRID: CREATE + LIST */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr,2fr] gap-6 max-w-6xl mx-auto">
          {/* CREATE ADMIN CARD */}
          <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-2xl shadow-black/40">
            <h2 className="text-lg font-semibold mb-1">Add New Admin</h2>
            <p className="text-xs text-slate-400 mb-4">
              Create a new admin with a unique admin ID. Gmail, name, and phone number
              can be updated later by the SuperAdmin.
            </p>

            <form className="space-y-4" onSubmit={handleCreateAdmin}>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Gmail (Email)
                </label>
                <input
                  type="email"
                  name="email"
                  value={createForm.email}
                  onChange={handleCreateChange}
                  placeholder="admin@gmail.com"
                  required
                  className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs md:text-sm 
                             text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 
                             focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={createForm.name}
                  onChange={handleCreateChange}
                  placeholder="Admin Name"
                  required
                  className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs md:text-sm 
                             text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 
                             focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={createForm.phone}
                  onChange={handleCreateChange}
                  placeholder="+91 9876543210"
                  className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs md:text-sm 
                             text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 
                             focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-blue-600 hover:bg-blue-500 text-xs md:text-sm font-semibold 
                           text-white py-2.5 mt-1 shadow-lg shadow-blue-700/40 transition"
              >
                Create Admin
              </button>
            </form>
          </section>

          {/* ADMIN LIST CARD */}
          <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-2xl shadow-black/40">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-lg font-semibold">Admins List</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Manage existing admins. Gmail, name and phone are fully dynamic.
                </p>
              </div>

              <button
                onClick={refreshAdmins}
                className="text-[11px] md:text-xs px-3 py-1.5 rounded-full border border-slate-600 
                           text-slate-200 hover:bg-slate-700/70 transition"
              >
                {loadingAdmins ? "Refreshing..." : "Refresh"}
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="min-w-full text-xs md:text-sm bg-slate-950/40">
                <thead className="bg-slate-900/80 text-slate-300">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium">Admin ID</th>
                    <th className="px-3 py-2 text-left font-medium">Gmail</th>
                    <th className="px-3 py-2 text-left font-medium">Name</th>
                    <th className="px-3 py-2 text-left font-medium">Phone</th>
                    <th className="px-3 py-2 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-3 py-4 text-center text-slate-400"
                      >
                        No admins available. Add an admin from the left side.
                      </td>
                    </tr>
                  )}

                  {admins.map((admin) => (
                    <tr
                      key={admin.id}
                      className="border-t border-slate-800 hover:bg-slate-900/70"
                    >
                      {/* Admin UID (unique id) */}
                      <td className="px-3 py-2 whitespace-nowrap text-slate-100">
                        {admin.admin_uid}
                      </td>

                      {/* Gmail */}
                      <td className="px-3 py-2 min-w-[180px]">
                        {editingId === admin.id ? (
                          <input
                            type="email"
                            name="email"
                            value={editForm.email}
                            onChange={handleEditChange}
                            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-2 py-1 text-xs 
                                       text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        ) : (
                          <span className="text-slate-200">{admin.email}</span>
                        )}
                      </td>

                      {/* Name */}
                      <td className="px-3 py-2 min-w-[150px]">
                        {editingId === admin.id ? (
                          <input
                            type="text"
                            name="name"
                            value={editForm.name}
                            onChange={handleEditChange}
                            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-2 py-1 text-xs 
                                       text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        ) : (
                          <span className="text-slate-200">{admin.name}</span>
                        )}
                      </td>

                      {/* Phone */}
                      <td className="px-3 py-2 min-w-[120px]">
                        {editingId === admin.id ? (
                          <input
                            type="tel"
                            name="phone"
                            value={editForm.phone}
                            onChange={handleEditChange}
                            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-2 py-1 text-xs 
                                       text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        ) : (
                          <span className="text-slate-200">
                            {admin.phone || "-"}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-3 py-2 text-right whitespace-nowrap">
                        {editingId === admin.id ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => saveEdit(admin.id)}
                              className="text-[11px] px-3 py-1 rounded-full bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400 transition"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="text-[11px] px-3 py-1 rounded-full border border-slate-600 text-slate-200 hover:bg-slate-800 transition"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => startEdit(admin)}
                            className="text-[11px] px-3 py-1 rounded-full bg-blue-600 text-white hover:bg-blue-500 transition"
                          >
                            Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default SuperDashboard;
