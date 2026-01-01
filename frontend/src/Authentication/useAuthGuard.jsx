// src/hooks/useAuthGuard.jsx
import { useEffect, useState } from "react";
import { supabase } from "../../supabase/supabase.js";

export function useAuthGuard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function checkActiveSession() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (!isMounted) return;
        if (error) throw error;

        const currentUser = session?.user ?? null;
        setUser(currentUser);

      } catch (err) {
        // Swallow redirect intent; caller decides how to handle auth failures.
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setLoading(false);

    });

    checkActiveSession();
    return () => {
      isMounted = false;
      subscription?.unsubscribe?.();
    };
  }, []);

  return { user, loading };
}