"use client";

import React from "react";
import { UploadCloud, FileText, Sparkles, ShieldCheck } from "lucide-react";

interface DragDropOverlayProps {
  isDragging: boolean;
  onDrop: (files: FileList) => void;
  onDragLeave: () => void;
}

export function DragDropOverlay({
  isDragging,
  onDrop,
  onDragLeave,
}: DragDropOverlayProps) {
  if (!isDragging) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onDrop(e.dataTransfer.files);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={onDragLeave}
      onDrop={handleDrop}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-6 animate-in fade-in duration-150"
    >
      <div className="w-full max-w-2xl rounded-3xl border-2 border-dashed border-brand-400 bg-[#0F172A]/90 p-12 text-center shadow-2xl glow-purple flex flex-col items-center justify-center pointer-events-none">
        <div className="relative mb-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-500/20 text-brand-400 border border-brand-500/30 animate-bounce">
            <UploadCloud className="h-10 w-10" />
          </div>
          <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-accent-sky animate-spin" />
        </div>

        <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Drop Files to Auto-Index
        </h3>
        <p className="mt-2 text-sm text-gray-300 max-w-md">
          Release your PDF, lecture slides, or exam notes anywhere. Files will be SHA-256 hashed and added directly to your group vault without compression.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs text-brand-300 font-semibold">
          <span className="rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 flex items-center gap-1.5">
            <FileText className="h-4 w-4 text-rose-400" />
            PDF Documents
          </span>
          <span className="rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 flex items-center gap-1.5">
            <FileText className="h-4 w-4 text-accent-sky" />
            DOCX / PPTX
          </span>
          <span className="rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            Zero Compression
          </span>
        </div>
      </div>
    </div>
  );
}
