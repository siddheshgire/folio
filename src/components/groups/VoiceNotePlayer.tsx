"use client";

import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Mic, Volume2 } from "lucide-react";

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

  // Toggle playback simulation
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

  // Simulated visual waveform heights
  const waveformHeights = [40, 70, 30, 85, 60, 95, 45, 65, 80, 50, 75, 90, 35, 60, 85, 50, 70, 40];

  return (
    <div className="flex items-center gap-3 w-full min-w-[240px] sm:min-w-[280px] pt-1 pb-0.5">
      {/* Play/Pause Button */}
      <button
        type="button"
        onClick={togglePlay}
        className={`flex h-10 w-10 items-center justify-center rounded-full transition active:scale-95 shadow flex-shrink-0 ${
          isMe
            ? "bg-white text-brand-600 hover:bg-gray-100"
            : "bg-brand-600 text-white hover:bg-brand-500"
        }`}
        title={isPlaying ? "Pause voice note" : "Play voice note"}
      >
        {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-0.5" />}
      </button>

      {/* Waveform & Scrubber */}
      <div className="flex-1 flex flex-col gap-1.5 min-w-0">
        <div className="flex items-center gap-1 h-7">
          {waveformHeights.map((h, idx) => {
            const barProgress = (idx / waveformHeights.length) * 100;
            const isFilled = progress >= barProgress;

            return (
              <div
                key={idx}
                style={{ height: `${h}%` }}
                className={`w-1 rounded-full transition-all duration-150 ${
                  isFilled
                    ? isMe ? "bg-white" : "bg-brand-400"
                    : isMe ? "bg-brand-400/50" : "bg-gray-600"
                }`}
              />
            );
          })}
        </div>

        {/* Timestamps & Info */}
        <div className="flex items-center justify-between text-[10px] text-gray-300 font-mono">
          <span className="flex items-center gap-1">
            <Mic className="h-3 w-3 text-brand-300" />
            Voice Note
          </span>
          <span>{isPlaying ? `${Math.floor((progress / 100) * 18)}s / ${duration}` : duration}</span>
        </div>
      </div>

      {/* Speed Switcher (1x, 1.5x, 2x) */}
      <button
        type="button"
        onClick={cycleSpeed}
        className="rounded-full bg-black/30 hover:bg-black/50 px-2 py-0.5 text-[10px] font-bold text-white transition border border-white/10 flex-shrink-0"
        title="Playback Speed"
      >
        {playbackSpeed}x
      </button>
    </div>
  );
}
