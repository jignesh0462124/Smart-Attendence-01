// src/SuperAdmin/super.js
import { supabase } from "../../supabase/supabase";

/**
 * SuperAdmin auth + admin CRUD helpers
 *
 * NOTE:
 * - This file assumes you're using OPTION A (admins are real Supabase Auth users).
 * - addAdmin() will create a Supabase Auth user with signUp() and then insert an admins row
 *   that contains auth_uid (linking the two systems).
 * - Updating/deleting the auth.users record requires a server-side admin key. This client
 *   code will NOT perform destructive admin API calls (for security).
 */

/* ---------------------------
   SuperAdmin sign-in (for login page)
   --------------------------- */
export async function superAdminLogin(email, password) {
  if (!email || !password) throw new Error("Email and password required.");

  // sign in using Supabase Auth
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // bubble up friendly message
    throw new Error(error.message || "Login failed.");
  }

  const user = data.user;

  // verify user exists in superadmins table
  const { data: row, error: qErr } = await supabase
    .from("superadmins")
    .select("*")
    .eq("auth_uid", user.id)
    .maybeSingle();

  if (qErr || !row) {
    // not a superadmin — sign out and reject
    await supabase.auth.signOut();
    throw new Error("Not authorized as SuperAdmin.");
  }

  return user;
}

/* ---------------------------
   Current user helper
   --------------------------- */
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data?.user ?? null;
}

/* ---------------------------
   Admin list
   --------------------------- */
export async function getAdmins() {
  const { data, error } = await supabase
    .from("admins")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getAdmins error:", error);
    throw new Error(error.message || "Failed to fetch admins.");
  }

  return data ?? [];
}

/* ---------------------------
   Create Admin (Auth + DB)
   - Creates Supabase Auth user via signUp()
   - Inserts a row in admins table with auth_uid
   --------------------------- */
export async function addAdmin({ email, name, phone = null, password }) {
  if (!email || !name || !password) {
    throw new Error("Email, name and password are required to create an admin.");
  }

  // Normalize
  const normEmail = email.trim().toLowerCase();

  // 1) Create the Auth user (client-side signUp)
  //    Note: this creates a normal user. If you require immediate confirmed status
  //    and the project requires it, consider server-side creation with service role key.
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: normEmail,
    password,
    options: {
      // Do not send a confirmation redirect; adjust if you want email verification flow.
      emailRedirectTo: null,
    },
  });

  if (signUpError) {
    console.error("addAdmin - signUpError:", signUpError);
    throw new Error(signUpError.message || "Failed to create auth user for admin.");
  }

  const auth_uid = signUpData?.user?.id;
  if (!auth_uid) {
    // Very defensive — if signUp didn't return an id, abort
    throw new Error("Failed to retrieve auth user id after signup.");
  }

  // 2) Insert admins table row, linking auth_uid
  const payload = {
    auth_uid,
    admin_uid: undefined, // Let DB default/generator set this (if configured)
    email: normEmail,
    name,
    phone,
    password, // storing plaintext per your previous request — consider hashing in future
  };

  const { data, error } = await supabase
    .from("admins")
    .insert([payload])
    .select()
    .maybeSingle();

  if (error) {
    console.error("addAdmin - insert admin error:", error);

    // NOTE: if DB insert fails, the Auth user is already created and may be orphaned.
    // You should either:
    //  - delete the created auth user using an admin API (server-side), or
    //  - leave it and clean up manually from Supabase Dashboard.
    //
    // We will surface the DB error to the caller.
    throw new Error(error.message || "Failed to create admin record.");
  }

  return data;
}

/* ---------------------------
   Update Admin (DB only)
   - Does NOT update the linked auth.users record (requires server-side admin key)
   --------------------------- */
export async function updateAdmin(id, { email, name, phone, password }) {
  if (!id) throw new Error("updateAdmin requires admin id.");

  // build payload for allowed fields
  const payload = {};
  if (email !== undefined) payload.email = String(email).trim().toLowerCase();
  if (name !== undefined) payload.name = name;
  if (phone !== undefined) payload.phone = phone;
  if (password !== undefined) payload.password = password; // again: plaintext per request

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

/* ---------------------------
   Delete Admin (DB only)
   - Deletes admin row from admins table.
   - Does NOT delete the auth.user. Deleting auth.user requires a server-side call.
   --------------------------- */
export async function deleteAdmin(id) {
  if (!id) throw new Error("deleteAdmin requires admin id.");

  // Fetch the admin row first (returns auth_uid so you can use it if you have a server cleanup)
  const { data: rows, error: fetchErr } = await supabase
    .from("admins")
    .select("auth_uid")
    .eq("id", id)
    .maybeSingle();

  if (fetchErr) {
    console.error("deleteAdmin - fetch error:", fetchErr);
    throw new Error(fetchErr.message || "Failed to fetch admin before delete.");
  }

  const { data, error } = await supabase.from("admins").delete().eq("id", id);

  if (error) {
    console.error("deleteAdmin error:", error);
    throw new Error(error.message || "Failed to delete admin.");
  }

  // NOTE: if you want to also delete the auth user:
  // - call a server-side endpoint (Edge Function) to remove auth user by auth_uid using service_role key.
  // - do NOT embed service_role key in client code.

  return data;
}
