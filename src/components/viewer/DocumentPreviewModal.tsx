"use client";

import React, { useState } from "react";
import { 
  X, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  FileText, 
  Maximize2, 
  CheckCircle2, 
  ShieldCheck,
  Bookmark
} from "lucide-react";

export interface PreviewDocument {
  id: string;
  title: string;
  filename: string;
  subject: string;
  unit: string;
  size: string;
  uploader: string;
  uploadedAt: string;
  type: "pdf" | "image" | "notes";
  sha256?: string;
}

interface DocumentPreviewModalProps {
  doc: PreviewDocument | null;
  onClose: () => void;
  onBookmark?: (id: string) => void;
  isBookmarked?: boolean;
}

export function DocumentPreviewModal({
  doc,
  onClose,
  onBookmark,
  isBookmarked = false,
}: DocumentPreviewModalProps) {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 14;

  if (!doc) return null;

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([
      `FOLIO Original Document: ${doc.title}\nSubject: ${doc.subject}\nUnit: ${doc.unit}\nVerified SHA-256: ${doc.sha256 || "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"}\n\n[This is a verified academic resource from your study group].`
    ], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = doc.filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-1 sm:p-4">
      <div className="flex h-[98dvh] sm:h-full sm:max-h-[92vh] w-full max-w-5xl flex-col rounded-2xl border border-white/10 bg-[#0F172A] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-white/10 bg-[#1E293B] px-3 sm:px-4 py-2.5 sm:py-3 flex-shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex-shrink-0">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-xs sm:text-sm text-white truncate max-w-[150px] sm:max-w-xs">{doc.title}</h3>
                <span className="rounded bg-brand-500/20 px-1.5 py-0.2 text-[9px] font-semibold text-brand-300 flex-shrink-0 hidden xs:inline">
                  {doc.subject}
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-gray-400 truncate">
                {doc.unit} • {doc.size}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {onBookmark && (
              <button
                type="button"
                onClick={() => onBookmark(doc.id)}
                className={`flex items-center gap-1 rounded-lg px-2 sm:px-2.5 py-1.5 text-xs font-medium transition active:scale-95 ${
                  isBookmarked
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    : "bg-white/5 text-gray-300 hover:bg-white/10"
                }`}
                title="Bookmark for Exam"
              >
                <Bookmark className={`h-3.5 w-3.5 ${isBookmarked ? "fill-amber-400 text-amber-400" : ""}`} />
                <span className="hidden sm:inline">{isBookmarked ? "Saved" : "Save"}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-1 rounded-lg bg-brand-600 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-brand-500 transition active:scale-95"
              title="Download original uncompressed file"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Download</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-white/10 hover:text-white transition active:scale-95"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Viewer Toolbar */}
        <div className="flex items-center justify-between border-b border-white/5 bg-[#111827] px-3 sm:px-4 py-2 text-xs text-gray-400 flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-[11px]">P. {currentPage}/{totalPages}</span>
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="rounded px-2 py-0.5 bg-white/5 hover:bg-white/10 disabled:opacity-40 text-xs"
              >
                Prev
              </button>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="rounded px-2 py-0.5 bg-white/5 hover:bg-white/10 disabled:opacity-40 text-xs"
              >
                Next
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-0.5 sm:gap-1">
              <button
                onClick={() => setZoom(z => Math.max(50, z - 15))}
                className="p-1 rounded hover:bg-white/10"
                title="Zoom Out"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </button>
              <span className="font-mono text-[11px] w-9 text-center">{zoom}%</span>
              <button
                onClick={() => setZoom(z => Math.min(180, z + 15))}
                className="p-1 rounded hover:bg-white/10"
                title="Zoom In"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </button>
            </div>

            <button
              onClick={() => setRotation(r => (r + 90) % 360)}
              className="p-1 rounded hover:bg-white/10 hidden xs:inline"
              title="Rotate"
            >
              <RotateCw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Document Canvas Body */}
        <div className="flex-1 overflow-auto bg-[#0B0F19] p-3 sm:p-8 flex items-start sm:items-center justify-center">
          <div 
            style={{ 
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              transformOrigin: 'top center',
              transition: 'transform 0.15s ease-out'
            }}
            className="w-full max-w-2xl rounded-xl border border-white/10 bg-[#1E293B] p-4 sm:p-8 shadow-2xl text-gray-200 space-y-4 sm:space-y-6"
          >
            <div className="border-b border-white/10 pb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] sm:text-xs uppercase tracking-widest text-brand-400 font-bold">
                  {doc.subject} • Lecture Note
                </span>
                <h2 className="text-base sm:text-xl font-bold text-white mt-0.5">{doc.title}</h2>
                <div className="text-[11px] text-gray-400 mt-0.5">{doc.unit}</div>
              </div>
              <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[9px] sm:text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                Verified Original
              </span>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-gray-300 font-sans">
              <h4 className="font-bold text-xs sm:text-sm text-white">1. Introduction to CPU Scheduling</h4>
              <p>
                CPU scheduling is the basis of multiprogrammed operating systems. By switching the CPU among processes, the operating system can make the computer more productive.
              </p>

              <h4 className="font-bold text-xs sm:text-sm text-white pt-1">2. Scheduling Criteria & Performance Metrics</h4>
              <ul className="list-disc pl-4 space-y-1 text-[11px] sm:text-xs">
                <li><strong className="text-white">CPU Utilization:</strong> Keep CPU busy (40% to 90%).</li>
                <li><strong className="text-white">Throughput:</strong> Processes completed per unit of time.</li>
                <li><strong className="text-white">Turnaround Time:</strong> Total submission to completion.</li>
              </ul>

              <div className="rounded-lg bg-[#0F172A] p-3 border border-brand-500/20 mt-3">
                <div className="text-[10px] sm:text-[11px] font-mono text-brand-300 font-bold">
                  Formula: Turnaround Time = Completion Time - Arrival Time
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-2.5 flex items-center justify-between text-[10px] text-gray-500">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-emerald-400" />
                Original Quality Preserved
              </span>
              <span>P. {currentPage} of {totalPages}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
