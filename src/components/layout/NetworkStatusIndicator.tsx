"use client";

import React, { useState, useEffect } from "react";
import { Wifi, WifiOff, Zap } from "lucide-react";

export function NetworkStatusIndicator() {
  const [isOffline, setIsOffline] = useState(false);
  const [connectionType, setConnectionType] = useState<string>("4g");
  const [isSlow, setIsSlow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateStatus = () => {
      setIsOffline(!navigator.onLine);

      // Check Network Information API (supported on Chrome, Edge, Mobile browsers)
      const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      if (conn) {
        setConnectionType(conn.effectiveType || "4g");
        setIsSlow(conn.effectiveType === "2g" || conn.effectiveType === "slow-2g" || conn.effectiveType === "3g" || conn.saveData);
      }
    };

    updateStatus();

    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);

    const conn = (navigator as any).connection;
    if (conn) {
      conn.addEventListener("change", updateStatus);
    }

    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
      if (conn) conn.removeEventListener("change", updateStatus);
    };
  }, []);

  if (isOffline) {
    return (
      <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-950/80 px-3 py-1.5 text-xs text-rose-300 shadow-xl backdrop-blur-md animate-pulse">
        <WifiOff className="h-3.5 w-3.5" />
        <span>Offline — Changes will sync when reconnected</span>
      </div>
    );
  }

  if (isSlow) {
    return (
      <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-950/80 px-3 py-1.5 text-[11px] text-amber-300 shadow-xl backdrop-blur-md">
        <Zap className="h-3.5 w-3.5 text-amber-400" />
        <span>Optimized for Slow 4G / 3G ({connectionType})</span>
      </div>
    );
  }

  return null;
}
