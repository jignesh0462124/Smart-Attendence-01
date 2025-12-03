import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabase/supabase.js";

export function useAuthGuard({ redirectTo = "/auth", redirectIfFound } = {}) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function checkActiveSession() {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (!isMounted) return;

        if (sessionError) {
          throw sessionError;
        }

        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (!currentUser) {
          if (redirectTo) navigate(redirectTo, { replace: true });
        } else if (redirectIfFound) {
          navigate(redirectIfFound, { replace: true });
        }
      } catch (err) {
        if (!isMounted) return;
        setError(err);
        if (redirectTo) navigate(redirectTo, { replace: true });
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;

      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setLoading(false);

      if (!currentUser) {
        if (redirectTo) navigate(redirectTo, { replace: true });
      } else if (redirectIfFound) {
        navigate(redirectIfFound, { replace: true });
      }
    });

    checkActiveSession();

    return () => {
      isMounted = false;
      subscription?.unsubscribe?.();
    };
  }, [navigate, redirectIfFound, redirectTo]);

  return { user, loading, error };
}
