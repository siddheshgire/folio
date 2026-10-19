"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { GroupSidebar } from "@/components/groups/GroupSidebar";
import { ChatFeed, ChatMessage } from "@/components/groups/ChatFeed";
import { ChatInput } from "@/components/groups/ChatInput";
import { StudyVaultSidebar } from "@/components/groups/StudyVaultSidebar";
import { DocumentPreviewModal, PreviewDocument } from "@/components/viewer/DocumentPreviewModal";
import { UploadResourceModal } from "@/components/upload/UploadResourceModal";
import { DragDropOverlay } from "@/components/upload/DragDropOverlay";
import { FolderGit2, MessageSquare, PanelRightClose, PanelRightOpen, ShieldCheck, Mic } from "lucide-react";

export default function GroupWorkspacePage() {
  const params = useParams();
  const { user } = useAuth();

  const [activeChannel, setActiveChannel] = useState("general");
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [showRightSidebar, setShowRightSidebar] = useState(true);
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  // Active Modals
  const [previewDoc, setPreviewDoc] = useState<PreviewDocument | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(["doc_1"]);

  // Initial group resources
  const [resources, setResources] = useState<PreviewDocument[]>([
    {
      id: "doc_1",
      title: "OS Unit 2: Process Synchronization & CPU Scheduling",
      filename: "OS_Unit2_CPU_Scheduling.pdf",
      subject: "CS501 Operating Systems",
      unit: "Unit 2: Process Synchronization & CPU Scheduling",
      size: "4.2 MB",
      uploader: "Siddharth (You)",
      uploadedAt: "Today, 10:44 AM",
      type: "pdf",
      sha256: "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9",
    },
    {
      id: "doc_2",
      title: "DBMS Unit 2: SQL Joins, Triggers & Views Handout",
      filename: "DBMS_SQL_Joins_Reference.pdf",
      subject: "CS502 DBMS",
      unit: "Unit 2: SQL, Joins & Subqueries",
      size: "2.8 MB",
      uploader: "Kavya Sharma",
      uploadedAt: "Yesterday",
      type: "pdf",
      sha256: "131498b5840d0f28329ef31e416a5d48dd99f8d5cfc5c78f14c40590c21fe638",
    },
    {
      id: "doc_3",
      title: "Computer Networks: Subnetting & IP Addressing Cheatsheet",
      filename: "CN_Subnetting_Cheatsheet.pdf",
      subject: "CS503 Computer Networks",
      unit: "Unit 2: Data Link Layer & Addressing",
      size: "1.9 MB",
      uploader: "Aryan Mehta",
      uploadedAt: "2 days ago",
      type: "notes",
      sha256: "9834876dcfb05cb167a5c24953eba58c4ac89b1adf57f28f2f9d09af107ee9f0",
    },
  ]);

  // Initial WhatsApp-style chat feed with Voice Note support
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m1",
      sender: "Aryan Mehta",
      senderColor: "bg-indigo-600",
      content: "Hey team! Anyone have the handwritten notes for OS Unit 2 (CPU Scheduling)? Mid-terms are next Tuesday 😅",
      timestamp: "10:42 AM",
      isMe: false,
    },
    {
      id: "m2",
      sender: "Siddharth (You)",
      senderColor: "bg-brand-600",
      content: "Got you covered! Here is the complete PDF with professor lecture formulas and solved numericals:",
      timestamp: "10:44 AM",
      isMe: true,
      resource: resources[0],
      reactions: { "🔥": 3, "🙌": 2 },
    },
    {
      id: "m3",
      sender: "Aryan Mehta",
      senderColor: "bg-indigo-600",
      content: "",
      voiceNoteDuration: "0:24",
      timestamp: "10:45 AM",
      isMe: false,
      reactions: { "💡": 3 },
    },
    {
      id: "m4",
      sender: "Kavya Sharma",
      senderColor: "bg-emerald-600",
      content: "Life saver!! Aryan, that voice explanation for Round Robin with quantum = 2 cleared up my confusion 100%.",
      timestamp: "10:46 AM",
      isMe: false,
      reactions: { "💡": 2 },
    },
    {
      id: "m5",
      sender: "Rohan Verma",
      senderColor: "bg-amber-600",
      content: "Thanks man! It's so nice that files aren't compressed like on WhatsApp. Handwriting is super sharp on desktop.",
      timestamp: "10:50 AM",
      isMe: false,
      reactions: { "💯": 4 },
    },
  ]);

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

  // Dropping files on the full-screen overlay
  const handleFullWindowFileDrop = (files: FileList) => {
    setIsDraggingFile(false);
    if (!files.length) return;

    const file = files[0];
    const newDoc: PreviewDocument = {
      id: "doc_" + Math.random().toString(36).substring(2, 9),
      title: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
      filename: file.name,
      subject: selectedSubject || "CS501 Operating Systems",
      unit: "Unit 2: Process Synchronization & CPU Scheduling",
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      uploader: user?.displayName ? `${user.displayName} (You)` : "Siddharth (You)",
      uploadedAt: "Just now",
      type: "pdf",
      sha256: "4a7d1ed414474e4033ac29ccb8653d9b",
    };

    handleUploadSuccess(newDoc, `Dropped new study resource: ${newDoc.title}`);
  };

  // Sending a new text message
  const handleSendMessage = (text: string) => {
    const newMsg: ChatMessage = {
      id: "m_" + Date.now(),
      sender: user?.displayName ? `${user.displayName} (You)` : "Siddharth (You)",
      senderColor: "bg-brand-600",
      content: text,
      timestamp: "Just now",
      isMe: true,
      reactions: {},
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  // Sending a new voice note
  const handleSendVoiceNote = (duration: string) => {
    const voiceMsg: ChatMessage = {
      id: "m_" + Date.now(),
      sender: user?.displayName ? `${user.displayName} (You)` : "Siddharth (You)",
      senderColor: "bg-brand-600",
      content: "",
      voiceNoteDuration: duration,
      timestamp: "Just now",
      isMe: true,
      reactions: { "🔥": 1 },
    };
    setMessages((prev) => [...prev, voiceMsg]);
  };

  // Dropping an uploaded file into the group vault + chat feed
  const handleUploadSuccess = (newDoc: PreviewDocument, messageText?: string) => {
    setResources((prev) => [newDoc, ...prev]);

    if (messageText) {
      const dropMessage: ChatMessage = {
        id: "m_" + Date.now(),
        sender: user?.displayName ? `${user.displayName} (You)` : "Siddharth (You)",
        senderColor: "bg-brand-600",
        content: messageText,
        timestamp: "Just now",
        isMe: true,
        resource: newDoc,
        reactions: { "🔥": 1 },
      };
      setMessages((prev) => [...prev, dropMessage]);
    }
  };

  // Bookmark toggle
  const handleBookmarkToggle = (docId: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]
    );
  };

  // Reaction toggle
  const handleAddReaction = (messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const reactions = { ...(msg.reactions || {}) };
          reactions[emoji] = (reactions[emoji] || 0) + 1;
          return { ...msg, reactions };
        }
        return msg;
      })
    );
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0B0F19] text-gray-100 selection:bg-brand-500 selection:text-white relative">
      {/* 1. Left Group Sidebar (Channels, Subjects, Members) */}
      <GroupSidebar
        activeChannel={activeChannel}
        onSelectChannel={setActiveChannel}
        selectedSubject={selectedSubject}
        onSelectSubject={setSelectedSubject}
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
            {selectedSubject && (
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-brand-500/10 border border-brand-500/20 px-2 py-0.5 text-[11px] text-brand-300">
                Filtered: {selectedSubject}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsUploadOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-brand-600/20 text-brand-400 border border-brand-500/30 px-3 py-1.5 text-xs font-semibold hover:bg-brand-600 hover:text-white transition"
            >
              <span>+ Drop Study Note</span>
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
          messages={messages}
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
          resources={resources}
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

      {/* Full-Screen Drag-and-Drop Overlay */}
      <DragDropOverlay
        isDragging={isDraggingFile}
        onDrop={handleFullWindowFileDrop}
        onDragLeave={() => setIsDraggingFile(false)}
      />
    </div>
  );
}
