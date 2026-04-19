import React from "react";

interface NoiseSectionProps {
  id: string;
  title: string;
  level: string;
  description: string;
  index: string;
  bgClass: string;
  textColorClass?: string;
  accentColorClass?: string;
  decorative?: React.ReactNode;
  overlayGradient?: string;
  auraColors?: string[];
}

export const NoiseSection: React.FC<NoiseSectionProps> = ({
  id,
  title,
  level,
  description,
  index,
  bgClass,
  textColorClass = "text-on-surface",
  accentColorClass = "text-primary/60",
  decorative,
  overlayGradient,
}) => {
  return (
    <section id={id} className={`snap-section w-full pt-16 ${bgClass}`}>
      {/* SVG Noise Filter (Cleaner than images) */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.03]">
        <svg 
          viewBox="0 0 200 200" 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-full w-full"
          preserveAspectRatio="none"
        >
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      <div className="absolute inset-0 z-0 opacity-20">
        <div className={`absolute inset-0 ${overlayGradient}`}></div>
      </div>
      
      <div className="relative z-10 px-6 text-center">
        <p className={`mb-4 text-[10px] font-bold tracking-[0.3em] uppercase ${accentColorClass}`}>
          Frequency Level: {level}
        </p>
        <h2
          className={`text-[5rem] leading-none font-extrabold tracking-tighter md:text-[8rem] ${textColorClass}`}
        >
          {title}
        </h2>
        <p className="text-on-surface-variant mx-auto mt-8 max-w-md text-lg leading-relaxed font-light">
          {description}
        </p>
        <div className="mt-12 flex items-center justify-center gap-8">
          <div className="bg-outline-variant/30 h-[2px] w-16"></div>
          <span className="text-primary text-sm font-bold tracking-widest">{index} / 03</span>
          <div className="bg-outline-variant/30 h-[2px] w-16"></div>
        </div>
      </div>
      {decorative}
    </section>
  );
};
