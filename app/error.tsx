"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="bg-surface flex h-dvh flex-col items-center justify-center gap-8 px-6 text-center">
      <div className="bg-error/10 flex h-20 w-20 items-center justify-center rounded-full">
        <AlertCircle className="text-error h-10 w-10" />
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl font-bold tracking-tight">Something went wrong</h2>
        <p className="text-on-surface-variant max-w-xs text-sm leading-relaxed">
          We encountered an unexpected error while preparing your soundscape.
        </p>
      </div>

      <button
        onClick={() => reset()}
        className="bg-primary flex items-center gap-2 rounded-xl px-8 py-4 font-bold text-zinc-950 transition-transform active:scale-95"
      >
        <RefreshCw className="h-4 w-4" />
        Try Again
      </button>
    </div>
  );
}
