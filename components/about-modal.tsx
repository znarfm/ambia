"use client";

import React, { useState } from "react";
import { X, ExternalLink, Info, BookOpen, MonitorPlay } from "lucide-react";
import { useWebHaptics } from "web-haptics/react";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  const haptic = useWebHaptics();
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isAnimate, setIsAnimate] = useState(false);

  const handleClose = () => {
    haptic.trigger("light");
    setIsAnimate(false);
    setTimeout(onClose, 500);
  };

  React.useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      const timer = setTimeout(() => setIsAnimate(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsAnimate(false);
      const timer = setTimeout(() => setShouldRender(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col justify-end overflow-x-hidden overflow-y-auto p-0 transition-all duration-500 sm:justify-center sm:p-6 ${isAnimate ? "visible" : "invisible"}`}
    >
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-500 ${isAnimate ? "opacity-100" : "opacity-0"}`}
        onClick={handleClose}
      ></div>

      <div
        className={`bg-surface-container-high relative mx-auto w-full max-w-lg rounded-t-[2.5rem] border-t border-white/10 p-8 shadow-2xl backdrop-blur-3xl transition-all duration-500 ease-out sm:my-auto sm:rounded-3xl sm:border sm:p-10 ${
          isAnimate
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-full opacity-0 sm:translate-y-8 sm:scale-95"
        }`}
      >
        <div className="mx-auto mb-8 h-1.5 w-12 rounded-full bg-white/10 sm:hidden" />

        <button
          onClick={handleClose}
          className="text-on-surface-variant hover:text-on-surface absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full transition-all hover:bg-white/5 active:scale-90"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="space-y-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div
                className="bg-primary/10 rounded-xl p-2.5"
                style={{ color: "var(--dynamic-primary)" }}
              >
                <Info className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight">About Ambia</h2>
            </div>
            <p className="text-on-surface-variant text-lg leading-relaxed font-light">
              A simple, calming sound space designed to help you focus, relax, and breathe easier.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold tracking-[0.2em] uppercase opacity-40">
              Science & Research
            </h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Research shows that red and pink noise can enhance productivity, executive function,
              and working memory. While white noise may improve focus for individuals with ADHD,
              scientific evidence regarding its effectiveness for sleep remains inconsistent across
              different populations. Ambia offers a customizable utility to mask distractions and
              stabilize your acoustic environment.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://youtu.be/-rUBgPiQngg?t=335"
                target="_blank"
                rel="noopener noreferrer"
                className="border-on-surface/5 bg-on-surface/5 hover:bg-on-surface/10 flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition-all"
              >
                <MonitorPlay className="h-3.5 w-3.5" />
                Types of Noise and Their Names
                <ExternalLink className="h-3 w-3 opacity-50" />
              </a>
              <a
                href="https://acoustics.asn.au/conference_proceedings/AAS2024/papers/p76.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="border-on-surface/5 bg-on-surface/5 hover:bg-on-surface/10 flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition-all"
              >
                <BookOpen className="h-3.5 w-3.5" />
                The effect of white noise and “coloured” noise on cognition and sleep
                <ExternalLink className="h-3 w-3 opacity-50" />
              </a>
              <a
                href="https://journals.lww.com/nohe/fulltext/2020/22040/spectral_content__colour__of_noise_exposure.3.aspx"
                target="_blank"
                rel="noopener noreferrer"
                className="border-on-surface/5 bg-on-surface/5 hover:bg-on-surface/10 flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition-all"
              >
                <BookOpen className="h-3.5 w-3.5" />
                Spectral Content (color) of Noise Exposure Affects Work Efficiency
                <ExternalLink className="h-3 w-3 opacity-50" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p
            className="text-xs font-bold tracking-[0.3em] uppercase transition-all duration-500"
            style={{
              color: "var(--dynamic-primary)",
              opacity: 0.8,
              textShadow: "0 0 12px var(--dynamic-glow)",
            }}
          >
            <a
              href="https://github.com/znarfm"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-100"
            >
              znarfm
            </a>{" "}
            /{" "}
            <a
              href="https://github.com/znarfm/ambia"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-100"
            >
              ambia
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
