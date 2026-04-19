"use client";

import { useState } from "react";
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
  X
} from "lucide-react";
import { NoiseSection } from "./noise-section";

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(65);
  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
  const [activeTimer, setActiveTimer] = useState("30M");

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
        <div className="w-6"></div> {/* Spacer for balance */}
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
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Playback Center */}
            <div className="flex items-center gap-6">
              <button className="text-on-surface-variant hover:text-primary transition-colors">
                <SkipBack className="w-6 h-6" />
              </button>
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center shadow-lg shadow-primary/10 active:scale-95 transition-transform group"
              >
                {isPlaying ? (
                  <Pause className="w-7 h-7 text-zinc-950 fill-current" />
                ) : (
                  <Play className="w-7 h-7 text-zinc-950 fill-current ml-1" />
                )}
              </button>
              <button className="text-on-surface-variant hover:text-primary transition-colors">
                <SkipForward className="w-6 h-6" />
              </button>
            </div>

            {/* Volume Slider */}
            <div 
              className="flex items-center gap-3 w-full md:w-48"
              onWheel={(e) => {
                setVolume((prev) => {
                  const delta = e.deltaY > 0 ? -2 : 2;
                  return Math.max(0, Math.min(100, prev + delta));
                });
              }}
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

      {/* Sleep Timer Modal */}
      {isTimerModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsTimerModalOpen(false)}
          ></div>
          <div className="relative w-full max-w-sm bg-surface-container-high border border-white/10 rounded-2xl p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => setIsTimerModalOpen(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-xl font-bold tracking-tight mb-2">Custom Timer</h3>
            <p className="text-on-surface-variant text-sm mb-8">Set a duration for your soundscape.</p>
            
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-primary/60">Duration (Minutes)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 45"
                  className="bg-surface-container-highest border border-white/5 rounded-xl px-4 py-3 outline-none focus:border-primary/30 transition-colors"
                />
              </div>
              
              <button 
                onClick={() => setIsTimerModalOpen(false)}
                className="w-full py-4 bg-primary text-zinc-950 font-bold rounded-xl hover:bg-primary-dim transition-colors"
              >
                Set Timer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
