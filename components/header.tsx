"use client";

import React from "react";
import { Waves, Info, Sun, Moon } from "lucide-react";
import { useWebHaptics } from "web-haptics/react";

interface HeaderProps {
  resolvedTheme: string | undefined;
  setTheme: (theme: string) => void;
  setIsAboutModalOpen: (open: boolean) => void;
  isMounted: boolean;
}

export function Header({ resolvedTheme, setTheme, setIsAboutModalOpen, isMounted }: HeaderProps) {
  const haptic = useWebHaptics();

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
      <div className="flex items-center gap-6">
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
      </div>
    </header>
  );
}
