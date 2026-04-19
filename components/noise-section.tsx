import React from "react";

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

const BackgroundAura = React.memo<{ colors: string[] }>(({ colors }) => {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-20 saturate-150 transition-opacity duration-1000 select-none dark:opacity-30 dark:saturate-100">
      <div className="absolute inset-0 [backface-visibility:hidden] [perspective:1000px]">
        <div
          className={`animate-float-slow absolute -top-[25%] -left-[25%] h-[110%] w-[110%] transform-gpu rounded-full blur-[100px] will-change-transform ${colors[0]} dark:bg-primary/20`}
          style={{ animationDelay: "0s" }}
        ></div>
        <div
          className={`animate-float-slow absolute -right-[25%] -bottom-[25%] h-[100%] w-[100%] transform-gpu rounded-full blur-[90px] will-change-transform ${colors[1] || colors[0]} dark:bg-primary/10`}
          style={{ animationDelay: "-5s" }}
        ></div>
        {colors[2] && (
          <div
            className={`animate-pulse-slow absolute top-1/2 left-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 transform-gpu rounded-full blur-[70px] will-change-transform ${colors[2]} dark:bg-primary/15`}
          ></div>
        )}
      </div>
    </div>
  );
});
BackgroundAura.displayName = "BackgroundAura";

export const NoiseSection = React.memo(
  React.forwardRef<HTMLElement, NoiseSectionProps>(
    (
      {
        id,
        title,
        level,
        description,
        bgClass,
        textColorClass = "text-on-surface",
        accentColorClass = "text-primary",
        decorative,
        overlayGradient,
        auraColors = ["bg-white/5", "bg-white/5"],
      },
      ref,
    ) => {
      return (
        <section ref={ref} id={id} className={`snap-section w-full pt-16 ${bgClass}`}>
          <BackgroundAura colors={auraColors} />

          <div className="absolute inset-0 z-0 opacity-20">
            <div className={`absolute inset-0 ${overlayGradient}`}></div>
          </div>

          <div className="relative z-10 px-6 text-center">
            <p
              className={`mb-4 text-[10px] font-bold tracking-[0.3em] uppercase ${accentColorClass}`}
            >
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
    },
  ),
);

NoiseSection.displayName = "NoiseSection";
