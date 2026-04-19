import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";

interface NoiseSectionProps {
  id: string;
  title: string;
  level: string;
  description: string;
  bgClass: string;
  textColorClass?: string;
  accentColorClass?: string;
  decorative?: React.ReactNode;
  overlayGradient?: string;
  auraColors?: string[];
}

const BackgroundAura: React.FC<{ colors: string[] }> = ({ colors }) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none z-0 select-none transition-opacity duration-1000 ${isDark ? "opacity-40 saturate-100" : "opacity-30 saturate-150"}`}>
      <div className="absolute inset-0 [perspective:1000px] [backface-visibility:hidden]">
        <div 
          className={`absolute -top-[25%] -left-[25%] w-[110%] h-[110%] rounded-full blur-[160px] animate-float-slow transform-gpu ${!isDark && colors[0].includes('white') ? 'bg-primary/30' : colors[0]}`}
          style={{ animationDelay: "0s" }}
        ></div>
        <div 
          className={`absolute -bottom-[25%] -right-[25%] w-[100%] h-[100%] rounded-full blur-[140px] animate-float-slow transform-gpu ${!isDark && (colors[1] || colors[0]).includes('white') ? 'bg-primary/20' : (colors[1] || colors[0])}`}
          style={{ animationDelay: "-5s" }}
        ></div>
        {colors[2] && (
          <div 
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full blur-[120px] animate-pulse-slow transform-gpu ${!isDark && colors[2].includes('white') ? 'bg-primary/25' : colors[2]}`}
          ></div>
        )}
      </div>
    </div>
  );
};

export const NoiseSection: React.FC<NoiseSectionProps> = ({
  id,
  title,
  level,
  description,
  bgClass,
  textColorClass = "text-on-surface",
  accentColorClass = "text-primary/60",
  decorative,
  overlayGradient,
  auraColors = ["bg-white/5", "bg-white/5"],
}) => {
  return (
    <section id={id} className={`snap-section w-full pt-16 ${bgClass}`}>
      <BackgroundAura colors={auraColors} />

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
      </div>
      {decorative}
    </section>
  );
};
