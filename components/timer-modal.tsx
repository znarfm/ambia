"use client";

import React, { useState } from "react";
import { X, Timer } from "lucide-react";

interface TimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSetCustomTimer: (minutes: number) => void;
  activeNoise: string;
}

export const TimerModal: React.FC<TimerModalProps> = ({
  isOpen,
  onClose,
  onSetCustomTimer,
  activeNoise,
}) => {
  const [customValue, setCustomValue] = useState("");

  React.useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    const mins = parseInt(customValue);
    if (!isNaN(mins) && mins > 0) {
      onSetCustomTimer(mins);
      setCustomValue("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-surface-container-high animate-in fade-in zoom-in relative w-full max-w-sm rounded-2xl border border-white/10 p-8 shadow-2xl duration-300">
        <button
          onClick={onClose}
          className="text-on-surface-variant hover:text-on-surface absolute top-4 right-4 transition-colors"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <Timer 
            className="w-5 h-5 transition-colors duration-500" 
            style={{ 
              color: "var(--dynamic-primary)",
              filter: "drop-shadow(0 0 5px var(--dynamic-glow))"
            }}
          />
          <h3 className="text-xl font-bold tracking-tight">Custom Timer</h3>
        </div>
        <p className="text-on-surface-variant mb-8 text-sm">Set a duration for your {activeNoise} soundscape.</p>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="duration"
              className="text-[10px] font-bold tracking-widest uppercase opacity-60"
              style={{ color: "var(--dynamic-primary)" }}
            >
              Duration (Minutes)
            </label>
            <input
              id="duration"
              type="number"
              placeholder="e.g. 45"
              value={customValue}
              onChange={(e) => setCustomValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className="bg-surface-container-highest rounded-xl border border-white/5 px-4 py-3 transition-all outline-none focus:ring-2"
              style={{ 
                ["--tw-ring-color" as any]: "var(--dynamic-primary)",
                borderColor: customValue ? "var(--dynamic-primary)" : undefined
              }}
              autoFocus
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full rounded-xl py-4 font-bold transition-all active:scale-95"
            style={{
              backgroundColor: "var(--dynamic-primary)",
              color: "var(--dynamic-text)",
              boxShadow: "0 10px 15px -3px var(--dynamic-glow)",
            }}
          >
            Set Timer
          </button>
        </div>
      </div>
    </div>
  );
};
