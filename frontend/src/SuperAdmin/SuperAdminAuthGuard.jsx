// src/Authentication/SuperAdminAuthGuard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabase/supabase";

export const useSuperAdminGuard = () => {
  const [loading, setLoading] = useState(true);
  const [superAdmin, setSuperAdmin] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getSession();
      const session = data?.session;

      if (error || !session?.user) {
        navigate("/super-login");
        setLoading(false);
        return;
      }

      const user = session.user;

      // Check if the user is a valid superadmin (exists in DB)
      const { data: row, error: superErr } = await supabase
        .from("superadmins")
        .select("*")
        .eq("auth_uid", user.id)
        .maybeSingle();

      if (superErr || !row) {
        // Not a superadmin
        navigate("/super-login");
        setLoading(false);
        return;
      }

      // Valid superadmin
      setSuperAdmin(user);
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  return { superAdmin, loading };
};
