// src/Admin/AdminAuthGuard.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase/supabase";
import { useNavigate } from "react-router-dom";

const AdminAuthGuard = ({ children }) => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        // 1) Check Supabase session
        const { data } = await supabase.auth.getSession();
        const session = data?.session;

        if (!session?.user) {
          navigate("/admin-login");
          return;
        }

        const uid = session.user.id;

        // 2) Validate admin exists in admins table
        const { data: admin, error } = await supabase
          .from("admins")
          .select("*")
          .eq("auth_uid", uid)
          .maybeSingle();

        if (error || !admin) {
          // Not an admin → logout
          await supabase.auth.signOut();
          navigate("/admin-login");
          return;
        }
      } catch (err) {
        console.error("AdminAuthGuard error:", err);
        navigate("/admin-login");
      } finally {
        setChecking(false);
      }
    };

    verifyAdmin();
  }, [navigate]);

  if (checking) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-gray-600">
        Validating Admin...
      </div>
    );
  }

  return children;
};

export default AdminAuthGuard;
