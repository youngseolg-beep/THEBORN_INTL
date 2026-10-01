import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { homeV2Content } from "../../data/homeV2Content";

const { whyTheBorn } = homeV2Content;

function ramp(value: number, start: number, end: number) {
  return Math.min(1, Math.max(0, (value - start) / (end - start)));
}

function mix(from: number, to: number, progress: number) {
  return from + (to - from) * progress;
}

function StoryImage({ className = "" }: { className?: string }) {
  return (
    <div className={`overflow-hidden rounded-2xl bg-zinc-900 ${className}`}>
      <img
        src={whyTheBorn.media.src}
        alt={whyTheBorn.media.alt}
        width={843}
        height={796}
        className="h-full w-full object-cover object-center"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

function ManifestoCopy({ compact = false }: { compact?: boolean }) {
  return (
    <>
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#ed2028] sm:text-sm">
        {whyTheBorn.eyebrow}
      </p>
      <h2
        id="home-v2-why-the-born-title"
        className={
          compact
            ? "mt-5 text-[clamp(2.5rem,4vw,3.25rem)] font-medium leading-[1.04] tracking-[-0.05em] text-white"
            : "mt-5 font-medium uppercase leading-[0.98] tracking-[-0.055em] text-white"
        }
      >
        {whyTheBorn.title}
      </h2>
      <div className={`${compact ? "mt-8 sm:mt-10" : "mt-7 sm:mt-9"} space-y-4 leading-[1.7] text-zinc-300 sm:space-y-5`}>
        {whyTheBorn.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </>
  );
}

function ClosingMessage() {
  const hasFinalPeriod = whyTheBorn.closingMessage.endsWith(".");
  const message = hasFinalPeriod
    ? whyTheBorn.closingMessage.slice(0, -1)
    : whyTheBorn.closingMessage;

  return (
    <p className="max-w-[90vw] text-balance text-center text-[clamp(2.5rem,12vw,5rem)] font-medium uppercase leading-[0.98] tracking-[-0.055em] text-[#f7f3ec] md:text-[clamp(3.5rem,6.5vw,7rem)]">
      {message}
      {hasFinalPeriod ? <span className="text-[#ed2028]">.</span> : null}
    </p>
  );
}

export default function WhyTheBorn() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = Boolean(useReducedMotion());
  const [viewport, setViewport] = useState({ width: 1440, height: 900 });
  const [storyProgress, setStoryProgress] = useState(0);

  useEffect(() => {
    const updateViewport = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", setStoryProgress);

  const isMobile = viewport.width < 768;
  const initialTextWidth = isMobile
    ? Math.max(272, viewport.width - 40)
    : Math.min(viewport.width * 0.44, 640);
  const centeredTextWidth = isMobile
    ? Math.max(288, viewport.width - 32)
    : Math.min(viewport.width * 0.9, 1000);
  const moveProgress = ramp(storyProgress, 0.22, 0.58);
  const initialTitleSize = isMobile ? 34 : Math.min(Math.max(viewport.width * 0.04, 40), 52);
  const finalTitleSize = isMobile ? 48 : Math.min(Math.max(viewport.width * 0.06, 56), 104);
  const textX = mix(isMobile ? 0 : viewport.width * 0.25, 0, moveProgress);
  const textY = mix(isMobile ? viewport.height * 0.19 : 0, 0, moveProgress);
  const textWidth = mix(initialTextWidth, centeredTextWidth, moveProgress);
  const titleSize = mix(initialTitleSize, finalTitleSize, moveProgress);
  const bodySize = mix(isMobile ? 12.5 : 18, isMobile ? 15 : 20, moveProgress);
  const manifestoOpacity = 1 - ramp(storyProgress, 0.72, 0.82);
  const imageProgress = ramp(storyProgress, 0.18, 0.42);
  const imageOpacity = 1 - imageProgress;
  const imageScale = mix(1, 0.96, imageProgress);
  const closingOpacity = ramp(storyProgress, 0.82, 0.88);
  const closingScale = mix(0.98, 1, closingOpacity);

  if (reduceMotion) {
    return (
      <section
        ref={sectionRef}
        aria-labelledby="home-v2-why-the-born-title"
        className="bg-[#090a0c] px-[5%] pb-[clamp(7rem,14svh,11rem)] text-[#f7f3ec]"
      >
        <div className="mx-auto grid max-w-7xl gap-12 border-t border-white/10 pt-[clamp(5rem,11svh,8rem)] lg:grid-cols-[minmax(0,0.44fr)_minmax(0,0.56fr)] lg:items-center lg:gap-[clamp(4rem,7vw,7rem)]">
          <StoryImage className="aspect-[4/5] w-full" />
          <div>
            <ManifestoCopy compact />
          </div>
        </div>
        <div className="mx-auto flex min-h-[70svh] max-w-7xl items-center justify-center pt-24">
          <ClosingMessage />
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      aria-labelledby="home-v2-why-the-born-title"
      className="h-[280svh] bg-[#090a0c] text-[#f7f3ec]"
    >
      <div className="sticky top-0 h-svh overflow-hidden border-t border-white/10">
        <motion.div
          className="absolute left-1/2 top-[5svh] h-[26svh] w-[min(58vw,15rem)] -translate-x-1/2 sm:top-[4svh] md:left-[5%] md:top-1/2 md:aspect-[4/5] md:h-auto md:w-[min(38vw,31rem)] md:-translate-x-0 md:-translate-y-1/2"
          style={{ opacity: imageOpacity, transform: `scale(${imageScale})` }}
        >
          <StoryImage className="h-full w-full" />
        </motion.div>

        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            style={{
              width: textWidth,
              transform: `translate3d(${textX}px, ${textY}px, 0)`,
              opacity: manifestoOpacity,
              textAlign: storyProgress >= 0.4 ? "center" : "left",
              fontSize: bodySize,
            }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#ed2028] sm:text-sm">
              {whyTheBorn.eyebrow}
            </p>
            <motion.h2
              id="home-v2-why-the-born-title"
              className="mt-4 font-medium uppercase leading-[0.98] tracking-[-0.055em] text-white sm:mt-5"
              style={{ fontSize: titleSize }}
            >
              {whyTheBorn.title}
            </motion.h2>
            <div className="mt-5 space-y-3 leading-[1.65] text-zinc-300 sm:mt-7 sm:space-y-4">
              {whyTheBorn.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          className="absolute inset-0 flex items-center justify-center px-5"
          style={{ opacity: closingOpacity, scale: closingScale }}
        >
          <ClosingMessage />
        </motion.div>
      </div>
    </section>
  );
}
