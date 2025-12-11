// src/Authentication/Signup.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase/supabase.js";
import { useNavigate, useLocation } from "react-router-dom";
import img1 from "./img1/img1.png";

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();

  // Views: 'login' | 'signup' | 'reset' | 'updatePassword'
  const [view, setView] = useState("login");

  // Login fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginAdminId, setLoginAdminId] = useState("");

  // Signup fields
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");
  const [signupAdminId, setSignupAdminId] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Reset / update password
  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

  // UI state
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

  // If you want email links to redirect to this component, set this EXACT URL in Supabase:
  // Auth -> Settings -> Redirect URLs (e.g. http://localhost:5173/signup)
  // Leave null to avoid passing redirect on client calls.
  const EMAIL_REDIRECT = null;

  // On mount: handle any session tokens in URL (email confirmation links)
  useEffect(() => {
    let mounted = true;
    // 1) Parse possible supabase session tokens from URL (confirmation / oauth)
    async function handleSessionFromUrl() {
      try {
        // getSessionFromUrl will read URL params and store session if present
        const { data, error } = await supabase.auth.getSessionFromUrl({ storeSession: true });
        console.log("getSessionFromUrl returned:", { data, error });

        // If Supabase created a session from the URL (typical on confirm link),
        // we will sign the user out (so they must explicitly login),
        // show a confirmation message, and show the login tab.
        if (error) {
          // Non-fatal: show a message but continue. Some providers may not set session.
          console.warn("getSessionFromUrl error:", error);
        }

        if (data?.session) {
          // There is an active session created by clicking confirmation — sign out to force explicit login
          await supabase.auth.signOut();
          if (!mounted) return;
          setView("login");
          setSuccessMsg("Email confirmed. Please sign in using your credentials.");
          // Remove tokens from URL for cleanliness
          try {
            const cleanPath = window.location.pathname;
            window.history.replaceState({}, document.title, cleanPath);
          } catch (e) {
            /* ignore */
          }
          return;
        }

        // If there was no session but the provider redirected with a marker, we handle that below via query param.
      } catch (e) {
        console.error("Error while handling session from URL:", e);
      }
    }

    handleSessionFromUrl();

    // 2) Also check for a query param like ?confirmed=1 (useful if you configured redirect manually)
    const query = new URLSearchParams(location.search);
    if (query.get("confirmed") === "1") {
      setView("login");
      setSuccessMsg("Email confirmed. Please sign in using your credentials.");
      // remove query param from URL for cleanliness
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  // Old initial session logging (safe to keep)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session:", session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth event:", event, session);
      if (event === "PASSWORD_RECOVERY") {
        resetMessages();
        setView("updatePassword");
      } else if (event === "SIGNED_IN") {
        if (view !== "updatePassword") {
          // If you want a signed-in user to go to employee-dashboard, do so.
          navigate("/employee-dashboard", { replace: true });
        }
      }
    });

    return () => {
      try {
        subscription?.unsubscribe?.();
      } catch (e) {
        console.warn("Failed to unsubscribe auth listener", e);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  // ========== Handlers ==========

  // LOGIN
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    resetMessages();

    if (!loginEmail || !loginPassword || !loginAdminId) {
      setErrorMsg("Please enter email, password, and Admin ID.");
      return;
    }

    const email = loginEmail.trim().toLowerCase();
    const adminId = loginAdminId.trim().toUpperCase();

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: loginPassword,
      });

      console.log("signInWithPassword response:", { data, error });

      if (error) {
        setErrorMsg(error.message || "Login failed. Please try again.");
        return;
      }

      const authUser = data.user;
      const userAdminUid = authUser?.user_metadata?.admin_uid;

      if (!userAdminUid) {
        await supabase.auth.signOut();
        setErrorMsg("Your account is not linked to an Admin ID. Contact your Admin.");
        return;
      }

      if (userAdminUid.toUpperCase() !== adminId) {
        await supabase.auth.signOut();
        setErrorMsg("Invalid Admin ID for this account.");
        return;
      }

      setSuccessMsg("Login successful — redirecting to dashboard.");
      navigate("/employee-dashboard", { replace: true });
    } catch (err) {
      console.error("Login thrown error:", err);
      setErrorMsg("Login failed. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  // SIGNUP
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    resetMessages();

    if (
      !signupName ||
      !signupEmail ||
      !signupPassword ||
      !signupConfirm ||
      !signupAdminId
    ) {
      setErrorMsg("Please fill in all fields, including Admin ID.");
      return;
    }
    if (signupPassword !== signupConfirm) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    if (signupPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }
    if (!acceptTerms) {
      setErrorMsg("Please accept the terms to continue.");
      return;
    }

    const email = signupEmail.trim().toLowerCase();
    const adminId = signupAdminId.trim().toUpperCase();
    const fullName = signupName.trim();

    try {
      setLoading(true);

      // Optional client-side admin check. If RLS prevents it, do this server-side.
      const { data: adminCheck, error: adminError } = await supabase
        .from("admins")
        .select("admin_uid")
        .eq("admin_uid", adminId)
        .maybeSingle();

      if (adminError) {
        console.warn("Admin lookup failed:", adminError);
        setErrorMsg("Could not verify Admin ID. Try again or contact Admin.");
        setLoading(false);
        return;
      }
      if (!adminCheck) {
        setErrorMsg("Admin ID not found. Ask your Admin for the correct ID.");
        setLoading(false);
        return;
      }

      // Build options for signUp: pass emailRedirectTo only if you configured it in Auth settings
      const options = {};
      if (EMAIL_REDIRECT) options.emailRedirectTo = EMAIL_REDIRECT;

      const { data, error } = await supabase.auth.signUp(
        { email, password: signupPassword },
        {
          ...options,
          data: {
            full_name: fullName,
            admin_uid: adminId,
          },
        }
      );

      console.log("signUp response:", { data, error });

      if (error) {
        setErrorMsg(error.message || "Signup failed. See console for details.");
        return;
      }

      // If the signup created a session (auto-confirm), navigate straight to dashboard;
      // otherwise show helpful instruction and show the Login tab.
      if (data?.user) {
        setSuccessMsg("Signup successful — you are now signed in.");
        navigate("/employee-dashboard", { replace: true });
      } else {
        // Most common case: confirmation email required and user must verify email
        // If you configured EMAIL_REDIRECT in Supabase templates to point to /signup?confirmed=1
        // then the user will land back here with that query param and will see the message.
        setView("login");
        setSuccessMsg("Signup complete. Check your inbox for a confirmation email, then login.");
        // Optionally pre-fill login email & admin id
        setLoginEmail(email);
        setLoginAdminId(adminId);
      }
    } catch (err) {
      console.error("Signup thrown error:", err);
      setErrorMsg("Signup failed. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  // RESET (send reset link)
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    resetMessages();

    if (!resetEmail) {
      setErrorMsg("Please enter your email to reset password.");
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.resetPasswordForEmail(
        resetEmail.trim().toLowerCase(),
        {
          redirectTo: EMAIL_REDIRECT || undefined,
        }
      );

      console.log("resetPasswordForEmail response:", { data, error });

      if (error) {
        setErrorMsg(error.message || "Could not send reset link.");
        return;
      }

      setSuccessMsg("If this email exists, a reset link was sent. Check your email.");
      setView("login");
    } catch (err) {
      console.error("Reset thrown error:", err);
      setErrorMsg("Reset failed. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  // UPDATE password (after recovery flow)
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
    if (newPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      console.log("updateUser response:", { data, error });
      if (error) {
        setErrorMsg(error.message || "Could not update password.");
        return;
      }

      setSuccessMsg("Password updated. Please login with your new password.");
      setNewPassword("");
      setNewPasswordConfirm("");
      setView("login");
    } catch (err) {
      console.error("updateUser thrown error:", err);
      setErrorMsg("Could not update password. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  const isActiveTab = (tab) =>
    view === tab ? "bg-blue-600 text-white shadow-sm" : "bg-transparent text-slate-600 hover:bg-slate-100";

  // ========== Render UI (unchanged structure) ==========
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
              Streamline your attendance, manage leaves efficiently, and boost team productivity with our all-in-one workforce solution.
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
            {/* Tabs */}
            <div className="flex justify-center mb-4">
              <div className="inline-flex rounded-full bg-slate-100 p-1">
                <button type="button" onClick={() => handleSwitchView("login")} className={"px-4 py-2 text-sm font-medium rounded-full transition " + isActiveTab("login")}>Login</button>
                <button type="button" onClick={() => handleSwitchView("signup")} className={"px-4 py-2 text-sm font-medium rounded-full transition " + isActiveTab("signup")}>Signup</button>
                <button type="button" onClick={() => handleSwitchView("reset")} className={"px-4 py-2 text-sm font-medium rounded-full transition " + isActiveTab("reset")}>Reset Password</button>
              </div>
            </div>

            {/* Headings */}
            {view === "login" && (
              <div className="text-center">
                <h2 className="text-xl font-semibold text-slate-900">Employee Login</h2>
                <p className="text-sm text-slate-500 mt-1">Enter your details and Admin ID to access your dashboard.</p>
              </div>
            )}

            {view === "signup" && (
              <div className="text-center">
                <h2 className="text-xl font-semibold text-slate-900">Create your SmartAttend account</h2>
                <p className="text-sm text-slate-500 mt-1">Join your team and link yourself to your Admin via Admin ID.</p>
              </div>
            )}

            {view === "reset" && (
              <div className="text-center">
                <h2 className="text-xl font-semibold text-slate-900">Reset your password</h2>
                <p className="text-sm text-slate-500 mt-1">Enter your email and we'll send you a reset link.</p>
              </div>
            )}

            {view === "updatePassword" && (
              <div className="text-center">
                <h2 className="text-xl font-semibold text-slate-900">Set a new password</h2>
                <p className="text-sm text-slate-500 mt-1">Enter a new password for your SmartAttend account.</p>
              </div>
            )}

            {/* Messages */}
            {(errorMsg || successMsg) && (
              <div className="text-sm">
                {errorMsg && <div className="mb-2 rounded-lg bg-red-50 text-red-600 px-3 py-2">{errorMsg}</div>}
                {successMsg && <div className="rounded-lg bg-emerald-50 text-emerald-700 px-3 py-2">{successMsg}</div>}
              </div>
            )}

            {/* FORMS */}
            {view === "login" && (
              <form onSubmit={handleLoginSubmit} className="space-y-4 mt-2">
                <div className="space-y-1">
                  <label htmlFor="loginEmail" className="text-sm font-medium text-slate-700">Email Address</label>
                  <input id="loginEmail" type="email" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="john@company.com" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
                </div>

                <div className="space-y-1">
                  <label htmlFor="loginPassword" className="text-sm font-medium text-slate-700">Password</label>
                  <input id="loginPassword" type="password" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="••••••••" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                </div>

                <div className="space-y-1">
                  <label htmlFor="loginAdminId" className="text-sm font-medium text-slate-700">Admin ID <span className="text-xs text-slate-400 ml-1">(e.g. ADM-000001)</span></label>
                  <input id="loginAdminId" type="text" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="ADM-000001" value={loginAdminId} onChange={(e) => setLoginAdminId(e.target.value)} />
                </div>

                <div className="flex items-center justify-between text-xs mt-1">
                  <div className="flex items-center gap-2">
                    <input id="login-remember" type="checkbox" className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    <label htmlFor="login-remember" className="text-slate-600">Keep me signed in</label>
                  </div>
                  <button type="button" onClick={() => handleSwitchView("reset")} className="text-blue-600 font-medium hover:underline">Forgot password?</button>
                </div>

                <button type="submit" disabled={loading} className="w-full mt-4 rounded-full bg-blue-600 text-white text-sm font-semibold py-2.5 hover:bg-blue-700 transition disabled:opacity-60">{loading ? "Please wait..." : "Login"}</button>
              </form>
            )}

            {view === "signup" && (
              <form onSubmit={handleSignupSubmit} className="space-y-4 mt-2">
                <div className="space-y-1">
                  <label htmlFor="signupName" className="text-sm font-medium text-slate-700">Full Name</label>
                  <input id="signupName" type="text" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="John Doe" value={signupName} onChange={(e) => setSignupName(e.target.value)} />
                </div>

                <div className="space-y-1">
                  <label htmlFor="signupEmail" className="text-sm font-medium text-slate-700">Work Email</label>
                  <input id="signupEmail" type="email" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="you@company.com" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} />
                </div>

                <div className="space-y-1">
                  <label htmlFor="signupPassword" className="text-sm font-medium text-slate-700">Password</label>
                  <input id="signupPassword" type="password" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Create a strong password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} />
                </div>

                <div className="space-y-1">
                  <label htmlFor="signupConfirm" className="text-sm font-medium text-slate-700">Confirm Password</label>
                  <input id="signupConfirm" type="password" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Re-enter password" value={signupConfirm} onChange={(e) => setSignupConfirm(e.target.value)} />
                </div>

                <div className="space-y-1">
                  <label htmlFor="signupAdminId" className="text-sm font-medium text-slate-700">Admin ID <span className="text-xs text-slate-400 ml-1">(Ask your Admin, e.g. ADM-000001)</span></label>
                  <input id="signupAdminId" type="text" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="ADM-000001" value={signupAdminId} onChange={(e) => setSignupAdminId(e.target.value)} />
                </div>

                <div className="flex items-start gap-2 text-xs mt-1">
                  <input id="signup-terms" type="checkbox" className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} />
                  <label htmlFor="signup-terms" className="text-slate-600">I agree to the <span className="text-blue-600 font-medium">Terms, Privacy Policy</span> and <span className="text-blue-600 font-medium">Code of Conduct.</span></label>
                </div>

                <button type="submit" disabled={loading} className="w-full mt-4 rounded-full bg-blue-600 text-white text-sm font-semibold py-2.5 hover:bg-blue-700 transition disabled:opacity-60">{loading ? "Creating account..." : "Create account"}</button>

                <p className="text-xs text-slate-500 text-center mt-2">Already have an account? <button type="button" onClick={() => handleSwitchView("login")} className="text-blue-600 font-medium hover:underline">Login here</button>.</p>
              </form>
            )}

            {view === "reset" && (
              <form onSubmit={handleResetSubmit} className="space-y-4 mt-2">
                <div className="space-y-1">
                  <label htmlFor="resetEmail" className="text-sm font-medium text-slate-700">Email Address</label>
                  <input id="resetEmail" type="email" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="you@company.com" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} />
                </div>

                <button type="submit" disabled={loading} className="w-full mt-4 rounded-full bg-blue-600 text-white text-sm font-semibold py-2.5 hover:bg-blue-700 transition disabled:opacity-60">{loading ? "Sending link..." : "Send reset link"}</button>

                <p className="text-xs text-slate-500 text-center mt-2">Remember your password? <button type="button" onClick={() => handleSwitchView("login")} className="text-blue-600 font-medium hover:underline">Back to Login</button>.</p>
              </form>
            )}

            {view === "updatePassword" && (
              <form onSubmit={handleUpdatePasswordSubmit} className="space-y-4 mt-2">
                <div className="space-y-1">
                  <label htmlFor="newPassword" className="text-sm font-medium text-slate-700">New Password</label>
                  <input id="newPassword" type="password" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </div>

                <div className="space-y-1">
                  <label htmlFor="newPasswordConfirm" className="text-sm font-medium text-slate-700">Confirm New Password</label>
                  <input id="newPasswordConfirm" type="password" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Re-enter new password" value={newPasswordConfirm} onChange={(e) => setNewPasswordConfirm(e.target.value)} />
                </div>

                <button type="submit" disabled={loading} className="w-full mt-4 rounded-full bg-blue-600 text-white text-sm font-semibold py-2.5 hover:bg-blue-700 transition disabled:opacity-60">{loading ? "Updating..." : "Update Password"}</button>

                <p className="text-xs text-slate-500 text-center mt-2">Changed your mind? <button type="button" onClick={() => handleSwitchView("login")} className="text-blue-600 font-medium hover:underline">Back to Login</button>.</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
