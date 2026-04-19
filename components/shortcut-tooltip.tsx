"use client";

import React from "react";

interface ShortcutTooltipProps {
  shortcut: string;
  children: React.ReactNode;
  className?: string;
  position?: "top" | "bottom" | "left" | "right";
}

export function ShortcutTooltip({
  shortcut,
  children,
  className = "",
  position = "top",
}: ShortcutTooltipProps) {
  const positionClasses = {
    top: "-top-11 left-1/2 -translate-x-1/2 group-hover:-translate-y-1",
    bottom: "-bottom-11 left-1/2 -translate-x-1/2 group-hover:translate-y-1",
    left: "top-1/2 -left-16 -translate-y-1/2 group-hover:-translate-x-1",
    right: "top-1/2 -right-16 -translate-y-1/2 group-hover:translate-x-1",
  };

  const renderKey = (keyString: string) => {
    const symbolMap: Record<string, string> = {
      UP: "↑",
      DOWN: "↓",
      LEFT: "←",
      RIGHT: "→",
    };

    const keys = keyString.split(/(\s[+/]\s)/);

    return (
      <div className="flex items-center gap-1.5">
        {keys.map((k, i) => {
          if (k === " / " || k === " + ") {
            return (
              <span
                key={i}
                className="text-[10px] opacity-40"
                style={{ color: "var(--dynamic-primary)" }}
              >
                {k.trim()}
              </span>
            );
          }
          const displayKey = symbolMap[k] || k;
          return (
            <kbd
              key={i}
              className="bg-surface-container-highest/90 font-manrope flex min-w-[1.6rem] items-center justify-center rounded-md border-b-2 border-white/10 px-2 py-1 text-[10px] font-extrabold tracking-tight shadow-[0_2px_0_0_rgba(0,0,0,0.2)] ring-1 ring-white/10 backdrop-blur-sm transition-all duration-300"
              style={{ color: "var(--dynamic-primary)" }}
            >
              {displayKey}
            </kbd>
          );
        })}
      </div>
    );
  };

  return (
    <div className={`group relative inline-flex items-center justify-center ${className}`}>
      {children}
      <div
        className={`pointer-events-none absolute z-[100] flex items-center justify-center px-2.5 py-1.5 whitespace-nowrap opacity-0 transition-all duration-500 ease-out group-hover:opacity-100 ${positionClasses[position]}`}
      >
        {renderKey(shortcut)}
      </div>
    </div>
  );
}
