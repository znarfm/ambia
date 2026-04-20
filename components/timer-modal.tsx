"use client";

import React, { useState, useRef } from "react";
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
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isAnimate, setIsAnimate] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClose = React.useCallback(() => {
    haptic.trigger("light");
    setIsAnimate(false);
    setTimeout(onClose, 500);
  }, [onClose, haptic]);

  const handleSubmit = React.useCallback(() => {
    haptic.trigger("medium");
    const mins = parseInt(customValue, 10);
    if (!isNaN(mins) && mins > 0) {
      onSetCustomTimer(mins);
      setCustomValue("");
      handleClose();
    }
  }, [customValue, onSetCustomTimer, handleClose, haptic]);

  // Derived state to handle mounting immediately
  if (isOpen && !shouldRender) {
    setShouldRender(true);
  }

  React.useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setIsAnimate(true), 10);
      return () => clearTimeout(timer);
    } else {
      // Defer to avoid cascading render error
      const frame = requestAnimationFrame(() => setIsAnimate(false));
      const timer = setTimeout(() => setShouldRender(false), 500);
      return () => {
        cancelAnimationFrame(frame);
        clearTimeout(timer);
      };
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (isOpen && shouldRender) {
      // Small delay to ensure modal is visible/rendered
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, shouldRender]);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, handleClose]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col justify-end overflow-x-hidden overflow-y-auto p-0 transition-all duration-500 sm:justify-center sm:p-6 ${isAnimate ? "visible" : "invisible"}`}
    >
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-500 ${isAnimate ? "opacity-100" : "opacity-0"}`}
        onClick={handleClose}
      ></div>

      <div
        className={`bg-surface-container-high relative mx-auto max-h-[90dvh] w-[92%] max-w-sm overflow-y-auto rounded-t-[2.5rem] border-t border-white/10 p-8 shadow-2xl backdrop-blur-3xl transition-all duration-500 ease-out sm:my-auto sm:rounded-3xl sm:border sm:p-10 ${
          isAnimate
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-full opacity-0 sm:translate-y-8 sm:scale-95"
        }`}
      >
        {/* Mobile Handle */}
        <div className="mx-auto mb-8 h-1.5 w-12 rounded-full bg-white/10 sm:hidden" />

        <button
          onClick={handleClose}
          className="text-on-surface-variant hover:text-on-surface absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full transition-all hover:bg-white/5 active:scale-90"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="animate-in fade-in slide-in-from-bottom-4 delay-150 duration-700">
          <div className="mb-3 flex items-center gap-3">
            <Timer
              className="h-6 w-6 transition-colors duration-500"
              style={{
                color: "var(--dynamic-primary)",
                filter: "drop-shadow(0 0 8px var(--dynamic-glow))",
              }}
            />
            <h3 className="text-2xl font-bold tracking-tight">Custom Timer</h3>
          </div>
          <p className="text-on-surface-variant mb-10 text-sm leading-relaxed opacity-70">
            Set a duration for your {activeNoise} soundscape.
          </p>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 flex flex-col gap-8 delay-300 duration-700">
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
              ref={inputRef}
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="e.g. 45"
              value={customValue}
              onChange={(e) => setCustomValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className="bg-surface-container-highest/50 rounded-2xl border border-white/5 px-6 py-4 text-lg font-medium transition-all outline-none focus:ring-2 focus:ring-inset"
              style={
                {
                  ["--tw-ring-color" as string]: "var(--dynamic-primary)",
                  borderColor: customValue ? "var(--dynamic-primary)" : undefined,
                } as React.CSSProperties
              }
            />
          </div>

          <button
            onClick={handleSubmit}
            className="mb-6 w-full rounded-2xl py-5 font-bold transition-all active:scale-95 sm:mb-0"
            style={{
              backgroundColor: "var(--dynamic-primary)",
              color: "var(--dynamic-text)",
              boxShadow: "0 10px 20px -5px var(--dynamic-glow)",
              paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))",
            }}
          >
            Set Timer
          </button>
        </div>
      </div>
    </div>
  );
};
