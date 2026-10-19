"use client";

import React, { useState } from "react";
import { 
  Paperclip, 
  Send, 
  Smile, 
  UploadCloud, 
  FileText, 
  Sparkles,
  X
} from "lucide-react";

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  onOpenUpload: () => void;
}

export function ChatInput({ onSendMessage, onOpenUpload }: ChatInputProps) {
  const [text, setText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const emojis = ["🔥", "🙌", "💯", "📚", "💡", "😂", "🚀", "✍️"];

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

  return (
    <div className="relative border-t border-white/5 bg-[#0D1321] p-3 sm:p-4">
      {/* Quick emoji drawer */}
      {showEmojiPicker && (
        <div className="absolute bottom-16 left-4 z-20 flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#1E293B] p-2 shadow-xl animate-in fade-in zoom-in-95">
          {emojis.map((emoji) => (
            <button
              key={emoji}
              onClick={() => addEmoji(emoji)}
              className="rounded-lg p-1.5 text-base hover:bg-white/10 transition active:scale-125"
            >
              {emoji}
            </button>
          ))}
          <button
            onClick={() => setShowEmojiPicker(false)}
            className="p-1 text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <form onSubmit={handleSend} className="flex items-center gap-2">
        {/* Attachment / Upload button */}
        <button
          type="button"
          onClick={onOpenUpload}
          title="Drop Study Material / PDF into Group"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/15 text-brand-400 border border-brand-500/25 hover:bg-brand-500 hover:text-white transition flex-shrink-0"
        >
          <Paperclip className="h-5 w-5" />
        </button>

        {/* Emoji toggle */}
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          title="Insert Reaction / Emoji"
          className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-200 transition flex-shrink-0"
        >
          <Smile className="h-5 w-5" />
        </button>

        {/* Text input */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Type a message or discuss study notes... (Press Enter to send)"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full rounded-xl border border-white/10 bg-[#1E293B] px-4 py-2.5 text-xs sm:text-sm text-gray-100 placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/40"
          />
        </div>

        {/* Send button */}
        <button
          type="submit"
          disabled={!text.trim()}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow-md shadow-brand-500/25 hover:bg-brand-500 active:scale-95 transition disabled:opacity-40 disabled:pointer-events-none flex-shrink-0"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
