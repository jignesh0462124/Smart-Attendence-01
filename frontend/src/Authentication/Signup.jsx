// src/Authentication/Signup.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase/supabase.js";
import { useNavigate } from "react-router-dom";
import img1 from "./img1/img1.png";

export default function Signup() {
  const navigate = useNavigate();
  // Views: login, signup, reset
  const [view, setView] = useState("login");

  // Login States
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup States
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Reset States
  const [resetEmail, setResetEmail] = useState("");

  // UI States
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const formatSupabaseError = (err) => {
    if (!err) return "Unexpected error";
    const code = err.code || "";
    if (code === "invalid_grant" || code === "invalid_credentials") return "Invalid email or password.";
    if (code === "email_not_confirmed") return "Please confirm your email before logging in.";
    return err.message || "Something went wrong.";
  };

  const resetMessages = () => {
    setErrorMsg("");
    setSuccessMsg("");
  };

  const handleSwitchView = (v) => {
    if (loading) return;
    resetMessages();
    setView(v);
  };

  const isActiveTab = (tab) => {
    return view === tab
      ? "bg-blue-600 text-white shadow-sm"
      : "bg-transparent text-slate-600 hover:bg-slate-100";
  };

  // --- EMAIL CONFIRMATION & AUTH LISTENER ---
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      // If the user clicks the email link, event is 'SIGNED_IN'
      if (event === "SIGNED_IN" && session) {
        setSuccessMsg("Logged in. Redirecting to dashboard...");
        setLoading(false);
        setTimeout(() => navigate("/employee-dashboard", { replace: true }), 500);
      }

      // Check for errors in the URL hash (e.g., link expired)
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      if (hashParams.get("error")) {
        setErrorMsg(hashParams.get("error_description") || "Invalid or expired link.");
      }
    });

    return () => subscription?.unsubscribe();
  }, [navigate]);

  // LOGIN LOGIC
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    resetMessages();
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail.trim().toLowerCase(),
        password: loginPassword,
      });
      if (error) throw error;
      setSuccessMsg("Logged in. Redirecting to dashboard...");
      // onAuthStateChange will redirect; also navigate immediately for snappier UX
      navigate("/employee-dashboard", { replace: true });
    } catch (err) {
      setErrorMsg(formatSupabaseError(err));
    } finally {
      setLoading(false);
    }
  };

  // SIGNUP LOGIC
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    resetMessages();

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
          data: { full_name: signupName.trim() }, // Passes to your SQL Trigger
          emailRedirectTo: window.location.origin + "/auth", // Redirects back to this page
        },
      });

      if (error) throw error;
      setSuccessMsg("Signup successful! Please check your email to confirm your account.");
      setView("login");
    } catch (err) {
      setErrorMsg(formatSupabaseError(err));
    } finally {
      setLoading(false);
    }
  };

  // RESET LOGIC
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    resetMessages();
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail.trim().toLowerCase());
      if (error) throw error;
      setSuccessMsg("Password reset link sent.");
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
        {/* LEFT BRANDING */}
        <div className="bg-blue-600 text-white p-10 flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-4">SmartAttend</h1>
            <p className="text-blue-100">Smart attendance & workforce management system.</p>
          </div>
          <img src={img1} alt="SmartAttend" className="mt-10" />
        </div>

        {/* RIGHT FORM AREA */}
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-slate-100 rounded-full p-1 flex">
              {["login", "signup", "reset"].map((t) => (
                <button
                  key={t}
                  onClick={() => handleSwitchView(t)}
                  className={`px-4 py-2 rounded-full text-sm transition-all duration-200 ${isActiveTab(t)}`}
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {(errorMsg || successMsg) && (
            <div className="mb-4 text-sm">
              {errorMsg && <div className="bg-red-100 text-red-600 p-2 rounded">{errorMsg}</div>}
              {successMsg && <div className="bg-green-100 text-green-700 p-2 rounded">{successMsg}</div>}
            </div>
          )}

          {view === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <input type="email" placeholder="Email" className="w-full border p-2 rounded" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
              <input type="password" placeholder="Password" className="w-full border p-2 rounded" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required />
              <button disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          )}

          {view === "signup" && (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <input type="text" placeholder="Full Name" className="w-full border p-2 rounded" value={signupName} onChange={(e) => setSignupName(e.target.value)} required />
              <input type="email" placeholder="Email" className="w-full border p-2 rounded" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} required />
              <input type="password" placeholder="Password" className="w-full border p-2 rounded" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} required />
              <input type="password" placeholder="Confirm Password" className="w-full border p-2 rounded" value={signupConfirm} onChange={(e) => setSignupConfirm(e.target.value)} required />
              <label className="text-sm flex gap-2 cursor-pointer">
                <input type="checkbox" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} required />
                Accept terms
              </label>
              <button disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>
          )}

          {view === "reset" && (
            <form onSubmit={handleResetSubmit} className="space-y-4">
              <input type="email" placeholder="Email" className="w-full border p-2 rounded" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} required />
              <button disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}