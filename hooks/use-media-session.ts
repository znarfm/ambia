"use client";

import { useEffect } from "react";
import { type NoiseType } from "./use-noise";

interface MediaSessionOptions {
  isPlaying: boolean;
  activeNoise: NoiseType;
  volume: number;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

export function useMediaSession({
  isPlaying,
  activeNoise,
  onPlay,
  onPause,
  onStop,
  onPrevious,
  onNext,
}: MediaSessionOptions) {
  useEffect(() => {
    if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;

    if (isPlaying) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: `${activeNoise.charAt(0).toUpperCase() + activeNoise.slice(1)} Noise`,
        artist: "Ambia",
        album: "Ambia",
        artwork: [
          { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
        ],
      });
      navigator.mediaSession.playbackState = "playing";
    } else {
      navigator.mediaSession.playbackState = "paused";
    }

    navigator.mediaSession.setActionHandler("play", onPlay);
    navigator.mediaSession.setActionHandler("pause", onPause);
    navigator.mediaSession.setActionHandler("stop", onStop);
    navigator.mediaSession.setActionHandler("previoustrack", onPrevious);
    navigator.mediaSession.setActionHandler("nexttrack", onNext);

    return () => {
      navigator.mediaSession.setActionHandler("play", null);
      navigator.mediaSession.setActionHandler("pause", null);
      navigator.mediaSession.setActionHandler("stop", null);
      navigator.mediaSession.setActionHandler("previoustrack", null);
      navigator.mediaSession.setActionHandler("nexttrack", null);
    };
  }, [isPlaying, activeNoise, onPlay, onPause, onStop, onPrevious, onNext]);
}
