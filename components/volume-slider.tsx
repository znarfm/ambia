import React from "react";
import { Volume1, Volume2 } from "lucide-react";
import { useWebHaptics } from "web-haptics/react";
import { ShortcutTooltip } from "./shortcut-tooltip";

interface VolumeSliderProps {
  volume: number;
  setVolume: (v: number | ((prev: number) => number)) => void;
  handleVolumeWheel: (e: React.WheelEvent) => void;
}

export function VolumeSlider({ volume, setVolume, handleVolumeWheel }: VolumeSliderProps) {
  const haptic = useWebHaptics();

  return (
    <div className="order-2 flex items-center justify-center gap-4 md:order-3 md:justify-end">
      <ShortcutTooltip shortcut="LEFT / RIGHT" className="w-full md:w-48">
        <div
          className="group flex w-full max-w-[200px] items-center gap-3 md:w-48"
          onWheel={handleVolumeWheel}
        >
          <button
            onClick={() => setVolume((v) => Math.max(0, (typeof v === "number" ? v : volume) - 5))}
            className="text-on-surface transition-colors"
            aria-label="Decrease volume"
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
              onChange={(e) => setVolume(parseInt(e.target.value, 10))}
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
            onClick={() =>
              setVolume((v) => Math.min(100, (typeof v === "number" ? v : volume) + 5))
            }
            className="text-on-surface transition-colors"
            aria-label="Increase volume"
          >
            <Volume2 className="h-4 w-4" />
          </button>
        </div>
      </ShortcutTooltip>
    </div>
  );
}
