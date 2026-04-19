"use client";

import React, { useState } from "react";
import { X, Timer } from "lucide-react";
import { useWebHaptics } from "web-haptics/react";

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
  const haptic = useWebHaptics();
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
    haptic.trigger("medium");
    const mins = parseInt(customValue);
    if (!isNaN(mins) && mins > 0) {
      onSetCustomTimer(mins);
      setCustomValue("");
      onClose();
    }
  };

  const handleClose = () => {
    haptic.trigger("light");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 overflow-hidden">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-500" 
        onClick={handleClose}
      ></div>
      <div className="bg-surface-container-high/90 animate-in fade-in zoom-in slide-in-from-bottom-8 relative w-full max-w-sm rounded-3xl border border-white/10 p-10 shadow-2xl backdrop-blur-2xl duration-500">
        <button
          onClick={handleClose}
          className="text-on-surface-variant hover:text-on-surface hover:bg-white/5 absolute top-5 right-5 flex h-10 w-10 items-center justify-center rounded-full transition-all active:scale-90"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="animate-in fade-in slide-in-from-bottom-4 delay-150 duration-700">
          <div className="flex items-center gap-3 mb-3">
            <Timer 
              className="w-6 h-6 transition-colors duration-500" 
              style={{ 
                color: "var(--dynamic-primary)",
                filter: "drop-shadow(0 0 8px var(--dynamic-glow))"
              }}
            />
            <h3 className="text-2xl font-bold tracking-tight">Custom Timer</h3>
          </div>
          <p className="text-on-surface-variant mb-10 text-sm leading-relaxed opacity-70">
            Set a duration for your {activeNoise} soundscape. The timer will gently fade out the sound.
          </p>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 delay-300 duration-700 flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <label
              htmlFor="duration"
              className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-50"
              style={{ color: "var(--dynamic-primary)" }}
            >
              Duration (Minutes)
            </label>
            <input
              id="duration"
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="e.g. 45"
              value={customValue}
              onChange={(e) => setCustomValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className="bg-surface-container-highest/50 rounded-2xl border border-white/5 px-5 py-4 text-lg font-medium transition-all outline-none focus:ring-2"
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
