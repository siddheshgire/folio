"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
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
  HardDrive
} from "lucide-react";

export default function DashboardPage() {
  const { user, logout } = useAuth();

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
          <span className="text-xs font-semibold text-gray-300">Student Workspace</span>
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
              <div className="font-semibold text-white">{user?.displayName || "Siddharth"}</div>
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
              Welcome back, {user?.displayName || "Siddharth"}!
            </h1>
            <p className="mt-1 text-sm text-gray-400 max-w-xl">
              Your friend study group is active. 3 new lecture notes were dropped today in <strong className="text-gray-200">CS 3rd Year Squad</strong>.
            </p>
          </div>

          {/* Quick Action Button */}
          <div className="flex items-center gap-3">
            <Link
              href="/group/cs-squad"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 hover:from-brand-500 hover:to-brand-600 transition"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Open Group Chat & Vault</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-white/5 bg-[#111827] p-4 flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-gray-400">My Study Groups</div>
              <div className="text-xl font-bold text-white">2 Active</div>
            </div>
          </div>

          <div className="rounded-xl border border-white/5 bg-[#111827] p-4 flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-sky/10 text-accent-sky border border-accent-sky/20">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-gray-400">Accessible Files</div>
              <div className="text-xl font-bold text-white">35 Notes & PDFs</div>
            </div>
          </div>

          <div className="rounded-xl border border-white/5 bg-[#111827] p-4 flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Bookmark className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-gray-400">Bookmarked</div>
              <div className="text-xl font-bold text-white">7 Exam Resources</div>
            </div>
          </div>

          <div className="rounded-xl border border-white/5 bg-[#111827] p-4 flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <HardDrive className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-gray-400">Free Storage Used</div>
              <div className="text-xl font-bold text-white">48.2 MB / 1 GB</div>
            </div>
          </div>
        </div>

        {/* Groups & Channels preview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-[#111827] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="h-4 w-4 text-brand-400" />
                Your Study Circles
              </h2>
              <span className="text-xs text-brand-400 font-semibold cursor-pointer hover:underline">
                + Create New Circle
              </span>
            </div>

            <div className="space-y-3">
              {/* Group 1 */}
              <Link
                href="/group/cs-squad"
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-white/5 bg-[#0F172A] p-4 hover:border-brand-500/40 hover:bg-brand-500/5 transition"
              >
                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white font-bold text-sm shadow-md">
                    CS
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-sm group-hover:text-brand-300 transition">
                        CS 3rd Year Squad
                      </span>
                      <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-400 border border-emerald-500/20">
                        Admin
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      4 Members • 3 Subjects • Latest file: <em>OS_Unit2_CPU_Scheduling.pdf</em>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span className="text-xs font-semibold text-brand-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Enter Chat & Vault <ChevronRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>

              {/* Group 2 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-white/5 bg-[#0F172A] p-4 opacity-75">
                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white font-bold text-sm shadow-md">
                    ML
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-sm">
                        Machine Learning Project Group
                      </span>
                      <span className="rounded bg-gray-800 px-1.5 py-0.5 text-[10px] font-medium text-gray-300">
                        Member
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      3 Members • 12 Files • Pinned dataset and research papers
                    </div>
                  </div>
                </div>

                <span className="text-xs text-gray-500 self-end sm:self-center">
                  Last active yesterday
                </span>
              </div>
            </div>
          </div>

          {/* Quick Security & Academic Syllabus shortcut */}
          <div className="rounded-2xl border border-white/10 bg-[#111827] p-6 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              Security Checkup
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#0B0F19] border border-white/5">
                <span className="text-gray-300">Two-Factor Authentication</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" /> Enforced
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#0B0F19] border border-white/5">
                <span className="text-gray-300">File Download Security</span>
                <span className="text-brand-300 font-semibold">Signed URLs (15m)</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#0B0F19] border border-white/5">
                <span className="text-gray-300">Hash Deduplication</span>
                <span className="text-brand-300 font-semibold">SHA-256 Active</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/5 text-[11px] text-gray-400">
              Files are stored in private object storage buckets. Direct URL guessing is impossible.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
