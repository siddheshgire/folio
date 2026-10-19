"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDirectChat } from "@/lib/chat/DirectChatStore";
import { useAuth } from "@/lib/auth/AuthContext";
import { X, MessageSquare, Mail, User, ArrowRight, Sparkles, UserPlus } from "lucide-react";

interface NewDirectChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewDirectChatModal({ isOpen, onClose }: NewDirectChatModalProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { campusUsers, startOrGetDirectChat } = useDirectChat();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  // Filter out the current user from suggestions
  const otherUsers = campusUsers.filter(
    (u) => u.email.toLowerCase() !== user?.email?.toLowerCase()
  );

  const handleStartWithEmail = (targetEmail: string, targetName?: string) => {
    const clean = targetEmail.trim().toLowerCase();
    if (!clean || !clean.includes("@")) {
      setError("Please enter a valid student email address");
      return;
    }

    if (clean === user?.email?.toLowerCase()) {
      setError("You cannot start a private chat with yourself");
      return;
    }

    const chat = startOrGetDirectChat(clean, targetName);
    onClose();
    router.push(`/dm/${chat.id}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    handleStartWithEmail(email);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111827] shadow-2xl overflow-hidden glass-panel">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 bg-[#0F172A] px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white font-bold text-xs shadow">
              <MessageSquare className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Start 1-on-1 Private Chat</h3>
              <p className="text-[11px] text-gray-400">Directly with a friend by registered email</p>
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
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Friend's Registered Email
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

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-600 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-brand-500 active:scale-95 transition"
            >
              <span>Open Private Chat</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Newly joined registered students list */}
          {otherUsers.length > 0 && (
            <div className="pt-3 border-t border-white/5 space-y-2">
              <div className="text-[10px] uppercase font-bold tracking-wider text-gray-400 flex items-center justify-between">
                <span>Or Select Registered Student ({otherUsers.length})</span>
                <Sparkles className="h-3 w-3 text-brand-400" />
              </div>

              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {otherUsers.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleStartWithEmail(u.email, u.displayName)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl border border-white/5 bg-[#0B0F19] hover:border-brand-500/30 hover:bg-[#161F33] transition text-left"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="h-7 w-7 rounded-full bg-brand-500/20 text-brand-300 font-bold text-xs flex items-center justify-center uppercase flex-shrink-0">
                        {u.displayName.slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-white truncate">{u.displayName}</div>
                        <div className="text-[10px] text-gray-400 truncate">{u.email}</div>
                      </div>
                    </div>

                    <span className="text-[11px] font-semibold text-brand-400 flex items-center gap-1 flex-shrink-0 ml-2">
                      <span>Chat</span>
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
