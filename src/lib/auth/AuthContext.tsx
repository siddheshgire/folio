"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

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
    // Check if session exists in local state
    const saved = typeof window !== "undefined" ? localStorage.getItem(DEMO_USER_STORAGE_KEY) : null;
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem(DEMO_USER_STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const register = async (displayName: string, email: string, password: string) => {
    try {
      // 1. Try real Supabase auth if URL is provided and not placeholder
      const supabase = createClient();
      const hasRealSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

      if (hasRealSupabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: displayName },
          },
        });
        if (error) return { success: false, error: error.message };
      }

      // Set user object with MFA requirement
      const newUser: UserProfile = {
        id: "usr_" + Math.random().toString(36).substring(2, 9),
        email,
        displayName,
        mfaEnabled: true,
      };

      // Store temporary pending state
      sessionStorage.setItem("folio_pending_user", JSON.stringify(newUser));
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
        const { data, error } = await supabase.auth.signInWithPassword({
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
    // 6-digit code validation (for demo accept any 6-digit or default 123456)
    if (code.length !== 6 || !/^\d+$/.test(code)) {
      return { success: false, error: "Invalid 6-digit verification code" };
    }

    const pending = sessionStorage.getItem("folio_pending_user");
    if (!pending) {
      return { success: false, error: "Session expired, please log in again" };
    }

    const verifiedUser: UserProfile = JSON.parse(pending);
    setUser(verifiedUser);
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
    setUser(null);
    localStorage.removeItem(DEMO_USER_STORAGE_KEY);
    sessionStorage.removeItem("folio_pending_user");
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
