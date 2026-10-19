"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Paperclip, 
  Send, 
  Smile, 
  UploadCloud, 
  FileText, 
  Sparkles,
  X,
  Mic,
  Trash2
} from "lucide-react";

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  onSendVoiceNote: (duration: string) => void;
  onOpenUpload: () => void;
}

export function ChatInput({ 
  onSendMessage, 
  onSendVoiceNote, 
  onOpenUpload 
}: ChatInputProps) {
  const [text, setText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const emojis = ["🔥", "🙌", "💯", "📚", "💡", "😂", "🚀", "✍️", "🎯", "📌"];

  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const startRecording = () => {
    setIsRecording(true);
  };

  const cancelRecording = () => {
    setIsRecording(false);
    setRecordingSeconds(0);
  };

  const finishAndSendVoiceNote = () => {
    const mins = Math.floor(recordingSeconds / 60);
    const secs = recordingSeconds % 60;
    const duration = `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    setIsRecording(false);
    onSendVoiceNote(duration === "0:00" ? "0:08" : duration);
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim()) return;
    onSendMessage(text.trim());
    setText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const addEmoji = (emoji: string) => {
    setText((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const formatTimer = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="relative border-t border-white/10 bg-[#0D1321] px-2.5 py-2 sm:px-4 sm:py-3.5 flex-shrink-0 z-20 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      {/* Floating Emoji Drawer */}
      {showEmojiPicker && (
        <div className="absolute bottom-full mb-2 left-2 sm:left-4 z-30 flex items-center gap-1 sm:gap-1.5 rounded-2xl border border-white/15 bg-[#1E293B] p-2 sm:p-2.5 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 max-w-[95vw] overflow-x-auto">
          {emojis.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => addEmoji(emoji)}
              className="rounded-xl p-1.5 sm:p-2 text-base hover:bg-white/10 transition active:scale-125 flex-shrink-0"
            >
              {emoji}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setShowEmojiPicker(false)}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 ml-1 flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Recording State */}
      {isRecording ? (
        <div className="flex items-center justify-between gap-2 sm:gap-3 rounded-2xl bg-rose-950/60 border border-rose-500/40 px-3 py-2 sm:px-4 sm:py-2.5 text-rose-300 animate-in fade-in shadow-xl">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <span className="flex h-2.5 w-2.5 sm:h-3 sm:w-3 relative flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-rose-500"></span>
            </span>
            <span className="font-mono text-xs sm:text-sm font-bold text-white tracking-wider flex-shrink-0">
              {formatTimer(recordingSeconds)}
            </span>
            <span className="text-[11px] text-rose-200 truncate hidden xs:inline">
              Recording...
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={cancelRecording}
              className="p-2 rounded-xl text-gray-400 hover:text-rose-400 hover:bg-white/5 transition active:scale-95"
              title="Discard Recording"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={finishAndSendVoiceNote}
              className="flex items-center gap-1 rounded-xl bg-rose-600 px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-semibold text-white shadow-lg hover:bg-rose-500 active:scale-95 transition"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Send</span>
            </button>
          </div>
        </div>
      ) : (
        /* Normal Chat Form with Mobile Keyboard Optimization */
        <form onSubmit={handleSend} className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Attachment button */}
          <button
            type="button"
            onClick={onOpenUpload}
            title="Upload Any Study Material (PDF, PPT, Code, Notes)"
            className="flex h-10 w-10 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-brand-500/15 text-brand-300 border border-brand-500/30 hover:bg-brand-500 hover:text-white transition active:scale-95 flex-shrink-0"
          >
            <Paperclip className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          {/* Emoji button */}
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            title="Emoji / Reactions"
            className="flex h-10 w-10 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-100 border border-white/5 transition active:scale-95 flex-shrink-0"
          >
            <Smile className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          {/* Text input - 16px text-base on mobile prevents iOS Safari auto-zoom! */}
          <div className="relative flex-1 min-w-0">
            <input
              type="text"
              placeholder="Message circle or drop notes..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full rounded-xl border border-white/10 bg-[#1E293B] px-3.5 py-2 sm:px-4 sm:py-2.5 text-base sm:text-sm text-gray-100 placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/40 transition"
            />
          </div>

          {/* Send or Mic Button */}
          {text.trim() ? (
            <button
              type="submit"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow-md shadow-brand-500/25 hover:bg-brand-500 active:scale-95 transition flex-shrink-0"
              title="Send Message"
            >
              <Send className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={startRecording}
              title="Record Voice Note"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-brand-400 hover:bg-brand-600 hover:text-white border border-brand-500/30 active:scale-95 transition flex-shrink-0"
            >
              <Mic className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          )}
        </form>
      )}
    </div>
  );
}
