"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export function useTimer(isMounted: boolean, isPlaying: boolean, onStop: () => void) {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [activeTimer, setActiveTimer] = useState<string | null>(null);
  const endTimeRef = useRef<number | null>(null);

  // Load from localStorage
  useEffect(() => {
    if (!isMounted) return;

    requestAnimationFrame(() => {
      const savedRemaining = localStorage.getItem("ambia_timer_remaining");
      const savedEndTime = localStorage.getItem("ambia_timer_end");
      const savedLabel = localStorage.getItem("ambia_timer_label");

      if (savedRemaining) {
        const remaining = parseInt(savedRemaining);
        if (remaining > 0) {
          setTimeLeft(remaining);
          setActiveTimer(savedLabel);
        }
      } else if (savedEndTime) {
        const endTime = parseInt(savedEndTime);
        const remaining = Math.floor((endTime - Date.now()) / 1000);
        if (remaining > 0) {
          setTimeLeft(remaining);
          setActiveTimer(savedLabel);
        } else {
          localStorage.removeItem("ambia_timer_end");
          localStorage.removeItem("ambia_timer_label");
        }
      }
    });
  }, [isMounted]);

  const clearTimer = useCallback(() => {
    setTimeLeft(null);
    setActiveTimer(null);
    endTimeRef.current = null;
    localStorage.removeItem("ambia_timer_end");
    localStorage.removeItem("ambia_timer_remaining");
    localStorage.removeItem("ambia_timer_label");
  }, []);

  const setTimer = useCallback((mins: number, label: string) => {
    const durationSecs = mins * 60;
    const endTime = Date.now() + durationSecs * 1000;
    setTimeLeft(durationSecs);
    setActiveTimer(label);
    endTimeRef.current = null; // Reset ref to force re-calc in effect
    localStorage.setItem("ambia_timer_end", endTime.toString());
    localStorage.setItem("ambia_timer_remaining", durationSecs.toString());
    localStorage.setItem("ambia_timer_label", label);
  }, []);

  const handleTimerSelect = useCallback(
    (timeStr: string | null) => {
      if (timeStr === null) {
        clearTimer();
        return;
      }
      setTimer(parseInt(timeStr), `${timeStr}M`);
    },
    [clearTimer, setTimer],
  );

  const isTimerInactive = timeLeft === null;

  useEffect(() => {
    if (isTimerInactive || !isMounted) return;

    if (timeLeft !== null && timeLeft <= 0) {
      setTimeout(() => {
        onStop();
        clearTimer();
      }, 0);
      return;
    }

    if (!isPlaying) {
      if (timeLeft !== null) {
        localStorage.setItem("ambia_timer_remaining", timeLeft.toString());
      }
      localStorage.removeItem("ambia_timer_end");
      endTimeRef.current = null;
      return;
    }

    if (!endTimeRef.current) {
      const saved = localStorage.getItem("ambia_timer_end");
      endTimeRef.current = saved ? parseInt(saved) : Date.now() + (timeLeft || 0) * 1000;
      localStorage.setItem("ambia_timer_end", endTimeRef.current.toString());
      localStorage.removeItem("ambia_timer_remaining");
    }

    const timer = setInterval(() => {
      const remaining = Math.max(0, Math.floor((endTimeRef.current! - Date.now()) / 1000));
      setTimeLeft((prev) => (prev !== remaining ? remaining : prev));
      if (remaining <= 0) {
        clearInterval(timer);
        onStop();
        clearTimer();
      }
    }, 100);

    return () => clearInterval(timer);
  }, [isPlaying, isMounted, onStop, isTimerInactive, timeLeft, clearTimer]);

  // Sync on visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && timeLeft !== null && isPlaying) {
        const savedEndTime = localStorage.getItem("ambia_timer_end");
        if (savedEndTime) {
          const remaining = Math.max(0, Math.floor((parseInt(savedEndTime) - Date.now()) / 1000));
          setTimeLeft(remaining);
          if (remaining <= 0) {
            onStop();
            clearTimer();
          }
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [timeLeft, isPlaying, onStop, clearTimer]);

  return { timeLeft, activeTimer, handleTimerSelect, setTimer, clearTimer };
}
