// src/Authentication/Admin.js
import { supabase } from "../../supabase/supabase.js";

/**
 * Sign in an admin:
 * - Authenticates via Supabase Auth (email/password)
 * - Verifies that the email exists in public.admins
 * - Returns { user, session, admin }
 */
export async function signInAdmin(email, password) {
  // 1. Auth login
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  const { user, session } = data;

  if (!user || !session) {
    throw new Error("Authentication failed. No active session.");
  }

  // 2. Verify that this user is an Admin (by email)
  const { data: admin, error: adminError } = await supabase
    .from("admins")
    .select("id, admin_uid, email, name, phone, created_at, updated_at")
    .eq("email", email)
    .single();

  if (adminError || !admin) {
    // Important: sign out any non-admin users who logged in here
    await supabase.auth.signOut();
    throw new Error("Access denied: Admin account not found.");
  }

  return { user, session, admin };
}

/**
 * Get the current logged-in Admin + auth user
 * - Returns null if not logged in or not an admin.
 */
export async function getCurrentAdmin() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  if (!user) {
    return null;
  }

  // Match admin by email (admins.email is unique)
  const { data: admin, error: adminError } = await supabase
    .from("admins")
    .select("id, admin_uid, email, name, phone, created_at, updated_at")
    .eq("email", user.email)
    .single();

  if (adminError || !admin) {
    // Logged-in user is not an admin
    return null;
  }

  return { user, admin };
}

/**
 * Sign out the current admin (normal Supabase signOut)
 */
export async function signOutAdmin() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
