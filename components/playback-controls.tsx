import React from "react";
import { SkipBack, Play, Pause, SkipForward } from "lucide-react";
import { ShortcutTooltip } from "./shortcut-tooltip";
import { NOISE_TYPES, type NoiseType } from "../hooks/use-noise";

interface PlaybackControlsProps {
  isPlaying: boolean;
  activeNoise: string;
  handlePlayPause: () => void;
  scrollToSection: (idx: number) => void;
}

export function PlaybackControls({
  isPlaying,
  activeNoise,
  handlePlayPause,
  scrollToSection,
}: PlaybackControlsProps) {
  return (
    <div className="order-1 flex items-center justify-center gap-8 md:order-2">
      <ShortcutTooltip shortcut="UP">
        <button
          onClick={() => {
            const idx = NOISE_TYPES.indexOf(activeNoise as NoiseType);
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
            const idx = NOISE_TYPES.indexOf(activeNoise as NoiseType);
            scrollToSection((idx + 1) % 3);
          }}
          className="text-on-surface p-2 transition-colors active:scale-90"
          aria-label="Next noise type"
        >
          <SkipForward className="h-5 w-5 fill-current" />
        </button>
      </ShortcutTooltip>
    </div>
  );
}
