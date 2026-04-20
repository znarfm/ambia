"use client";

import { useEffect, Dispatch, SetStateAction, RefObject } from "react";
import { type NoiseType, NOISE_TYPES } from "./use-noise";

interface PersistenceProps {
  volume: number;
  setVolume: Dispatch<SetStateAction<number>>;
  activeNoise: NoiseType;
  setActiveNoise: Dispatch<SetStateAction<NoiseType>>;
  setAudioVolume: (volume: number) => void;
  isMounted: boolean;
  setIsMounted: Dispatch<SetStateAction<boolean>>;
  sectionsRef: RefObject<(HTMLElement | null)[]>;
}

export function useAmbiaPersistence({
  volume,
  setVolume,
  activeNoise,
  setActiveNoise,
  setAudioVolume,
  isMounted,
  setIsMounted,
  sectionsRef,
}: PersistenceProps) {
  // Load persistence
  useEffect(() => {
    const savedVolume = localStorage.getItem("ambia_volume");
    const savedNoise = localStorage.getItem("ambia_noise");

    setIsMounted(true);
    if (savedVolume) setVolume(parseInt(savedVolume, 10));
    if (savedNoise && (NOISE_TYPES as readonly string[]).includes(savedNoise)) {
      setActiveNoise(savedNoise as NoiseType);
      setTimeout(() => {
        const idx = NOISE_TYPES.indexOf(savedNoise as NoiseType);
        if (idx !== -1) sectionsRef.current?.[idx]?.scrollIntoView({ behavior: "instant" });
      }, 0);
    }
  }, [setVolume, setActiveNoise, setIsMounted, sectionsRef]);

  // Save persistence
  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem("ambia_volume", volume.toString());
    localStorage.setItem("ambia_noise", activeNoise);
    setAudioVolume(volume);
  }, [volume, activeNoise, isMounted, setAudioVolume]);
}
