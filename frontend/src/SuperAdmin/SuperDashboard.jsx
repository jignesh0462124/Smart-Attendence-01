// src/SuperAdmin/SuperDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabase/supabase"; // ⬅️ adjust path if needed
import {
    getCurrentUser,
    getAdmins,
    addAdmin,
    updateAdmin,
} from "./super";
import {
    User, // Used for Admin avatar/icon
    LogOut,
    Plus, // Used for Add Admin button
    RefreshCw, // Used for Refresh button
    Edit2, // Used for Edit button
    Check, // Used for Save button
    X, // Used for Cancel button
    Briefcase, // Used for logo
} from "lucide-react";


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
        password: "",
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
                // If not superadmin, go to login
                if (err.message === "You are not authorized as SuperAdmin.") {
                    setErrorMsg(err.message);
                    navigate("/super-login");
                    return;
                }
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
            const { email, name, phone, password } = createForm;
            if (!email || !name) {
                setErrorMsg("Email and Name are required.");
                return;
            }
            if (!password || password.length < 6) {
                setErrorMsg("Password is required and must be at least 6 characters.");
                return;
            }

            await addAdmin({ email, name, phone, password });
            setActionMsg("Admin created successfully.");
            setCreateForm({ email: "", name: "", phone: "", password: "" });
            await refreshAdmins();
        } catch (err) {
            console.error(err);
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
                setErrorMsg("Failed to update admin: Email and Name are required.");
                return;
            }

            await updateAdmin(id, { email, name, phone });
            setActionMsg("Admin updated successfully.");
            setEditingId(null);
            setEditForm({ email: "", name: "", phone: "" });
            await refreshAdmins();
        } catch (err) {
            console.error(err);
            setErrorMsg(err.message || "Failed to update admin.");
        }
    };

    if (loadingPage) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                    <p className="text-sm text-gray-600">Loading SuperAdmin dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        // Changed main background to light gray, text to dark gray
        <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
            {/* HEADER - Full width, light theme */}
            <header className="flex items-center justify-between px-6 md:px-10 py-4 border-b border-gray-200 bg-white shadow-md">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900">
                            SuperAdmin Dashboard
                        </h1>
                        {superUser && (
                            <p className="mt-0.5 text-xs text-gray-500">
                                Logged in as{" "}
                                <span className="font-medium text-indigo-600">{superUser.email}</span>
                            </p>
                        )}
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="text-xs md:text-sm rounded-lg border border-red-500 px-4 py-1.5 
                                text-red-600 hover:bg-red-50 hover:text-red-700 transition font-medium flex items-center space-x-2"
                >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                </button>
            </header>

            {/* CONTENT */}
            <main className="flex-1 px-4 md:px-10 py-8 space-y-8">
                <h2 className="text-2xl font-bold text-gray-900 text-center">Admin Management</h2>

                {/* STATUS MESSAGES */}
                {(actionMsg || errorMsg) && (
                    <div className="max-w-4xl mx-auto space-y-2">
                        {actionMsg && (
                            <div className="text-xs md:text-sm bg-emerald-100 border border-emerald-400 rounded-xl px-4 py-2 text-emerald-800 font-medium flex items-center space-x-2">
                                <Check className="w-4 h-4" />
                                <span>{actionMsg}</span>
                            </div>
                        )}
                        {errorMsg && (
                            <div className="text-xs md:text-sm bg-red-100 border border-red-400 rounded-xl px-4 py-2 text-red-800 font-medium flex items-center space-x-2">
                                <X className="w-4 h-4" />
                                <span>{errorMsg}</span>
                            </div>
                        )}
                    </div>
                )}

                {/* GRID: CREATE + LIST */}
                <div className="grid grid-cols-1 lg:grid-cols-[1.2fr,2fr] gap-8 max-w-6xl mx-auto">
                    {/* CREATE ADMIN CARD */}
                    <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xl">
                        <div className="flex items-center space-x-3 mb-4">
                            <Plus className="w-6 h-6 text-indigo-600" />
                            <h2 className="text-xl font-bold">Add New Admin</h2>
                        </div>
                        <p className="text-sm text-gray-500 mb-6">
                            Create a new administrator account for HRMS access.
                        </p>

                        <form className="space-y-4" onSubmit={handleCreateAdmin}>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Gmail (Email)
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={createForm.email}
                                    onChange={handleCreateChange}
                                    placeholder="admin@example.com"
                                    required
                                    className="w-full rounded-lg bg-gray-50 border border-gray-300 px-3 py-2.5 text-sm 
                                             text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 
                                             focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={createForm.name}
                                    onChange={handleCreateChange}
                                    placeholder="Admin Name"
                                    required
                                    className="w-full rounded-lg bg-gray-50 border border-gray-300 px-3 py-2.5 text-sm 
                                             text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 
                                             focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={createForm.phone}
                                    onChange={handleCreateChange}
                                    placeholder="+91 9876543210"
                                    className="w-full rounded-lg bg-gray-50 border border-gray-300 px-3 py-2.5 text-sm 
                                             text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 
                                             focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Password (Min 6 characters)
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={createForm.password}
                                    onChange={handleCreateChange}
                                    placeholder="Enter a strong password"
                                    required
                                    className="w-full rounded-lg bg-gray-50 border border-gray-300 px-3 py-2.5 text-sm 
                                             text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 
                                             focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 text-sm font-semibold 
                                           text-white py-2.5 mt-2 shadow-md shadow-indigo-700/30 transition flex items-center justify-center space-x-2"
                            >
                                <User className="w-5 h-5" />
                                <span>Create Admin Account</span>
                            </button>
                        </form>
                    </section>

                    {/* ADMIN LIST CARD */}
                    <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold">Admins List</h2>
                            <button
                                onClick={refreshAdmins}
                                className="text-xs px-4 py-1.5 rounded-lg border border-gray-300 bg-white 
                                           text-gray-700 hover:bg-gray-50 transition flex items-center space-x-2 font-medium"
                            >
                                <RefreshCw className="w-4 h-4" />
                                <span>{loadingAdmins ? "Refreshing..." : "Refresh"}</span>
                            </button>
                        </div>
                        <p className="text-sm text-gray-500 mb-6">
                            View and edit details for all existing administrator accounts.
                        </p>

                        <div className="overflow-x-auto rounded-lg border border-gray-200">
                            <table className="min-w-full text-sm bg-white">
                                <thead className="bg-gray-50 text-gray-600">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-medium">Admin ID</th>
                                        <th className="px-4 py-3 text-left font-medium">Gmail</th>
                                        <th className="px-4 py-3 text-left font-medium">Name</th>
                                        <th className="px-4 py-3 text-left font-medium">Phone</th>
                                        <th className="px-4 py-3 text-right font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {admins.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="px-4 py-6 text-center text-gray-500"
                                            >
                                                {loadingAdmins ? "Loading..." : "No admins available. Add an admin from the left side."}
                                            </td>
                                        </tr>
                                    )}

                                    {admins.map((admin) => (
                                        <tr
                                            key={admin.id}
                                            className="hover:bg-gray-50"
                                        >
                                            {/* Admin UID */}
                                            <td className="px-4 py-3 whitespace-nowrap text-gray-800">
                                                {admin.admin_uid}
                                            </td>

                                            {/* Gmail */}
                                            <td className="px-4 py-3 min-w-[180px]">
                                                {editingId === admin.id ? (
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={editForm.email}
                                                        onChange={handleEditChange}
                                                        className="w-full rounded-md bg-white border border-indigo-300 px-2 py-1.5 text-sm 
                                                                     text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                                    />
                                                ) : (
                                                    <span className="text-gray-700">{admin.email}</span>
                                                )}
                                            </td>

                                            {/* Name */}
                                            <td className="px-4 py-3 min-w-[150px]">
                                                {editingId === admin.id ? (
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        value={editForm.name}
                                                        onChange={handleEditChange}
                                                        className="w-full rounded-md bg-white border border-indigo-300 px-2 py-1.5 text-sm 
                                                                     text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                                    />
                                                ) : (
                                                    <span className="text-gray-700">{admin.name}</span>
                                                )}
                                            </td>

                                            {/* Phone */}
                                            <td className="px-4 py-3 min-w-[120px]">
                                                {editingId === admin.id ? (
                                                    <input
                                                        type="tel"
                                                        name="phone"
                                                        value={editForm.phone}
                                                        onChange={handleEditChange}
                                                        className="w-full rounded-md bg-white border border-indigo-300 px-2 py-1.5 text-sm 
                                                                     text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                                    />
                                                ) : (
                                                    <span className="text-gray-700">
                                                        {admin.phone || "-"}
                                                    </span>
                                                )}
                                            </td>

                                            {/* Actions */}
                                            <td className="px-4 py-3 text-right whitespace-nowrap">
                                                {editingId === admin.id ? (
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => saveEdit(admin.id)}
                                                            className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition flex items-center space-x-1"
                                                        >
                                                            <Check className="w-4 h-4" />
                                                            <span>Save</span>
                                                        </button>
                                                        <button
                                                            onClick={cancelEdit}
                                                            className="text-xs px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition flex items-center space-x-1"
                                                        >
                                                            <X className="w-4 h-4" />
                                                            <span>Cancel</span>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => startEdit(admin)}
                                                        className="text-xs px-4 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition flex items-center space-x-1 font-medium"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                        <span>Edit</span>
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