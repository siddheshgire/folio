"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { useGroups } from "@/lib/groups/GroupStore";
import { CreateGroupModal } from "@/components/groups/CreateGroupModal";
import { 
  BookOpen, 
  MessageSquare, 
  ShieldCheck, 
  UploadCloud, 
  Users, 
  Search, 
  Bookmark, 
  FileText, 
  Clock, 
  LogOut, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  HardDrive,
  Plus,
  Share2
} from "lucide-react";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { groups } = useGroups();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Total calculated metrics
  const totalFiles = groups.reduce((acc, g) => acc + g.resources.length, 0);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 flex flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#0F172A]/90 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white font-bold text-xs shadow-md shadow-brand-500/20">
              <BookOpen className="h-4 w-4" />
            </div>
            <span className="font-extrabold text-white text-base">FOLIO</span>
          </Link>
          <span className="text-gray-600">/</span>
          <span className="text-xs font-semibold text-gray-300">Workspace</span>
        </div>

        <div className="flex items-center gap-3">
          {/* MFA status pill */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-xs text-emerald-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>MFA Protected</span>
          </div>

          {/* User profile dropdown info */}
          <div className="flex items-center gap-2 pl-2 border-l border-white/10">
            <div className="h-8 w-8 rounded-full bg-brand-500 flex items-center justify-center text-xs font-bold text-white uppercase">
              {user?.displayName ? user.displayName.slice(0, 2) : "ME"}
            </div>
            <div className="hidden md:block text-left text-xs">
              <div className="font-semibold text-white">{user?.displayName || "Student"}</div>
              <div className="text-[10px] text-gray-400">{user?.email || "student@campus.edu"}</div>
            </div>
            <button
              onClick={() => logout()}
              title="Sign Out"
              className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-white/5 transition ml-1"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Welcome Banner */}
        <div className="rounded-2xl border border-brand-500/20 bg-gradient-to-r from-brand-950/40 via-[#111827] to-brand-950/30 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-500/10 border border-brand-500/20 px-3 py-1 text-xs font-semibold text-brand-300 mb-2">
              <Sparkles className="h-3.5 w-3.5 text-brand-400" />
              Academic Term 2026-2027
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome, {user?.displayName || "Student"}!
            </h1>
            <p className="mt-1 text-sm text-gray-400 max-w-xl">
              {groups.length === 0
                ? "You have a fresh workspace. Create your first study circle or ask a friend to add your email to their group."
                : `You are in ${groups.length} active study circle${groups.length === 1 ? "" : "s"}. Share notes and chat with total freedom.`}
            </p>
          </div>

          {/* Quick Action Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 hover:from-brand-500 hover:to-brand-600 transition active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Create New Circle</span>
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-white/5 bg-[#111827] p-4 flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-gray-400">My Study Circles</div>
              <div className="text-xl font-bold text-white">{groups.length} Active</div>
            </div>
          </div>

          <div className="rounded-xl border border-white/5 bg-[#111827] p-4 flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-sky/10 text-accent-sky border border-accent-sky/20">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-gray-400">Total Uploaded Notes</div>
              <div className="text-xl font-bold text-white">{totalFiles} PDFs & Docs</div>
            </div>
          </div>

          <div className="rounded-xl border border-white/5 bg-[#111827] p-4 flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Bookmark className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-gray-400">Saved for Exams</div>
              <div className="text-xl font-bold text-white">0 Bookmarks</div>
            </div>
          </div>

          <div className="rounded-xl border border-white/5 bg-[#111827] p-4 flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <HardDrive className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-gray-400">Free Storage Used</div>
              <div className="text-xl font-bold text-white">0.0 MB / 1 GB</div>
            </div>
          </div>
        </div>

        {/* Study Circles List or Clean Empty State */}
        <div className="rounded-2xl border border-white/10 bg-[#111827] p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/5">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="h-4 w-4 text-brand-400" />
                Your Study Circles
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Private collaborative spaces for chatting and sharing semester materials
              </p>
            </div>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create Circle</span>
            </button>
          </div>

          {groups.length === 0 ? (
            /* Clean Empty State */
            <div className="text-center py-16 px-4 max-w-md mx-auto space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-400 border border-brand-500/20 mx-auto">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-white">No Study Circles Yet</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Create your first circle for your friends, classmates, or project team. Once created, you can invite your friends directly using their registered email.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setIsCreateOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-xs font-semibold text-white shadow-lg shadow-brand-500/25 hover:bg-brand-500 active:scale-95 transition"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Your First Study Circle</span>
                </button>
              </div>
            </div>
          ) : (
            /* Real Active Circles */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {groups.map((group) => (
                <Link
                  key={group.id}
                  href={`/group/${group.id}`}
                  className="group rounded-xl border border-white/5 bg-[#0F172A] p-5 hover:border-brand-500/40 hover:bg-brand-500/5 transition flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3.5 min-w-0">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-white font-bold text-sm shadow-md flex-shrink-0">
                        {group.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-sm truncate group-hover:text-brand-300 transition">
                            {group.name}
                          </h4>
                          <span className="rounded bg-brand-500/10 px-1.5 py-0.5 text-[10px] font-medium text-brand-300 border border-brand-500/20">
                            {group.academicYear || "Active"}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                          {group.description || "Private group for notes and discussions."}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center gap-3">
                      <span>{group.members.length} Member{group.members.length === 1 ? "" : "s"}</span>
                      <span>•</span>
                      <span>{group.resources.length} Notes</span>
                    </div>

                    <span className="font-semibold text-brand-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Open Circle <ChevronRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Create Group Modal */}
      <CreateGroupModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </div>
  );
}
