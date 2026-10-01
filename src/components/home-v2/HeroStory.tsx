import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { homeV2Content } from "../../data/homeV2Content";

function ramp(value: number, start: number, end: number) {
  return Math.min(1, Math.max(0, (value - start) / (end - start)));
}

function mix(from: number, to: number, progress: number) {
  return from + (to - from) * progress;
}

function timeline(value: number, points: readonly number[], values: readonly number[]) {
  const nextIndex = points.findIndex((point) => value <= point);
  if (nextIndex <= 0) return values[0];
  if (nextIndex === -1) return values[values.length - 1];
  return mix(values[nextIndex - 1], values[nextIndex], ramp(value, points[nextIndex - 1], points[nextIndex]));
}

export default function HeroStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [viewport, setViewport] = useState({ width: 1440, height: 900 });
  const [copySize, setCopySize] = useState({ width: 768, height: 280 });
  const [heroProgress, setHeroProgress] = useState(0);
  const { corporate, hero } = homeV2Content;

  useEffect(() => {
    const updateViewport = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  useLayoutEffect(() => {
    const copy = copyRef.current;
    if (!copy) return;
    const updateSize = () => setCopySize({ width: copy.offsetWidth, height: copy.offsetHeight });
    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(copy);
    return () => observer.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", setHeroProgress);

  const desktopImageScale = useTransform(
    scrollYProgress,
    [0, 0.2, 0.45, 0.7, 0.88, 1],
    [1, 1.01, 1.025, 1.05, 1.07, 1.08],
  );
  const mobileImageScale = useTransform(
    scrollYProgress,
    [0, 0.2, 0.45, 0.7, 0.88, 1],
    [1, 1.005, 1.015, 1.025, 1.032, 1.035],
  );
  const desktopImageY = useTransform(
    scrollYProgress,
    [0, 0.2, 0.45, 0.7, 0.88, 1],
    ["0%", "-0.5%", "-1.5%", "-3%", "-4%", "-4.5%"],
  );
  const mobileImageY = useTransform(
    scrollYProgress,
    [0, 0.2, 0.45, 0.7, 0.88, 1],
    ["0%", "-0.25%", "-0.5%", "-1%", "-1.25%", "-1.5%"],
  );
  const reduceMotion = Boolean(prefersReducedMotion);
  const isMobile = viewport.width < 768;
  const imageScale = reduceMotion
    ? 1
    : isMobile
      ? mobileImageScale
      : desktopImageScale;
  const imageY = reduceMotion
    ? "0%"
    : isMobile
      ? mobileImageY
      : desktopImageY;
  const movement = reduceMotion ? 1 : ramp(heroProgress, 0.18, 0.62);
  const finalScale = isMobile ? 0.82 : 0.72;
  const anchorLeft = viewport.width * (isMobile ? 0.075 : 0.06);
  const anchorBottom = viewport.height * (isMobile ? 0.07 : 0.1);
  const startX = viewport.width / 2 - anchorLeft - copySize.width / 2;
  const startY = -viewport.height / 2 + anchorBottom + copySize.height / 2;
  const copyX = startX * (1 - movement);
  const copyY = startY * (1 - movement);
  const copyScale = mix(1, finalScale, movement);
  const textOpacity = reduceMotion ? 1 : timeline(heroProgress, [0, 0.82, 0.94, 1], [1, 1, 0.72, 0.25]);
  const sceneOpacity = reduceMotion ? 1 : timeline(heroProgress, [0, 0.82, 0.92, 1], [1, 1, 0.88, 0.55]);
  const colorProgress = reduceMotion ? 1 : ramp(heroProgress, 0.48, 0.68);
  const heroTitleColor = `rgb(${Math.round(mix(247, 237, colorProgress))}, ${Math.round(mix(243, 32, colorProgress))}, ${Math.round(mix(236, 40, colorProgress))})`;

  return (
    <section
      ref={sectionRef}
      aria-labelledby="home-v2-hero-title"
      className={reduceMotion ? "min-h-svh bg-black" : "h-[150svh] bg-black"}
    >
      <motion.div
        className="sticky top-0 h-svh overflow-hidden bg-black"
        style={{ opacity: sceneOpacity }}
      >
        <motion.img
          src={corporate.media.heroImage.src}
          alt={corporate.media.heroImage.alt}
          className="absolute inset-0 h-full w-full object-cover object-[52%_center] md:object-center"
          style={{ scale: imageScale, y: imageY }}
          loading="eager"
          fetchPriority="high"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/5 to-black/50"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.26)_72%,rgba(0,0,0,0.48)_100%)]"
        />

        <motion.div
          ref={copyRef}
          className="absolute bottom-[7vh] left-[7.5vw] z-10 w-[calc(100%-3rem)] max-w-3xl sm:bottom-[10vh] sm:left-[6vw] sm:w-[88vw]"
          style={{
            opacity: textOpacity,
            transform: `translate3d(${copyX}px, ${copyY}px, 0) scale(${copyScale})`,
            textAlign: reduceMotion || heroProgress >= 0.4 ? "left" : "center",
            transformOrigin: "left bottom",
          }}
        >
          <p className="text-base font-medium tracking-[0.08em] text-white/85 sm:text-lg md:text-xl">
            {hero.eyebrow}
          </p>
          <motion.h1
            id="home-v2-hero-title"
            className="mt-5 text-[clamp(4.5rem,18vw,6rem)] font-semibold leading-[0.9] tracking-[-0.065em] sm:mt-6 md:text-[clamp(5.5rem,9vw,9rem)]"
            style={{ color: heroTitleColor }}
          >
            {hero.title}
          </motion.h1>
          <p className="mt-7 text-lg leading-relaxed text-white/85 sm:text-xl md:mt-8 md:text-[1.375rem]">
            {hero.description}
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
