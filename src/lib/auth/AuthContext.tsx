"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { 
  createSessionPayload, 
  setClientSessionCookie, 
  getClientSessionCookie, 
  clearClientSessionCookie 
} from "@/lib/auth/session";

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  mfaEnabled: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; requiresMfa?: boolean; error?: string }>;
  register: (displayName: string, email: string, password: string) => Promise<{ success: boolean; requiresMfa?: boolean; error?: string }>;
  verifyMfa: (code: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER_STORAGE_KEY = "folio_demo_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 1. First check server session cookie (Edge Middleware standard)
    const activeSession = getClientSessionCookie();

    if (activeSession && activeSession.mfaVerified) {
      setUser({
        id: activeSession.userId,
        email: activeSession.email,
        displayName: activeSession.displayName,
        mfaEnabled: true,
      });
    } else {
      // If cookie expired or missing, clean up local storage
      localStorage.removeItem(DEMO_USER_STORAGE_KEY);
      setUser(null);
    }

    setLoading(false);
  }, []);

  const register = async (displayName: string, email: string, password: string) => {
    try {
      const supabase = createClient();
      const hasRealSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

      if (hasRealSupabase) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: displayName },
          },
        });
        if (error) return { success: false, error: error.message };
      }

      const pendingUser: UserProfile = {
        id: "usr_" + Math.random().toString(36).substring(2, 9),
        email,
        displayName,
        mfaEnabled: true,
      };

      sessionStorage.setItem("folio_pending_user", JSON.stringify(pendingUser));
      return { success: true, requiresMfa: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to register" };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const supabase = createClient();
      const hasRealSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

      if (hasRealSupabase) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) return { success: false, error: error.message };
      }

      const existingUser: UserProfile = {
        id: "usr_" + Math.random().toString(36).substring(2, 9),
        email,
        displayName: email.split("@")[0],
        mfaEnabled: true,
      };

      sessionStorage.setItem("folio_pending_user", JSON.stringify(existingUser));
      return { success: true, requiresMfa: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to login" };
    }
  };

  const verifyMfa = async (code: string) => {
    if (code.length !== 6 || !/^\d+$/.test(code)) {
      return { success: false, error: "Invalid 6-digit verification code" };
    }

    const pending = sessionStorage.getItem("folio_pending_user");
    if (!pending) {
      return { success: false, error: "Session expired, please log in again" };
    }

    const verifiedUser: UserProfile = JSON.parse(pending);
    setUser(verifiedUser);

    // 1. Create secure 7-day session cookie for Middleware
    const sessionPayload = createSessionPayload(
      verifiedUser.id,
      verifiedUser.email,
      verifiedUser.displayName
    );
    setClientSessionCookie(sessionPayload);

    // 2. Persist in local storage
    localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(verifiedUser));
    sessionStorage.removeItem("folio_pending_user");

    return { success: true };
  };

  const logout = async () => {
    const supabase = createClient();
    try {
      await supabase.auth.signOut();
    } catch (e) {
      // ignore
    }

    // 1. Clear session cookie
    clearClientSessionCookie();

    // 2. Clear state and storage
    setUser(null);
    localStorage.removeItem(DEMO_USER_STORAGE_KEY);
    sessionStorage.removeItem("folio_pending_user");

    // 3. Redirect to login
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, verifyMfa, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
