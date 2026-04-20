import Link from "next/link";
import { Compass, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="bg-surface flex h-dvh flex-col items-center justify-center gap-8 px-6 text-center">
      <div className="bg-primary/10 flex h-20 w-20 items-center justify-center rounded-full">
        <Compass className="text-primary h-10 w-10" />
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl font-bold tracking-tight">Lost in the noise</h2>
        <p className="text-on-surface-variant max-w-xs text-sm leading-relaxed">
          The soundscape you're looking for doesn't exist or has moved.
        </p>
      </div>

      <Link
        href="/"
        className="bg-primary flex items-center gap-2 rounded-xl px-8 py-4 font-bold text-zinc-950 transition-transform active:scale-95"
      >
        <Home className="h-4 w-4" />
        Return Home
      </Link>
    </div>
  );
}
