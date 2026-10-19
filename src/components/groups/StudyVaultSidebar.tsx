"use client";

import React, { useState } from "react";
import { 
  FolderGit2, 
  Search, 
  FileText, 
  Download, 
  Eye, 
  Bookmark, 
  HardDrive, 
  UploadCloud, 
  Sparkles,
  CheckCircle2,
  Filter
} from "lucide-react";
import { PreviewDocument } from "@/components/viewer/DocumentPreviewModal";

interface StudyVaultSidebarProps {
  resources: PreviewDocument[];
  onPreview: (doc: PreviewDocument) => void;
  onBookmark: (id: string) => void;
  bookmarkedIds: string[];
  onOpenUpload: () => void;
  selectedSubject: string | null;
}

export function StudyVaultSidebar({
  resources,
  onPreview,
  onBookmark,
  bookmarkedIds,
  onOpenUpload,
  selectedSubject,
}: StudyVaultSidebarProps) {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  const filtered = resources.filter((res) => {
    const matchesSubject = !selectedSubject || res.subject.includes(selectedSubject);
    const matchesSearch =
      res.title.toLowerCase().includes(search.toLowerCase()) ||
      res.unit.toLowerCase().includes(search.toLowerCase()) ||
      res.uploader.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === "all" || res.type === filterType;

    return matchesSubject && matchesSearch && matchesType;
  });

  return (
    <aside className="w-80 sm:w-88 flex-shrink-0 flex flex-col border-l border-white/5 bg-[#0D1321] text-gray-300">
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#0F172A]">
        <div className="flex items-center gap-2">
          <FolderGit2 className="h-4 w-4 text-brand-400" />
          <h3 className="font-bold text-sm text-white">Group Study Vault</h3>
        </div>
        <button
          onClick={onOpenUpload}
          className="flex items-center gap-1 rounded-lg bg-brand-600 px-2.5 py-1 text-xs font-semibold text-white shadow hover:bg-brand-500 transition"
        >
          <UploadCloud className="h-3.5 w-3.5" />
          <span>Upload</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-3 border-b border-white/5 space-y-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search notes, formulas, PDFs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg bg-[#1E293B] pl-8 pr-3 py-1.5 text-xs text-gray-200 placeholder-gray-500 border border-white/5 focus:border-brand-500 focus:outline-none"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 text-[11px]">
          {["all", "pdf", "notes"].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`rounded px-2 py-0.5 uppercase tracking-wider font-semibold transition ${
                filterType === t
                  ? "bg-brand-500/20 text-brand-300 border border-brand-500/30"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {t}
            </button>
          ))}
          {selectedSubject && (
            <span className="ml-auto text-[10px] text-accent-sky font-semibold bg-accent-sky/10 px-1.5 py-0.5 rounded border border-accent-sky/20">
              {selectedSubject}
            </span>
          )}
        </div>
      </div>

      {/* Files List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-10 text-xs text-gray-400 space-y-2">
            <FileText className="h-8 w-8 mx-auto text-gray-400 opacity-50" />
            <p>No study resources found matching criteria.</p>
          </div>
        ) : (
          filtered.map((doc) => {
            const isBookmarked = bookmarkedIds.includes(doc.id);
            return (
              <div
                key={doc.id}
                className="group rounded-xl border border-white/5 bg-[#111827] p-3 hover:border-brand-500/30 hover:bg-[#161F33] transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/25 flex-shrink-0 mt-0.5">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 
                        onClick={() => onPreview(doc)}
                        className="text-xs font-semibold text-white truncate cursor-pointer hover:text-brand-300 transition"
                        title={doc.title}
                      >
                        {doc.title}
                      </h4>
                      <p className="text-[10px] text-gray-400 truncate mt-0.5">
                        {doc.unit}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onBookmark(doc.id)}
                    className="text-gray-400 hover:text-amber-400 transition"
                    title={isBookmarked ? "Remove Bookmark" : "Save for Exams"}
                  >
                    <Bookmark className={`h-3.5 w-3.5 ${isBookmarked ? "fill-amber-400 text-amber-400" : ""}`} />
                  </button>
                </div>

                <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-400">
                  <span>{doc.size} • by {doc.uploader}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onPreview(doc)}
                      className="text-brand-400 hover:text-brand-300 font-semibold"
                    >
                      Preview
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Free Tier Quota Indicator Footer */}
      <div className="p-3 border-t border-white/5 bg-[#0A0E18] space-y-1.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1.5 text-gray-400">
            <HardDrive className="h-3.5 w-3.5 text-emerald-400" />
            Storage Used
          </span>
          <span className="font-semibold text-gray-200">48.2 MB / 1 GB</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-gray-800 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-brand-500 to-emerald-400 w-[5%]" />
        </div>
        <div className="text-[10px] text-gray-400 text-right">Free Tier Safe</div>
      </div>
    </aside>
  );
}
