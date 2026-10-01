import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { homeV2Content } from "../../data/homeV2Content";

export default function HeroStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const { corporate, hero } = homeV2Content;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const updateViewport = () => setIsMobile(mediaQuery.matches);

    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);

    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

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
  const textOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.45, 0.7],
    [1, 1, 0.4, 0.05],
  );
  const textY = useTransform(
    scrollYProgress,
    [0, 0.2, 0.45, 0.7],
    ["0vh", "0vh", "-2.5vh", "-4vh"],
  );
  const sceneOpacity = useTransform(
    scrollYProgress,
    [0, 0.7, 0.88, 1],
    [1, 1, 0.88, 0.55],
  );

  const reduceMotion = Boolean(prefersReducedMotion);
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

  return (
    <section
      ref={sectionRef}
      aria-labelledby="home-v2-hero-title"
      className={reduceMotion ? "min-h-svh bg-black" : "h-[150svh] bg-black"}
    >
      <motion.div
        className="sticky top-0 h-svh overflow-hidden bg-black"
        style={{ opacity: reduceMotion ? 1 : sceneOpacity }}
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
          className="relative z-10 flex h-full items-end px-6 pb-14 text-left sm:px-10 sm:pb-16 md:px-16 md:pb-20 lg:px-24 lg:pb-24"
          style={{
            opacity: reduceMotion ? 1 : textOpacity,
            y: reduceMotion ? 0 : textY,
          }}
        >
          <div className="flex max-w-3xl flex-col items-start">
            <p className="text-sm font-medium tracking-[0.08em] text-white/85 sm:text-base md:text-lg">
              {hero.eyebrow}
            </p>
            <h1
              id="home-v2-hero-title"
              className="mt-5 text-[clamp(4rem,7vw,7rem)] font-semibold leading-[0.92] tracking-[-0.06em] text-white sm:mt-6"
            >
              {hero.title}
            </h1>
            <p className="mt-7 max-w-[48rem] text-base leading-relaxed text-white/85 sm:text-lg md:mt-8 md:text-xl">
              {hero.description}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
