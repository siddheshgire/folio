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
    // Generate simulated original download
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4">
      <div className="flex h-full max-h-[92vh] w-full max-w-5xl flex-col rounded-2xl border border-white/10 bg-[#0F172A] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-white/10 bg-[#1E293B] px-4 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex-shrink-0">
              <FileText className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white truncate">{doc.title}</h3>
                <span className="rounded bg-brand-500/20 px-2 py-0.5 text-[10px] font-semibold text-brand-300 flex-shrink-0">
                  {doc.subject}
                </span>
              </div>
              <p className="text-[11px] text-gray-400 truncate">
                {doc.unit} • {doc.size} • Uploaded by {doc.uploader}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {onBookmark && (
              <button
                type="button"
                onClick={() => onBookmark(doc.id)}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                  isBookmarked
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    : "bg-white/5 text-gray-300 hover:bg-white/10"
                }`}
                title="Bookmark for Exam"
              >
                <Bookmark className={`h-3.5 w-3.5 ${isBookmarked ? "fill-amber-400 text-amber-400" : ""}`} />
                <span className="hidden sm:inline">{isBookmarked ? "Saved" : "Bookmark"}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-brand-500 transition"
              title="Download original uncompressed file"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Download</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-white/10 hover:text-white transition ml-1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Viewer Toolbar */}
        <div className="flex items-center justify-between border-b border-white/5 bg-[#111827] px-4 py-2 text-xs text-gray-400">
          <div className="flex items-center gap-3">
            <span>Page {currentPage} of {totalPages}</span>
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="rounded px-2 py-0.5 bg-white/5 hover:bg-white/10 disabled:opacity-40"
              >
                Prev
              </button>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="rounded px-2 py-0.5 bg-white/5 hover:bg-white/10 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setZoom(z => Math.max(50, z - 15))}
                className="p-1 rounded hover:bg-white/10"
                title="Zoom Out"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </button>
              <span className="font-mono w-10 text-center">{zoom}%</span>
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
              className="p-1 rounded hover:bg-white/10"
              title="Rotate"
            >
              <RotateCw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Document Canvas Body */}
        <div className="flex-1 overflow-auto bg-[#0B0F19] p-4 sm:p-8 flex items-center justify-center">
          <div 
            style={{ 
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              transformOrigin: 'center center',
              transition: 'transform 0.15s ease-out'
            }}
            className="w-full max-w-2xl rounded-xl border border-white/10 bg-[#1E293B] p-8 shadow-2xl text-gray-200 space-y-6"
          >
            {/* Header info inside PDF canvas */}
            <div className="border-b border-white/10 pb-4 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-widest text-brand-400 font-bold">
                  {doc.subject} • Lecture Series
                </span>
                <h2 className="text-xl font-bold text-white mt-1">{doc.title}</h2>
                <div className="text-xs text-gray-400 mt-0.5">{doc.unit}</div>
              </div>
              <span className="rounded bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                Verified Original
              </span>
            </div>

            {/* Simulated rendered PDF page content */}
            <div className="space-y-4 text-xs leading-relaxed text-gray-300 font-sans">
              <h4 className="font-bold text-sm text-white">1. Introduction to CPU Scheduling</h4>
              <p>
                CPU scheduling is the basis of multiprogrammed operating systems. By switching the CPU among processes, the operating system can make the computer more productive. In a single-processor system, only one process can run at a time; any others must wait until the CPU is free and can be rescheduled.
              </p>

              <h4 className="font-bold text-sm text-white pt-2">2. Scheduling Criteria & Performance Metrics</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong className="text-white">CPU Utilization:</strong> Keep the CPU as busy as possible (typically 40% to 90%).</li>
                <li><strong className="text-white">Throughput:</strong> Number of processes completed per unit of time.</li>
                <li><strong className="text-white">Turnaround Time:</strong> Interval from submission to completion.</li>
                <li><strong className="text-white">Waiting Time:</strong> Sum of periods spent waiting in the ready queue.</li>
              </ul>

              <div className="rounded-lg bg-[#0F172A] p-4 border border-brand-500/20 mt-4">
                <div className="text-[11px] font-mono text-brand-300 font-bold mb-1">
                  Formula: Turnaround Time = Completion Time - Arrival Time
                </div>
                <div className="text-[10px] text-gray-400">
                  Waiting Time = Turnaround Time - Burst Time
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-3 flex items-center justify-between text-[10px] text-gray-500">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-emerald-400" />
                Zero compression applied • Bit-for-bit preserved
              </span>
              <span>Page {currentPage} of {totalPages}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
