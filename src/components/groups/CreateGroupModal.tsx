"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useGroups } from "@/lib/groups/GroupStore";
import { X, Users, Sparkles, ArrowRight, ShieldCheck, BookOpen } from "lucide-react";

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateGroupModal({ isOpen, onClose }: CreateGroupModalProps) {
  const router = useRouter();
  const { createGroup } = useGroups();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [academicYear, setAcademicYear] = useState("Semester 6 (2026-2027)");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const group = createGroup(name.trim(), description.trim(), academicYear);
    onClose();
    router.push(`/group/${group.id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111827] shadow-2xl overflow-hidden glass-panel">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 bg-[#0F172A] px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white font-bold text-xs shadow-md shadow-brand-500/25">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Create New Study Circle</h3>
              <p className="text-[11px] text-gray-400">A private WhatsApp-like workspace for your friends</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Circle / Group Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. CS 3rd Year Squad or AI Project Team"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#0B0F19] px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Academic Term / Semester
            </label>
            <input
              type="text"
              placeholder="e.g. 3rd Year • Semester 6"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#0B0F19] px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Purpose / Description
            </label>
            <textarea
              rows={3}
              placeholder="e.g. For sharing lecture slides, exam solutions, lab codes, and discussions."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#0B0F19] px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:border-brand-500 focus:outline-none resize-none"
            />
          </div>

          <div className="rounded-xl bg-brand-500/10 border border-brand-500/20 p-3 text-xs text-brand-300 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 flex-shrink-0 text-emerald-400" />
            <span>You will be the Circle Admin. You can invite friends by their registered email right after creating.</span>
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 hover:from-brand-500 hover:to-brand-600 active:scale-95 transition disabled:opacity-40"
          >
            <span>Launch Circle</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
