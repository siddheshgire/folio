"use client";

import React, { useState } from "react";
import { useGroups } from "@/lib/groups/GroupStore";
import { 
  X, 
  UserPlus, 
  Mail, 
  Shield, 
  Copy, 
  Check, 
  AlertCircle, 
  CheckCircle2,
  Users
} from "lucide-react";

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  groupName: string;
  inviteCode: string;
}

export function AddMemberModal({
  isOpen,
  onClose,
  groupId,
  groupName,
  inviteCode,
}: AddMemberModalProps) {
  const { addMemberByEmail } = useGroups();

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "member">("member");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Please enter a valid email address");
      return;
    }

    const res = addMemberByEmail(groupId, email.trim(), role);
    if (res.success) {
      setSuccess(`Added ${email.trim()} to ${groupName}!`);
      setEmail("");
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } else {
      setError(res.error || "Failed to add member");
    }
  };

  const copyInvite = () => {
    const inviteLink = `https://folio.app/join/${inviteCode}`;
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111827] shadow-2xl overflow-hidden glass-panel">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 bg-[#0F172A] px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-xs shadow">
              <UserPlus className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Add People to Circle</h3>
              <p className="text-[11px] text-gray-400">{groupName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300">
              <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Direct Add by Registered Email */}
          <form onSubmit={handleAdd} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Add By Registered Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  required
                  placeholder="e.g. friend@college.edu or gmail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#0B0F19] pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:border-brand-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Role selection */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Assign Role
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole("member")}
                  className={`rounded-xl border p-2.5 text-xs font-medium text-left transition ${
                    role === "member"
                      ? "border-brand-500 bg-brand-500/10 text-white"
                      : "border-white/10 text-gray-400 hover:text-white"
                  }`}
                >
                  <div className="font-bold">Member</div>
                  <div className="text-[10px] text-gray-400">Can chat, upload & preview</div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={`rounded-xl border p-2.5 text-xs font-medium text-left transition ${
                    role === "admin"
                      ? "border-brand-500 bg-brand-500/10 text-white"
                      : "border-white/10 text-gray-400 hover:text-white"
                  }`}
                >
                  <div className="font-bold flex items-center gap-1">
                    <Shield className="h-3 w-3 text-brand-400" />
                    Admin
                  </div>
                  <div className="text-[10px] text-gray-400">Can invite & moderate</div>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-600 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-brand-500 active:scale-95 transition"
            >
              <UserPlus className="h-4 w-4" />
              <span>Add Member Directly</span>
            </button>
          </form>

          {/* Or Share Link */}
          <div className="pt-3 border-t border-white/5 space-y-2">
            <div className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
              Or Share Private Invite Link
            </div>
            <div className="flex items-center justify-between rounded-xl bg-[#0B0F19] border border-white/10 p-2.5 text-xs">
              <span className="font-mono text-gray-300 text-[11px] truncate mr-2">
                https://folio.app/join/{inviteCode}
              </span>
              <button
                type="button"
                onClick={copyInvite}
                className="flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1 text-xs font-semibold text-white hover:bg-white/20 transition flex-shrink-0"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
