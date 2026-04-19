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
  Volume2
} from "lucide-react";
import { NoiseSection } from "./noise-section";
import { useNoise, type NoiseType } from "./use-noise";
import { TimerModal } from "./timer-modal";

export default function Home() {
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
          document.querySelectorAll(".snap-section")[idx]?.scrollIntoView({ behavior: "instant" });
        }
      }, 0);
    }

    const savedEndTime = localStorage.getItem("ambia_timer_end");
    if (savedEndTime) {
      const endTime = parseInt(savedEndTime);
      const remaining = Math.floor((endTime - Date.now()) / 1000);
      if (remaining > 0) {
        setTimeLeft(remaining);
        setActiveTimer(localStorage.getItem("ambia_timer_label"));
      } else {
        localStorage.removeItem("ambia_timer_end");
        localStorage.removeItem("ambia_timer_label");
      }
    }
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
        localStorage.removeItem("ambia_timer_label");
      }
      return;
    }

    if (timeLeft <= 0) {
      setIsPlaying(false);
      stop();
      setTimeLeft(null);
      setActiveTimer(null);
      if (isMounted) {
        localStorage.removeItem("ambia_timer_end");
        localStorage.removeItem("ambia_timer_label");
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, stop, isMounted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleTimerSelect = (timeStr: string | null) => {
    if (timeStr === null) {
      setTimeLeft(null);
      setActiveTimer(null);
      return;
    }
    const mins = parseInt(timeStr);
    const durationSecs = mins * 60;
    const endTime = Date.now() + durationSecs * 1000;
    
    setTimeLeft(durationSecs);
    setActiveTimer(timeStr);
    if (isMounted) {
      localStorage.setItem("ambia_timer_end", endTime.toString());
      localStorage.setItem("ambia_timer_label", timeStr);
    }
  };

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
      { threshold: 0.6 }
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

  return (
    <div className={`min-h-screen flex flex-col transition-opacity duration-300 ${isMounted ? "opacity-100" : "opacity-0"}`}>
      {/* Fixed Top Navigation */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 py-6 bg-surface/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-4">
          <Waves className="text-primary w-6 h-6" />
        </div>
        <h1 className="font-manrope uppercase tracking-[0.2em] text-sm font-light text-on-surface">
          AMBIA
        </h1>
        <div className="w-6"></div>
      </header>

      {/* Main Content: Snap Scroll Sections */}
      <main className="snap-container flex-grow">
        <NoiseSection
          id="white"
          title="WHITE"
          level="High"
          index="01"
          bgClass="bg-surface"
          overlayGradient="bg-gradient-to-b from-primary/10 to-transparent"
          description="A static, pure wall of sound. Designed to mask sharp environmental interruptions and sharpen focus."
        />

        <NoiseSection
          id="pink"
          title="PINK"
          level="Mid"
          index="02"
          bgClass="bg-surface-container-low"
          textColorClass="text-primary"
          description="Balanced and natural, mimicking the steady rhythm of rainfall or wind through heavy autumn leaves."
        />

        <NoiseSection
          id="brown"
          title="BROWN"
          level="Deep"
          index="03"
          bgClass="bg-surface-container-lowest"
          textColorClass="text-on-primary-container"
          accentColorClass="text-primary-dim"
          description="A deep, powerful rumble. Mimics the roar of a distant ocean or the low hum of a cavernous space."
        />
      </main>

      {/* Persistent Bottom Control Panel */}
      <footer className="fixed bottom-0 left-0 w-full bg-surface-container-high/90 backdrop-blur-lg border-t border-white/5 z-50">
        <div className="max-w-screen-xl mx-auto px-6 py-6 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Sleep Timer */}
            <div className="flex items-center gap-2 min-w-[300px]">
              <div className="flex items-center gap-2">
                <Timer className={`w-5 h-5 ${timeLeft ? "text-primary animate-pulse" : "text-secondary-dim"}`} />
                {timeLeft !== null && (
                  <span className="text-[10px] font-mono font-bold text-primary tabular-nums">
                    {formatTime(timeLeft)}
                  </span>
                )}
              </div>
              <div className="flex gap-1.5 ml-2">
                {["15M", "30M", "60M"].map((time) => (
                  <button
                    key={time}
                    onClick={() => handleTimerSelect(time === activeTimer ? null : time)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-widest transition-all ${
                      activeTimer === time
                        ? "bg-primary-container text-primary"
                        : "bg-surface-container-highest text-on-surface hover:bg-primary/20"
                    }`}
                  >
                    {time}
                  </button>
                ))}
                <button 
                  onClick={() => setIsTimerModalOpen(true)}
                  className={`px-3 py-1.5 rounded-lg bg-surface-container-highest text-on-surface hover:bg-primary/20 transition-all flex items-center justify-center ${
                    activeTimer && !["15M", "30M", "60M"].includes(activeTimer) ? "bg-primary-container text-primary" : ""
                  }`}
                  aria-label="Set custom timer"
                >
                  <Plus className="w-4 h-4" />
                </button>
                {timeLeft !== null && (
                  <button 
                    onClick={() => handleTimerSelect(null)}
                    className="px-3 py-1.5 rounded-lg bg-error-dim/20 text-error-dim hover:bg-error-dim/30 transition-all text-[10px] font-bold tracking-widest"
                  >
                    OFF
                  </button>
                )}
              </div>
            </div>

            {/* Playback Center */}
            <div className="flex items-center gap-6">
              <button 
                onClick={() => {
                  const types: NoiseType[] = ["white", "pink", "brown"];
                  const idx = types.indexOf(activeNoise);
                  scrollToSection((idx - 1 + 3) % 3);
                }}
                className="text-on-surface-variant hover:text-primary transition-colors"
                aria-label="Previous noise type"
              >
                <SkipBack className="w-6 h-6" />
              </button>
              <button 
                onClick={handlePlayPause}
                className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center shadow-lg shadow-primary/10 active:scale-95 transition-transform group"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="w-7 h-7 text-zinc-950 fill-current" />
                ) : (
                  <Play className="w-7 h-7 text-zinc-950 fill-current ml-1" />
                )}
              </button>
              <button 
                onClick={() => {
                  const types: NoiseType[] = ["white", "pink", "brown"];
                  const idx = types.indexOf(activeNoise);
                  scrollToSection((idx + 1) % 3);
                }}
                className="text-on-surface-variant hover:text-primary transition-colors"
                aria-label="Next noise type"
              >
                <SkipForward className="w-6 h-6" />
              </button>
            </div>

            {/* Volume Slider */}
            <div 
              className="flex items-center gap-3 w-full md:w-48"
              onWheel={handleVolumeWheel}
            >
              <Volume1 className="text-secondary-dim w-5 h-5" />
              <div className="flex-grow h-1.5 bg-surface-container-highest rounded-full relative group cursor-pointer">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(parseInt(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  aria-label="Volume slider"
                />
                <div 
                  className="absolute left-0 top-0 h-full bg-primary rounded-full transition-all duration-75"
                  style={{ width: `${volume}%` }}
                ></div>
                <div 
                  className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-primary rounded-full shadow-lg transition-all duration-75"
                  style={{ left: `${volume}%` }}
                ></div>
              </div>
              <Volume2 className="text-secondary-dim w-5 h-5" />
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
