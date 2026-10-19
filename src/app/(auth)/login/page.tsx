"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { loginSchema } from "@/lib/validation/auth";
import { BookOpen, ShieldCheck, Lock, Mail, AlertCircle, ArrowRight, Sparkles, KeyRound, Clock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const redirectUrl = searchParams.get("redirect") || "/dashboard";
  const isExpired = searchParams.get("expired") === "true";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setServerError("");

    const validation = loginSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    const res = await login(formData.email, formData.password);
    setLoading(false);

    if (res.success) {
      router.push(`/mfa?redirect=${encodeURIComponent(redirectUrl)}`);
    } else {
      setServerError(res.error || "Invalid credentials");
    }
  };

  const handleQuickDemoLogin = async () => {
    setLoading(true);
    await login("siddharth@campus.edu", "Password123!");
    setLoading(false);
    router.push(`/mfa?redirect=${encodeURIComponent(redirectUrl)}`);
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-brand-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2.5 transition hover:opacity-90 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-accent-sky p-0.5 shadow-lg shadow-brand-500/25">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#0B0F19]">
              <BookOpen className="h-5 w-5 text-brand-400" />
            </div>
          </div>
          <span className="text-2xl font-black tracking-tight text-white">FOLIO</span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Sign In to Your Vault
        </h2>
        <p className="mt-1.5 text-xs text-gray-400">
          Access your friend study groups and academic folders.
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="rounded-2xl border border-white/10 bg-[#111827] p-6 sm:p-8 shadow-2xl glass-panel">
          {/* Expired Session Alert */}
          {isExpired && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-300">
              <Clock className="h-4 w-4 flex-shrink-0" />
              <span>Your session has expired. Please sign in again.</span>
            </div>
          )}

          {serverError && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          {/* Quick Demo Access banner */}
          <div className="mb-5 p-3 rounded-xl bg-brand-500/10 border border-brand-500/25 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand-400 flex-shrink-0" />
              <div className="text-[11px] text-gray-300">
                <strong className="text-white">Testing mode:</strong> Instant 1-click friend access
              </div>
            </div>
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="text-xs font-semibold text-brand-400 hover:text-brand-300 underline"
            >
              Fill & Test
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  placeholder="siddharth@campus.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full rounded-xl border bg-[#0B0F19] pl-10 pr-3.5 py-2.5 text-sm text-gray-100 placeholder-gray-500 transition focus:outline-none focus:ring-2 focus:ring-brand-500/50 ${
                    errors.email ? "border-rose-500" : "border-white/10 focus:border-brand-500"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-rose-400">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Password
                </label>
                <span className="text-[11px] text-brand-400 hover:underline cursor-pointer">
                  Forgot?
                </span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`w-full rounded-xl border bg-[#0B0F19] pl-10 pr-3.5 py-2.5 text-sm text-gray-100 placeholder-gray-500 transition focus:outline-none focus:ring-2 focus:ring-brand-500/50 ${
                    errors.password ? "border-rose-500" : "border-white/10 focus:border-brand-500"
                  }`}
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-rose-400">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition hover:from-brand-500 hover:to-brand-600 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <span>Checking credentials...</span>
              ) : (
                <>
                  <KeyRound className="h-4 w-4" />
                  <span>Verify Credentials</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer link to Register */}
          <div className="mt-6 text-center text-xs text-gray-400 border-t border-white/5 pt-4">
            Don't have an account yet?{" "}
            <Link href="/register" className="font-semibold text-brand-400 hover:underline">
              Register New Student
            </Link>
          </div>
        </div>

        {/* Security footnote */}
        <div className="mt-6 text-center text-[11px] text-gray-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span>Protected with TOTP Two-Factor Authentication</span>
        </div>
      </div>
    </div>
  );
}
