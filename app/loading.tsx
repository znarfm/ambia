"use client";

import { Waves } from "lucide-react";

export default function Loading() {
  return (
    <div className="bg-surface flex h-screen flex-col items-center justify-center gap-6">
      <div className="relative">
        <div className="bg-primary/20 absolute inset-0 animate-ping rounded-full"></div>
        <Waves className="text-primary h-12 w-12 animate-pulse" />
      </div>
      <p className="font-manrope text-on-surface-variant text-sm font-light tracking-[0.3em] uppercase">
        Ambia is warming up...
      </p>
    </div>
  );
}
