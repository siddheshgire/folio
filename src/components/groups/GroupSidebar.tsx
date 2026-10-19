"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Users, 
  MessageSquare, 
  BookOpen, 
  Share2, 
  Check, 
  ChevronDown, 
  Plus, 
  Settings, 
  ArrowLeft,
  Hash,
  ShieldCheck,
  Sparkles,
  UserPlus
} from "lucide-react";
import { GroupMember } from "@/lib/groups/GroupStore";

interface GroupSidebarProps {
  groupId: string;
  groupName: string;
  inviteCode: string;
  members: GroupMember[];
  activeChannel: string;
  onSelectChannel: (channel: string) => void;
  selectedSubject: string | null;
  onSelectSubject: (subject: string | null) => void;
  onOpenAddMember: () => void;
}

export function GroupSidebar({
  groupId,
  groupName,
  inviteCode,
  members,
  activeChannel,
  onSelectChannel,
  selectedSubject,
  onSelectSubject,
  onOpenAddMember,
}: GroupSidebarProps) {
  const [copiedInvite, setCopiedInvite] = useState(false);

  const channels = [
    { id: "general", name: "study-chat-drops", icon: MessageSquare },
    { id: "exam-prep", name: "midterm-prep", icon: Sparkles },
    { id: "assignments", name: "assignment-help", icon: Hash },
  ];

  const subjects = [
    { code: "CS501", name: "Operating Systems", count: 4 },
    { code: "CS502", name: "DBMS", count: 3 },
    { code: "CS503", name: "Computer Networks", count: 5 },
  ];

  const copyInvite = () => {
    navigator.clipboard.writeText(`https://folio.app/join/${inviteCode}`);
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2000);
  };

  return (
    <aside className="w-64 sm:w-72 flex-shrink-0 flex flex-col border-r border-white/5 bg-[#0D1321] text-gray-300 select-none">
      {/* Group Title Bar */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#0F172A]">
        <div className="flex items-center gap-2.5 min-w-0">
          <Link href="/dashboard" className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white font-bold text-xs flex-shrink-0">
            {groupName.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h2 className="text-xs font-bold text-white truncate">{groupName}</h2>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Private Circle
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={copyInvite}
          title="Copy Private Invite Link"
          className="p-1.5 rounded-lg bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 transition border border-brand-500/20"
        >
          {copiedInvite ? <Check className="h-4 w-4 text-emerald-400" /> : <Share2 className="h-4 w-4" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-6">
        {/* Discussion Channels */}
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-2 mb-1.5 flex items-center justify-between">
            <span>Channels</span>
          </div>
          <div className="space-y-0.5">
            {channels.map((ch) => {
              const Icon = ch.icon;
              const isActive = activeChannel === ch.id;
              return (
                <button
                  key={ch.id}
                  onClick={() => onSelectChannel(ch.id)}
                  className={`w-full flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                    isActive
                      ? "bg-brand-600 text-white shadow-sm"
                      : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>#{ch.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Academic Syllabus Shortcuts */}
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-2 mb-1.5 flex items-center justify-between">
            <span>Syllabus Shortcuts</span>
            {selectedSubject && (
              <button
                onClick={() => onSelectSubject(null)}
                className="text-[10px] text-brand-400 hover:underline lowercase font-normal"
              >
                clear
              </button>
            )}
          </div>
          <div className="space-y-1">
            {subjects.map((sub) => {
              const isSelected = selectedSubject === sub.code;
              return (
                <button
                  key={sub.code}
                  onClick={() => onSelectSubject(isSelected ? null : sub.code)}
                  className={`w-full flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition border ${
                    isSelected
                      ? "bg-brand-500/15 border-brand-500/40 text-brand-300 font-semibold"
                      : "border-transparent text-gray-400 hover:bg-white/5 hover:text-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <BookOpen className="h-3 w-3 text-brand-400 flex-shrink-0" />
                    <span className="truncate">{sub.name}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 px-1.5 py-0.2 rounded bg-black/30">
                    {sub.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Real Members List + Add Member Action */}
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-2 mb-2 flex items-center justify-between">
            <span>Members ({members.length})</span>
            <button
              onClick={onOpenAddMember}
              className="text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-0.5 text-[10px]"
              title="Add registered email to circle"
            >
              <UserPlus className="h-3 w-3" />
              <span>+ Add</span>
            </button>
          </div>

          <div className="space-y-1.5">
            {members.map((m, i) => (
              <div key={i} className="flex items-center justify-between px-2 py-1 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="relative flex-shrink-0">
                    <div className="h-6 w-6 rounded-full bg-brand-600 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                      {m.displayName.slice(0, 2)}
                    </div>
                    {m.online && (
                      <span className="absolute bottom-0 right-0 h-1.5 w-1.5 rounded-full bg-emerald-400 ring-2 ring-[#0D1321]" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-gray-200 font-medium truncate text-xs">{m.displayName}</div>
                    <div className="text-[9px] text-gray-400 truncate">{m.email}</div>
                  </div>
                </div>

                {m.role === "admin" && (
                  <span className="text-[9px] text-brand-400 bg-brand-500/10 px-1.5 py-0.5 rounded border border-brand-500/20 font-semibold flex-shrink-0 ml-1">
                    Admin
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Security Badge */}
      <div className="p-3 border-t border-white/5 bg-[#0A0E18] text-[10px] text-gray-400 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span>MFA Enforced</span>
        </span>
        <span className="font-mono text-gray-400">RLS Active</span>
      </div>
    </aside>
  );
}
