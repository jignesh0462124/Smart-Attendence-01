// src/Authentication/Signup.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase/supabase.js";
import { useNavigate } from "react-router-dom";
import img1 from "./img1/img1.png";
import { Mail, Lock, User, ArrowRight, Check } from "lucide-react";

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
          data: { full_name: signupName.trim() },
          emailRedirectTo: window.location.origin + "/auth",
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
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 min-h-[600px] animate-fade-in-up">

        {/* LEFT BRANDING SECTION */}
        <div className="relative hidden md:flex flex-col justify-between p-12 bg-cover bg-center overflow-hidden">
          <div className="absolute inset-0 bg-indigo-900/90 z-10"></div>
          {/* Decorative Circles */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

          <div className="relative z-20 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                  <span className="text-2xl">⚡</span>
                </div>
                <h1 className="text-3xl font-bold text-white tracking-wide">SmartAttend</h1>
              </div>
              <p className="text-indigo-200 text-lg leading-relaxed">
                Experience the next generation of workforce management. Seamless attendance tracking, leave management, and more.
              </p>
            </div>

            <div className="flex justify-center">
              <img src={img1} alt="Illustration" className="w-[80%] object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-500" />
            </div>

            <div className="text-indigo-300 text-sm font-medium">
              &copy; {new Date().getFullYear()} SmartAttend Inc.
            </div>
          </div>
        </div>

        {/* RIGHT FORM SECTION */}
        <div className="p-8 md:p-12 flex flex-col justify-center bg-white relative">

          {/* Toggle Switch */}
          <div className="flex justify-center mb-10">
            <div className="bg-gray-100 p-1 rounded-full flex shadow-inner">
              {["login", "signup"].map((t) => (
                <button
                  key={t}
                  onClick={() => handleSwitchView(t)}
                  className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${view === t || (t === "login" && view === "reset")
                      ? "bg-white text-indigo-700 shadow-md"
                      : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                  {t === "login" ? "Sign In" : "Sign Up"}
                </button>
              ))}
            </div>
          </div>

          <div className="max-w-sm mx-auto w-full">
            <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
              {view === "login" ? "Welcome Back!" : view === "signup" ? "Create Account" : "Reset Password"}
            </h2>
            <p className="text-gray-500 text-center mb-8">
              {view === "login" ? "Please enter your details to sign in." : view === "signup" ? "Start your journey with us today." : "Enter your email to receive a reset link."}
            </p>

            {/* ERROR / SUCCESS MESSAGES */}
            {(errorMsg || successMsg) && (
              <div className={`mb-6 p-4 rounded-xl text-sm font-medium flex items-start gap-3 transform transition-all duration-300 ${errorMsg ? "bg-red-50 text-red-600 border border-red-100" : "bg-green-50 text-green-700 border border-green-100"}`}>
                {errorMsg && <span>⚠️ {errorMsg}</span>}
                {successMsg && <span>✅ {successMsg}</span>}
              </div>
            )}

            {/* VIEW: LOGIN */}
            {view === "login" && (
              <form onSubmit={handleLoginSubmit} className="space-y-5">
                <div className="relative group">
                  <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-gray-800"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-gray-800"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                  <div className="text-right mt-2">
                    <button type="button" onClick={() => handleSwitchView("reset")} className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">Forgot Password?</button>
                  </div>
                </div>

                <button disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2">
                  {loading ? "Signing In..." : <>Sign In <ArrowRight className="w-5 h-5" /></>}
                </button>
              </form>
            )}

            {/* VIEW: SIGNUP */}
            {view === "signup" && (
              <form onSubmit={handleSignupSubmit} className="space-y-4">
                <div className="relative group">
                  <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-gray-800"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    required
                  />
                </div>
                <div className="relative group">
                  <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-gray-800"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-gray-800"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-gray-800"
                    value={signupConfirm}
                    onChange={(e) => setSignupConfirm(e.target.value)}
                    required
                  />
                </div>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${acceptTerms ? "bg-indigo-600 border-indigo-600" : "bg-white border-gray-300 group-hover:border-indigo-400"}`}>
                    {acceptTerms && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <input type="checkbox" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} className="hidden" required />
                  <span className="text-sm text-gray-600">I agree to the <span className="text-indigo-600 font-semibold hover:underline">Terms & Conditions</span></span>
                </label>
                <button disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-0.5 transition-all duration-200 text-lg">
                  {loading ? "Creating..." : "Create Account"}
                </button>
              </form>
            )}

            {/* VIEW: RESET */}
            {view === "reset" && (
              <form onSubmit={handleResetSubmit} className="space-y-6">
                <div className="relative group">
                  <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    type="email"
                    placeholder="Registered Email"
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-gray-800"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                  />
                </div>
                <button disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-0.5 transition-all duration-200">
                  {loading ? "Sending Link..." : "Send Reset Link"}
                </button>
                <button type="button" onClick={() => handleSwitchView("login")} className="w-full text-indigo-600 font-semibold hover:bg-indigo-50 py-3 rounded-xl transition-colors">
                  Back to Login
                </button>
              </form>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
