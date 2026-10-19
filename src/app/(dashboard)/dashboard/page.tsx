"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { useGroups } from "@/lib/groups/GroupStore";
import { useDirectChat } from "@/lib/chat/DirectChatStore";
import { CreateGroupModal } from "@/components/groups/CreateGroupModal";
import { NewDirectChatModal } from "@/components/chat/NewDirectChatModal";
import { DocumentPreviewModal, PreviewDocument } from "@/components/viewer/DocumentPreviewModal";
import { getFileMeta } from "@/lib/utils/fileMeta";
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
  ChevronRight, 
  HardDrive, 
  Plus, 
  Share2, 
  UserPlus, 
  CheckCircle2, 
  FolderGit2, 
  Layers, 
  Presentation, 
  FileCode, 
  Eye, 
  Download 
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { groups, addMemberByEmail } = useGroups();
  const { campusUsers, directChats, startOrGetDirectChat } = useDirectChat();

  const [activeTab, setActiveTab] = useState<"circles" | "direct">("circles");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDirectChatOpen, setIsDirectChatOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<PreviewDocument | null>(null);
  const [addedNotif, setAddedNotif] = useState<string | null>(null);

  // Total calculated metrics
  const totalFiles = groups.reduce((acc, g) => acc + g.resources.length, 0);

  // Recent files across all circles
  const allResources: PreviewDocument[] = groups.flatMap((g) => g.resources);

  // Filter other registered students (exclude self)
  const newlyJoinedFriends = campusUsers.filter(
    (u) => u.email.toLowerCase() !== user?.email?.toLowerCase()
  );

  const handleStartChatWith = (friendEmail: string, friendName?: string) => {
    const chat = startOrGetDirectChat(friendEmail, friendName);
    router.push(`/dm/${chat.id}`);
  };

  const handleQuickAddToCircle = (friendEmail: string, friendName: string) => {
    if (groups.length === 0) {
      setIsCreateOpen(true);
      return;
    }
    const targetGroup = groups[0];
    const res = addMemberByEmail(targetGroup.id, friendEmail);
    if (res.success) {
      setAddedNotif(`Added ${friendName} to ${targetGroup.name}!`);
      setTimeout(() => setAddedNotif(null), 3500);
    } else {
      setAddedNotif(res.error || "Could not add");
      setTimeout(() => setAddedNotif(null), 3500);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 flex flex-col selection:bg-brand-500 selection:text-white">
      {/* 1. TOP NAVIGATION HEADER */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#0F172A]/90 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2.5 transition hover:opacity-90">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-accent-sky p-0.5 shadow-lg shadow-brand-500/25">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#0B0F19]">
                <BookOpen className="h-4 w-4 text-brand-400" />
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-white text-lg tracking-tight">FOLIO</span>
              <span className="rounded-full bg-brand-500/10 px-2 py-0.5 text-[10px] font-semibold text-brand-400 border border-brand-500/20">
                Workspace
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          {/* MFA Protection Badge */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs text-emerald-400 font-medium">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>MFA Protected</span>
          </div>

          {/* User Profile dropdown */}
          <div className="flex items-center gap-2.5 pl-3 border-l border-white/10">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-brand-600 to-accent-sky flex items-center justify-center text-xs font-bold text-white uppercase shadow">
              {user?.displayName ? user.displayName.slice(0, 2) : "ST"}
            </div>
            <div className="hidden md:block text-left text-xs">
              <div className="font-semibold text-white">{user?.displayName || "Student"}</div>
              <div className="text-[10px] text-gray-400">{user?.email || "student@campus.edu"}</div>
            </div>
            <button
              onClick={() => logout()}
              title="Sign Out"
              className="p-2 rounded-xl text-gray-400 hover:text-rose-400 hover:bg-white/5 transition ml-1"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Toast alert */}
        {addedNotif && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-[#111827] px-4 py-3 text-xs text-emerald-300 shadow-2xl animate-in slide-in-from-bottom">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
            <span>{addedNotif}</span>
          </div>
        )}

        {/* SECTION A: HERO WORKSPACE BANNER */}
        <section className="relative rounded-3xl border border-brand-500/20 bg-gradient-to-r from-brand-950/40 via-[#111827] to-brand-950/30 p-6 sm:p-8 shadow-xl overflow-hidden glass-panel">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-500/10 border border-brand-500/20 px-3 py-1 text-xs font-semibold text-brand-300">
                <Sparkles className="h-3.5 w-3.5 text-brand-400" />
                <span>Centralized Campus Library</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Welcome back, {user?.displayName || "Student"}!
              </h1>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                Connect with classmates, share original-quality study notes, and discuss assignments with total WhatsApp-style freedom.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setIsDirectChatOpen(true)}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2.5 text-xs font-semibold text-gray-200 transition active:scale-95 shadow-sm"
              >
                <MessageSquare className="h-4 w-4 text-accent-sky" />
                <span>1-on-1 Chat</span>
              </button>

              <button
                type="button"
                onClick={() => setIsCreateOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-brand-500/25 hover:from-brand-500 hover:to-brand-600 transition active:scale-95"
              >
                <Plus className="h-4 w-4" />
                <span>Create Study Circle</span>
              </button>
            </div>
          </div>
        </section>

        {/* SECTION B: METRICS OVERVIEW */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-white/5 bg-[#111827] p-5 flex items-center gap-4 hover:border-brand-500/30 transition shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20 flex-shrink-0">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xs text-gray-400 font-medium">Study Circles</div>
              <div className="text-2xl font-bold text-white mt-0.5">{groups.length} Active</div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#111827] p-5 flex items-center gap-4 hover:border-accent-sky/30 transition shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-sky/10 text-accent-sky border border-accent-sky/20 flex-shrink-0">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xs text-gray-400 font-medium">1-on-1 Direct Chats</div>
              <div className="text-2xl font-bold text-white mt-0.5">{directChats.length} Conversations</div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#111827] p-5 flex items-center gap-4 hover:border-amber-500/30 transition shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex-shrink-0">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xs text-gray-400 font-medium">Uploaded Files</div>
              <div className="text-2xl font-bold text-white mt-0.5">{totalFiles} Resources</div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#111827] p-5 flex items-center gap-4 hover:border-emerald-500/30 transition shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex-shrink-0">
              <HardDrive className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs text-gray-400 font-medium">Storage Quota</div>
              <div className="text-lg font-bold text-white mt-0.5">0.0 MB / 1 GB</div>
              <div className="mt-1.5 h-1.5 w-full rounded-full bg-gray-800 overflow-hidden">
                <div className="h-full bg-emerald-400 w-[2%]" />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION C: CAMPUS COMMUNITY & REGISTERED CLASSMATES */}
        {newlyJoinedFriends.length > 0 && (
          <section className="rounded-2xl border border-white/10 bg-[#111827] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <h3 className="font-bold text-sm text-white">
                  Campus Classmates Available ({newlyJoinedFriends.length})
                </h3>
              </div>
              <span className="text-[11px] text-gray-400 hidden sm:inline">
                Connect 1-on-1 or invite to your circle
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {newlyJoinedFriends.map((friend) => (
                <div
                  key={friend.id}
                  className="rounded-xl border border-white/5 bg-[#0B0F19] p-3 flex items-center justify-between gap-3 hover:border-brand-500/30 transition"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="h-9 w-9 rounded-xl bg-brand-600/30 text-brand-300 font-bold text-xs flex items-center justify-center uppercase flex-shrink-0 border border-brand-500/20">
                      {friend.displayName.slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-xs text-white truncate">{friend.displayName}</div>
                      <div className="text-[10px] text-gray-400 truncate">{friend.email}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => handleStartChatWith(friend.email, friend.displayName)}
                      className="rounded-lg bg-brand-600/20 hover:bg-brand-600 text-brand-300 hover:text-white p-2 transition active:scale-95"
                      title="Start 1-on-1 Private Chat"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                    </button>
                    {groups.length > 0 && (
                      <button
                        onClick={() => handleQuickAddToCircle(friend.email, friend.displayName)}
                        className="rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white p-2 transition active:scale-95"
                        title="Add to My Study Circle"
                      >
                        <UserPlus className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION D: WORKSPACE HUB (CIRCLES & PRIVATE MESSAGES) */}
        <section className="space-y-4">
          {/* Section Header with View Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("circles")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
                  activeTab === "circles"
                    ? "bg-brand-600 text-white shadow-md shadow-brand-500/20"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Users className="h-4 w-4" />
                <span>Study Circles ({groups.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("direct")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
                  activeTab === "direct"
                    ? "bg-brand-600 text-white shadow-md shadow-brand-500/20"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <MessageSquare className="h-4 w-4" />
                <span>1-on-1 Chats ({directChats.length})</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              {activeTab === "circles" ? (
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(true)}
                  className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>New Circle</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsDirectChatOpen(true)}
                  className="text-xs font-semibold text-accent-sky hover:underline flex items-center gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Start Private Chat</span>
                </button>
              )}
            </div>
          </div>

          {/* TAB CONTENT: STUDY CIRCLES */}
          {activeTab === "circles" && (
            <div>
              {groups.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-[#111827] p-12 text-center max-w-lg mx-auto space-y-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-400 border border-brand-500/20 mx-auto">
                    <Users className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-bold text-white">No Study Circles Yet</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Create a circle for your classmates, project partners, or study group. You can chat freely and drop PDFs without compression.
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setIsCreateOpen(true)}
                      className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-xs font-semibold text-white shadow-lg shadow-brand-500/25 hover:bg-brand-500 active:scale-95 transition"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Create Your First Study Circle</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groups.map((g) => (
                    <Link
                      key={g.id}
                      href={`/group/${g.id}`}
                      className="group rounded-2xl border border-white/5 bg-[#111827] p-5 hover:border-brand-500/40 hover:bg-[#151D2E] transition-all flex flex-col justify-between space-y-4 shadow-sm"
                    >
                      <div className="flex items-start gap-3.5 min-w-0">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-white font-bold text-sm shadow-md flex-shrink-0">
                          {g.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-bold text-sm text-white truncate group-hover:text-brand-300 transition">
                              {g.name}
                            </h4>
                            <span className="rounded bg-brand-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-brand-300 border border-brand-500/20 flex-shrink-0">
                              {g.academicYear || "Active"}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                            {g.description || "Private group for notes and discussions."}
                          </p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
                        <div className="flex items-center gap-2">
                          <span>{g.members.length} Member{g.members.length === 1 ? "" : "s"}</span>
                          <span>•</span>
                          <span>{g.resources.length} Notes</span>
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
          )}

          {/* TAB CONTENT: 1-ON-1 DIRECT CHATS */}
          {activeTab === "direct" && (
            <div>
              {directChats.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-[#111827] p-12 text-center max-w-lg mx-auto space-y-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-sky/10 text-accent-sky border border-accent-sky/20 mx-auto">
                    <MessageSquare className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-bold text-white">No 1-on-1 Chats Yet</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Message a friend directly using their registered email to chat in private, send voice notes, and share notes.
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setIsDirectChatOpen(true)}
                      className="inline-flex items-center gap-2 rounded-xl bg-accent-sky/20 border border-accent-sky/30 text-accent-sky px-6 py-3 text-xs font-semibold hover:bg-accent-sky/30 transition active:scale-95"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Start 1-on-1 Chat by Email</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {directChats.map((chat) => (
                    <Link
                      key={chat.id}
                      href={`/dm/${chat.id}`}
                      className="group rounded-2xl border border-white/5 bg-[#111827] p-5 hover:border-accent-sky/40 hover:bg-[#151D2E] transition-all flex items-center justify-between gap-3 shadow-sm"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-brand-600 to-accent-sky text-white font-bold text-sm flex items-center justify-center flex-shrink-0 uppercase shadow">
                          {chat.friendName.slice(0, 2)}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-sm text-white truncate group-hover:text-accent-sky transition">
                            {chat.friendName}
                          </h4>
                          <p className="text-xs text-gray-400 mt-0.5 truncate">{chat.friendEmail}</p>
                          <span className="text-[10px] text-gray-500 font-mono">
                            {chat.messages.length} message{chat.messages.length === 1 ? "" : "s"}
                          </span>
                        </div>
                      </div>

                      <ChevronRight className="h-5 w-5 text-gray-500 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

        {/* SECTION E: RECENT STUDY RESOURCES ACROSS VAULT */}
        {allResources.length > 0 && (
          <section className="rounded-2xl border border-white/10 bg-[#111827] p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <FolderGit2 className="h-4 w-4 text-brand-400" />
                <h3 className="font-bold text-sm text-white">Recent Study Materials in Vault</h3>
              </div>
              <span className="text-xs text-gray-400 font-mono">
                {allResources.length} total resources
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {allResources.slice(0, 6).map((doc) => {
                const meta = getFileMeta(doc.filename || doc.title);

                return (
                  <div
                    key={doc.id}
                    className="rounded-xl border border-white/5 bg-[#0B0F19] p-3.5 flex flex-col justify-between space-y-3 hover:border-brand-500/30 transition shadow-sm"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${meta.iconBg} border ${meta.borderCol} flex-shrink-0 shadow`}>
                        {meta.category === "presentation" ? (
                          <Presentation className="h-4 w-4" />
                        ) : meta.category === "code" ? (
                          <FileCode className="h-4 w-4" />
                        ) : (
                          <FileText className="h-4 w-4" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h5
                          onClick={() => setPreviewDoc(doc)}
                          className="font-semibold text-xs text-white truncate cursor-pointer hover:text-brand-300 transition"
                          title={doc.title}
                        >
                          {doc.title}
                        </h5>
                        <div className="text-[10px] text-gray-400 truncate mt-0.5">
                          {doc.subject} • {doc.size}
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                      <span className="text-[10px] text-gray-500">by {doc.uploader}</span>
                      <button
                        onClick={() => setPreviewDoc(doc)}
                        className="font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1 text-xs"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Preview</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* Modals */}
      <CreateGroupModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      <NewDirectChatModal
        isOpen={isDirectChatOpen}
        onClose={() => setIsDirectChatOpen(false)}
      />

      <DocumentPreviewModal
        doc={previewDoc}
        onClose={() => setPreviewDoc(null)}
      />
    </div>
  );
}
