"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { useGroups } from "@/lib/groups/GroupStore";
import { GroupSidebar } from "@/components/groups/GroupSidebar";
import { ChatFeed, ChatMessage } from "@/components/groups/ChatFeed";
import { ChatInput } from "@/components/groups/ChatInput";
import { StudyVaultSidebar } from "@/components/groups/StudyVaultSidebar";
import { DocumentPreviewModal, PreviewDocument } from "@/components/viewer/DocumentPreviewModal";
import { UploadResourceModal } from "@/components/upload/UploadResourceModal";
import { AddMemberModal } from "@/components/groups/AddMemberModal";
import { DragDropOverlay } from "@/components/upload/DragDropOverlay";
import { 
  FolderGit2, 
  MessageSquare, 
  PanelRightClose, 
  PanelRightOpen, 
  ShieldCheck, 
  UserPlus, 
  AlertCircle, 
  ArrowLeft,
  Plus,
  Menu,
  X,
  BookOpen
} from "lucide-react";

export default function GroupWorkspacePage() {
  const params = useParams();
  const groupId = params.id as string;

  const { user } = useAuth();
  const { getGroup, addMessage, addResource } = useGroups();

  const group = getGroup(groupId);

  const [activeChannel, setActiveChannel] = useState("general");
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [showRightSidebar, setShowRightSidebar] = useState(true);
  const [showMobileLeftDrawer, setShowMobileLeftDrawer] = useState(false);
  const [showMobileVaultDrawer, setShowMobileVaultDrawer] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  // Active Modals
  const [previewDoc, setPreviewDoc] = useState<PreviewDocument | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  // Window drag listeners
  useEffect(() => {
    let dragCounter = 0;

    const handleWindowDragEnter = (e: DragEvent) => {
      e.preventDefault();
      dragCounter++;
      if (e.dataTransfer?.types.includes("Files")) {
        setIsDraggingFile(true);
      }
    };

    const handleWindowDragLeave = (e: DragEvent) => {
      e.preventDefault();
      dragCounter--;
      if (dragCounter <= 0) {
        setIsDraggingFile(false);
      }
    };

    const handleWindowDrop = (e: DragEvent) => {
      e.preventDefault();
      dragCounter = 0;
      setIsDraggingFile(false);
    };

    window.addEventListener("dragenter", handleWindowDragEnter);
    window.addEventListener("dragleave", handleWindowDragLeave);
    window.addEventListener("drop", handleWindowDrop);

    return () => {
      window.removeEventListener("dragenter", handleWindowDragEnter);
      window.removeEventListener("dragleave", handleWindowDragLeave);
      window.removeEventListener("drop", handleWindowDrop);
    };
  }, []);

  if (!group) {
    return (
      <div className="min-h-[100dvh] bg-[#0B0F19] text-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-2xl border border-white/10 bg-[#111827] p-8 text-center space-y-4 glass-panel">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-400 border border-brand-500/20 mx-auto">
            <AlertCircle className="h-7 w-7 text-brand-400" />
          </div>
          <h2 className="text-xl font-bold text-white">Study Circle Not Found</h2>
          <p className="text-xs text-gray-400">
            This study group either doesn't exist yet, or you don't have membership permissions.
          </p>
          <div className="pt-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-semibold text-white shadow hover:bg-brand-500 transition"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleFullWindowFileDrop = (files: FileList) => {
    setIsDraggingFile(false);
    if (!files.length) return;

    const file = files[0];
    const newDoc: PreviewDocument = {
      id: "doc_" + Math.random().toString(36).substring(2, 9),
      title: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
      filename: file.name,
      subject: selectedSubject || "General Notes",
      unit: "Unit 1: Fundamentals",
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      uploader: user?.displayName ? `${user.displayName} (You)` : "Siddharth (You)",
      uploadedAt: "Just now",
      type: "pdf",
      sha256: "4a7d1ed414474e4033ac29ccb8653d9b",
    };

    addResource(group.id, newDoc, true);
  };

  const handleSendMessage = (text: string) => {
    addMessage(group.id, {
      sender: user?.displayName ? `${user.displayName} (You)` : "You",
      senderColor: "bg-brand-600",
      content: text,
      isMe: true,
      reactions: {},
    });
  };

  const handleSendVoiceNote = (duration: string) => {
    addMessage(group.id, {
      sender: user?.displayName ? `${user.displayName} (You)` : "You",
      senderColor: "bg-brand-600",
      content: "",
      voiceNoteDuration: duration,
      isMe: true,
      reactions: { "🔥": 1 },
    });
  };

  const handleUploadSuccess = (newDoc: PreviewDocument) => {
    addResource(group.id, newDoc, true);
  };

  const handleBookmarkToggle = (docId: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]
    );
  };

  return (
    <div className="flex h-[100dvh] w-screen overflow-hidden bg-[#0B0F19] text-gray-100 selection:bg-brand-500 selection:text-white relative">
      {/* 1. DESKTOP LEFT SIDEBAR */}
      <div className="hidden md:flex flex-shrink-0 h-full">
        <GroupSidebar
          groupId={group.id}
          groupName={group.name}
          inviteCode={group.inviteCode}
          members={group.members}
          activeChannel={activeChannel}
          onSelectChannel={setActiveChannel}
          selectedSubject={selectedSubject}
          onSelectSubject={setSelectedSubject}
          onOpenAddMember={() => setIsAddMemberOpen(true)}
        />
      </div>

      {/* MOBILE LEFT DRAWER (Channels & Members) */}
      {showMobileLeftDrawer && (
        <div className="fixed inset-0 z-50 md:hidden flex animate-in fade-in duration-200">
          <div 
            onClick={() => setShowMobileLeftDrawer(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm" 
          />
          <div className="relative z-10 w-72 max-w-[85vw] h-full bg-[#0D1321] shadow-2xl flex flex-col">
            <GroupSidebar
              groupId={group.id}
              groupName={group.name}
              inviteCode={group.inviteCode}
              members={group.members}
              activeChannel={activeChannel}
              onSelectChannel={(ch) => {
                setActiveChannel(ch);
                setShowMobileLeftDrawer(false);
              }}
              selectedSubject={selectedSubject}
              onSelectSubject={setSelectedSubject}
              onOpenAddMember={() => {
                setIsAddMemberOpen(true);
                setShowMobileLeftDrawer(false);
              }}
            />
          </div>
        </div>
      )}

      {/* 2. MAIN CHAT WORKSPACE (100% Mobile Safe with 100dvh) */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[#0F172A] relative">
        {/* Workspace Top Header Bar */}
        <header className="h-14 sm:h-16 border-b border-white/5 bg-[#0B0F19]/95 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between flex-shrink-0 z-10">
          <div className="flex items-center gap-2 min-w-0">
            {/* Mobile menu trigger */}
            <button
              type="button"
              onClick={() => setShowMobileLeftDrawer(true)}
              className="p-2 -ml-1 rounded-xl text-gray-400 hover:text-white md:hidden hover:bg-white/5 active:scale-95 transition"
              title="Open channels"
            >
              <Menu className="h-5 w-5" />
            </button>

            <span className="text-gray-500 font-medium text-sm hidden xs:inline">#</span>
            <div className="min-w-0">
              <h2 className="font-bold text-xs sm:text-sm text-white truncate max-w-[120px] xs:max-w-[160px] sm:max-w-xs">
                {activeChannel === "general" ? "study-chat-drops" : activeChannel}
              </h2>
              <span className="text-[10px] text-gray-400 block xs:hidden truncate">
                {group.name}
              </span>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] text-gray-300 font-medium">
              {group.members.length} Members
            </span>
          </div>

          {/* Action buttons (Clean responsive icons on mobile) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setIsAddMemberOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 px-2.5 sm:px-3 py-1.5 text-xs font-semibold hover:bg-emerald-600 hover:text-white transition active:scale-95 shadow-sm"
              title="Add friends by registered email"
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">+ Add People</span>
            </button>

            <button
              type="button"
              onClick={() => setIsUploadOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-brand-600 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-brand-500/25 hover:bg-brand-500 transition active:scale-95"
              title="Upload study material"
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Drop Note</span>
            </button>

            {/* Desktop Vault Toggle */}
            <button
              type="button"
              onClick={() => setShowRightSidebar(!showRightSidebar)}
              className="hidden lg:flex p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition active:scale-95"
              title={showRightSidebar ? "Collapse Study Vault" : "Expand Study Vault"}
            >
              {showRightSidebar ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
            </button>

            {/* Mobile Vault Button (Opens Slide-over Drawer) */}
            <button
              type="button"
              onClick={() => setShowMobileVaultDrawer(true)}
              className="lg:hidden p-2 rounded-xl text-accent-sky hover:bg-accent-sky/10 border border-accent-sky/20 transition active:scale-95"
              title="Open Group Study Vault"
            >
              <FolderGit2 className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Real-time WhatsApp-Style Feed with Isolated Scrolling */}
        <ChatFeed
          messages={group.messages}
          onPreview={(doc) => setPreviewDoc(doc)}
          onBookmark={handleBookmarkToggle}
          bookmarkedIds={bookmarkedIds}
          onAddReaction={() => {}}
        />

        {/* Input Bar with Voice Notes (Never Collides with Mobile Viewport) */}
        <ChatInput
          onSendMessage={handleSendMessage}
          onSendVoiceNote={handleSendVoiceNote}
          onOpenUpload={() => setIsUploadOpen(true)}
        />
      </main>

      {/* 3. DESKTOP RIGHT SIDEBAR: STUDY VAULT */}
      {showRightSidebar && (
        <div className="hidden lg:flex flex-shrink-0 h-full">
          <StudyVaultSidebar
            resources={group.resources}
            onPreview={(doc) => setPreviewDoc(doc)}
            onBookmark={handleBookmarkToggle}
            bookmarkedIds={bookmarkedIds}
            onOpenUpload={() => setIsUploadOpen(true)}
            selectedSubject={selectedSubject}
          />
        </div>
      )}

      {/* MOBILE STUDY VAULT SLIDE-OVER DRAWER */}
      {showMobileVaultDrawer && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end animate-in fade-in duration-200">
          <div 
            onClick={() => setShowMobileVaultDrawer(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm" 
          />
          <div className="relative z-10 w-80 max-w-[88vw] h-full bg-[#0D1321] shadow-2xl flex flex-col">
            <div className="p-3 border-b border-white/5 bg-[#0F172A] flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <FolderGit2 className="h-4 w-4 text-brand-400" />
                Group Study Vault
              </span>
              <button
                type="button"
                onClick={() => setShowMobileVaultDrawer(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <StudyVaultSidebar
                resources={group.resources}
                onPreview={(doc) => {
                  setPreviewDoc(doc);
                  setShowMobileVaultDrawer(false);
                }}
                onBookmark={handleBookmarkToggle}
                bookmarkedIds={bookmarkedIds}
                onOpenUpload={() => {
                  setIsUploadOpen(true);
                  setShowMobileVaultDrawer(false);
                }}
                selectedSubject={selectedSubject}
              />
            </div>
          </div>
        </div>
      )}

      {/* PDF & Image In-Browser Preview Modal */}
      <DocumentPreviewModal
        doc={previewDoc}
        onClose={() => setPreviewDoc(null)}
        onBookmark={handleBookmarkToggle}
        isBookmarked={previewDoc ? bookmarkedIds.includes(previewDoc.id) : false}
      />

      {/* Upload Study Material Modal */}
      <UploadResourceModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={handleUploadSuccess}
        defaultSubject={selectedSubject}
      />

      {/* Add Member By Email Modal */}
      <AddMemberModal
        isOpen={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
        groupId={group.id}
        groupName={group.name}
        inviteCode={group.inviteCode}
      />

      {/* Full-Screen Drag-and-Drop Overlay */}
      <DragDropOverlay
        isDragging={isDraggingFile}
        onDrop={handleFullWindowFileDrop}
        onDragLeave={() => setIsDraggingFile(false)}
      />
    </div>
  );
}
