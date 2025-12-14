// src/Authentication/Signup.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase/supabase.js";
import { useNavigate, useLocation } from "react-router-dom";
import img1 from "./img1/img1.png";

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();

  // Views
  const [view, setView] = useState("login");

  // Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Reset / Update
  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

  // UI
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const resetMessages = () => {
    setErrorMsg("");
    setSuccessMsg("");
  };

  const handleSwitchView = (v) => {
    if (loading) return;
    resetMessages();
    setView(v);
  };

  // ✅ FIXED (this was crashing your app)
  const isActiveTab = (tab) => {
    return view === tab
      ? "bg-blue-600 text-white shadow-sm"
      : "bg-transparent text-slate-600 hover:bg-slate-100";
  };

  // Handle auth events
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "PASSWORD_RECOVERY") {
          setView("updatePassword");
        }
        if (event === "SIGNED_IN") {
          navigate("/employee-dashboard", { replace: true });
        }
      }
    );

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, [navigate]);

  // LOGIN
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    resetMessages();

    if (!loginEmail || !loginPassword) {
      setErrorMsg("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail.trim().toLowerCase(),
        password: loginPassword,
      });

      if (error) throw error;

      navigate("/employee-dashboard", { replace: true });
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  // SIGNUP
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    resetMessages();

    if (!signupName || !signupEmail || !signupPassword || !signupConfirm) {
      setErrorMsg("Please fill in all fields.");
      return;
    }

    if (signupPassword !== signupConfirm) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    if (!acceptTerms) {
      setErrorMsg("Please accept the terms.");
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email: signupEmail.trim().toLowerCase(),
        password: signupPassword,
        options: {
          data: {
            full_name: signupName.trim(),
          },
        },
      });

      if (error) throw error;

      setSuccessMsg("Signup successful. Please check your email.");
      setView("login");
      setLoginEmail(signupEmail);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  // RESET PASSWORD
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    resetMessages();

    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(
        resetEmail.trim().toLowerCase()
      );
      if (error) throw error;

      setSuccessMsg("Password reset link sent.");
      setView("login");
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  // UPDATE PASSWORD
  const handleUpdatePasswordSubmit = async (e) => {
    e.preventDefault();
    resetMessages();

    if (newPassword !== newPasswordConfirm) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;

      setSuccessMsg("Password updated. Please login.");
      setView("login");
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 rounded-3xl shadow-xl overflow-hidden">

        {/* LEFT */}
        <div className="bg-blue-600 text-white p-10 flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-4">SmartAttend</h1>
            <p className="text-blue-100">
              Smart attendance & workforce management system.
            </p>
          </div>
          <img src={img1} alt="SmartAttend" className="mt-10" />
        </div>

        {/* RIGHT */}
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-slate-100 rounded-full p-1 flex">
              {["login", "signup", "reset"].map((t) => (
                <button
                  key={t}
                  onClick={() => handleSwitchView(t)}
                  className={`px-4 py-2 rounded-full text-sm ${isActiveTab(t)}`}
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {(errorMsg || successMsg) && (
            <div className="mb-4 text-sm">
              {errorMsg && (
                <div className="bg-red-100 text-red-600 p-2 rounded">
                  {errorMsg}
                </div>
              )}
              {successMsg && (
                <div className="bg-green-100 text-green-700 p-2 rounded">
                  {successMsg}
                </div>
              )}
            </div>
          )}

          {view === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                className="w-full border p-2 rounded"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full border p-2 rounded"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
              <button className="w-full bg-blue-600 text-white py-2 rounded">
                Login
              </button>
            </form>
          )}

          {view === "signup" && (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full border p-2 rounded"
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full border p-2 rounded"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full border p-2 rounded"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full border p-2 rounded"
                value={signupConfirm}
                onChange={(e) => setSignupConfirm(e.target.value)}
              />
              <label className="text-sm flex gap-2">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                />
                Accept terms
              </label>
              <button className="w-full bg-blue-600 text-white py-2 rounded">
                Create Account
              </button>
            </form>
          )}

          {view === "reset" && (
            <form onSubmit={handleResetSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                className="w-full border p-2 rounded"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
              />
              <button className="w-full bg-blue-600 text-white py-2 rounded">
                Send Reset Link
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
