"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { registerSchema } from "@/lib/validation/auth";
import { BookOpen, ShieldCheck, Lock, Mail, User, KeyRound, AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setServerError("");

    const validation = registerSchema.safeParse(formData);
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
    const res = await register(formData.displayName, formData.email, formData.password);
    setLoading(false);

    if (res.success) {
      // Direct to MFA setup step
      router.push("/mfa");
    } else {
      setServerError(res.error || "Failed to create account");
    }
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
          Create Student Account
        </h2>
        <p className="mt-1.5 text-xs text-gray-400">
          Join your friends' study circle with MFA-level security.
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="rounded-2xl border border-white/10 bg-[#111827] p-6 sm:p-8 shadow-2xl glass-panel">
          {serverError && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Display Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Full / Display Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="e.g. Siddharth"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  className={`w-full rounded-xl border bg-[#0B0F19] pl-10 pr-3.5 py-2.5 text-sm text-gray-100 placeholder-gray-500 transition focus:outline-none focus:ring-2 focus:ring-brand-500/50 ${
                    errors.displayName ? "border-rose-500" : "border-white/10 focus:border-brand-500"
                  }`}
                />
              </div>
              {errors.displayName && (
                <p className="mt-1 text-xs text-rose-400">{errors.displayName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  placeholder="you@college.edu or gmail"
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
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="password"
                  placeholder="Min 8 chars, 1 uppercase, 1 number"
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

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="password"
                  placeholder="Repeat your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className={`w-full rounded-xl border bg-[#0B0F19] pl-10 pr-3.5 py-2.5 text-sm text-gray-100 placeholder-gray-500 transition focus:outline-none focus:ring-2 focus:ring-brand-500/50 ${
                    errors.confirmPassword ? "border-rose-500" : "border-white/10 focus:border-brand-500"
                  }`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-rose-400">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms checkbox */}
            <div className="flex items-start gap-2 pt-1">
              <input
                id="terms"
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                className="mt-0.5 h-4 w-4 rounded border-gray-700 bg-gray-900 text-brand-600 focus:ring-brand-500"
              />
              <label htmlFor="terms" className="text-xs text-gray-400">
                I agree to the academic sharing guidelines and acknowledge that uploads are restricted to study materials.
              </label>
            </div>
            {errors.acceptTerms && (
              <p className="text-xs text-rose-400">{errors.acceptTerms}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition hover:from-brand-500 hover:to-brand-600 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <span>Continue to MFA Setup</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer link to Login */}
          <div className="mt-6 text-center text-xs text-gray-400 border-t border-white/5 pt-4">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-brand-400 hover:underline">
              Sign In
            </Link>
          </div>
        </div>

        {/* Security footnote */}
        <div className="mt-6 text-center text-[11px] text-gray-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span>Secured with Multi-Factor Authentication & Row-Level Security</span>
        </div>
      </div>
    </div>
  );
}
