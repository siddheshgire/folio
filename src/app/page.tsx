"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { 
  MessageSquare, 
  BookOpen, 
  FileText, 
  ShieldCheck, 
  Lock, 
  UploadCloud, 
  Search, 
  Bookmark, 
  Users, 
  Eye, 
  Download, 
  Sparkles, 
  CheckCircle2, 
  KeyRound, 
  FolderGit2, 
  Share2, 
  Smartphone,
  ChevronRight,
  Flame,
  FileCheck
} from "lucide-react";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<"chat" | "vault">("chat");

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 flex flex-col selection:bg-brand-500 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32">
        {/* Glow gradients in background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-500/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[350px] h-[250px] bg-accent-sky/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-xs font-semibold text-brand-300 mb-6 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-brand-400" />
            <span>Built for You & Your Friends' Academic Circle</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
            Chat with friends. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-brand-400 via-brand-500 to-accent-sky bg-clip-text text-transparent">
              Organize every study note.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto font-normal leading-relaxed">
            Stop losing critical exam notes, lab manuals, and PDFs inside crowded WhatsApp groups. 
            Enjoy <strong className="text-gray-200">real-time group chat freedom</strong> backed by an <strong className="text-gray-200">auto-indexed Academic Vault</strong> and <strong className="text-gray-200">MFA security</strong>.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 rounded-xl bg-brand-600 px-7 py-3.5 text-base font-semibold text-white shadow-xl shadow-brand-500/25 transition hover:bg-brand-500 hover:shadow-brand-500/40 active:scale-95"
            >
              <Users className="h-5 w-5" />
              <span>Create Friend Group</span>
            </Link>
            <a
              href="#interactive-preview"
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-7 py-3.5 text-base font-medium text-gray-200 backdrop-blur-sm transition hover:bg-white/10 hover:border-white/20"
            >
              <Eye className="h-5 w-5 text-accent-sky" />
              <span>Explore Interactive Demo</span>
            </a>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Zero PDF Compression</span>
            </div>
            <div className="flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-brand-400" />
              <span>MFA One-Time Setup</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-accent-sky" />
              <span>Row-Level Security (RLS)</span>
            </div>
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-purple-400" />
              <span>Desktop & Mobile Friendly</span>
            </div>
          </div>
        </div>

        {/* Interactive Live Mockup Preview Section */}
        <div id="interactive-preview" className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mt-16">
          <div className="rounded-2xl border border-white/10 bg-[#111827] shadow-2xl overflow-hidden glass-panel">
            {/* Window Top Bar with Toggle */}
            <div className="flex flex-col sm:flex-row items-center justify-between border-b border-white/10 bg-[#0F172A] px-4 py-3 gap-3">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs font-semibold text-gray-400 flex items-center gap-1.5">
                  <Lock className="h-3 w-3 text-emerald-400" />
                  FOLIO // Study Group: <strong>CS 3rd Year Squad</strong>
                </span>
              </div>

              {/* View Switcher: Chat vs Vault */}
              <div className="flex items-center rounded-lg bg-[#1E293B] p-1 border border-white/5">
                <button
                  type="button"
                  onClick={() => setActiveTab("chat")}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                    activeTab === "chat"
                      ? "bg-brand-600 text-white shadow-sm"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>WhatsApp-Style Feed</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("vault")}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                    activeTab === "vault"
                      ? "bg-brand-600 text-white shadow-sm"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>Academic Vault View</span>
                </button>
              </div>
            </div>

            {/* Tab 1: WhatsApp-Style Group Chat with Smart Study Attachment Drops */}
            {activeTab === "chat" ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
                {/* Left Mini Sidebar: Channels & Friends */}
                <div className="hidden lg:block lg:col-span-4 border-r border-white/5 bg-[#0D1321] p-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                    Active Study Circles
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between rounded-xl bg-brand-600/15 border border-brand-500/30 p-2.5 text-sm font-medium text-white">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white font-bold text-xs">
                          CS
                        </div>
                        <div>
                          <div className="text-xs font-semibold">CS 3rd Year Squad</div>
                          <div className="text-[10px] text-brand-300">Aryan: uploaded OS Unit 2...</div>
                        </div>
                      </div>
                      <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                    </div>

                    <div className="flex items-center justify-between rounded-xl p-2.5 text-sm font-medium text-gray-400 hover:bg-white/5 transition">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-800 text-gray-300 font-bold text-xs">
                          AI
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-gray-300">ML Project Team</div>
                          <div className="text-[10px] text-gray-500">Kavya: Dataset link pinned</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-white/5 pt-4">
                    <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                      Online Friends (4)
                    </div>
                    <div className="space-y-2 text-xs text-gray-300">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        <span>Siddharth (You)</span>
                        <span className="ml-auto text-[10px] text-brand-400 bg-brand-500/10 px-1.5 py-0.5 rounded">Admin</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        <span>Aryan Mehta</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        <span>Kavya Sharma</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        <span>Rohan Verma</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Chat Feed */}
                <div className="lg:col-span-8 flex flex-col justify-between p-4 sm:p-6 bg-[#0B0F19]/60">
                  {/* Messages Feed */}
                  <div className="space-y-4 overflow-y-auto max-h-[380px] pr-2">
                    {/* Message 1: Friend */}
                    <div className="flex items-start gap-2.5 max-w-[85%]">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-bold text-white flex-shrink-0">
                        AM
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-gray-300">Aryan Mehta</span>
                          <span className="text-[10px] text-gray-500">10:42 AM</span>
                        </div>
                        <div className="rounded-2xl rounded-tl-sm bg-[#1F2937] p-3 text-sm text-gray-200 border border-white/5">
                          Hey guys! Anyone got the handwritten notes for OS Unit 2 (CPU Scheduling)? Mid-terms are next Tuesday 😅
                        </div>
                      </div>
                    </div>

                    {/* Message 2: You replying with a Smart Study Drop */}
                    <div className="flex items-start gap-2.5 max-w-[90%] ml-auto flex-row-reverse">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-500 text-[11px] font-bold text-white flex-shrink-0">
                        You
                      </div>
                      <div>
                        <div className="flex items-center justify-end gap-2 mb-1">
                          <span className="text-[10px] text-gray-500">10:44 AM</span>
                          <span className="text-xs font-medium text-brand-300">You</span>
                        </div>

                        {/* Interactive Dropped Study Card */}
                        <div className="rounded-2xl rounded-tr-sm bg-gradient-to-br from-brand-900/60 to-brand-800/40 p-3.5 border border-brand-500/40 shadow-lg">
                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex-shrink-0">
                              <FileText className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-semibold text-xs text-white truncate">
                                  OS_Unit2_CPU_Scheduling_Handwritten.pdf
                                </span>
                              </div>
                              <div className="text-[11px] text-gray-300 mt-0.5">
                                Operating Systems • Unit 2: Scheduling Algorithms • 4.2 MB
                              </div>
                              <div className="mt-2 flex items-center gap-2">
                                <button className="inline-flex items-center gap-1 rounded-md bg-brand-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-brand-500 transition">
                                  <Eye className="h-3 w-3" />
                                  <span>Preview PDF</span>
                                </button>
                                <button className="inline-flex items-center gap-1 rounded-md bg-white/10 px-2.5 py-1 text-xs font-medium text-gray-200 hover:bg-white/20 transition">
                                  <Download className="h-3 w-3" />
                                  <span>Download (Original)</span>
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="mt-2.5 pt-2 border-t border-brand-500/20 flex items-center justify-between text-[10px] text-brand-300">
                            <span className="flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                              Auto-indexed to Semester 5 &gt; OS Vault
                            </span>
                            <span className="text-gray-400">SHA-256 Verified</span>
                          </div>
                        </div>

                        <div className="mt-1.5 text-right text-xs text-gray-300">
                          Got you covered! Direct professor lecture notes + solved numericals.
                        </div>
                      </div>
                    </div>

                    {/* Message 3: Friend reaction */}
                    <div className="flex items-start gap-2.5 max-w-[85%]">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-[11px] font-bold text-white flex-shrink-0">
                        KS
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-gray-300">Kavya Sharma</span>
                          <span className="text-[10px] text-gray-500">10:46 AM</span>
                        </div>
                        <div className="rounded-2xl rounded-tl-sm bg-[#1F2937] p-2.5 text-sm text-gray-200 border border-white/5 flex items-center gap-2">
                          <span>Life saver!! Bookmarking this right now 🔥🙌</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* WhatsApp-style Input Bar with Quick File Upload */}
                  <div className="mt-4 pt-3 border-t border-white/10">
                    <div className="flex items-center gap-2 rounded-xl bg-[#1E293B] p-2 border border-white/10">
                      <button 
                        title="Upload Study Material / PDF"
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600/20 text-brand-400 hover:bg-brand-600 hover:text-white transition"
                      >
                        <UploadCloud className="h-5 w-5" />
                      </button>
                      <input 
                        type="text" 
                        readOnly 
                        value="Type a message or drop study notes here..." 
                        className="flex-1 bg-transparent px-2 text-xs sm:text-sm text-gray-400 focus:outline-none cursor-default" 
                      />
                      <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white hover:bg-brand-500 transition">
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Tab 2: Academic Vault View showing Structured Folders */
              <div className="p-6 bg-[#0D1321] min-h-[480px]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <FolderGit2 className="h-5 w-5 text-brand-400" />
                      Semester 5 Academic Tree
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Hierarchical syllabus: <strong>Year 3 → Sem 5 → Subjects → Units</strong>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
                      <input 
                        type="text" 
                        readOnly 
                        placeholder="Search notes, formulas..." 
                        className="rounded-lg bg-[#1E293B] pl-9 pr-3 py-1.5 text-xs text-gray-200 border border-white/10 focus:outline-none" 
                      />
                    </div>
                  </div>
                </div>

                {/* Subject Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  {/* Subject 1 */}
                  <div className="rounded-xl border border-brand-500/30 bg-brand-500/5 p-4 hover:border-brand-500/50 transition">
                    <div className="flex items-center justify-between mb-2">
                      <span className="rounded-md bg-brand-500/20 px-2 py-0.5 text-[10px] font-semibold text-brand-300">
                        CS501
                      </span>
                      <span className="text-xs text-gray-400">12 Files</span>
                    </div>
                    <h4 className="font-semibold text-white text-sm">Operating Systems</h4>
                    <p className="text-xs text-gray-400 mt-1">Processes, Threads, CPU Scheduling, Deadlocks</p>
                    <div className="mt-4 pt-3 border-t border-white/5 space-y-1.5 text-xs text-gray-300">
                      <div className="flex items-center justify-between">
                        <span className="truncate">Unit 1: Overview</span>
                        <span className="text-gray-500 text-[10px]">3 PDFs</span>
                      </div>
                      <div className="flex items-center justify-between text-brand-300 font-medium">
                        <span className="truncate">Unit 2: Scheduling</span>
                        <span className="text-brand-400 text-[10px]">5 PDFs</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="truncate">Unit 3: Deadlocks</span>
                        <span className="text-gray-500 text-[10px]">4 PDFs</span>
                      </div>
                    </div>
                  </div>

                  {/* Subject 2 */}
                  <div className="rounded-xl border border-white/10 bg-[#111827] p-4 hover:border-white/20 transition">
                    <div className="flex items-center justify-between mb-2">
                      <span className="rounded-md bg-accent-sky/20 px-2 py-0.5 text-[10px] font-semibold text-accent-sky">
                        CS502
                      </span>
                      <span className="text-xs text-gray-400">8 Files</span>
                    </div>
                    <h4 className="font-semibold text-white text-sm">Database Management Systems</h4>
                    <p className="text-xs text-gray-400 mt-1">ER Modeling, SQL, Normalization, ACID</p>
                    <div className="mt-4 pt-3 border-t border-white/5 space-y-1.5 text-xs text-gray-300">
                      <div className="flex items-center justify-between">
                        <span className="truncate">Unit 1: Relational Model</span>
                        <span className="text-gray-500 text-[10px]">2 PDFs</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="truncate">Unit 2: SQL & Triggers</span>
                        <span className="text-gray-500 text-[10px]">4 PDFs</span>
                      </div>
                    </div>
                  </div>

                  {/* Subject 3 */}
                  <div className="rounded-xl border border-white/10 bg-[#111827] p-4 hover:border-white/20 transition">
                    <div className="flex items-center justify-between mb-2">
                      <span className="rounded-md bg-purple-500/20 px-2 py-0.5 text-[10px] font-semibold text-purple-300">
                        CS503
                      </span>
                      <span className="text-xs text-gray-400">15 Files</span>
                    </div>
                    <h4 className="font-semibold text-white text-sm">Computer Networks</h4>
                    <p className="text-xs text-gray-400 mt-1">OSI Model, TCP/IP, Routing, Subnetting</p>
                    <div className="mt-4 pt-3 border-t border-white/5 space-y-1.5 text-xs text-gray-300">
                      <div className="flex items-center justify-between">
                        <span className="truncate">Unit 1: Physical Layer</span>
                        <span className="text-gray-500 text-[10px]">3 PDFs</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="truncate">Unit 2: Data Link Layer</span>
                        <span className="text-gray-500 text-[10px]">6 PDFs</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Feature Pillars: Why FOLIO Beats WhatsApp & Drive */}
      <section id="chat-experience" className="py-20 border-t border-white/5 bg-[#0D1321]/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-brand-400">
              Built Specifically for Friend Groups
            </h2>
            <p className="mt-3 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Why WhatsApp + Drive Wasn't Working for You
            </p>
            <p className="mt-4 text-base text-gray-400">
              WhatsApp groups are great for talking, but terrible for organizing notes. Google Drive has no chat and links get lost. FOLIO combines the best of both.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="rounded-2xl border border-white/10 bg-[#111827] p-8 hover:border-brand-500/40 transition group">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20 group-hover:scale-110 transition-transform">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-white">Full Freedom Chat</h3>
              <p className="mt-3 text-sm text-gray-400 leading-relaxed">
                Talk, joke, drop questions, react with emojis, and discuss upcoming exams in real time with the friends you trust.
              </p>
            </div>

            {/* Card 2 */}
            <div className="rounded-2xl border border-white/10 bg-[#111827] p-8 hover:border-accent-sky/40 transition group">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-sky/10 text-accent-sky border border-accent-sky/20 group-hover:scale-110 transition-transform">
                <FileCheck className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-white">Bit-for-Bit File Integrity</h3>
              <p className="mt-3 text-sm text-gray-400 leading-relaxed">
                No automatic image compression or blurry handwriting scans. Every PDF, PPTX, and image retains its exact original quality.
              </p>
            </div>

            {/* Card 3 */}
            <div className="rounded-2xl border border-white/10 bg-[#111827] p-8 hover:border-emerald-500/40 transition group">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                <FolderGit2 className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-white">Auto-Indexed Vault</h3>
              <p className="mt-3 text-sm text-gray-400 leading-relaxed">
                Never ask "Bro, can you resend the unit 3 notes?". Every file dropped in the chat is automatically filed under its subject and unit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MFA Security & Privacy Showcase */}
      <section id="mfa-security" className="py-20 border-t border-white/5 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-brand-500/20 bg-gradient-to-r from-brand-950/40 via-[#111827] to-brand-950/40 p-8 sm:p-12 lg:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400 mb-4">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Multi-Factor Authentication (MFA)
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  One-time MFA setup. <br />
                  <span className="text-brand-400">Zero unauthorized leaks.</span>
                </h2>
                <p className="mt-4 text-gray-400 text-sm sm:text-base leading-relaxed">
                  Academic projects and private notes shouldn't be visible to strangers. 
                  When you or your friends create an account, set up 2-Factor Authentication (TOTP via Google Authenticator or Email OTP) once.
                </p>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                    <span>Private invite codes with configurable usage limits</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                    <span>Supabase Row Level Security (RLS) protects database records</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                    <span>Short-lived signed download URLs — no naked links</span>
                  </div>
                </div>
              </div>

              {/* MFA Visual Card */}
              <div className="rounded-2xl border border-white/10 bg-[#0B0F19] p-6 shadow-xl">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                      <KeyRound className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Two-Factor Authentication</div>
                      <div className="text-[10px] text-emerald-400">Active & Enforced</div>
                    </div>
                  </div>
                  <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/30">
                    TOTP 6-Digit
                  </span>
                </div>

                <div className="mt-6 text-center">
                  <div className="inline-block p-4 rounded-xl bg-white/5 border border-white/10 mb-4">
                    <div className="flex items-center justify-center gap-2 font-mono text-2xl font-bold tracking-widest text-brand-300">
                      <span>4</span>
                      <span>8</span>
                      <span>2</span>
                      <span className="text-gray-500">•</span>
                      <span>9</span>
                      <span>1</span>
                      <span>7</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">
                    Enter the code from Google Authenticator / Authy to verify login.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="mt-auto border-t border-white/10 bg-[#090D16] py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white font-bold text-xs">
              <BookOpen className="h-4 w-4" />
            </div>
            <div>
              <span className="font-extrabold text-white">FOLIO</span>
              <p className="text-xs text-gray-500">One Campus. One Library. Every Resource.</p>
            </div>
          </div>

          <div className="text-xs text-gray-500 text-center sm:text-right">
            Designed for college students & study circles • 100% Free Tier Deployable
          </div>
        </div>
      </footer>
    </div>
  );
}
