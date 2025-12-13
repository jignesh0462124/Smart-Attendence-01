// src/SuperAdmin/SuperDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabase/supabase";

import {
  User,
  LogOut,
  Plus,
  RefreshCw,
  Trash,
  Briefcase,
} from "lucide-react";

const SuperDashboard = () => {
  const navigate = useNavigate();

  const [superUser, setSuperUser] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAdmins, setLoadingAdmins] = useState(false);

  const [createForm, setCreateForm] = useState({
    email: "",
    name: "",
    phone: "",
    password: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    email: "",
    name: "",
    phone: "",
  });

  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  /* ------------------------------------
        SUPERADMIN AUTH GUARD
  -------------------------------------*/
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data?.session;

      if (!session?.user) {
        navigate("/super-login");
        return;
      }

      // verify from DB
      const { data: row } = await supabase
        .from("superadmins")
        .select("*")
        .eq("auth_uid", session.user.id)
        .maybeSingle();

      if (!row) {
        navigate("/super-login");
        return;
      }

      setSuperUser(session.user);
      loadAdmins();
      setLoading(false);
    };

    checkAuth();
  }, []);

  /* ------------------------------------
        LOAD ADMINS
  -------------------------------------*/
  const loadAdmins = async () => {
    setLoadingAdmins(true);
    try {
      const { data, error } = await supabase.from("admins").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      setAdmins(data);
    } catch (err) {
      setError(err.message);
    }
    setLoadingAdmins(false);
  };

  /* ------------------------------------
        LOGOUT
  -------------------------------------*/
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/super-login");
  };

  /* ------------------------------------
        CREATE ADMIN
  -------------------------------------*/
  const handleCreateChange = (e) => {
    setCreateForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");

    const { email, name, phone, password } = createForm;

    if (!email || !name || !password) {
      setError("Email, name & password required.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be 6+ characters.");
      return;
    }

    try {
      // Check if email already exists
      const { data: existing, error: fetchError } = await supabase
        .from("admins")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (fetchError) throw fetchError;
      if (existing) {
        setError("Email already exists.");
        return;
      }

      // Insert new admin
      const { data, error } = await supabase.from("admins").insert([{
        email,
        name,
        phone,
        password,
        auth_uid: null // leave null unless linking to an auth user
      }]);

      if (error) throw error;

      setMsg("Admin created successfully.");
      setCreateForm({ email: "", name: "", phone: "", password: "" });
      loadAdmins();
    } catch (err) {
      console.error("Add admin error:", err);
      setError(err.message || "Failed to create admin");
    }
  };

  /* ------------------------------------
        EDIT ADMIN
  -------------------------------------*/
  const startEdit = (admin) => {
    setEditingId(admin.id);
    setEditForm({
      email: admin.email,
      name: admin.name,
      phone: admin.phone,
    });
  };

  const saveEdit = async (id) => {
    setError("");
    try {
      const { data, error } = await supabase.from("admins").update(editForm).eq("id", id);
      if (error) throw error;
      setMsg("Admin updated.");
      setEditingId(null);
      loadAdmins();
    } catch (err) {
      setError(err.message);
    }
  };

  /* ------------------------------------
        DELETE ADMIN
  -------------------------------------*/
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this admin?")) return;

    try {
      const { data, error } = await supabase.from("admins").delete().eq("id", id);
      if (error) throw error;
      setMsg("Admin deleted.");
      loadAdmins();
    } catch (err) {
      setError(err.message);
    }
  };

  /* ------------------------------------
        LOADING SCREEN
  -------------------------------------*/
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Validating SuperAdmin...
      </div>
    );
  }

  /* ------------------------------------
        MAIN DASHBOARD
  -------------------------------------*/
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between p-4 bg-white border-b shadow">
        <div className="flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-indigo-600" />
          <h1 className="text-xl font-bold">SuperAdmin Dashboard</h1>
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-1.5 bg-red-500 text-white rounded"
        >
          <LogOut className="w-4 h-4 inline mr-2" />
          Logout
        </button>
      </header>

      <main className="p-6 max-w-6xl mx-auto">
        {msg && <div className="bg-green-100 text-green-700 p-2 rounded">{msg}</div>}
        {error && <div className="bg-red-100 text-red-700 p-2 rounded">{error}</div>}

        <div className="grid lg:grid-cols-2 gap-8 mt-6">
          {/* CREATE ADMIN */}
          <div className="bg-white p-6 shadow rounded-xl">
            <h3 className="text-lg font-bold mb-3 flex items-center">
              <Plus className="w-5 h-5 mr-2 text-indigo-600" /> Create Admin
            </h3>

            <form onSubmit={handleCreateAdmin} className="space-y-3">
              <input
                name="email"
                value={createForm.email}
                onChange={handleCreateChange}
                placeholder="Email"
                className="border p-2 w-full rounded"
                required
              />

              <input
                name="name"
                value={createForm.name}
                onChange={handleCreateChange}
                placeholder="Full Name"
                className="border p-2 w-full rounded"
                required
              />

              <input
                name="phone"
                value={createForm.phone}
                onChange={handleCreateChange}
                placeholder="Phone"
                className="border p-2 w-full rounded"
              />

              <input
                name="password"
                type="password"
                value={createForm.password}
                onChange={handleCreateChange}
                placeholder="Password"
                className="border p-2 w-full rounded"
                required
              />

              <button className="bg-indigo-600 text-white py-2 w-full rounded">
                Create Admin
              </button>
            </form>
          </div>

          {/* ADMIN LIST */}
          <div className="bg-white p-6 shadow rounded-xl">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-bold">Admins</h3>
              <button
                onClick={loadAdmins}
                className="px-4 py-1 border rounded flex items-center gap-1"
              >
                <RefreshCw className="w-4 h-4" /> Refresh
              </button>
            </div>

            <table className="w-full text-sm border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2">Admin ID</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">Phone</th>
                  <th className="p-2 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {admins.map((admin) => (
                  <tr key={admin.id} className="border-b">
                    <td className="p-2">{admin.admin_uid}</td>

                    <td className="p-2">
                      {editingId === admin.id ? (
                        <input
                          name="email"
                          value={editForm.email}
                          onChange={(e) =>
                            setEditForm((p) => ({ ...p, email: e.target.value }))
                          }
                          className="border p-1 rounded"
                        />
                      ) : (
                        admin.email
                      )}
                    </td>

                    <td className="p-2">
                      {editingId === admin.id ? (
                        <input
                          name="name"
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm((p) => ({ ...p, name: e.target.value }))
                          }
                          className="border p-1 rounded"
                        />
                      ) : (
                        admin.name
                      )}
                    </td>

                    <td className="p-2">
                      {editingId === admin.id ? (
                        <input
                          name="phone"
                          value={editForm.phone}
                          onChange={(e) =>
                            setEditForm((p) => ({ ...p, phone: e.target.value }))
                          }
                          className="border p-1 rounded"
                        />
                      ) : (
                        admin.phone || "-"
                      )}
                    </td>

                    <td className="p-2 text-right">
                      {editingId === admin.id ? (
                        <>
                          <button
                            onClick={() => saveEdit(admin.id)}
                            className="bg-green-600 text-white px-3 py-1 rounded mr-1"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="border px-3 py-1 rounded"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(admin)}
                            className="bg-indigo-600 text-white px-3 py-1 rounded mr-1"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(admin.id)}
                            className="bg-red-600 text-white px-3 py-1 rounded flex items-center"
                          >
                            <Trash className="w-4 h-4 mr-1" /> Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}

                {admins.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-gray-500">
                      No admins found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SuperDashboard;
