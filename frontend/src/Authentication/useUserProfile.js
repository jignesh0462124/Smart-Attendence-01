// src/hooks/useUserProfile.js
import { useEffect, useState } from "react";
import { supabase } from "../../supabase/supabase.js";

const FALLBACK_INITIALS = "DT";

const deriveInitials = (displayName = "") => {
  if (!displayName) return FALLBACK_INITIALS;
  return (
    displayName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((chunk) => chunk[0]?.toUpperCase() ?? "")
      .join("") || FALLBACK_INITIALS
  );
};

export function useUserProfile() {
  const [profile, setProfile] = useState({
    user_id: "",
    name: "",
    email: "",
    phone_number: "",
    address: "",
    employee_id: "",
    initials: FALLBACK_INITIALS,
    profile_image: null
  });
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Helper to fetch data from public.users table based on auth.uid()
  const fetchExtendedProfile = async (user) => {
    if (!user) return null;
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.error("Error fetching table data:", error.message);
      const name = user.user_metadata?.full_name || "Guest";
      return { user_id: user.id, name: name, email: user.email, initials: deriveInitials(name) };
    }

    return {
      user_id: data.user_id,
      name: data.full_name,
      email: data.email,
      phone_number: data.phone_number || "",
      address: data.address || "",
      employee_id: data.employee_id || "N/A",
      profile_image: data.profile_image,
      initials: deriveInitials(data.full_name),
    };
  };

  const refreshProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const fullProfile = await fetchExtendedProfile(user);
      setProfile(fullProfile);
    }
  };

  useEffect(() => {
    let isMounted = true;
    async function loadUser() {
      setLoadingProfile(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user && isMounted) {
        const fullProfile = await fetchExtendedProfile(user);
        setProfile(fullProfile);
      }
      if (isMounted) setLoadingProfile(false);
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (isMounted) {
        if (session?.user) {
          const fullProfile = await fetchExtendedProfile(session.user);
          setProfile(fullProfile);
        } else {
          setProfile({ name: "", email: "", initials: FALLBACK_INITIALS });
        }
        setLoadingProfile(false);
      }
    });

    loadUser();
    return () => { isMounted = false; subscription?.unsubscribe(); };
  }, []);

  return { profile, loadingProfile, setProfile, refreshProfile };
}