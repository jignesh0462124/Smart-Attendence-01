// src/SuperAdmin/super.js
import { supabase } from "../../supabase/supabase.js";

/* =========================
   SUPERADMIN AUTH LAYER
   ========================= */

// Login only if user exists in superadmins table
export async function superAdminLogin(email, password) {
  // 1. Auth login
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message || "Invalid login credentials");
  }

  const user = data.user;

  // 2. Check superadmins table
  const { data: superadmin, error: saError } = await supabase
    .from("superadmins")
    .select("*")
    .eq("auth_uid", user.id)
    .single();

  if (saError || !superadmin) {
    // Not a registered superadmin → sign out immediately
    await supabase.auth.signOut();
    throw new Error("Access denied. You are not a SuperAdmin.");
  }

  // 3. Update last_login
  await supabase
    .from("superadmins")
    .update({ last_login: new Date().toISOString() })
    .eq("auth_uid", user.id);

  return superadmin; // verified superadmin row
}

// Get current logged-in superadmin row (or null)
export async function getCurrentSuperAdmin() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  const authUser = data.user;
  if (!authUser) return null;

  const { data: superadmin, error: saError } = await supabase
    .from("superadmins")
    .select("*")
    .eq("auth_uid", authUser.id)
    .single();

  if (saError || !superadmin) return null;
  return superadmin;
}

// Generic current auth user (if you still need it anywhere)
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
}

// Logout helper
export async function superAdminLogout() {
  await supabase.auth.signOut();
}

/* =========================
   ADMIN MANAGEMENT HELPERS
   ========================= */

// Generate a human readable unique admin ID, e.g. ADM-349281
function generateAdminUid() {
  const random = Math.floor(100000 + Math.random() * 900000); // 6 digits
  return `ADM-${random}`;
}

// Fetch all admins
export async function getAdmins() {
  const { data, error } = await supabase
    .from("admins")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Add new admin:
 * 1) Create Supabase Auth user (email + password)
 * 2) Restore SuperAdmin session
 * 3) Insert into admins table with generated admin_uid
 *
 * @param {{ email: string, name: string, phone?: string, password: string }} param0
 */
export async function addAdmin({ email, name, phone, password }) {
  // Save current SuperAdmin session so we can restore it after signUp
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();
  if (sessionError) {
    console.error("Error getting current session:", sessionError);
    throw new Error("Failed to read current session.");
  }

  const originalSession = sessionData?.session || null;

  // 1) Create auth user for this admin (login credentials)
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpError) {
    console.error("Error creating auth user for admin:", signUpError);
    throw new Error(
      signUpError.message || "Failed to create admin auth account."
    );
  }

  const newAdminAuthUser = signUpData.user;

  // 2) Restore original SuperAdmin session (so dashboard stays logged in)
  if (originalSession) {
    const { error: restoreError } = await supabase.auth.setSession({
      access_token: originalSession.access_token,
      refresh_token: originalSession.refresh_token,
    });

    if (restoreError) {
      console.error("Error restoring SuperAdmin session:", restoreError);
      // not fatal for admin creation, so don't throw here
    }
  } else {
    // No original session (very unlikely in this flow), nothing to restore
  }

  // 3) Create admin record in admins table
  const admin_uid = generateAdminUid();

  const { data: adminRow, error: adminError } = await supabase
    .from("admins")
    .insert([
      {
        admin_uid,
        email,
        name,
        phone,
        // If in future you add auth_uid to admins table, you can include:
        // auth_uid: newAdminAuthUser.id,
      },
    ])
    .select()
    .single();

  if (adminError) {
    console.error("Error creating admin row:", adminError);
    throw new Error(adminError.message || "Failed to create admin record.");
  }

  return { admin: adminRow, authUser: newAdminAuthUser };
}

// Update existing admin (gmail / name / phone are dynamic)
export async function updateAdmin(id, { email, name, phone }) {
  const { data, error } = await supabase
    .from("admins")
    .update({ email, name, phone })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating admin:", error);
    throw new Error(error.message || "Failed to update admin.");
  }

  return data;
}
