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
  Plus
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

  // If group not found
  if (!group) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-gray-100 flex items-center justify-center p-4">
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

  // Dropping files on the full-screen overlay
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

  // Sending a new text message
  const handleSendMessage = (text: string) => {
    addMessage(group.id, {
      sender: user?.displayName ? `${user.displayName} (You)` : "You",
      senderColor: "bg-brand-600",
      content: text,
      isMe: true,
      reactions: {},
    });
  };

  // Sending a new voice note
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

  // Dropping an uploaded file into the group vault + chat feed
  const handleUploadSuccess = (newDoc: PreviewDocument, messageText?: string) => {
    addResource(group.id, newDoc, true);
  };

  // Bookmark toggle
  const handleBookmarkToggle = (docId: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]
    );
  };

  // Reaction toggle
  const handleAddReaction = (messageId: string, emoji: string) => {
    // Reaction state update
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0B0F19] text-gray-100 selection:bg-brand-500 selection:text-white relative">
      {/* 1. Left Group Sidebar (Channels, Subjects, Real Members) */}
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

      {/* 2. Main Chat Workspace (Center) */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0F172A] relative">
        {/* Workspace Top Header Bar */}
        <header className="h-14 border-b border-white/5 bg-[#0B0F19]/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-gray-400 font-medium text-sm">#</span>
            <h1 className="font-bold text-sm text-white truncate">
              {activeChannel === "general" ? "study-chat-drops" : activeChannel}
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 text-[11px] text-gray-300">
              {group.members.length} Member{group.members.length === 1 ? "" : "s"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddMemberOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 text-xs font-semibold hover:bg-emerald-600 hover:text-white transition"
              title="Add friends by registered email"
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>+ Add People</span>
            </button>

            <button
              onClick={() => setIsUploadOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-brand-600/20 text-brand-400 border border-brand-500/30 px-3 py-1.5 text-xs font-semibold hover:bg-brand-600 hover:text-white transition"
            >
              <span>+ Drop Note</span>
            </button>

            {/* Toggle Right Vault Panel */}
            <button
              onClick={() => setShowRightSidebar(!showRightSidebar)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition"
              title={showRightSidebar ? "Collapse Study Vault" : "Expand Study Vault"}
            >
              {showRightSidebar ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
            </button>
          </div>
        </header>

        {/* Real-time WhatsApp-Style Feed */}
        <ChatFeed
          messages={group.messages}
          onPreview={(doc) => setPreviewDoc(doc)}
          onBookmark={handleBookmarkToggle}
          bookmarkedIds={bookmarkedIds}
          onAddReaction={handleAddReaction}
        />

        {/* Input Bar with Voice Notes */}
        <ChatInput
          onSendMessage={handleSendMessage}
          onSendVoiceNote={handleSendVoiceNote}
          onOpenUpload={() => setIsUploadOpen(true)}
        />
      </main>

      {/* 3. Right Sidebar: Group Study Vault (Permanent Folders) */}
      {showRightSidebar && (
        <StudyVaultSidebar
          resources={group.resources}
          onPreview={(doc) => setPreviewDoc(doc)}
          onBookmark={handleBookmarkToggle}
          bookmarkedIds={bookmarkedIds}
          onOpenUpload={() => setIsUploadOpen(true)}
          selectedSubject={selectedSubject}
        />
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
