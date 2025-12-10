// src/Authentication/AdminLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { signInAdmin } from "./Admin.js";
import adminImg from "./img1/img1.png";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // UI State
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      // 1. Admin authentication + role verification (from Admin.js)
      const { user, admin } = await signInAdmin(email, password);

      console.log("Admin Auth User:", user);
      console.log("Admin Row:", admin);

      // 2. Optional: store admin data locally for quick access in UI
      localStorage.setItem(
        "adminInfo",
        JSON.stringify({
          auth_uid: user.id,          // Supabase auth user ID
          id: admin.id,               // internal admins table ID
          admin_uid: admin.admin_uid, // human-readable ID (e.g. ADM-000001)
          email: admin.email,
          name: admin.name,
          phone: admin.phone,
        })
      );

      // 3. Navigate to Admin Dashboard
      // Make sure your Route path matches this (e.g. <Route path="/admin-dashboard" ... />)
      navigate("/admin-dashboard");
    } catch (error) {
      console.error("Admin Login Error:", error);
      setErrorMsg(error.message || "Invalid login credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Panel - Visuals */}
        <div className="bg-slate-900 text-white p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="z-10 relative">
            <h1 className="text-3xl font-bold mb-2">Admin Portal</h1>
            <p className="text-slate-400">
              Authorized personnel only. Manage teams, monitor attendance, and system configurations.
            </p>
          </div>

          {/* Decorative Circle */}
          <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-blue-600 rounded-full opacity-20 blur-2xl" />
          <div className="absolute bottom-[-50px] left-[-50px] w-60 h-60 bg-purple-600 rounded-full opacity-20 blur-3xl" />

          <div className="mt-8 z-10 flex justify-center">
            <img
              src={adminImg}
              alt="Admin Panel"
              className="w-3/4 opacity-90 drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="p-10 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Login</h2>
            <p className="text-sm text-slate-500">
              Sign in to the administration dashboard.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Admin Email
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="admin@smartattend.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying Credentials..." : "Access Dashboard"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-400">
              Not an admin?{" "}
              <a href="/login" className="text-blue-600 hover:underline">
                Go to Employee Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
