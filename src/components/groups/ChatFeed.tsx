"use client";

import React, { useRef, useEffect } from "react";
import { 
  FileText, 
  Download, 
  Eye, 
  CheckCheck, 
  ShieldCheck, 
  Bookmark, 
  Smile, 
  Sparkles,
  CheckCircle2,
  Mic,
  ExternalLink,
  Bot,
  Video,
  Globe,
  FileCode,
  FileArchive,
  Presentation
} from "lucide-react";
import { PreviewDocument } from "@/components/viewer/DocumentPreviewModal";
import { VoiceNotePlayer } from "@/components/groups/VoiceNotePlayer";
import { extractLinks } from "@/lib/utils/linkPreview";
import { getFileMeta } from "@/lib/utils/fileMeta";

export interface ChatMessage {
  id: string;
  sender: string;
  senderColor: string;
  content: string;
  timestamp: string;
  isMe: boolean;
  resource?: PreviewDocument;
  voiceNoteDuration?: string;
  reactions?: Record<string, number>;
}

interface ChatFeedProps {
  messages: ChatMessage[];
  onPreview: (doc: PreviewDocument) => void;
  onBookmark: (id: string) => void;
  bookmarkedIds: string[];
  onAddReaction: (messageId: string, emoji: string) => void;
}

export function ChatFeed({
  messages,
  onPreview,
  onBookmark,
  bookmarkedIds,
  onAddReaction,
}: ChatFeedProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#0B0F19]/70">
      {/* Intro Date Banner */}
      <div className="flex justify-center">
        <span className="rounded-full bg-[#1E293B] border border-white/5 px-3 py-1 text-[11px] font-semibold text-gray-400">
          Real-Time Encrypted Session • Fast 4G / Offline Optimized
        </span>
      </div>

      {messages.map((msg) => {
        const isMe = msg.isMe;
        const links = extractLinks(msg.content);

        return (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 max-w-[90%] sm:max-w-[75%] ${
              isMe ? "ml-auto flex-row-reverse" : ""
            }`}
          >
            {/* Sender Avatar */}
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full ${msg.senderColor} text-white font-bold text-xs flex-shrink-0 uppercase shadow`}
            >
              {msg.sender.slice(0, 2)}
            </div>

            {/* Bubble Content */}
            <div className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
              {/* Sender Name & Time */}
              <div className="flex items-center gap-2 mb-1 text-[11px]">
                <span className={`font-semibold ${isMe ? "text-brand-300" : "text-gray-300"}`}>
                  {msg.sender}
                </span>
                <span className="text-gray-500">{msg.timestamp}</span>
              </div>

              {/* Speech Bubble */}
              <div
                className={`rounded-2xl p-3.5 text-xs sm:text-sm text-gray-100 shadow-md transition ${
                  isMe
                    ? "rounded-tr-sm bg-gradient-to-br from-brand-700/80 to-brand-600/90 border border-brand-500/30"
                    : "rounded-tl-sm bg-[#1E293B] border border-white/5"
                }`}
              >
                {/* Voice Note Player */}
                {msg.voiceNoteDuration ? (
                  <VoiceNotePlayer
                    duration={msg.voiceNoteDuration}
                    sender={msg.sender}
                    isMe={isMe}
                  />
                ) : (
                  msg.content && (
                    <p className="leading-relaxed whitespace-pre-wrap break-words">{msg.content}</p>
                  )
                )}

                {/* Smart Link Preview Cards (ChatGPT, Gemini, YouTube, Web Links) */}
                {links.length > 0 && (
                  <div className="mt-2.5 space-y-2">
                    {links.map((link, idx) => {
                      const isAi = link.provider === "chatgpt" || link.provider === "gemini" || link.provider === "claude";

                      return (
                        <div
                          key={idx}
                          className="rounded-xl border border-white/10 bg-[#0F172A]/90 p-3 shadow-lg hover:border-brand-500/40 transition group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              {isAi ? (
                                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex-shrink-0">
                                  <Bot className="h-4 w-4" />
                                </div>
                              ) : link.provider === "youtube" ? (
                                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30 flex-shrink-0">
                                  <Video className="h-4 w-4" />
                                </div>
                              ) : (
                                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 flex-shrink-0">
                                  <Globe className="h-4 w-4" />
                                </div>
                              )}
                              <div className="min-w-0">
                                <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-bold border ${link.badgeColor}`}>
                                  {link.domain}
                                </span>
                                <h5 className="font-semibold text-xs text-white truncate mt-0.5">
                                  {link.title}
                                </h5>
                              </div>
                            </div>

                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-lg bg-brand-600/30 hover:bg-brand-600 text-brand-300 hover:text-white p-1.5 transition flex-shrink-0"
                              title="Open link in new window"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          </div>

                          <div className="mt-2 text-[10px] text-gray-400 truncate font-mono">
                            {link.url}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Smart Study Drop File Card (Universal Formats: PDF, PPT, DOCX, ZIP, Code) */}
                {msg.resource && (() => {
                  const meta = getFileMeta(msg.resource.filename || msg.resource.title);

                  return (
                    <div className={`mt-2.5 rounded-xl border ${meta.borderCol} bg-[#0F172A]/90 p-3 shadow-lg`}>
                      <div className="flex items-start gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${meta.iconBg} border ${meta.borderCol} flex-shrink-0`}>
                          {meta.category === "presentation" ? (
                            <Presentation className="h-5 w-5" />
                          ) : meta.category === "code" ? (
                            <FileCode className="h-5 w-5" />
                          ) : meta.category === "archive" ? (
                            <FileArchive className="h-5 w-5" />
                          ) : (
                            <FileText className="h-5 w-5" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className={`rounded ${meta.badgeBg} ${meta.badgeText} px-1.5 py-0.2 text-[9px] font-bold border ${meta.borderCol}`}>
                              {meta.label}
                            </span>
                            <h4 
                              onClick={() => onPreview(msg.resource!)}
                              className="font-bold text-xs text-white truncate cursor-pointer hover:text-brand-300 transition"
                            >
                              {msg.resource.title}
                            </h4>
                          </div>

                          <div className="text-[11px] text-gray-400 mt-0.5 truncate">
                            {msg.resource.subject} • {msg.resource.unit}
                          </div>
                          <div className="text-[10px] text-gray-400 mt-0.5">
                            Size: {msg.resource.size} • Original Quality
                          </div>

                          {/* Action Buttons */}
                          <div className="mt-2.5 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => onPreview(msg.resource!)}
                              className="inline-flex items-center gap-1 rounded-lg bg-brand-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-brand-500 transition shadow"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              <span>Preview</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => onBookmark(msg.resource!.id)}
                              className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                                bookmarkedIds.includes(msg.resource.id)
                                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                  : "bg-white/10 text-gray-200 hover:bg-white/20"
                              }`}
                            >
                              <Bookmark className={`h-3.5 w-3.5 ${bookmarkedIds.includes(msg.resource.id) ? "fill-amber-400" : ""}`} />
                              <span>{bookmarkedIds.includes(msg.resource.id) ? "Saved" : "Save"}</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-400">
                        <span className="flex items-center gap-1 text-emerald-400">
                          <CheckCircle2 className="h-3 w-3" />
                          Zero Compression Storage
                        </span>
                        <span>SHA-256 Verified</span>
                      </div>
                    </div>
                  );
                })()}

                {/* Read receipt checkmark */}
                <div className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${isMe ? "text-brand-200" : "text-gray-400"}`}>
                  <CheckCheck className="h-3.5 w-3.5 text-accent-sky" />
                </div>
              </div>

              {/* Reactions Bar */}
              <div className="mt-1 flex items-center gap-1">
                {msg.reactions && Object.entries(msg.reactions).map(([emoji, count]) => (
                  <button
                    key={emoji}
                    onClick={() => onAddReaction(msg.id, emoji)}
                    className="flex items-center gap-1 rounded-full bg-[#1E293B] border border-white/5 px-2 py-0.5 text-xs hover:border-brand-500/30 transition"
                  >
                    <span>{emoji}</span>
                    <span className="text-[10px] font-bold text-gray-400">{count}</span>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => onAddReaction(msg.id, "🔥")}
                  className="rounded-full bg-white/5 p-1 text-[11px] text-gray-400 hover:text-white transition"
                  title="Add reaction"
                >
                  <Smile className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        );
      })}

      <div ref={bottomRef} />
    </div>
  );
}
