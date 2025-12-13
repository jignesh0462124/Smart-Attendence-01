// src/SuperAdmin/SuperLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { superAdminLogin } from "./super";

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
      await superAdminLogin(form.email.trim(), form.password);
      navigate("/super-dashboard");
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-xl rounded-3xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          SuperAdmin Login
        </h2>
        <p className="text-xs text-gray-500 text-center mt-1">
          Only SuperAdmins are allowed here.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-xs text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded-xl mt-1"
              placeholder="super@admin.com"
            />
          </div>

          <div>
            <label className="text-xs text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded-xl mt-1"
              placeholder="••••••••"
            />
          </div>

          {errorMsg && (
            <div className="bg-red-100 text-red-700 text-xs px-3 py-2 rounded-xl">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-xl mt-2 hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Checking..." : "Login as SuperAdmin"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SuperLogin;
