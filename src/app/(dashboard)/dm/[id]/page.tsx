"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { useDirectChat } from "@/lib/chat/DirectChatStore";
import { ChatFeed } from "@/components/groups/ChatFeed";
import { ChatInput } from "@/components/groups/ChatInput";
import { DocumentPreviewModal, PreviewDocument } from "@/components/viewer/DocumentPreviewModal";
import { UploadResourceModal } from "@/components/upload/UploadResourceModal";
import { 
  ArrowLeft, 
  ShieldCheck, 
  Lock, 
  MessageSquare, 
  FileText, 
  AlertCircle,
  Plus
} from "lucide-react";

export default function DirectChatPage() {
  const params = useParams();
  const chatId = params.id as string;
  const router = useRouter();

  const { user } = useAuth();
  const { getDirectChat, sendDirectMessage, sendDirectResource } = useDirectChat();

  const chat = getDirectChat(chatId);

  const [previewDoc, setPreviewDoc] = useState<PreviewDocument | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  if (!chat) {
    return (
      <div className="min-h-[100dvh] bg-[#0B0F19] text-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-2xl border border-white/10 bg-[#111827] p-8 text-center space-y-4 glass-panel">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-400 border border-brand-500/20 mx-auto">
            <AlertCircle className="h-7 w-7 text-brand-400" />
          </div>
          <h2 className="text-xl font-bold text-white">Private Chat Not Found</h2>
          <p className="text-xs text-gray-400">
            This direct message thread does not exist or has expired.
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

  const handleSendMessage = (text: string) => {
    sendDirectMessage(chat.id, text);
  };

  const handleSendVoiceNote = (duration: string) => {
    sendDirectMessage(chat.id, "", duration);
  };

  const handleUploadSuccess = (newDoc: PreviewDocument) => {
    sendDirectResource(chat.id, newDoc);
  };

  const handleBookmarkToggle = (docId: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]
    );
  };

  return (
    <div className="flex h-[100dvh] w-screen overflow-hidden bg-[#0B0F19] text-gray-100 flex-col selection:bg-brand-500 selection:text-white">
      {/* Top Header */}
      <header className="h-14 sm:h-16 border-b border-white/5 bg-[#0F172A]/95 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between flex-shrink-0 z-20">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <Link
            href="/dashboard"
            className="p-2 -ml-1 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition active:scale-95"
            title="Back to Dashboard"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          {/* Friend Avatar */}
          <div className="relative flex-shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-accent-sky text-white font-bold text-xs uppercase shadow">
              {chat.friendName.slice(0, 2)}
            </div>
            <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-[#0F172A]" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="font-bold text-xs sm:text-sm text-white truncate max-w-[130px] sm:max-w-xs">{chat.friendName}</h2>
              <span className="rounded bg-emerald-500/10 px-1.5 py-0.2 text-[9px] font-semibold text-emerald-400 border border-emerald-500/20 hidden xs:inline flex-shrink-0">
                1-on-1
              </span>
            </div>
            <p className="text-[10px] text-gray-400 truncate max-w-[150px] sm:max-w-xs">{chat.friendEmail}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-brand-500 transition active:scale-95"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Send Study Note</span>
            <span className="inline sm:hidden">Note</span>
          </button>
        </div>
      </header>

      {/* Main Chat Feed */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[#0B0F19] relative">
        <ChatFeed
          messages={chat.messages}
          onPreview={(doc) => setPreviewDoc(doc)}
          onBookmark={handleBookmarkToggle}
          bookmarkedIds={bookmarkedIds}
          onAddReaction={() => {}}
        />

        {/* Input Bar with Voice Notes */}
        <ChatInput
          onSendMessage={handleSendMessage}
          onSendVoiceNote={handleSendVoiceNote}
          onOpenUpload={() => setIsUploadOpen(true)}
        />
      </main>

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
      />
    </div>
  );
}
