import React from "react";
import { Timer, Plus } from "lucide-react";
import { ShortcutTooltip } from "./shortcut-tooltip";

const BASE_TIMERS = ["15", "30", "60"];
const PRESET_TIMERS = BASE_TIMERS.map((m) => `${m}M`);

interface SleepTimerProps {
  timeLeft: number | null;
  activeTimer: string | null;
  formatTime: (secs: number) => string;
  handleTimerSelect: (mins: string | null) => void;
  setIsTimerModalOpen: (open: boolean) => void;
}

export function SleepTimer({
  timeLeft,
  activeTimer,
  formatTime,
  handleTimerSelect,
  setIsTimerModalOpen,
}: SleepTimerProps) {
  const isCustomTimerActive = activeTimer !== null && !PRESET_TIMERS.includes(activeTimer);

  return (
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
        {BASE_TIMERS.map((mins) => (
          <button
            key={mins}
            onClick={() => handleTimerSelect(mins === activeTimer?.replace("M", "") ? null : mins)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border text-[11px] font-bold tracking-tight transition-all active:scale-95"
            style={{
              backgroundColor:
                activeTimer === `${mins}M`
                  ? "var(--dynamic-container)"
                  : "var(--color-surface-variant)",
              borderColor:
                activeTimer === `${mins}M` ? "transparent" : "var(--color-outline-variant)",
              color:
                activeTimer === `${mins}M` ? "var(--dynamic-primary)" : "var(--color-on-surface)",
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
              backgroundColor: isCustomTimerActive ? "var(--dynamic-container)" : undefined,
              color: isCustomTimerActive ? "var(--dynamic-primary)" : undefined,
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
  );
}
