"use client";

import { useRef, useCallback, useEffect } from "react";

export const NOISE_TYPES = ["white", "pink", "brown"] as const;
export type NoiseType = (typeof NOISE_TYPES)[number];

const WARMUP_ITERATIONS = 1000;

const NOISE_CONFIG = {
  white: {
    gain: 0.4,
  },
  pink: {
    b0: 0.99886,
    b0w: 0.0555179,
    b1: 0.99332,
    b1w: 0.0750759,
    b2: 0.969,
    b2w: 0.153852,
    b3: 0.8665,
    b3w: 0.3104856,
    b4: 0.55,
    b4w: 0.5329522,
    b5: -0.7616,
    b5w: 0.016898,
    outW: 0.5362,
    b6w: 0.115926,
    gain: 0.11,
  },
  brown: {
    lastOutMult: 1.02,
    whiteMult: 0.02,
    gain: 3.5,
  },
  masterGain: 0.7,
} as const;

export function useNoise() {
  const audioCtx = useRef<AudioContext | null>(null);
  const gainNode = useRef<GainNode | null>(null);
  const sourceNode = useRef<AudioBufferSourceNode | null>(null);
  const buffers = useRef<Record<string, AudioBuffer>>({});
  const isInitializing = useRef(false);

  useEffect(() => {
    return () => {
      if (audioCtx.current) {
        audioCtx.current.close().catch(() => {});
      }
    };
  }, []);

  const createNoiseBuffer = useCallback((type: NoiseType) => {
    if (!audioCtx.current) return null;

    if (buffers.current[type]) return buffers.current[type];

    const sampleRate = audioCtx.current.sampleRate;
    const bufferSize = sampleRate * 30;
    const buffer = audioCtx.current.createBuffer(1, bufferSize, sampleRate);
    const output = buffer.getChannelData(0);

    if (type === "white") {
      const gain = NOISE_CONFIG.white.gain;
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * gain;
      }
    } else if (type === "pink") {
      let b0 = 0.0,
        b1 = 0.0,
        b2 = 0.0,
        b3 = 0.0,
        b4 = 0.0,
        b5 = 0.0,
        b6 = 0.0;

      const {
        b0: cb0,
        b0w,
        b1: cb1,
        b1w,
        b2: cb2,
        b2w,
        b3: cb3,
        b3w,
        b4: cb4,
        b4w,
        b5: cb5,
        b5w,
        outW,
        b6w,
        gain,
      } = NOISE_CONFIG.pink;

      for (let i = 0; i < WARMUP_ITERATIONS; i++) {
        const white = Math.random() * 2 - 1;
        b0 = cb0 * b0 + white * b0w;
        b1 = cb1 * b1 + white * b1w;
        b2 = cb2 * b2 + white * b2w;
        b3 = cb3 * b3 + white * b3w;
        b4 = cb4 * b4 + white * b4w;
        b5 = cb5 * b5 - white * b5w;
        b6 = white * b6w;
      }

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = cb0 * b0 + white * b0w;
        b1 = cb1 * b1 + white * b1w;
        b2 = cb2 * b2 + white * b2w;
        b3 = cb3 * b3 + white * b3w;
        b4 = cb4 * b4 + white * b4w;
        b5 = cb5 * b5 - white * b5w;
        const out = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * outW;
        b6 = white * b6w;
        output[i] = out * gain;
      }
    } else if (type === "brown") {
      let lastOut = 0.0;
      const { whiteMult, lastOutMult, gain } = NOISE_CONFIG.brown;

      for (let i = 0; i < WARMUP_ITERATIONS; i++) {
        const white = Math.random() * 2 - 1;
        lastOut = (lastOut + whiteMult * white) / lastOutMult;
      }

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        lastOut = (lastOut + whiteMult * white) / lastOutMult;
        output[i] = lastOut * gain;
      }
    }

    buffers.current[type] = buffer;
    return buffer;
  }, []);

  const stop = useCallback(() => {
    if (sourceNode.current) {
      try {
        sourceNode.current.onended = null;
        sourceNode.current.stop();
      } catch {
        // Ignore errors from stopping source
      }
      sourceNode.current = null;
    }
  }, []);

  const start = useCallback(
    async (type: NoiseType, volume: number, durationSeconds?: number, onEnded?: () => void) => {
      if (typeof window === "undefined" || isInitializing.current) return;

      try {
        isInitializing.current = true;

        if (!audioCtx.current) {
          const AudioContextClass =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          audioCtx.current = new AudioContextClass();
          gainNode.current = audioCtx.current.createGain();
          gainNode.current.connect(audioCtx.current.destination);
        }

        if (audioCtx.current.state === "suspended") {
          await audioCtx.current.resume();
        }

        const gainValue = Math.pow(volume / 100, 2) * NOISE_CONFIG.masterGain;
        gainNode.current!.gain.setValueAtTime(gainValue, audioCtx.current.currentTime);

        stop();

        const buffer = createNoiseBuffer(type);
        if (buffer && audioCtx.current) {
          const source = audioCtx.current.createBufferSource();
          sourceNode.current = source;

          source.buffer = buffer;
          source.loop = true;

          if (onEnded) {
            source.onended = onEnded;
          }

          source.connect(gainNode.current!);
          source.start();

          if (durationSeconds && durationSeconds > 0) {
            source.stop(audioCtx.current.currentTime + durationSeconds);
          }
        }
      } catch (err) {
        console.error("Failed to start noise:", err);
      } finally {
        isInitializing.current = false;
      }
    },
    [createNoiseBuffer, stop],
  );

  const setVolume = useCallback((volume: number) => {
    if (gainNode.current && audioCtx.current) {
      const v = volume / 100;
      const gainValue = v * v * NOISE_CONFIG.masterGain;
      gainNode.current.gain.setTargetAtTime(gainValue, audioCtx.current.currentTime, 0.1);
    }
  }, []);

  return { start, stop, setVolume };
}
