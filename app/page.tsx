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
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(65);
  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
  const [activeTimer, setActiveTimer] = useState("30M");
  const [activeNoise, setActiveNoise] = useState<NoiseType>("white");

  const { start, stop, setVolume: setAudioVolume } = useNoise();

  // Intersection Observer for active noise sync
  useEffect(() => {
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
  }, []);

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
    if (isPlaying) {
      start(activeNoise, volume);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNoise, isPlaying]);

  useEffect(() => {
    setAudioVolume(volume);
  }, [volume, setAudioVolume]);

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
    <>
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
      <main className="snap-container">
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
      <footer className="bg-surface-container-high border-t border-white/5 z-50">
        <div className="max-w-screen-xl mx-auto px-6 py-6 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Sleep Timer */}
            <div className="flex items-center gap-2">
              <Timer className="text-secondary-dim w-5 h-5" />
              <div className="flex gap-2">
                {["15M", "30M", "60M"].map((time) => (
                  <button
                    key={time}
                    onClick={() => setActiveTimer(time)}
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
                  className="px-3 py-1.5 rounded-lg bg-surface-container-highest text-on-surface hover:bg-primary/20 transition-all flex items-center justify-center"
                  aria-label="Set custom timer"
                >
                  <Plus className="w-4 h-4" />
                </button>
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
      />
    </>
  );
}
