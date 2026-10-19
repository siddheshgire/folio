"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { 
  ShieldCheck, 
  KeyRound, 
  Smartphone, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  QrCode, 
  Copy, 
  Lock,
  Sparkles
} from "lucide-react";

export default function MfaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyMfa } = useAuth();

  const redirectUrl = searchParams.get("redirect") || "/dashboard";

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showSetupDetails, setShowSetupDetails] = useState(true);

  const secretKey = "FOLIO-SQUAD-9812-MFA";

  const handleDigitChange = (index: number, value: string) => {
    if (value.length > 1) {
      const pasted = value.replace(/\D/g, "").slice(0, 6).split("");
      const updated = [...code];
      pasted.forEach((char, i) => {
        if (i < 6) updated[i] = char;
      });
      setCode(updated);
      const nextInput = document.getElementById(`digit-5`);
      nextInput?.focus();
      return;
    }

    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-advance to next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`digit-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = document.getElementById(`digit-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");

    const fullCode = code.join("");
    if (fullCode.length !== 6) {
      setError("Please enter all 6 digits from your authenticator app");
      return;
    }

    setLoading(true);
    const res = await verifyMfa(fullCode);
    setLoading(false);

    if (res.success) {
      router.push(redirectUrl);
    } else {
      setError(res.error || "Invalid MFA code");
    }
  };

  const handleAutoFillDemo = () => {
    setCode(["1", "2", "3", "4", "5", "6"]);
    setError("");
  };

  const copySecret = () => {
    navigator.clipboard.writeText(secretKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-brand-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6 relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-400 mb-4">
          <ShieldCheck className="h-4 w-4" />
          <span>Two-Factor Authentication</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Verify Security Code
        </h2>
        <p className="mt-1 text-xs text-gray-400">
          Open Google Authenticator or Authy on your phone to complete sign in.
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="rounded-2xl border border-white/10 bg-[#111827] p-6 sm:p-8 shadow-2xl glass-panel space-y-6">
          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Setup / QR code container (expandable) */}
          <div className="rounded-xl border border-white/5 bg-[#0B0F19]/70 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                <Smartphone className="h-3.5 w-3.5 text-brand-400" />
                One-Time MFA Setup
              </span>
              <button
                type="button"
                onClick={() => setShowSetupDetails(!showSetupDetails)}
                className="text-[11px] text-brand-400 hover:underline"
              >
                {showSetupDetails ? "Hide QR" : "Show QR"}
              </button>
            </div>

            {showSetupDetails && (
              <div className="space-y-3 pt-1">
                {/* Simulated QR Code Canvas */}
                <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-white/5 border border-white/5">
                  <div className="flex items-center justify-center h-28 w-28 rounded-lg bg-white p-2">
                    <div className="grid grid-cols-4 gap-1 w-full h-full p-1 bg-black rounded">
                      <div className="bg-white col-span-2 row-span-2 rounded-sm" />
                      <div className="bg-white" />
                      <div className="bg-white" />
                      <div className="bg-white" />
                      <div className="bg-white" />
                      <div className="bg-white col-span-2 row-span-2 rounded-sm" />
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400 mt-2">
                    Scan with Google Authenticator or Apple Keychain
                  </span>
                </div>

                {/* Secret key copy */}
                <div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                    Or Enter Secret Manually
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-[#1E293B] px-3 py-1.5 text-xs text-brand-300 font-mono">
                    <span>{secretKey}</span>
                    <button
                      type="button"
                      onClick={copySecret}
                      className="text-gray-400 hover:text-white transition ml-2"
                      title="Copy Key"
                    >
                      {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Demo Helper */}
          <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-2.5">
            <span className="text-[11px] text-emerald-300 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              Demo Code Available
            </span>
            <button
              type="button"
              onClick={handleAutoFillDemo}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 underline"
            >
              Autofill (123456)
            </button>
          </div>

          {/* 6 Digit Inputs */}
          <form onSubmit={handleVerify}>
            <label className="block text-center text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3">
              Enter 6-Digit Authenticator Code
            </label>
            <div className="flex items-center justify-center gap-2 sm:gap-2.5">
              {code.map((digit, i) => (
                <input
                  key={i}
                  id={`digit-${i}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="h-12 w-10 sm:w-12 text-center text-lg sm:text-xl font-bold rounded-xl border border-white/10 bg-[#0B0F19] text-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition hover:from-brand-500 hover:to-brand-600 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <span>Validating Token...</span>
              ) : (
                <>
                  <KeyRound className="h-4 w-4" />
                  <span>Verify & Enter Workspace</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <Link href="/login" className="text-xs text-gray-500 hover:text-gray-300 transition">
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
