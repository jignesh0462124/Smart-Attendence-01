// src/Authentication/Signup.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase/supabase.js";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import img1 from "./img1/img1.png";
import { Mail, Lock, User, ArrowRight, Check, AlertCircle, Loader2 } from "lucide-react";

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
        setTimeout(() => navigate("/employee-dashboard", { replace: true }), 1500);
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
      setSuccessMsg("Logged in successfully!");
      setTimeout(() => navigate("/employee-dashboard", { replace: true }), 1000);
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
      setTimeout(() => setView("login"), 2000);
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
      setTimeout(() => setView("login"), 2000);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 lg:p-8 font-sans">
      <div className="bg-white w-full max-w-6xl h-[850px] lg:h-[700px] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row shadow-slate-200/50 border border-white">

        {/* LEFT BRANDING SECTION */}
        <div className="relative hidden md:flex w-[45%] flex-col justify-between p-12 overflow-hidden bg-slate-900 text-white">

          {/* Background Gradients */}
          <div className="absolute top-0 left-0 w-full h-full z-0">
            <div className="absolute top-[-50%] left-[-50%] w-[100%] h-[100%] bg-blue-600 rounded-full blur-[120px] opacity-40"></div>
            <div className="absolute bottom-[-50%] right-[-50%] w-[100%] h-[100%] bg-indigo-600 rounded-full blur-[120px] opacity-40"></div>
          </div>

          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
                  <span className="text-xl font-bold">S</span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight">SmartAttend</h1>
              </div>

              <div className="space-y-6">
                <h2 className="text-4xl font-extrabold leading-tight">
                  Start your journey <br /> with us.
                </h2>
                <p className="text-slate-400 text-lg max-w-xs leading-relaxed">
                  Join thousands of companies managing their workforce intelligently.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full"></div>
              <img src={img1} alt="Illustration" className="relative z-10 w-full max-w-[320px] mx-auto drop-shadow-2xl hover:scale-105 transition-transform duration-500" />
            </div>

            <div className="flex justify-between items-center text-sm text-slate-500 font-medium">
              <span>© 2025 SmartAttend Inc.</span>
              <div className="flex gap-4">
                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                <a href="#" className="hover:text-white transition-colors">Terms</a>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT FORM SECTION */}
        <div className="flex-1 p-8 md:p-16 lg:p-20 relative flex flex-col justify-center">

          <div className="max-w-md mx-auto w-full">

            {/* View Switching Tabs */}
            <div className="flex justify-center mb-12">
              <div className="bg-slate-100 p-1.5 rounded-full inline-flex relative">
                <motion.div
                  className="absolute top-1.5 bottom-1.5 bg-white rounded-full shadow-sm"
                  initial={false}
                  animate={{
                    x: view === 'login' ? 0 : view === 'signup' ? '100%' : 0,
                    width: view === 'reset' ? '0%' : '50%',
                    opacity: view === 'reset' ? 0 : 1
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
                <button
                  onClick={() => handleSwitchView("login")}
                  className={`relative z-10 px-8 py-2.5 rounded-full text-sm font-bold transition-colors ${view === 'login' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleSwitchView("signup")}
                  className={`relative z-10 px-8 py-2.5 rounded-full text-sm font-bold transition-colors ${view === 'signup' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Sign Up
                </button>
              </div>
            </div>

            {/* Header Text */}
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">
                {view === "login" ? "Welcome Back" : view === "signup" ? "Create Account" : "Reset Password"}
              </h2>
              <p className="text-slate-500">
                {view === "login" ? "Enter your credentials to access your account." : view === "signup" ? "Fill in your details to get started." : "Enter your email to receive a reset link."}
              </p>
            </div>

            {/* Alerts */}
            <AnimatePresence mode="wait">
              {(errorMsg || successMsg) && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`mb-6 p-4 rounded-2xl flex items-start gap-3 text-sm font-medium ${errorMsg ? "bg-red-50 text-red-600 border border-red-100" : "bg-green-50 text-green-700 border border-green-100"}`}
                >
                  {errorMsg ? <AlertCircle className="w-5 h-5 shrink-0" /> : <Check className="w-5 h-5 shrink-0" />}
                  <span>{errorMsg || successMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Forms */}
            <div className="relative">
              <AnimatePresence mode="wait">

                {/* LOGIN FORM */}
                {view === "login" && (
                  <motion.form
                    key="login"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleLoginSubmit}
                    className="space-y-5"
                  >
                    <div className="space-y-4">
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                        <input
                          type="email"
                          placeholder="Email Address"
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-2xl outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400 hover:bg-slate-100/50"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                        <input
                          type="password"
                          placeholder="Password"
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-2xl outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400 hover:bg-slate-100/50"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button type="button" onClick={() => handleSwitchView("reset")} className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                        Forgot Password?
                      </button>
                    </div>

                    <button
                      disabled={loading}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      {loading ? <Loader2 className="animate-spin" /> : <>Sign In <ArrowRight className="w-5 h-5" /></>}
                    </button>
                  </motion.form>
                )}

                {/* SIGNUP FORM */}
                {view === "signup" && (
                  <motion.form
                    key="signup"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleSignupSubmit}
                    className="space-y-5"
                  >
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                      <input
                        type="text"
                        placeholder="Full Name"
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-2xl outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400 hover:bg-slate-100/50"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                      <input
                        type="email"
                        placeholder="Email Address"
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-2xl outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400 hover:bg-slate-100/50"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex gap-4">
                      <div className="relative group w-1/2">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                        <input
                          type="password"
                          placeholder="Password"
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-2xl outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400 hover:bg-slate-100/50"
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          required
                        />
                      </div>
                      <div className="relative group w-1/2">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                        <input
                          type="password"
                          placeholder="Confirm"
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-2xl outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400 hover:bg-slate-100/50"
                          value={signupConfirm}
                          onChange={(e) => setSignupConfirm(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <label className="flex items-center gap-3 cursor-pointer group mt-2">
                      <div
                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${acceptTerms ? "bg-blue-600 border-blue-600" : "bg-white border-slate-300 group-hover:border-blue-400"}`}
                        onClick={(e) => { e.preventDefault(); setAcceptTerms(!acceptTerms); }}
                      >
                        {acceptTerms && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                      </div>
                      <span className="text-sm text-slate-600 select-none" onClick={() => setAcceptTerms(!acceptTerms)}>
                        I agree to the <span className="text-blue-600 font-bold hover:underline">Terms & Conditions</span>
                      </span>
                    </label>

                    <button
                      disabled={loading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-600/20 hover:shadow-blue-600/30 transform hover:-translate-y-0.5 transition-all duration-200 mt-6"
                    >
                      {loading ? <Loader2 className="animate-spin mx-auto scale-110" /> : "Create Account"}
                    </button>
                  </motion.form>
                )}

                {/* RESET FORM */}
                {view === "reset" && (
                  <motion.form
                    key="reset"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleResetSubmit}
                    className="space-y-6"
                  >
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                      <input
                        type="email"
                        placeholder="Registered Email"
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-2xl outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400 hover:bg-slate-100/50"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        required
                      />
                    </div>
                    <button
                      disabled={loading}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                      {loading ? <Loader2 className="animate-spin mx-auto" /> : "Send Reset Link"}
                    </button>
                    <button type="button" onClick={() => handleSwitchView("login")} className="w-full text-slate-500 font-bold hover:text-slate-800 py-2 rounded-xl transition-colors text-sm">
                      Back to Login
                    </button>
                  </motion.form>
                )}

              </AnimatePresence>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
