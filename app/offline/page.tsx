"use client";

import { Waves } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="bg-surface flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="bg-surface-variant/30 mb-8 flex h-24 w-24 items-center justify-center rounded-3xl backdrop-blur-xl">
        <Waves className="text-primary h-12 w-12" />
      </div>
      <h1 className="font-manrope text-on-surface text-2xl font-bold tracking-tight">
        Currently Offline
      </h1>
      <p className="text-on-surface-variant mt-2 max-w-xs">
        Ambia is a sanctuary that travels with you. Your saved soundscapes will be available once
        the app is fully cached.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="bg-primary text-on-primary mt-8 rounded-full px-8 py-3 text-sm font-bold tracking-widest uppercase transition-all hover:scale-105 active:scale-95"
      >
        Try Again
      </button>
    </div>
  );
}
