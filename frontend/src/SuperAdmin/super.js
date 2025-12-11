// src/SuperAdmin/super.js
import { supabase } from "../../supabase/supabase.js";

/* =========================
   SUPERADMIN AUTH LAYER
   ========================= */

/**
 * Sign in a SuperAdmin using email + password.
 * Verifies authenticated user's id exists in public.superadmins.auth_uid.
 * Returns: { user, session, superAdmin } on success.
 */
export async function superAdminLogin(email, password) {
  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  // 1) Authenticate using Supabase Auth (v2)
  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({ email, password });

  if (authError) {
    // Authentication failed
    throw new Error(authError.message || "Invalid login credentials.");
  }

  const user = authData?.user ?? null;
  const session = authData?.session ?? null;

  if (!user?.id) {
    // Defensive: auth succeeded but no user returned
    if (session) await supabase.auth.signOut();
    throw new Error("Authentication failed (no user returned).");
  }

  // 2) Ensure this auth user is registered as a superadmin
  const { data: superAdminRow, error: saError } = await supabase
    .from("superadmins")
    .select("*")
    .eq("auth_uid", user.id)
    .maybeSingle();

  if (saError) {
    // DB read error — sign out to be safe
    await supabase.auth.signOut();
    throw new Error(saError.message || "Failed to verify superadmin.");
  }

  if (!superAdminRow) {
    // Not a superadmin — remove session and deny access
    await supabase.auth.signOut();
    throw new Error("Access denied. This account is not a SuperAdmin.");
  }

  // 3) Update last_login (fire-and-forget; do not fail login if update errors)
  try {
    await supabase
      .from("superadmins")
      .update({ last_login: new Date().toISOString() })
      .eq("id", superAdminRow.id);
  } catch (e) {
    // ignore update errors
    console.warn("Failed to update last_login for superadmin:", e?.message || e);
  }

  return { user, session, superAdmin: superAdminRow };
}

/**
 * Return the current logged-in superadmin row or null.
 */
export async function getCurrentSuperAdmin() {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) {
    console.error("getCurrentSuperAdmin: auth.getUser error:", userError);
    throw userError;
  }

  const authUser = userData?.user;
  if (!authUser) return null;

  const { data: superAdminRow, error: saError } = await supabase
    .from("superadmins")
    .select("*")
    .eq("auth_uid", authUser.id)
    .maybeSingle();

  if (saError) {
    console.error("getCurrentSuperAdmin: DB read error:", saError);
    return null;
  }

  return superAdminRow || null;
}

/**
 * Return the currently authenticated user object (or null).
 */
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error("getCurrentUser error:", error);
    throw error;
  }
  return data?.user ?? null;
}

/**
 * Sign out current session
 */
export async function superAdminLogout() {
  await supabase.auth.signOut();
}

/* =========================
   ADMIN MANAGEMENT HELPERS
   ========================= */

/**
 * Generate a collision-free admin uid (ADM-xxxxxx).
 */
async function generateUniqueAdminUid(attempts = 6) {
  for (let i = 0; i < attempts; i++) {
    const random = Math.floor(100000 + Math.random() * 900000); // 6 digits
    const candidate = `ADM-${random}`;

    const { data: exists, error } = await supabase
      .from("admins")
      .select("id")
      .eq("admin_uid", candidate)
      .limit(1)
      .maybeSingle();

    if (error) {
      // If DB read fails, bail early
      throw new Error("Failed to generate admin UID: " + (error.message || ""));
    }

    // maybeSingle returns the row or null
    if (!exists) {
      return candidate;
    }
    // else loop and try another candidate
  }
  throw new Error("Failed to generate a unique admin UID after several attempts.");
}

/**
 * Get list of admins (most recent first)
 */
export async function getAdmins() {
  const { data, error } = await supabase
    .from("admins")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getAdmins error:", error);
    throw error;
  }
  return data ?? [];
}

/**
 * Add new admin:
 * Steps:
 *  1) Save current superadmin session
 *  2) Create Auth user for new admin (signUp)
 *  3) Restore original SuperAdmin session
 *  4) Insert row into admins table with unique admin_uid
 */
export async function addAdmin({ email, name, phone = null, password }) {
  if (!email || !name || !password) {
    throw new Error("email, name and password are required to create an admin.");
  }

  // 0) Preserve current session (so superadmin remains logged in)
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) {
    console.warn("addAdmin: failed to read current session:", sessionError);
  }
  const originalSession = sessionData?.session ?? null;

  // 1) Create auth user for new admin
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpError) {
    console.error("addAdmin: signUp error:", signUpError);
    throw new Error(signUpError.message || "Failed to create admin auth account.");
  }

  const newAdminAuthUser = signUpData?.user ?? null;

  // 2) Restore original session so superadmin stays logged in
  if (originalSession) {
    const { error: restoreError } = await supabase.auth.setSession({
      access_token: originalSession.access_token,
      refresh_token: originalSession.refresh_token,
    });
    if (restoreError) {
      console.warn("addAdmin: failed to restore SuperAdmin session:", restoreError);
    }
  }

  // 3) Insert admin row in admins table (with unique admin_uid)
  const admin_uid = await generateUniqueAdminUid();

  const insertPayload = {
    admin_uid,
    email,
    name,
  };
  if (phone) insertPayload.phone = phone;

  const { data: adminRow, error: adminError } = await supabase
    .from("admins")
    .insert([insertPayload])
    .select()
    .maybeSingle();

  if (adminError) {
    console.error("addAdmin: insert admin row error:", adminError);
    throw new Error(adminError.message || "Failed to create admin record.");
  }

  return { admin: adminRow, authUser: newAdminAuthUser };
}

/**
 * Update an existing admin row (by id)
 */
export async function updateAdmin(id, { email, name, phone }) {
  if (!id) throw new Error("updateAdmin requires admin id.");

  const payload = {};
  if (email !== undefined) payload.email = email;
  if (name !== undefined) payload.name = name;
  if (phone !== undefined) payload.phone = phone;

  const { data, error } = await supabase
    .from("admins")
    .update(payload)
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) {
    console.error("updateAdmin error:", error);
    throw new Error(error.message || "Failed to update admin.");
  }

  return data;
}
