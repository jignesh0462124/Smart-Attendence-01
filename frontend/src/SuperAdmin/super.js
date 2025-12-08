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
  return data;
}

// Add new admin
export async function addAdmin({ email, name, phone }) {
  const admin_uid = generateAdminUid();

  const { data, error } = await supabase
    .from("admins")
    .insert([{ admin_uid, email, name, phone }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Update existing admin (gmail / name / phone are dynamic)
export async function updateAdmin(id, { email, name, phone }) {
  const { data, error } = await supabase
    .from("admins")
    .update({ email, name, phone })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
