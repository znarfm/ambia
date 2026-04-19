"use client";

import React from "react";
import { Timer, Plus, SkipBack, Play, Pause, SkipForward, Volume1, Volume2 } from "lucide-react";
import { useWebHaptics } from "web-haptics/react";
import { ShortcutTooltip } from "./shortcut-tooltip";

interface FooterProps {
  isPlaying: boolean;
  volume: number;
  timeLeft: number | null;
  activeTimer: string | null;
  formatTime: (secs: number) => string;
  handleTimerSelect: (mins: string | null) => void;
  setIsTimerModalOpen: (open: boolean) => void;
  handlePlayPause: () => void;
  scrollToSection: (idx: number) => void;
  activeNoise: string;
  setVolume: (v: number | ((prev: number) => number)) => void;
  handleVolumeWheel: (e: React.WheelEvent) => void;
}

export function Footer({
  isPlaying,
  volume,
  timeLeft,
  activeTimer,
  formatTime,
  handleTimerSelect,
  setIsTimerModalOpen,
  handlePlayPause,
  scrollToSection,
  activeNoise,
  setVolume,
  handleVolumeWheel,
}: FooterProps) {
  const haptic = useWebHaptics();

  return (
    <footer className="bg-surface/80 border-outline-variant/10 safe-area-bottom z-50 flex-shrink-0 border-t backdrop-blur-lg transition-all duration-500">
      <div className="mx-auto max-w-screen-2xl px-8 py-6 md:py-8">
        <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-3 md:gap-4">
          {/* Left: Sleep Timer */}
          <div className="order-3 flex items-center justify-center gap-3 md:order-1 md:justify-start">
            <div className="bg-surface-variant/30 border-outline-variant/10 flex items-center gap-2 rounded-xl border px-3 py-2.5">
              <Timer
                className="h-4 w-4 transition-colors duration-500"
                style={{
                  color: timeLeft ? "var(--dynamic-primary)" : "var(--color-on-surface-variant)",
                }}
              />
              {timeLeft !== null && (
                <span
                  className="min-w-[45px] font-mono text-sm font-bold tabular-nums transition-colors duration-500"
                  style={{ color: "var(--dynamic-primary)" }}
                >
                  {formatTime(timeLeft)}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              {["15", "30", "60"].map((mins) => (
                <button
                  key={mins}
                  onClick={() =>
                    handleTimerSelect(mins === activeTimer?.replace("M", "") ? null : mins)
                  }
                  className="flex h-11 w-11 items-center justify-center rounded-xl border text-[11px] font-bold tracking-tight transition-all active:scale-95"
                  style={{
                    backgroundColor:
                      activeTimer === `${mins}M`
                        ? "var(--dynamic-container)"
                        : "var(--color-surface-variant)",
                    borderColor:
                      activeTimer === `${mins}M` ? "transparent" : "var(--color-outline-variant)",
                    color:
                      activeTimer === `${mins}M`
                        ? "var(--dynamic-primary)"
                        : "var(--color-on-surface)",
                    opacity: activeTimer === `${mins}M` ? 1 : 1,
                  }}
                  aria-label={`${mins} minute sleep timer`}
                >
                  {mins}
                </button>
              ))}
              <ShortcutTooltip shortcut="T">
                <button
                  onClick={() => setIsTimerModalOpen(true)}
                  className="text-on-surface hover:text-primary bg-surface-variant border-outline-variant hover:bg-surface-variant/80 flex h-11 w-11 items-center justify-center rounded-xl border transition-all active:scale-95"
                  style={{
                    backgroundColor:
                      activeTimer && !["15", "30", "60"].map((m) => `${m}M`).includes(activeTimer!)
                        ? "var(--dynamic-container)"
                        : undefined,
                    color:
                      activeTimer && !["15", "30", "60"].map((m) => `${m}M`).includes(activeTimer!)
                        ? "var(--dynamic-primary)"
                        : undefined,
                  }}
                  aria-label="Set custom timer"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </ShortcutTooltip>
              {timeLeft !== null && (
                <button
                  onClick={() => handleTimerSelect(null)}
                  className="bg-error/10 border-error/20 text-error hover:bg-error/20 flex h-11 w-11 items-center justify-center rounded-xl border text-[11px] font-bold transition-all active:scale-95"
                  aria-label="Turn off timer"
                >
                  OFF
                </button>
              )}
            </div>
          </div>

          {/* Center: Playback Controls */}
          <div className="order-1 flex items-center justify-center gap-8 md:order-2">
            <ShortcutTooltip shortcut="UP">
              <button
                onClick={() => {
                  const types = ["white", "pink", "brown"];
                  const idx = types.indexOf(activeNoise);
                  scrollToSection((idx - 1 + 3) % 3);
                }}
                className="text-on-surface-variant hover:text-on-surface p-2 transition-colors active:scale-90"
                aria-label="Previous noise type"
              >
                <SkipBack className="h-5 w-5 fill-current" />
              </button>
            </ShortcutTooltip>

            <ShortcutTooltip shortcut="SPACE">
              <button
                onClick={handlePlayPause}
                className="group relative flex h-16 w-16 items-center justify-center rounded-full shadow-xl transition-all hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: "var(--dynamic-primary)",
                  color: "var(--dynamic-text)",
                  boxShadow: `0 20px 25px -5px var(--dynamic-glow)`,
                }}
                aria-label={isPlaying ? "Pause noise" : "Play noise"}
              >
                {isPlaying ? (
                  <Pause className="relative z-10 h-8 w-8 fill-current" />
                ) : (
                  <Play className="relative z-10 ml-1 h-8 w-8 fill-current" />
                )}
              </button>
            </ShortcutTooltip>

            <ShortcutTooltip shortcut="DOWN">
              <button
                onClick={() => {
                  const types = ["white", "pink", "brown"];
                  const idx = types.indexOf(activeNoise);
                  scrollToSection((idx + 1) % 3);
                }}
                className="text-on-surface p-2 transition-colors active:scale-90"
                aria-label="Next noise type"
              >
                <SkipForward className="h-5 w-5 fill-current" />
              </button>
            </ShortcutTooltip>
          </div>

          {/* Right: Volume & Settings */}
          <div className="order-2 flex items-center justify-center gap-4 md:order-3 md:justify-end">
            <ShortcutTooltip shortcut="LEFT / RIGHT" className="w-full md:w-48">
              <div
                className="group flex w-full max-w-[200px] items-center gap-3 md:w-48"
                onWheel={handleVolumeWheel}
              >
                <button
                  onClick={() => setVolume(0)}
                  className="text-on-surface transition-colors"
                  aria-label="Mute volume"
                >
                  {volume === 0 ? (
                    <Volume1 className="text-error h-4 w-4" />
                  ) : (
                    <Volume1 className="h-4 w-4" />
                  )}
                </button>

                <div className="relative h-1.5 flex-grow cursor-pointer overflow-hidden rounded-full bg-white/10">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onInput={() => haptic.trigger("selection")}
                    onChange={(e) => setVolume(parseInt(e.target.value))}
                    className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                    aria-label="Volume slider"
                  />
                  <div
                    className="absolute top-0 left-0 h-full transition-all duration-75"
                    style={{
                      width: `${volume}%`,
                      backgroundColor: "var(--dynamic-primary)",
                    }}
                  ></div>
                </div>

                <button
                  onClick={() => setVolume(100)}
                  className="text-on-surface transition-colors"
                  aria-label="Maximum volume"
                >
                  <Volume2 className="h-4 w-4" />
                </button>
              </div>
            </ShortcutTooltip>
          </div>
        </div>
      </div>
    </footer>
  );
}
