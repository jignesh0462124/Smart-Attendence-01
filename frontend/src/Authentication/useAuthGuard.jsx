// src/hooks/useAuthGuard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabase/supabase.js";

export function useAuthGuard({ redirectTo = "/auth", redirectIfFound } = {}) {
  const navigate = useNavigate();
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

        if (!currentUser && redirectTo) {
          navigate(redirectTo, { replace: true });
        } else if (currentUser && redirectIfFound) {
          navigate(redirectIfFound, { replace: true });
        }
      } catch (err) {
        if (isMounted && redirectTo) navigate(redirectTo, { replace: true });
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setLoading(false);

      if (!currentUser && redirectTo) {
        navigate(redirectTo, { replace: true });
      }
    });

    checkActiveSession();
    return () => {
      isMounted = false;
      subscription?.unsubscribe?.();
    };
  }, [navigate, redirectTo, redirectIfFound]);

  return { user, loading };
}