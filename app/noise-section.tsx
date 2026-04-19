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
}

export const NoiseSection: React.FC<NoiseSectionProps> = ({
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
    <section className={`snap-section pt-16 ${bgClass}`}>
      <div className="grain-overlay"></div>
      <div className="absolute inset-0 z-0 opacity-20">
        <div className={`absolute inset-0 ${overlayGradient}`}></div>
      </div>
      <div className="relative z-10 text-center px-6">
        <p
          className={`uppercase tracking-[0.3em] mb-4 font-bold text-[10px] ${accentColorClass}`}
        >
          Frequency Level: {level}
        </p>
        <h2
          className={`text-[5rem] md:text-[8rem] font-extrabold tracking-tighter leading-none ${textColorClass}`}
        >
          {title}
        </h2>
        <p className="max-w-md mx-auto mt-8 text-on-surface-variant font-light text-lg leading-relaxed">
          {description}
        </p>
        <div className="mt-12 flex justify-center gap-8 items-center">
          <div className="w-16 h-[2px] bg-outline-variant/30"></div>
          <span className="text-sm tracking-widest text-primary font-bold">
            {index} / 03
          </span>
          <div className="w-16 h-[2px] bg-outline-variant/30"></div>
        </div>
      </div>
      {decorative}
    </section>
  );
};
