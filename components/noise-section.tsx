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

const BackgroundAura: React.FC<{ colors: string[] }> = ({ colors }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none">
      <div className="absolute inset-0 opacity-40 [perspective:1000px] [backface-visibility:hidden]">
        <div 
          className={`absolute -top-[25%] -left-[25%] w-[110%] h-[110%] rounded-full blur-[160px] animate-float-slow transform-gpu ${colors[0]}`}
          style={{ animationDelay: "0s" }}
        ></div>
        <div 
          className={`absolute -bottom-[25%] -right-[25%] w-[100%] h-[100%] rounded-full blur-[140px] animate-float-slow transform-gpu ${colors[1] || colors[0]}`}
          style={{ animationDelay: "-5s" }}
        ></div>
        {colors[2] && (
          <div 
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full blur-[120px] animate-pulse-slow transform-gpu ${colors[2]}`}
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
  index,
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
