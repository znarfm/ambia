"use client";

import { useEffect } from "react";

interface ShortcutOptions {
  onPlayPause: () => void;
  onPrevSection: () => void;
  onNextSection: () => void;
  onVolUp: () => void;
  onVolDown: () => void;
  onToggleTheme: () => void;
  onOpenTimer: () => void;
  onOpenAbout: () => void;
}

export function useKeyboardShortcuts({
  onPlayPause,
  onPrevSection,
  onNextSection,
  onVolUp,
  onVolDown,
  onToggleTheme,
  onOpenTimer,
  onOpenAbout,
}: ShortcutOptions) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key.toLowerCase()) {
        case " ":
          e.preventDefault();
          onPlayPause();
          break;
        case "arrowup":
          e.preventDefault();
          onPrevSection();
          break;
        case "arrowdown":
          e.preventDefault();
          onNextSection();
          break;
        case "arrowleft":
          e.preventDefault();
          onVolDown();
          break;
        case "arrowright":
          e.preventDefault();
          onVolUp();
          break;
        case "m":
          onToggleTheme();
          break;
        case "t":
          onOpenTimer();
          break;
        case "a":
          onOpenAbout();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    onPlayPause,
    onPrevSection,
    onNextSection,
    onVolUp,
    onVolDown,
    onToggleTheme,
    onOpenTimer,
    onOpenAbout,
  ]);
}
