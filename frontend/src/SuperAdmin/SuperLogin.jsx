// src/SuperAdmin/SuperLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { superAdminLogin } from "./super.js";

const SuperLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      await superAdminLogin(form.email, form.password);
      navigate("/super-dashboard");
    } catch (err) {
      setErrorMsg(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans bg-slate-100">
      {/* LEFT PANEL */}
      <div className="flex-1 bg-blue-600 text-white flex items-center justify-center px-6 py-10">
        <div className="max-w-md">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
            Welcome Back to <br />
            <span className="text-yellow-300">SuperAdmin</span>
          </h1>
          <p className="text-sm md:text-base text-blue-100 leading-relaxed">
            Control every part of your platform with a secure, dedicated
            SuperAdmin panel. Manage admins, monitor activity, and stay in
            control.
          </p>

          <div className="mt-10 bg-blue-500/70 rounded-3xl shadow-xl p-6">
            <div className="w-full h-32 md:h-36 rounded-2xl bg-gradient-to-tr from-yellow-300 to-yellow-400 mb-3" />
            <p className="text-xs uppercase tracking-[0.25em] text-blue-100 text-center">
              Secure • Centralized • Highest Authority
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl px-6 py-8 md:px-8">
          <h2 className="text-xl md:text-2xl font-semibold text-center text-slate-900">
            SuperAdmin Sign In
          </h2>
          <p className="mt-1 text-xs text-center text-slate-500">
            Only accounts registered as SuperAdmin can access this panel.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="superadmin@company.com"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            {errorMsg && (
              <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed transition"
            >
              {loading ? "Checking..." : "Login as SuperAdmin"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SuperLogin;
