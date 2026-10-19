"use client";

import React, { useState } from "react";
import { 
  X, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  Presentation,
  FileCode,
  FileArchive
} from "lucide-react";
import { PreviewDocument } from "@/components/viewer/DocumentPreviewModal";
import { getFileMeta } from "@/lib/utils/fileMeta";

interface UploadResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (newDoc: PreviewDocument, messageText?: string) => void;
  defaultSubject?: string | null;
}

export function UploadResourceModal({
  isOpen,
  onClose,
  onUploadSuccess,
  defaultSubject,
}: UploadResourceModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState(defaultSubject || "CS501 Operating Systems");
  const [unit, setUnit] = useState("Unit 2: Process Synchronization & CPU Scheduling");
  const [shareInChat, setShareInChat] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile && !title) return;

    setUploading(true);
    setProgress(30);

    // Simulate reliable upload with SHA-256 hash calculation
    setTimeout(() => {
      setProgress(75);
      setTimeout(() => {
        setProgress(100);
        const filename = selectedFile?.name || `${title.replace(/\s+/g, "_")}.pdf`;
        const fileMeta = getFileMeta(filename);

        const newResource: PreviewDocument = {
          id: "doc_" + Math.random().toString(36).substring(2, 9),
          title: title || filename,
          filename: filename,
          subject: subject,
          unit: unit,
          size: selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB` : "2.4 MB",
          uploader: "You",
          uploadedAt: "Just now",
          type: fileMeta.category === "image" ? "image" : fileMeta.category === "pdf" ? "pdf" : "notes",
          sha256: "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9",
        };

        const messageText = shareInChat 
          ? `Uploaded new study resource: ${newResource.title}` 
          : undefined;

        onUploadSuccess(newResource, messageText);
        setUploading(false);
        onClose();
      }, 400);
    }, 400);
  };

  const currentMeta = selectedFile ? getFileMeta(selectedFile.name) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#111827] shadow-2xl overflow-hidden glass-panel">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-white/10 bg-[#0F172A] px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white font-bold text-xs">
              <UploadCloud className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Upload Any Study File</h3>
              <p className="text-[11px] text-gray-400">PDF, PPTX, DOCX, ZIP, Code & Image Support</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Universal File Picker Drag & Drop Box */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="border-2 border-dashed border-white/15 rounded-xl p-6 text-center hover:border-brand-500/50 bg-[#0B0F19]/50 transition cursor-pointer relative"
          >
            <input
              type="file"
              accept="*/*"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            {selectedFile ? (
              <div className="flex items-center justify-center gap-3 text-left">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${currentMeta?.iconBg} border ${currentMeta?.borderCol} flex-shrink-0`}>
                  {currentMeta?.category === "presentation" ? (
                    <Presentation className="h-5 w-5" />
                  ) : currentMeta?.category === "code" ? (
                    <FileCode className="h-5 w-5" />
                  ) : currentMeta?.category === "archive" ? (
                    <FileArchive className="h-5 w-5" />
                  ) : (
                    <FileText className="h-5 w-5" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-white truncate max-w-xs">
                      {selectedFile.name}
                    </span>
                    <span className={`rounded ${currentMeta?.badgeBg} ${currentMeta?.badgeText} px-1.5 py-0.2 text-[9px] font-bold border ${currentMeta?.borderCol}`}>
                      {currentMeta?.label}
                    </span>
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for Zero-Compression Storage
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <UploadCloud className="h-8 w-8 mx-auto text-brand-400" />
                <div className="text-xs font-semibold text-white">
                  Drop ANY study file here (PDF, PPT, DOCX, ZIP, Code, Images)
                </div>
                <div className="text-[10px] text-gray-400">
                  Preserves original bit-for-bit quality up to 50 MB
                </div>
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
              Resource Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Unit 2 Scheduling Handout + Numericals"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#0B0F19] px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:border-brand-500 focus:outline-none"
            />
          </div>

          {/* Academic Subject & Unit selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#0B0F19] px-3 py-2 text-xs text-white focus:border-brand-500 focus:outline-none"
              >
                <option value="CS501 Operating Systems">CS501 Operating Systems</option>
                <option value="CS502 DBMS">CS502 DBMS</option>
                <option value="CS503 Computer Networks">CS503 Computer Networks</option>
                <option value="General Study Material">General Study Material</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                Unit / Topic
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#0B0F19] px-3 py-2 text-xs text-white focus:border-brand-500 focus:outline-none"
              >
                <option value="Unit 1: Overview & Architecture">Unit 1: Overview & Architecture</option>
                <option value="Unit 2: Process Synchronization & CPU Scheduling">Unit 2: CPU Scheduling</option>
                <option value="Unit 3: Deadlocks & Prevention">Unit 3: Deadlocks & Prevention</option>
                <option value="Unit 4: Virtual Memory & Paging">Unit 4: Virtual Memory & Paging</option>
              </select>
            </div>
          </div>

          {/* Share in chat toggle */}
          <div className="flex items-center gap-2 pt-1">
            <input
              id="shareInChat"
              type="checkbox"
              checked={shareInChat}
              onChange={(e) => setShareInChat(e.target.checked)}
              className="h-4 w-4 rounded border-gray-700 bg-gray-900 text-brand-600 focus:ring-brand-500"
            />
            <label htmlFor="shareInChat" className="text-xs text-gray-300">
              Also share as an interactive card in the group chat feed
            </label>
          </div>

          {/* Progress bar if uploading */}
          {uploading && (
            <div className="space-y-1 pt-1">
              <div className="flex items-center justify-between text-[11px] text-gray-400">
                <span>Encrypting & Storing File...</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-gray-800 overflow-hidden">
                <div
                  style={{ width: `${progress}%` }}
                  className="h-full bg-gradient-to-r from-brand-500 to-emerald-400 transition-all duration-300"
                />
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={uploading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 py-2.5 text-xs font-semibold text-white shadow-lg shadow-brand-500/25 hover:from-brand-500 hover:to-brand-600 active:scale-95 transition disabled:opacity-50"
          >
            {uploading ? (
              <span>Uploading to Private Vault...</span>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4" />
                <span>Upload & Index Resource</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
