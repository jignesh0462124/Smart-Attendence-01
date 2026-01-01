import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../../supabase/supabase";

const UserProfileContext = createContext();

export const UserProfileProvider = ({ children }) => {
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState(null); // 'employee' or 'admin'

    const FALLBACK_INITIALS = "JD";

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

    const fetchProfile = async (userId) => {
        const timeoutMs = 5000;
        const timeout = new Promise((resolve) => setTimeout(() => resolve({ timedOut: true }), timeoutMs));

        try {
            const request = supabase
                .from("profiles")
                .select("*")
                .eq("id", userId)
                .maybeSingle();

            const result = await Promise.race([request, timeout]);

            if (result?.timedOut) {
                console.warn("Profile fetch timed out", { userId });
                return null;
            }

            const { data, error } = result;

            if (error) {
                if (error.code !== 'PGRST116') {
                    console.warn("Profile fetch error:", error.message);
                }
                return null;
            }
            return data;
        } catch (err) {
            console.error("Profile fetch exception:", err);
            return null;
        }
    };

    const setUserData = async (session) => {
        if (!session?.user) {
            setUserProfile(null);
            setRole(null);
            return;
        }

        const profileData = await fetchProfile(session.user.id);

        if (profileData) {
            setUserProfile({
                ...profileData,
                initials: deriveInitials(profileData.full_name)
            });
            setRole(profileData.role);
        } else {
            // Fallback for users without profiles table entry
            setUserProfile({
                id: session.user.id,
                email: session.user.email,
                full_name: session.user.user_metadata?.full_name || "User",
                initials: deriveInitials(session.user.user_metadata?.full_name),
                role: "employee" // default fallback
            });
            setRole("employee");
        }
    };

    useEffect(() => {
        let mounted = true;

        const initSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) console.warn("Session init error:", error.message);
                if (mounted) {
                    await setUserData(session);
                }
            } catch (error) {
                console.error("Session init exception:", error);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        initSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (!mounted) return;

            const shouldShowLoading = _event === 'SIGNED_IN' || _event === 'SIGNED_OUT';

            if (shouldShowLoading) setLoading(true);

            if (_event === 'SIGNED_IN' || _event === 'TOKEN_REFRESHED' || _event === 'SIGNED_OUT') {
                await setUserData(session);
            }

            if (shouldShowLoading) setLoading(false);
        });

        const safety = setTimeout(() => {
            if (mounted && loading) {
                console.warn("Auth still loading; forcing ready state");
                setLoading(false);
            }
        }, 5000);

        return () => {
            mounted = false;
            subscription?.unsubscribe();
            clearTimeout(safety);
        };
    }, []);

    const refreshProfile = async () => {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        await setUserData(session);
        setLoading(false);
    };

    return (
        <UserProfileContext.Provider value={{ userProfile, loading, role, refreshProfile }}>
            {children}
        </UserProfileContext.Provider>
    );
};

export const useUserProfile = () => useContext(UserProfileContext);
