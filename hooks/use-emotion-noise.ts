"use client";

import { useEffect, useRef } from "react";
import { type Emotion } from "./use-emotion";
import { type NoiseType } from "./use-noise";
import { useWebHaptics } from "web-haptics/react";

interface EmotionNoiseProps {
  dominantEmotion: Emotion;
  activeNoise: NoiseType;
  setActiveNoise: (noise: NoiseType) => void;
  scrollToSection: (index: number) => void;
}

export function useEmotionNoise({
  dominantEmotion,
  activeNoise,
  setActiveNoise,
  scrollToSection,
}: EmotionNoiseProps) {
  const haptic = useWebHaptics();
  const prevEmotionRef = useRef<Emotion>(null);

  useEffect(() => {
    if (!dominantEmotion) return;
    if (dominantEmotion === prevEmotionRef.current) return;

    prevEmotionRef.current = dominantEmotion;

    let targetNoise: NoiseType | null = null;

    switch (dominantEmotion) {
      case "angry":
      case "fearful":
      case "disgusted":
        targetNoise = "brown";
        haptic.trigger("heavy"); // single slow pulse
        break;
      case "neutral":
      case "surprised":
        targetNoise = "pink";
        // no haptic
        break;
      case "happy":
      case "sad":
        targetNoise = "white";
        // mock short double-pulse
        haptic.trigger("selection");
        setTimeout(() => haptic.trigger("selection"), 150);
        break;
    }

    if (targetNoise && targetNoise !== activeNoise) {
      setActiveNoise(targetNoise);

      const NOISE_TYPES: NoiseType[] = ["white", "pink", "brown"];
      const idx = NOISE_TYPES.indexOf(targetNoise);
      if (idx !== -1) {
        scrollToSection(idx);
      }
    }
  }, [dominantEmotion, activeNoise, setActiveNoise, scrollToSection, haptic]);
}
