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
  const { corporate, globalPresence } = homeV2Content;

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
    [0, 0.4, 0.8, 1],
    [1, 1.015, 1.075, 1.1],
  );
  const mobileImageScale = useTransform(
    scrollYProgress,
    [0, 0.4, 0.8, 1],
    [1, 1.008, 1.035, 1.045],
  );
  const desktopImageY = useTransform(
    scrollYProgress,
    [0, 0.4, 0.8, 1],
    ["0%", "-1%", "-4%", "-5%"],
  );
  const mobileImageY = useTransform(
    scrollYProgress,
    [0, 0.4, 0.8, 1],
    ["0%", "-0.5%", "-1.5%", "-2%"],
  );
  const textOpacity = useTransform(
    scrollYProgress,
    [0, 0.25, 0.55, 0.8],
    [1, 1, 0.25, 0],
  );
  const textY = useTransform(
    scrollYProgress,
    [0, 0.25, 0.55, 0.8],
    ["0vh", "0vh", "-4vh", "-7vh"],
  );
  const sceneOpacity = useTransform(
    scrollYProgress,
    [0, 0.8, 1],
    [1, 1, 0],
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
      className={reduceMotion ? "min-h-svh bg-black" : "h-[200svh] bg-black"}
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
          className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/45"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/15 to-transparent"
        />

        <motion.div
          className="relative z-10 flex h-full items-end px-6 pb-14 sm:px-10 sm:pb-16 md:px-16 md:pb-20 lg:px-24 lg:pb-24"
          style={{
            opacity: reduceMotion ? 1 : textOpacity,
            y: reduceMotion ? 0 : textY,
          }}
        >
          <div className="max-w-3xl">
            <h1 id="home-v2-hero-title" className="sr-only">
              {corporate.name}
            </h1>
            <img
              src={corporate.media.primaryLogo.src}
              alt={corporate.media.primaryLogo.alt}
              className="mb-7 h-auto w-36 sm:w-40 md:mb-9 md:w-48"
            />
            <p className="max-w-2xl text-balance text-2xl font-medium leading-tight tracking-[-0.035em] text-white sm:text-3xl md:text-4xl lg:text-5xl">
              {globalPresence.overview}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
