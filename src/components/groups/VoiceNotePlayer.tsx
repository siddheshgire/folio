"use client";

import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Mic } from "lucide-react";

interface VoiceNotePlayerProps {
  duration?: string;
  sender: string;
  isMe: boolean;
}

export function VoiceNotePlayer({
  duration = "0:18",
  sender,
  isMe,
}: VoiceNotePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
    } else {
      setIsPlaying(true);
      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            if (intervalRef.current) clearInterval(intervalRef.current);
            return 0;
          }
          return prev + 5 * playbackSpeed;
        });
      }, 300);
    }
  };

  const cycleSpeed = () => {
    const speeds = [1, 1.5, 2];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    setPlaybackSpeed(speeds[nextIdx]);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // 14 responsive waveform heights for all mobile screen sizes
  const waveformHeights = [40, 75, 35, 90, 60, 95, 45, 80, 50, 85, 40, 65, 85, 45];

  return (
    <div className="flex items-center gap-2 sm:gap-3 w-full max-w-full overflow-hidden py-0.5">
      {/* Play/Pause Button */}
      <button
        type="button"
        onClick={togglePlay}
        className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full transition active:scale-95 shadow flex-shrink-0 ${
          isMe
            ? "bg-white text-brand-600 hover:bg-gray-100"
            : "bg-brand-600 text-white hover:bg-brand-500"
        }`}
        title={isPlaying ? "Pause voice note" : "Play voice note"}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4 sm:h-5 sm:w-5 fill-current" />
        ) : (
          <Play className="h-4 w-4 sm:h-5 sm:w-5 fill-current ml-0.5" />
        )}
      </button>

      {/* Waveform & Scrubber */}
      <div className="flex-1 flex flex-col gap-1 min-w-0">
        <div className="flex items-center gap-0.5 sm:gap-1 h-6 sm:h-7 w-full overflow-hidden">
          {waveformHeights.map((h, idx) => {
            const barProgress = (idx / waveformHeights.length) * 100;
            const isFilled = progress >= barProgress;

            return (
              <div
                key={idx}
                style={{ height: `${h}%` }}
                className={`flex-1 max-w-[4px] rounded-full transition-all duration-150 ${
                  isFilled
                    ? isMe ? "bg-white" : "bg-brand-400"
                    : isMe ? "bg-brand-400/50" : "bg-gray-600"
                }`}
              />
            );
          })}
        </div>

        {/* Timestamps & Info */}
        <div className="flex items-center justify-between text-[9px] sm:text-[10px] text-gray-300 font-mono">
          <span className="flex items-center gap-1 truncate mr-1">
            <Mic className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-brand-300 flex-shrink-0" />
            <span className="truncate">Audio Note</span>
          </span>
          <span className="flex-shrink-0">
            {isPlaying ? `${Math.floor((progress / 100) * 18)}s / ${duration}` : duration}
          </span>
        </div>
      </div>

      {/* Speed Switcher (1x, 1.5x, 2x) */}
      <button
        type="button"
        onClick={cycleSpeed}
        className="rounded-full bg-black/30 hover:bg-black/50 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-white transition border border-white/10 flex-shrink-0 active:scale-95"
        title="Playback Speed"
      >
        {playbackSpeed}x
      </button>
    </div>
  );
}
