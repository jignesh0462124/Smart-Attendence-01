// src/Authentication/Signup.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase/supabase.js";
import { useNavigate } from "react-router-dom";
import img1 from "./img1/img1.png";

export default function Signup() {
  // Router navigation
  const navigate = useNavigate();

  // 'login' | 'signup' | 'reset' | 'updatePassword'
  const [view, setView] = useState("login");

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Reset password (send email) state
  const [resetEmail, setResetEmail] = useState("");

  // New password (after clicking email link) state
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

  // Shared UI state
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const resetMessages = () => {
    setErrorMsg("");
    setSuccessMsg("");
  };

  const handleSwitchView = (newView) => {
    if (loading) return;
    resetMessages();
    setView(newView);
  };

  // ✅ CRITICAL FIX: Handle Auth State Changes & Redirects
  useEffect(() => {
    // Check initial session (in case user clicked email link and page just loaded)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // If there is a session, wait a moment to see if it's a password recovery
        // If not recovery, it's a login/signup verification -> go to dashboard
        // We handle the specific redirect in onAuthStateChange below
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth Event:", event);

      if (event === "PASSWORD_RECOVERY") {
        resetMessages();
        setView("updatePassword");
      } 
      else if (event === "SIGNED_IN") {
        // ✅ If user clicked "Confirm Email", they are now Signed In.
        // We check if the view is NOT updatePassword (to avoid redirecting during reset flow)
        if (view !== "updatePassword") {
          console.log("User signed in/verified, redirecting...");
          navigate("/employee-dashboard");
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, navigate]);

  // ---------- Supabase handlers ----------

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    resetMessages();

    if (!loginEmail || !loginPassword) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) {
        setErrorMsg(error.message || "Login failed. Please try again.");
        return;
      }

      console.log("Login success:", data);
      setSuccessMsg("Logged in successfully.");
      
      // Navigation is handled by onAuthStateChange, but we can double ensure here:
      navigate("/employee-dashboard");
    } catch (err) {
      console.error(err);
      setErrorMsg("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
      setErrorMsg("Please accept the terms to continue.");
      return;
    }

    try {
      setLoading(true);

      // ✅ CRITICAL FIX: emailRedirectTo
      // We explicitly tell Supabase to send the user back to THIS page (not Landing)
      // window.location.origin is "http://localhost:5173"
      // window.location.pathname is "/signup" (or wherever this is mounted)
      const redirectUrl = `${window.location.origin}${window.location.pathname}`;

      const { data, error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          data: {
            full_name: signupName,
          },
          // This ensures they come back here, not to the landing page
          emailRedirectTo: redirectUrl, 
        },
      });

      if (error) {
        setErrorMsg(error.message || "Signup failed. Please try again.");
        return;
      }

      console.log("Signup success:", data);
      setSuccessMsg(
        "Account created! Please check your email to verify your account."
      );

      // After signup, we can show a success state or switch to login
      setView("login");
      setLoginEmail(signupEmail); 
    } catch (err) {
      console.error(err);
      setErrorMsg("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Send reset email
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    resetMessages();

    if (!resetEmail) {
      setErrorMsg("Please enter your email to reset password.");
      return;
    }

    try {
      setLoading(true);

      // ✅ CRITICAL FIX: ensure reset comes back here too
      const redirectUrl = `${window.location.origin}${window.location.pathname}`;

      const { data, error } = await supabase.auth.resetPasswordForEmail(
        resetEmail,
        { redirectTo: redirectUrl }
      );

      if (error) {
        setErrorMsg(error.message || "Could not send reset link.");
        return;
      }

      console.log("Reset email sent:", data);
      setSuccessMsg(
        "If this email exists, a reset link has been sent. Open your email and use the link to set a new password."
      );
    } catch (err) {
      console.error(err);
      setErrorMsg("Could not send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Update password after user comes from email link
  const handleUpdatePasswordSubmit = async (e) => {
    e.preventDefault();
    resetMessages();

    if (!newPassword || !newPasswordConfirm) {
      setErrorMsg("Please fill both password fields.");
      return;
    }
    if (newPassword !== newPasswordConfirm) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        setErrorMsg(error.message || "Could not update password.");
        return;
      }

      console.log("Password updated:", data);
      setSuccessMsg(
        "Password updated successfully. Please login with your new password."
      );

      setNewPassword("");
      setNewPasswordConfirm("");

      // Go back to LOGIN view
      setView("login");
    } catch (err) {
      console.error(err);
      setErrorMsg("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ---------- UI helpers ----------

  const isActiveTab = (tab) =>
    view === tab
      ? "bg-blue-600 text-white shadow-sm"
      : "bg-transparent text-slate-600 hover:bg-slate-100";

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-5xl bg-white rounded-[32px] shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* LEFT PANEL */}
        <div className="bg-[#0f5df4] text-white p-10 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
              Welcome Back to
              <br />
              SmartAttend
            </h1>
            <p className="text-base md:text-lg text-blue-100 leading-relaxed">
              Streamline your attendance, manage leaves efficiently, and boost
              team productivity with our all-in-one workforce solution.
            </p>
          </div>

          <div className="mt-10">
            <div className="bg-[#f5f7ff] rounded-3xl p-6 flex items-center justify-center">
              <img src={img1} alt="SmartAttend" className="w-full h-auto" />
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="bg-white p-8 md:p-10 flex flex-col">
          <div className="flex flex-col gap-6">
            {/* Tabs (for main 3 views only) */}
            <div className="flex justify-center mb-4">
              <div className="inline-flex rounded-full bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => handleSwitchView("login")}
                  className={
                    "px-4 py-2 text-sm font-medium rounded-full transition " +
                    isActiveTab("login")
                  }
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchView("signup")}
                  className={
                    "px-4 py-2 text-sm font-medium rounded-full transition " +
                    isActiveTab("signup")
                  }
                >
                  Signup
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchView("reset")}
                  className={
                    "px-4 py-2 text-sm font-medium rounded-full transition " +
                    isActiveTab("reset")
                  }
                >
                  Reset Password
                </button>
              </div>
            </div>

            {/* Headings */}
            {view === "login" && (
              <div className="text-center">
                <h2 className="text-xl font-semibold text-slate-900">
                  Sign In
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Enter your details to access your dashboard.
                </p>
              </div>
            )}

            {view === "signup" && (
              <div className="text-center">
                <h2 className="text-xl font-semibold text-slate-900">
                  Create your SmartAttend account
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Join your team and start managing attendance smarter.
                </p>
              </div>
            )}

            {view === "reset" && (
              <div className="text-center">
                <h2 className="text-xl font-semibold text-slate-900">
                  Reset your password
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Enter your email and we&apos;ll send you a reset link.
                </p>
              </div>
            )}

            {view === "updatePassword" && (
              <div className="text-center">
                <h2 className="text-xl font-semibold text-slate-900">
                  Set a new password
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Enter a new password for your SmartAttend account.
                </p>
              </div>
            )}

            {/* Messages */}
            {(errorMsg || successMsg) && (
              <div className="text-sm">
                {errorMsg && (
                  <div className="mb-2 rounded-lg bg-red-50 text-red-600 px-3 py-2">
                    {errorMsg}
                  </div>
                )}
                {successMsg && (
                  <div className="rounded-lg bg-emerald-50 text-emerald-700 px-3 py-2">
                    {successMsg}
                  </div>
                )}
              </div>
            )}

            {/* FORMS */}
            {view === "login" && (
              <form onSubmit={handleLoginSubmit} className="space-y-4 mt-2">
                <div className="space-y-1">
                  <label
                    htmlFor="loginEmail"
                    className="text-sm font-medium text-slate-700"
                  >
                    Email Address
                  </label>
                  <input
                    id="loginEmail"
                    type="email"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="john@company.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="loginPassword"
                    className="text-sm font-medium text-slate-700"
                  >
                    Password
                  </label>
                  <input
                    id="loginPassword"
                    type="password"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-between text-xs mt-1">
                  <div className="flex items-center gap-2">
                    <input
                      id="login-remember"
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="login-remember" className="text-slate-600">
                      Keep me signed in
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSwitchView("reset")}
                    className="text-blue-600 font-medium hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-4 rounded-full bg-blue-600 text-white text-sm font-semibold py-2.5 hover:bg-blue-700 transition disabled:opacity-60"
                >
                  {loading ? "Please wait..." : "Login"}
                </button>
              </form>
            )}

            {view === "signup" && (
              <form onSubmit={handleSignupSubmit} className="space-y-4 mt-2">
                <div className="space-y-1">
                  <label
                    htmlFor="signupName"
                    className="text-sm font-medium text-slate-700"
                  >
                    Full Name
                  </label>
                  <input
                    id="signupName"
                    type="text"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John Doe"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="signupEmail"
                    className="text-sm font-medium text-slate-700"
                  >
                    Work Email
                  </label>
                  <input
                    id="signupEmail"
                    type="email"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="you@company.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="signupPassword"
                    className="text-sm font-medium text-slate-700"
                  >
                    Password
                  </label>
                  <input
                    id="signupPassword"
                    type="password"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Create a strong password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="signupConfirm"
                    className="text-sm font-medium text-slate-700"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="signupConfirm"
                    type="password"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Re-enter password"
                    value={signupConfirm}
                    onChange={(e) => setSignupConfirm(e.target.value)}
                  />
                </div>

                <div className="flex items-start gap-2 text-xs mt-1">
                  <input
                    id="signup-terms"
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                  />
                  <label htmlFor="signup-terms" className="text-slate-600">
                    I agree to the{" "}
                    <span className="text-blue-600 font-medium">
                      Terms, Privacy Policy
                    </span>{" "}
                    and{" "}
                    <span className="text-blue-600 font-medium">
                      Code of Conduct.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-4 rounded-full bg-blue-600 text-white text-sm font-semibold py-2.5 hover:bg-blue-700 transition disabled:opacity-60"
                >
                  {loading ? "Creating account..." : "Create account"}
                </button>

                <p className="text-xs text-slate-500 text-center mt-2">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => handleSwitchView("login")}
                    className="text-blue-600 font-medium hover:underline"
                  >
                    Login here
                  </button>
                  .
                </p>
              </form>
            )}

            {view === "reset" && (
              <form onSubmit={handleResetSubmit} className="space-y-4 mt-2">
                <div className="space-y-1">
                  <label
                    htmlFor="resetEmail"
                    className="text-sm font-medium text-slate-700"
                  >
                    Email Address
                  </label>
                  <input
                    id="resetEmail"
                    type="email"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="you@company.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-4 rounded-full bg-blue-600 text-white text-sm font-semibold py-2.5 hover:bg-blue-700 transition disabled:opacity-60"
                >
                  {loading ? "Sending link..." : "Send reset link"}
                </button>

                <p className="text-xs text-slate-500 text-center mt-2">
                  Remember your password?{" "}
                  <button
                    type="button"
                    onClick={() => handleSwitchView("login")}
                    className="text-blue-600 font-medium hover:underline"
                  >
                    Back to Login
                  </button>
                  .
                </p>
              </form>
            )}

            {view === "updatePassword" && (
              <form
                onSubmit={handleUpdatePasswordSubmit}
                className="space-y-4 mt-2"
              >
                <div className="space-y-1">
                  <label
                    htmlFor="newPassword"
                    className="text-sm font-medium text-slate-700"
                  >
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="newPasswordConfirm"
                    className="text-sm font-medium text-slate-700"
                  >
                    Confirm New Password
                  </label>
                  <input
                    id="newPasswordConfirm"
                    type="password"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Re-enter new password"
                    value={newPasswordConfirm}
                    onChange={(e) => setNewPasswordConfirm(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-4 rounded-full bg-blue-600 text-white text-sm font-semibold py-2.5 hover:bg-blue-700 transition disabled:opacity-60"
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>

                <p className="text-xs text-slate-500 text-center mt-2">
                  Changed your mind?{" "}
                  <button
                    type="button"
                    onClick={() => handleSwitchView("login")}
                    className="text-blue-600 font-medium hover:underline"
                  >
                    Back to Login
                  </button>
                  .
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}