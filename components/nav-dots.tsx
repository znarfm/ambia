"use client";

import React from "react";
import { NOISE_TYPES } from "../hooks/use-noise";

interface NavDotsProps {
  activeNoise: string;
  scrollToSection: (idx: number) => void;
}

export function NavDots({ activeNoise, scrollToSection }: NavDotsProps) {
  return (
    <nav className="fixed top-1/2 right-10 z-40 hidden -translate-y-1/2 flex-col gap-6 md:flex">
      {NOISE_TYPES.map((type, idx) => (
        <button
          key={type}
          onClick={() => scrollToSection(idx)}
          className="group relative flex items-center justify-center p-2"
          aria-label={`Scroll to ${type} noise`}
        >
          <div
            className={`h-2.5 w-2.5 rounded-full transition-all duration-500 ${
              activeNoise === type ? "scale-125" : "bg-on-surface/20 hover:bg-on-surface/40"
            }`}
            style={{
              backgroundColor: activeNoise === type ? "var(--dynamic-primary)" : undefined,
              boxShadow: activeNoise === type ? "0 0 15px var(--dynamic-glow)" : undefined,
            }}
          ></div>
          <span className="bg-surface text-on-surface border-outline-variant/10 absolute right-full mr-4 scale-90 rounded-md border px-2 py-1 text-[10px] font-bold opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100">
            {type.toUpperCase()}
          </span>
        </button>
      ))}
    </nav>
  );
}
