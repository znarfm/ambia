"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { useWebHaptics } from "web-haptics/react";

import { NoiseSection } from "../components/noise-section";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { NavDots } from "../components/nav-dots";
import { AboutModal } from "../components/about-modal";

import { useNoise, type NoiseType } from "../hooks/use-noise";
import { useTimer } from "../hooks/use-timer";
import { useMediaSession } from "../hooks/use-media-session";
import { useKeyboardShortcuts } from "../hooks/use-keyboard-shortcuts";

const TimerModal = dynamic(
  () => import("../components/timer-modal").then((mod) => mod.TimerModal),
  { ssr: false },
);

const AURA_COLORS = {
  white: ["bg-white/20", "bg-sky-400/10", "bg-white/10"],
  pink: ["bg-rose-400/30", "bg-rose-300/15", "bg-rose-500/15"],
  brown: ["bg-orange-900/30", "bg-orange-950/20", "bg-amber-900/15"],
};

export default function Home() {
  const haptic = useWebHaptics();
  const { setTheme, resolvedTheme } = useTheme();

  const [isMounted, setIsMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(65);
  const [activeNoise, setActiveNoise] = useState<NoiseType>("white");

  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  const sectionsRef = useRef<(HTMLElement | null)[]>([]);
  const dummyAudioRef = useRef<HTMLAudioElement | null>(null);

  const { start, stop, setVolume: setAudioVolume } = useNoise();

  const handleStopAudio = useCallback(() => {
    setIsPlaying(false);
    stop();
    if (dummyAudioRef.current) {
      dummyAudioRef.current.pause();
      dummyAudioRef.current.currentTime = 0;
    }
  }, [stop]);

  const { timeLeft, activeTimer, handleTimerSelect, setTimer, clearTimer } = useTimer(
    isMounted,
    isPlaying,
    handleStopAudio,
  );

  const stopAll = useCallback(() => {
    handleStopAudio();
    clearTimer();
  }, [handleStopAudio, clearTimer]);

  // Load persistence
  useEffect(() => {
    const savedVolume = localStorage.getItem("ambia_volume");
    const savedNoise = localStorage.getItem("ambia_noise");

    setIsMounted(true);
    if (savedVolume) setVolume(parseInt(savedVolume, 10));
    if (savedNoise) {
      setActiveNoise(savedNoise as NoiseType);
      setTimeout(() => {
        const sections = ["white", "pink", "brown"];
        const idx = sections.indexOf(savedNoise);
        if (idx !== -1) sectionsRef.current[idx]?.scrollIntoView({ behavior: "instant" });
      }, 0);
    }
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem("ambia_volume", volume.toString());
    localStorage.setItem("ambia_noise", activeNoise);
    setAudioVolume(volume);
  }, [volume, activeNoise, isMounted, setAudioVolume]);

  const scrollToSection = useCallback(
    (index: number) => {
      haptic.trigger("selection");
      sectionsRef.current[index]?.scrollIntoView({ behavior: "smooth" });
    },
    [haptic],
  );

  const handlePlayPause = useCallback(() => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    if (nextState) {
      haptic.trigger("medium");
      start(activeNoise, volume, timeLeft || undefined, handleStopAudio);
      dummyAudioRef.current?.play().catch(() => {});
    } else {
      haptic.trigger("light");
      stop();
      dummyAudioRef.current?.pause();
    }
  }, [isPlaying, activeNoise, volume, start, stop, haptic, timeLeft, handleStopAudio]);

  // Sync audio when noise type changes while playing
  useEffect(() => {
    if (isPlaying && isMounted) {
      start(activeNoise, volume, timeLeft || undefined, handleStopAudio);
    }
  }, [activeNoise, isPlaying, isMounted, start, volume, timeLeft, handleStopAudio]);

  useMediaSession({
    isPlaying,
    activeNoise,
    volume,
    onPlay: handlePlayPause,
    onPause: handlePlayPause,
    onStop: stopAll,
    onPrevious: () => {
      const idx = (["white", "pink", "brown"].indexOf(activeNoise) - 1 + 3) % 3;
      scrollToSection(idx);
    },
    onNext: () => {
      const idx = (["white", "pink", "brown"].indexOf(activeNoise) + 1) % 3;
      scrollToSection(idx);
    },
  });

  useKeyboardShortcuts({
    onPlayPause: handlePlayPause,
    onPrevSection: () => {
      const idx = (["white", "pink", "brown"].indexOf(activeNoise) - 1 + 3) % 3;
      scrollToSection(idx);
    },
    onNextSection: () => {
      const idx = (["white", "pink", "brown"].indexOf(activeNoise) + 1) % 3;
      scrollToSection(idx);
    },
    onVolUp: () => setVolume((v) => Math.min(100, v + 5)),
    onVolDown: () => setVolume((v) => Math.max(0, v - 5)),
    onToggleTheme: () => setTheme(resolvedTheme === "dark" ? "light" : "dark"),
    onOpenTimer: () => setIsTimerModalOpen(true),
    onOpenAbout: () => setIsAboutModalOpen(true),
  });

  // Intersection Observer for scroll sync
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
      { root: document.querySelector(".snap-container"), threshold: 0.5 },
    );
    const sections = sectionsRef.current;
    sections.forEach((s) => s && observer.observe(s));
    return () => observer.disconnect();
  }, [isMounted]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return hrs > 0
      ? `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
      : `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className={`flex h-dvh flex-col transition-colors duration-700 noise-${activeNoise}`}>
      <Header
        isMounted={isMounted}
        resolvedTheme={resolvedTheme}
        setTheme={setTheme}
        setIsAboutModalOpen={setIsAboutModalOpen}
      />

      <NavDots activeNoise={activeNoise} scrollToSection={scrollToSection} />

      <main className="snap-container flex-grow overflow-y-auto">
        <NoiseSection
          ref={(el) => {
            sectionsRef.current[0] = el;
          }}
          id="white"
          title="WHITE"
          level="High"
          bgClass="bg-surface"
          overlayGradient="bg-gradient-to-b from-white/10 to-transparent"
          description="A static, pure wall of sound. Designed to mask sharp environmental interruptions and sharpen focus."
          auraColors={AURA_COLORS.white}
        />
        <NoiseSection
          ref={(el) => {
            sectionsRef.current[1] = el;
          }}
          id="pink"
          title="PINK"
          level="Mid"
          bgClass="bg-surface-container-low"
          description="Balanced and natural, mimicking the steady rhythm of rainfall or wind through heavy autumn leaves."
          auraColors={AURA_COLORS.pink}
        />
        <NoiseSection
          ref={(el) => {
            sectionsRef.current[2] = el;
          }}
          id="brown"
          title="BROWN"
          level="Deep"
          bgClass="bg-surface-container-lowest"
          description="A deep, powerful rumble. Mimics the roar of a distant ocean or the low hum of a cavernous space."
          auraColors={AURA_COLORS.brown}
        />
      </main>

      <Footer
        isPlaying={isPlaying}
        volume={volume}
        timeLeft={timeLeft}
        activeTimer={activeTimer}
        formatTime={formatTime}
        handleTimerSelect={handleTimerSelect}
        setIsTimerModalOpen={setIsTimerModalOpen}
        handlePlayPause={handlePlayPause}
        scrollToSection={scrollToSection}
        activeNoise={activeNoise}
        setVolume={setVolume}
        handleVolumeWheel={(e) => {
          haptic.trigger("selection");
          setVolume((v) => (e.deltaY > 0 ? Math.max(0, v - 2) : Math.min(100, v + 2)));
        }}
      />

      <TimerModal
        isOpen={isTimerModalOpen}
        onClose={() => setIsTimerModalOpen(false)}
        activeNoise={activeNoise}
        onSetCustomTimer={(mins) => setTimer(mins, `${mins}M`)}
      />

      <AboutModal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} />

      <audio
        ref={dummyAudioRef}
        loop
        playsInline
        className="hidden"
        src="data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA=="
      />
    </div>
  );
}
