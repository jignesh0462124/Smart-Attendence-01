// src/Authentication/Admin.js
import { supabase } from "../../supabase/supabase.js";

/**
 * Sign in an admin:
 * 1) Authenticate via Supabase Auth (email/password)
 * 2) Verify that (email + admin_uid) exists in public.admins
 * 3) Return { user, session, admin }
 */
export async function signInAdmin(email, password, adminUid) {
  if (!email || !password || !adminUid) {
    throw new Error("Please enter email, password and Admin ID.");
  }

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedAdminUid = adminUid.trim().toUpperCase();

  console.log("signInAdmin() - inputs:", {
    email: normalizedEmail,
    adminUid: normalizedAdminUid,
    passwordLen: password.length,
  });

  // 1) authenticate via Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: normalizedEmail,
    password,
  });

  if (authError) {
    console.error("signInAdmin - auth error:", authError);
    // Provide UI-friendly message
    const fallback = authError.message || "Invalid email or password.";
    throw new Error(fallback);
  }

  const user = authData?.user ?? null;
  const session = authData?.session ?? null;

  if (!user || !session) {
    // Defensive: unexpected auth response
    console.error("signInAdmin - missing user/session from auth:", authData);
    throw new Error("Authentication failed. No active session.");
  }

  // 2) Verify admin row in the database
  const { data: adminRow, error: adminError } = await supabase
    .from("admins")
    .select("id, auth_uid, admin_uid, email, name, phone, is_active, created_at, updated_at")
    .eq("email", normalizedEmail)
    .eq("admin_uid", normalizedAdminUid)
    .maybeSingle();

  if (adminError) {
    console.error("signInAdmin - admin lookup error:", adminError);
    // sign out the authenticated session for safety
    await supabase.auth.signOut();
    throw new Error("Failed to verify admin account. Please try again.");
  }

  if (!adminRow) {
    // Not found — sign out and deny access
    await supabase.auth.signOut();
    throw new Error("Access denied: Admin account not found or Admin ID does not match.");
  }

  if (!adminRow.is_active) {
    await supabase.auth.signOut();
    throw new Error("Access denied: Admin account is deactivated.");
  }

  // Optionally update last-login in admin row (non-blocking)
  try {
    await supabase
      .from("admins")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", adminRow.id);
  } catch (e) {
    console.warn("signInAdmin - failed to update admin updated_at:", e?.message || e);
  }

  console.log("signInAdmin - success for admin:", adminRow.admin_uid);

  return { user, session, admin: adminRow };
}

/**
 * Get currently logged-in admin (returns { user, admin } or null)
 */
export async function getCurrentAdmin() {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) {
    console.error("getCurrentAdmin - auth.getUser error:", userError);
    throw userError;
  }

  const user = userData?.user ?? null;
  if (!user) return null;

  const normalizedEmail = (user.email || "").trim().toLowerCase();

  const { data: adminRow, error: adminError } = await supabase
    .from("admins")
    .select("id, auth_uid, admin_uid, email, name, phone, is_active, created_at, updated_at")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (adminError) {
    console.warn("getCurrentAdmin - admin lookup error:", adminError);
    return null;
  }

  if (!adminRow) return null;
  if (!adminRow.is_active) return null;

  return { user, admin: adminRow };
}

/**
 * Sign out admin
 */
export async function signOutAdmin() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("signOutAdmin error:", error);
    throw error;
  }
}
