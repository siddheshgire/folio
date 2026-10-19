"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { useGroups } from "@/lib/groups/GroupStore";
import { useDirectChat } from "@/lib/chat/DirectChatStore";
import { CreateGroupModal } from "@/components/groups/CreateGroupModal";
import { NewDirectChatModal } from "@/components/chat/NewDirectChatModal";
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
  Share2,
  UserPlus,
  Bell,
  CheckCircle2,
  Radio
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { groups, addMemberByEmail } = useGroups();
  const { campusUsers, directChats, startOrGetDirectChat } = useDirectChat();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDirectChatOpen, setIsDirectChatOpen] = useState(false);
  const [addedNotif, setAddedNotif] = useState<string | null>(null);

  // Total calculated metrics
  const totalFiles = groups.reduce((acc, g) => acc + g.resources.length, 0);

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
    // Add to first circle
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
        {/* Added notification toast */}
        {addedNotif && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-[#111827] px-4 py-3 text-xs text-emerald-300 shadow-2xl animate-in slide-in-from-bottom">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
            <span>{addedNotif}</span>
          </div>
        )}

        {/* Welcome Banner */}
        <div className="rounded-2xl border border-brand-500/20 bg-gradient-to-r from-brand-950/40 via-[#111827] to-brand-950/30 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-500/10 border border-brand-500/20 px-3 py-1 text-xs font-semibold text-brand-300 mb-2">
              <Sparkles className="h-3.5 w-3.5 text-brand-400" />
              Campus Workspace
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome, {user?.displayName || "Student"}!
            </h1>
            <p className="mt-1 text-sm text-gray-400 max-w-xl">
              Collaborate in private friend circles, chat 1-on-1, and store study materials with zero compression.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsDirectChatOpen(true)}
              className="flex items-center gap-2 rounded-xl border border-brand-500/30 bg-brand-500/10 px-4 py-2.5 text-xs font-semibold text-brand-300 hover:bg-brand-500/20 transition active:scale-95"
            >
              <MessageSquare className="h-4 w-4 text-accent-sky" />
              <span>1-on-1 Chat</span>
            </button>

            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-brand-500/25 hover:from-brand-500 hover:to-brand-600 transition active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Create Circle</span>
            </button>
          </div>
        </div>

        {/* Newly Registered Students Live Activity Banner */}
        {newlyJoinedFriends.length > 0 && (
          <div className="rounded-2xl border border-brand-500/30 bg-gradient-to-r from-[#111827] via-brand-950/30 to-[#111827] p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2.5">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <h3 className="font-bold text-sm text-white">
                  Newly Registered Students ({newlyJoinedFriends.length})
                </h3>
              </div>
              <span className="text-[11px] text-gray-400 hidden sm:inline">
                Registered on campus • Want to chat or invite to circle?
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {newlyJoinedFriends.map((friend) => (
                <div
                  key={friend.id}
                  className="rounded-xl border border-white/5 bg-[#0B0F19] p-3 flex items-center justify-between gap-3 hover:border-brand-500/30 transition"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="h-8 w-8 rounded-full bg-brand-600/30 text-brand-300 font-bold text-xs flex items-center justify-center uppercase flex-shrink-0 border border-brand-500/20">
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
                      className="rounded-lg bg-brand-600/20 hover:bg-brand-600 text-brand-300 hover:text-white p-1.5 transition"
                      title="Start 1-on-1 Chat"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                    </button>
                    {groups.length > 0 && (
                      <button
                        onClick={() => handleQuickAddToCircle(friend.email, friend.displayName)}
                        className="rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white p-1.5 transition"
                        title="Add to My Circle"
                      >
                        <UserPlus className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-gray-400">1-on-1 Direct Chats</div>
              <div className="text-xl font-bold text-white">{directChats.length} Conversations</div>
            </div>
          </div>

          <div className="rounded-xl border border-white/5 bg-[#111827] p-4 flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-gray-400">Total Notes Uploaded</div>
              <div className="text-xl font-bold text-white">{totalFiles} Files</div>
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

        {/* Dual Sections: Study Circles & Direct Chats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Section 1: Study Circles */}
          <div className="rounded-2xl border border-white/10 bg-[#111827] p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Users className="h-4 w-4 text-brand-400" />
                  Your Study Circles
                </h2>
              </div>
              <button
                onClick={() => setIsCreateOpen(true)}
                className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>New Circle</span>
              </button>
            </div>

            {groups.length === 0 ? (
              <div className="text-center py-10 px-4 text-xs text-gray-400 space-y-2">
                <Users className="h-8 w-8 mx-auto text-gray-500 opacity-60" />
                <p>No study circles created yet.</p>
                <button
                  onClick={() => setIsCreateOpen(true)}
                  className="mt-2 text-xs font-semibold text-brand-400 hover:underline"
                >
                  + Create Your First Circle
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {groups.map((g) => (
                  <Link
                    key={g.id}
                    href={`/group/${g.id}`}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-white/5 bg-[#0F172A] hover:border-brand-500/30 hover:bg-[#161F33] transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-9 w-9 rounded-xl bg-brand-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                        {g.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-xs text-white truncate">{g.name}</div>
                        <div className="text-[10px] text-gray-400 mt-0.5">
                          {g.members.length} member{g.members.length === 1 ? "" : "s"} • {g.resources.length} notes
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-500" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: 1-on-1 Direct Chats */}
          <div className="rounded-2xl border border-white/10 bg-[#111827] p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-accent-sky" />
                  1-on-1 Private Chats
                </h2>
              </div>
              <button
                onClick={() => setIsDirectChatOpen(true)}
                className="text-xs font-semibold text-accent-sky hover:underline flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>New Chat</span>
              </button>
            </div>

            {directChats.length === 0 ? (
              <div className="text-center py-10 px-4 text-xs text-gray-400 space-y-2">
                <MessageSquare className="h-8 w-8 mx-auto text-gray-500 opacity-60" />
                <p>No 1-on-1 private chats yet.</p>
                <button
                  onClick={() => setIsDirectChatOpen(true)}
                  className="mt-2 text-xs font-semibold text-accent-sky hover:underline"
                >
                  + Start Chat by Registered Email
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {directChats.map((chat) => (
                  <Link
                    key={chat.id}
                    href={`/dm/${chat.id}`}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-white/5 bg-[#0F172A] hover:border-accent-sky/30 hover:bg-[#161F33] transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-brand-600 to-accent-sky text-white font-bold text-xs flex items-center justify-center flex-shrink-0 uppercase">
                        {chat.friendName.slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-xs text-white truncate">{chat.friendName}</div>
                        <div className="text-[10px] text-gray-400 mt-0.5 truncate">{chat.friendEmail}</div>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-500" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
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
    </div>
  );
}
