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
    name: "",
    email: "",
    initials: FALLBACK_INITIALS,
  });
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadUser() {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error) throw error;

        if (isMounted) {
          setProfile(formatProfile(user));
        }
      } catch (err) {
        console.error("Failed to load user profile:", err);
        if (isMounted) {
          setProfile({
            name: "",
            email: "",
            initials: FALLBACK_INITIALS,
          });
        }
      } finally {
        if (isMounted) setLoadingProfile(false);
      }
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      setProfile(formatProfile(session?.user));
      setLoadingProfile(false);
    });

    loadUser();

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  return { profile, loadingProfile };
}

function formatProfile(user) {
  if (!user) {
    return { name: "", email: "", initials: FALLBACK_INITIALS };
  }

  const fullName = user.user_metadata?.full_name?.trim();
  const email = user.email || "";
  const displayName = fullName || email || "Guest";

  return {
    name: displayName,
    email,
    initials: deriveInitials(displayName),
  };
}
