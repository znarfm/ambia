"use client";

import { useRef, useCallback } from "react";

export type NoiseType = "white" | "pink" | "brown";

export function useNoise() {
  const audioCtx = useRef<AudioContext | null>(null);
  const gainNode = useRef<GainNode | null>(null);
  const sourceNode = useRef<AudioBufferSourceNode | null>(null);
  const buffers = useRef<Record<string, AudioBuffer>>({});

  const createNoiseBuffer = useCallback((type: NoiseType) => {
    if (!audioCtx.current) return null;

    // Return cached buffer if exists
    if (buffers.current[type]) return buffers.current[type];

    const bufferSize = audioCtx.current.sampleRate * 2;
    const buffer = audioCtx.current.createBuffer(1, bufferSize, audioCtx.current.sampleRate);
    const output = buffer.getChannelData(0);

    if (type === "white") {
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.4;
      }
    } else if (type === "pink") {
      let b0, b1, b2, b3, b4, b5, b6;
      b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.969 * b2 + white * 0.153852;
        b3 = 0.8665 * b3 + white * 0.3104856;
        b4 = 0.55 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.016898;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.11; // Voss-McCartney scaling
        b6 = white * 0.115926;
      }
    } else if (type === "brown") {
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        const out = (lastOut + 0.012 * white) / 1.012;
        output[i] = out * 4.5;
        lastOut = out;
      }
    }

    buffers.current[type] = buffer;
    return buffer;
  }, []);

  const start = useCallback(
    (type: NoiseType, volume: number, durationSeconds?: number, onEnded?: () => void) => {
      if (typeof window === "undefined") return;

      if (!audioCtx.current) {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtx.current = new AudioContextClass();
        gainNode.current = audioCtx.current.createGain();
        gainNode.current.connect(audioCtx.current.destination);
      }

      if (audioCtx.current.state === "suspended") {
        audioCtx.current.resume();
      }

      const gainValue = Math.pow(volume / 100, 2) * 0.7;
      gainNode.current!.gain.setValueAtTime(gainValue, audioCtx.current.currentTime);

      if (sourceNode.current) {
        try {
          sourceNode.current.onended = null;
          sourceNode.current.stop();
        } catch {
          // Ignore errors from stopping source
        }
      }

      const buffer = createNoiseBuffer(type);
      if (buffer && audioCtx.current) {
        sourceNode.current = audioCtx.current.createBufferSource();
        sourceNode.current.buffer = buffer;
        sourceNode.current.loop = true;

        if (onEnded) {
          sourceNode.current.onended = onEnded;
        }

        sourceNode.current.connect(gainNode.current!);
        sourceNode.current.start();

        if (durationSeconds && durationSeconds > 0) {
          sourceNode.current.stop(audioCtx.current.currentTime + durationSeconds);
        }
      }
    },
    [createNoiseBuffer],
  );

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

  const setVolume = useCallback((volume: number) => {
    if (gainNode.current && audioCtx.current) {
      const gainValue = Math.pow(volume / 100, 2) * 0.7;
      gainNode.current.gain.setTargetAtTime(gainValue, audioCtx.current.currentTime, 0.1);
    }
  }, []);

  return { start, stop, setVolume };
}
