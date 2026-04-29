"use client";

import React, { useEffect, useRef } from "react";
import { Waves, Info, Sun, Moon, Smile } from "lucide-react";
import { useWebHaptics } from "web-haptics/react";
import { ShortcutTooltip } from "./shortcut-tooltip";
import { type Emotion } from "../hooks/use-emotion";

interface HeaderProps {
  resolvedTheme: string | undefined;
  setTheme: (theme: string) => void;
  setIsAboutModalOpen: (open: boolean) => void;
  isMounted: boolean;
  isEmotionEnabled: boolean;
  setIsEmotionEnabled: (enabled: boolean) => void;
  stream?: MediaStream | null;
  dominantEmotion?: Emotion;
}

export function Header({
  resolvedTheme,
  setTheme,
  setIsAboutModalOpen,
  isMounted,
  isEmotionEnabled,
  setIsEmotionEnabled,
  stream,
  dominantEmotion,
}: HeaderProps) {
  const haptic = useWebHaptics();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <header className="bg-surface/80 border-outline-variant/10 sticky top-0 z-50 flex flex-shrink-0 items-center justify-between border-b px-8 py-5 backdrop-blur-md transition-all duration-500">
      <button
        onClick={() => {
          haptic.trigger("medium");
          setIsAboutModalOpen(true);
        }}
        className="group flex items-center gap-3 transition-all"
        aria-label="Ambia - About and Settings"
      >
        <Waves
          className="text-primary h-7 w-7 transition-all duration-500"
          style={{ color: "var(--dynamic-primary)" }}
        />
        <h1 className="font-manrope text-on-surface text-xs font-bold tracking-[0.3em] uppercase opacity-80 transition-opacity group-hover:opacity-100">
          AMBIA
        </h1>
      </button>
      <div className="flex items-center gap-2 md:gap-6">
        {isEmotionEnabled && stream && (
          <div className="bg-surface-container-high/80 flex items-center gap-2 rounded-full border border-white/5 p-1 pr-3 shadow-lg backdrop-blur-xl md:gap-3">
            <div className="bg-surface-container-highest relative h-8 w-8 overflow-hidden rounded-full">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="absolute inset-0 h-full w-full scale-x-[-1] object-cover"
              />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-on-surface-variant hidden text-[10px] font-bold tracking-wider uppercase sm:block">
                Mood Sync
              </span>
              <span
                className="text-xs leading-none font-medium capitalize transition-colors duration-500 sm:text-sm"
                style={{ color: "var(--dynamic-primary)" }}
              >
                {dominantEmotion || "Detecting..."}
              </span>
            </div>
          </div>
        )}

        <ShortcutTooltip shortcut="A" position="bottom">
          <button
            onClick={() => {
              haptic.trigger("light");
              setIsAboutModalOpen(true);
            }}
            className="text-on-surface-variant hover:text-on-surface flex h-10 w-10 items-center justify-center rounded-full transition-all hover:bg-white/5 active:scale-90"
            aria-label="About"
          >
            <Info className="h-5 w-5" />
          </button>
        </ShortcutTooltip>
        <ShortcutTooltip shortcut="E" position="bottom">
          <button
            onClick={() => {
              haptic.trigger("light");
              setIsEmotionEnabled(!isEmotionEnabled);
            }}
            className={`flex h-10 w-10 items-center justify-center rounded-full transition-all active:scale-90 ${
              isEmotionEnabled
                ? ""
                : "text-on-surface-variant hover:text-on-surface hover:bg-white/5"
            }`}
            style={
              isEmotionEnabled
                ? { color: "var(--dynamic-primary)", backgroundColor: "var(--dynamic-container)" }
                : {}
            }
            aria-label="Toggle Emotion Tracking"
          >
            <Smile className="h-5 w-5" />
          </button>
        </ShortcutTooltip>
        <ShortcutTooltip shortcut="M" position="bottom">
          <button
            onClick={() => {
              haptic.trigger("light");
              setTheme(resolvedTheme === "dark" ? "light" : "dark");
            }}
            className="text-on-surface-variant hover:text-on-surface flex h-10 w-10 items-center justify-center rounded-full transition-all hover:bg-white/5 active:scale-90"
            aria-label="Toggle theme"
          >
            {!isMounted ? null : resolvedTheme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
        </ShortcutTooltip>
      </div>
    </header>
  );
}
