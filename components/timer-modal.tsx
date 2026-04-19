"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

interface TimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSetCustomTimer: (minutes: number) => void;
}

export const TimerModal: React.FC<TimerModalProps> = ({ isOpen, onClose, onSetCustomTimer }) => {
  const [customValue, setCustomValue] = useState("");

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

        <h3 className="mb-2 text-xl font-bold tracking-tight">Custom Timer</h3>
        <p className="text-on-surface-variant mb-8 text-sm">Set a duration for your soundscape.</p>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="duration"
              className="text-primary/60 text-[10px] font-bold tracking-widest uppercase"
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
              className="bg-surface-container-highest focus:border-primary/30 rounded-xl border border-white/5 px-4 py-3 transition-colors outline-none"
              autoFocus
            />
          </div>

          <button
            onClick={handleSubmit}
            className="bg-primary hover:bg-primary-dim w-full rounded-xl py-4 font-bold text-zinc-950 transition-colors"
          >
            Set Timer
          </button>
        </div>
      </div>
    </div>
  );
};
