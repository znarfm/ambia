"use client";

import React from "react";
import { SleepTimer } from "./sleep-timer";
import { PlaybackControls } from "./playback-controls";
import { VolumeSlider } from "./volume-slider";

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
  return (
    <footer className="bg-surface/80 border-outline-variant/10 safe-area-bottom z-50 flex-shrink-0 border-t backdrop-blur-lg transition-all duration-500">
      <div className="mx-auto max-w-screen-2xl px-8 py-6 md:py-8">
        <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-3 md:gap-4">
          <SleepTimer
            timeLeft={timeLeft}
            activeTimer={activeTimer}
            formatTime={formatTime}
            handleTimerSelect={handleTimerSelect}
            setIsTimerModalOpen={setIsTimerModalOpen}
          />

          <PlaybackControls
            isPlaying={isPlaying}
            activeNoise={activeNoise}
            handlePlayPause={handlePlayPause}
            scrollToSection={scrollToSection}
          />

          <VolumeSlider
            volume={volume}
            setVolume={setVolume}
            handleVolumeWheel={handleVolumeWheel}
          />
        </div>
      </div>
    </footer>
  );
}
