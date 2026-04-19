"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Waves,
  Timer,
  Plus,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Volume1,
  Volume2,
  Sun,
  Moon,
} from "lucide-react";
import { NoiseSection } from "../components/noise-section";
import { useNoise, type NoiseType } from "../hooks/use-noise";
import { TimerModal } from "../components/timer-modal";
import { useTheme } from "next-themes";

export default function Home() {
  const { setTheme, resolvedTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(65);
  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
  const [activeTimer, setActiveTimer] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [activeNoise, setActiveNoise] = useState<NoiseType>("white");

  const { start, stop, setVolume: setAudioVolume } = useNoise();

  // Load state from localStorage on mount
  useEffect(() => {
    requestAnimationFrame(() => {
      setIsMounted(true);

      const savedVolume = localStorage.getItem("ambia_volume");
      if (savedVolume) setVolume(parseInt(savedVolume));

      const savedNoise = localStorage.getItem("ambia_noise");
      if (savedNoise) {
        setActiveNoise(savedNoise as NoiseType);
        // Wait for DOM
        setTimeout(() => {
          const sections = ["white", "pink", "brown"];
          const idx = sections.indexOf(savedNoise);
          if (idx !== -1) {
            document
              .querySelectorAll(".snap-section")
              [idx]?.scrollIntoView({ behavior: "instant" });
          }
        }, 0);
      }

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
  }, []);

  // Persist Volume
  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem("ambia_volume", volume.toString());
    setAudioVolume(volume);
  }, [volume, setAudioVolume, isMounted]);

  // Persist Noise Selection
  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem("ambia_noise", activeNoise);
  }, [activeNoise, isMounted]);

  // Sleep Timer Countdown Logic
  useEffect(() => {
    if (timeLeft === null) {
      if (isMounted) {
        localStorage.removeItem("ambia_timer_end");
        localStorage.removeItem("ambia_timer_remaining");
        localStorage.removeItem("ambia_timer_label");
      }
      return;
    }

    if (timeLeft <= 0) {
      requestAnimationFrame(() => {
        setIsPlaying(false);
        stop();
        setTimeLeft(null);
        setActiveTimer(null);
      });
      if (isMounted) {
        localStorage.removeItem("ambia_timer_end");
        localStorage.removeItem("ambia_timer_remaining");
        localStorage.removeItem("ambia_timer_label");
      }
      return;
    }

    // If paused, save remaining seconds and clear absolute end time
    if (!isPlaying) {
      localStorage.setItem("ambia_timer_remaining", timeLeft.toString());
      localStorage.removeItem("ambia_timer_end");
      return;
    }

    // If playing, update absolute end time for background persistence
    const endTime = Date.now() + timeLeft * 1000;
    localStorage.setItem("ambia_timer_end", endTime.toString());
    localStorage.removeItem("ambia_timer_remaining");

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, stop, isMounted, isPlaying]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

  const handleTimerSelect = useCallback(
    (timeStr: string | null) => {
      if (timeStr === null) {
        setTimeLeft(null);
        setActiveTimer(null);
        localStorage.removeItem("ambia_timer_remaining");
        return;
      }
      const mins = parseInt(timeStr);
      const durationSecs = mins * 60;
      const now = Date.now();
      const endTime = now + durationSecs * 1000;

      setTimeLeft(durationSecs);
      setActiveTimer(timeStr);
      if (isMounted) {
        localStorage.setItem("ambia_timer_end", endTime.toString());
        localStorage.setItem("ambia_timer_remaining", durationSecs.toString());
        localStorage.setItem("ambia_timer_label", timeStr);
      }
    },
    [isMounted],
  );

  // Intersection Observer for active noise sync
  useEffect(() => {
    if (!isMounted) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.id) {
            setActiveNoise(entry.target.id as NoiseType);
          }
        });
      },
      {
        root: document.querySelector(".snap-container"),
        threshold: 0.5,
      },
    );

    const sections = document.querySelectorAll(".snap-section");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [isMounted]);

  const handlePlayPause = useCallback(() => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    if (nextState) {
      start(activeNoise, volume);
    } else {
      stop();
    }
  }, [isPlaying, activeNoise, volume, start, stop]);

  // Sync audio when noise type changes while playing
  useEffect(() => {
    if (isPlaying && isMounted) {
      start(activeNoise, volume);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNoise, isPlaying, isMounted]);

  useEffect(() => {
    if (isMounted) {
      setAudioVolume(volume);
    }
  }, [volume, setAudioVolume, isMounted]);

  const scrollToSection = useCallback((index: number) => {
    const sections = document.querySelectorAll(".snap-section");
    sections[index]?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleVolumeWheel = useCallback((e: React.WheelEvent) => {
    setVolume((prev) => {
      const delta = e.deltaY > 0 ? -2 : 2;
      return Math.max(0, Math.min(100, prev + delta));
    });
  }, []);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key.toLowerCase()) {
        case " ":
          e.preventDefault();
          handlePlayPause();
          break;
        case "arrowup":
          e.preventDefault();
          setVolume((v) => Math.min(100, v + 5));
          break;
        case "arrowdown":
          e.preventDefault();
          setVolume((v) => Math.max(0, v - 5));
          break;
        case "arrowleft":
          e.preventDefault();
          const prevIdx = (["white", "pink", "brown"].indexOf(activeNoise) - 1 + 3) % 3;
          scrollToSection(prevIdx);
          break;
        case "arrowright":
          e.preventDefault();
          const nextIdx = (["white", "pink", "brown"].indexOf(activeNoise) + 1) % 3;
          scrollToSection(nextIdx);
          break;
        case "m":
          setTheme(resolvedTheme === "dark" ? "light" : "dark");
          break;
        case "t":
          setIsTimerModalOpen(true);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePlayPause, activeNoise, scrollToSection, setTheme, resolvedTheme, setIsTimerModalOpen]);

  const getDynamicColors = () => {
    const isDark = resolvedTheme === "dark";
    switch (activeNoise) {
      case "white":
        return {
          primary: isDark ? "#FFFFFF" : "#4A4A4A",
          container: isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.08)",
          text: isDark ? "#000000" : "#FFFFFF",
          glow: isDark ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.2)",
        };
      case "pink":
        return {
          primary: "#FFB2BB",
          container: "rgba(255, 178, 187, 0.2)",
          text: "#2D1619",
          glow: "rgba(255, 178, 187, 0.4)",
        };
      case "brown":
        return {
          primary: "#E3C28E",
          container: "rgba(227, 194, 142, 0.2)",
          text: "#2D1F0E",
          glow: "rgba(227, 194, 142, 0.4)",
        };
      default:
        return {
          primary: "#E3C28E",
          container: "rgba(227, 194, 142, 0.2)",
          text: "#2D1F0E",
          glow: "rgba(227, 194, 142, 0.4)",
        };
    }
  };

  const colors = getDynamicColors();

  return (
    <div
      className={`flex h-screen flex-col transition-all duration-700 ${isMounted ? "opacity-100" : "opacity-0"}`}
      style={{
        ["--dynamic-primary" as string]: colors.primary,
        ["--dynamic-container" as string]: colors.container,
        ["--dynamic-text" as string]: colors.text,
        ["--dynamic-glow" as string]: colors.glow,
      }}
    >
      {/* Top Navigation */}
      <header className="bg-surface/80 border-outline-variant/10 sticky top-0 z-50 flex flex-shrink-0 items-center justify-between border-b px-8 py-5 backdrop-blur-md transition-all duration-500">
        <div className="flex items-center gap-4">
          <Waves
            className="text-primary h-7 w-7 transition-all duration-500"
            style={{ color: "var(--dynamic-primary)" }}
          />
        </div>
        <h1 className="font-manrope text-on-surface text-xs font-bold tracking-[0.3em] uppercase opacity-80">
          AMBIA
        </h1>
        <button
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50 flex h-10 w-10 items-center justify-center rounded-full transition-all active:scale-90"
          aria-label="Toggle theme"
        >
          {resolvedTheme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </header>

      {/* Vertical Dot Indicator (Pagination) */}
      <nav className="fixed top-1/2 right-10 z-40 hidden -translate-y-1/2 flex-col gap-6 md:flex">
        {["white", "pink", "brown"].map((type, idx) => (
          <button
            key={type}
            onClick={() => scrollToSection(idx)}
            className="group relative flex items-center justify-center p-2"
            aria-label={`Scroll to ${type} noise`}
          >
            <div
              className={`h-2.5 w-2.5 rounded-full transition-all duration-500 ${
                activeNoise === type ? "scale-125" : "bg-on-surface/20 hover:bg-on-surface/40"
              }`}
              style={{
                backgroundColor: activeNoise === type ? "var(--dynamic-primary)" : undefined,
                boxShadow: activeNoise === type ? "0 0 15px var(--dynamic-glow)" : undefined,
              }}
            ></div>
            <span className="bg-surface text-on-surface border-outline-variant/10 absolute right-full mr-4 scale-90 rounded-md border px-2 py-1 text-[10px] font-bold opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100">
              {type.toUpperCase()}
            </span>
          </button>
        ))}
      </nav>

      {/* Main Content: Snap Scroll Sections */}
      <main className="snap-container flex-grow overflow-y-auto">
        <NoiseSection
          id="white"
          title="WHITE"
          level="High"
          bgClass="bg-surface"
          overlayGradient="bg-gradient-to-b from-white/10 to-transparent"
          description="A static, pure wall of sound. Designed to mask sharp environmental interruptions and sharpen focus."
          auraColors={["bg-white/20", "bg-sky-400/10", "bg-white/10"]}
        />

        <NoiseSection
          id="pink"
          title="PINK"
          level="Mid"
          bgClass="bg-surface-container-low"
          textColorClass="text-[#FFB2BB]"
          description="Balanced and natural, mimicking the steady rhythm of rainfall or wind through heavy autumn leaves."
          auraColors={["bg-rose-400/20", "bg-amber-300/10", "bg-rose-500/10"]}
        />

        <NoiseSection
          id="brown"
          title="BROWN"
          level="Deep"
          bgClass="bg-surface-container-lowest"
          textColorClass="text-[#E3C28E]"
          description="A deep, powerful rumble. Mimics the roar of a distant ocean or the low hum of a cavernous space."
          auraColors={["bg-[#543b1f]/30", "bg-orange-950/20", "bg-amber-900/15"]}
        />
      </main>

      {/* Bottom Control Panel */}
      <footer className="bg-surface/80 safe-area-bottom border-outline-variant/10 z-50 flex-shrink-0 border-t backdrop-blur-lg transition-all duration-500">
        <div className="mx-auto max-w-screen-2xl px-8 py-6 md:py-8">
          <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-3 md:gap-4">
            {/* Left: Sleep Timer */}
            <div className="order-3 flex items-center justify-center gap-3 md:order-1 md:justify-start">
              <div className="bg-surface-variant/30 border-outline-variant/10 flex items-center gap-2 rounded-xl border px-3 py-2.5">
                <Timer
                  className="h-4 w-4 transition-colors duration-500"
                  style={{
                    color: timeLeft ? "var(--dynamic-primary)" : "var(--color-on-surface-variant)",
                  }}
                />
                {timeLeft !== null && (
                  <span
                    className="min-w-[45px] font-mono text-sm font-bold tabular-nums transition-colors duration-500"
                    style={{ color: "var(--dynamic-primary)" }}
                  >
                    {formatTime(timeLeft)}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                {["15", "30", "60"].map((mins) => (
                  <button
                    key={mins}
                    onClick={() =>
                      handleTimerSelect(mins === activeTimer?.replace("M", "") ? null : mins)
                    }
                    className="flex h-11 w-11 items-center justify-center rounded-xl border text-[11px] font-bold tracking-tight transition-all active:scale-95"
                    style={{
                      backgroundColor:
                        activeTimer === `${mins}M`
                          ? "var(--dynamic-container)"
                          : "var(--color-surface-variant)",
                      borderColor:
                        activeTimer === `${mins}M` ? "transparent" : "var(--color-outline-variant)",
                      color:
                        activeTimer === `${mins}M`
                          ? "var(--dynamic-primary)"
                          : "var(--color-on-surface-variant)",
                      opacity: activeTimer === `${mins}M` ? 1 : 0.6,
                    }}
                  >
                    {mins}
                  </button>
                ))}
                <button
                  onClick={() => setIsTimerModalOpen(true)}
                  className="text-on-surface-variant hover:text-on-surface bg-surface-variant border-outline-variant hover:bg-surface-variant/80 flex h-11 w-11 items-center justify-center rounded-xl border transition-all active:scale-95"
                  style={{
                    backgroundColor:
                      activeTimer && !["15", "30", "60"].map((m) => `${m}M`).includes(activeTimer!)
                        ? "var(--dynamic-container)"
                        : undefined,
                    color:
                      activeTimer && !["15", "30", "60"].map((m) => `${m}M`).includes(activeTimer!)
                        ? "var(--dynamic-primary)"
                        : undefined,
                  }}
                  aria-label="Set custom timer"
                >
                  <Plus className="h-5 w-5" />
                </button>
                {timeLeft !== null && (
                  <button
                    onClick={() => handleTimerSelect(null)}
                    className="bg-error/10 border-error/20 text-error hover:bg-error/20 flex h-11 w-11 items-center justify-center rounded-xl border text-[11px] font-bold transition-all active:scale-95"
                  >
                    OFF
                  </button>
                )}
              </div>
            </div>

            {/* Center: Playback Controls */}
            <div className="order-1 flex items-center justify-center gap-8 md:order-2">
              <button
                onClick={() => {
                  const types: NoiseType[] = ["white", "pink", "brown"];
                  const idx = types.indexOf(activeNoise);
                  scrollToSection((idx - 1 + 3) % 3);
                }}
                className="text-on-surface-variant hover:text-on-surface p-2 transition-colors active:scale-90"
                aria-label="Previous noise type"
              >
                <SkipBack className="h-5 w-5 fill-current" />
              </button>

              <button
                onClick={handlePlayPause}
                className="group relative flex h-16 w-16 items-center justify-center rounded-full shadow-xl transition-all hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: "var(--dynamic-primary)",
                  color: "var(--dynamic-text)",
                  boxShadow: `0 20px 25px -5px var(--dynamic-glow)`,
                }}
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="relative z-10 h-8 w-8 fill-current" />
                ) : (
                  <Play className="relative z-10 ml-1 h-8 w-8 fill-current" />
                )}
              </button>

              <button
                onClick={() => {
                  const types: NoiseType[] = ["white", "pink", "brown"];
                  const idx = types.indexOf(activeNoise);
                  scrollToSection((idx + 1) % 3);
                }}
                className="text-on-surface-variant hover:text-on-surface p-2 transition-colors active:scale-90"
                aria-label="Next noise type"
              >
                <SkipForward className="h-5 w-5 fill-current" />
              </button>
            </div>

            {/* Right: Volume & Settings */}
            <div className="order-2 flex items-center justify-center gap-4 md:order-3 md:justify-end">
              <div
                className="group flex w-full max-w-[200px] items-center gap-3 md:w-48"
                onWheel={handleVolumeWheel}
              >
                <button
                  onClick={() => setVolume(0)}
                  className="text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  {volume === 0 ? (
                    <Volume1 className="text-error h-4 w-4" />
                  ) : (
                    <Volume1 className="h-4 w-4" />
                  )}
                </button>

                <div className="relative h-1 flex-grow cursor-pointer overflow-hidden rounded-full bg-white/10">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => setVolume(parseInt(e.target.value))}
                    className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                    aria-label="Volume slider"
                  />
                  <div
                    className="absolute top-0 left-0 h-full transition-all duration-75"
                    style={{
                      width: `${volume}%`,
                      backgroundColor: "var(--dynamic-primary)",
                    }}
                  ></div>
                </div>

                <button
                  onClick={() => setVolume(100)}
                  className="text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  <Volume2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <TimerModal
        isOpen={isTimerModalOpen}
        onClose={() => setIsTimerModalOpen(false)}
        onSetCustomTimer={(mins) => {
          const durationSecs = mins * 60;
          const endTime = Date.now() + durationSecs * 1000;
          setTimeLeft(durationSecs);
          setActiveTimer(`${mins}M`);
          localStorage.setItem("ambia_timer_end", endTime.toString());
          localStorage.setItem("ambia_timer_label", `${mins}M`);
        }}
      />
    </div>
  );
}
