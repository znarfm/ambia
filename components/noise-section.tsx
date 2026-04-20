import React from "react";

interface NoiseSectionProps {
  id: string;
  title: string;
  level: string;
  description: string;
  bgClass: string;
  decorative?: React.ReactNode;
  overlayGradient?: string;
  auraColors?: string[];
}

const BackgroundAura = React.memo<{ colors: string[] }>(({ colors }) => {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-20 saturate-150 select-none dark:opacity-40">
      <div className="absolute inset-0 transform-gpu [backface-visibility:hidden]">
        <div
          className={`animate-float-slow absolute -top-[10%] -left-[10%] h-[80%] w-[80%] transform-gpu rounded-full blur-[60px] will-change-transform md:blur-[100px] ${colors[0]}`}
          style={{ animationDelay: "0s" }}
        ></div>
        <div
          className={`animate-float-slow absolute -right-[10%] -bottom-[10%] h-[70%] w-[70%] transform-gpu rounded-full blur-[50px] will-change-transform md:blur-[90px] ${colors[1] || colors[0]}`}
          style={{ animationDelay: "-5s" }}
        ></div>
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
        decorative,
        overlayGradient,
        auraColors = ["bg-white/5", "bg-white/5"],
      },
      ref,
    ) => {
      return (
        <section ref={ref} id={id} className={`snap-section w-full pt-16 noise-${id} ${bgClass}`}>
          <BackgroundAura colors={auraColors} />

          <div className="absolute inset-0 z-0 opacity-10">
            <div className={`absolute inset-0 ${overlayGradient}`}></div>
          </div>

          <div className="relative z-10 px-6 text-center">
            <p
              className="mb-4 text-[10px] font-bold tracking-[0.3em] uppercase opacity-70"
              style={{ color: "var(--dynamic-primary)" }}
            >
              Frequency Level: {level}
            </p>
            <h2
              className="text-[5rem] leading-none font-extrabold tracking-tighter transition-transform duration-700 md:text-[8rem]"
              style={{
                color: "var(--dynamic-primary)",
              }}
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
