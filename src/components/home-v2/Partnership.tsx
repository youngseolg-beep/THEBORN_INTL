import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { HomeV2Partnership } from "../../data/homeV2Content";
import { useHomeV2Locale } from "./HomeV2LocaleContext";
import { useMobileLayout } from "./useMobileLayout";
import MobilePartnership from "./MobilePartnership";
import ChapterHeader from "./ChapterHeader";

function ramp(value: number, start: number, end: number) {
  return Math.min(1, Math.max(0, (value - start) / (end - start)));
}

function sampleTimeline(value: number, times: number[], values: number[]) {
  for (let index = 1; index < times.length; index += 1) {
    if (value <= times[index]) {
      return values[index - 1] + (values[index] - values[index - 1])
        * ramp(value, times[index - 1], times[index]);
    }
  }
  return values[values.length - 1];
}

function OpeningTitle({
  partnership,
  isKorean,
}: {
  partnership: HomeV2Partnership;
  isKorean: boolean;
}) {
  return (
    <h2
      id="home-v2-partnership-title"
      className={`text-[clamp(2rem,3.15vw,3.5rem)] font-medium leading-[1.06] ${
        isKorean ? "tracking-[-0.035em]" : "uppercase tracking-[-0.055em]"
      }`}
    >
      {partnership.model}
      <br />
      {partnership.title.slice(partnership.model.length).trim()}
    </h2>
  );
}

export default function Partnership() {
  const { mobile, storyFits } = useMobileLayout();
  return mobile ? <MobilePartnership storyFits={storyFits} /> : <DesktopPartnership />;
}

function DesktopPartnership() {
  const { content, locale } = useHomeV2Locale();
  const { partnership } = content;
  const isKorean = locale === "ko";
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = Boolean(useReducedMotion());
  const [immersiveViewport, setImmersiveViewport] = useState(false);

  useEffect(() => {
    // Narrow, short and zoomed viewports use document flow rather than a clipped scene.
    const query = window.matchMedia("(min-width: 1024px) and (min-height: 700px)");
    const update = () => setImmersiveViewport(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const immersive = immersiveViewport && !reduceMotion;
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });

  // Callback transforms explicitly clamp each chapter to its own scroll interval.
  const imageScale = useTransform(scrollYProgress, (value) => 1.04 - 0.04 * ramp(value, 0, 0.28));
  const imageY = useTransform(scrollYProgress, (value) => 12 * (1 - ramp(value, 0, 0.28)));
  const imageOpacity = useTransform(scrollYProgress, (value) => sampleTimeline(value, [0, 0.24, 0.4, 0.62], [1, 1, 0.12, 0]));
  const openingOpacity = useTransform(scrollYProgress, (value) => sampleTimeline(value, [0, 0.08, 0.24, 0.32], [0.75, 1, 1, 0]));
  const openingY = useTransform(scrollYProgress, (value) => sampleTimeline(value, [0, 0.08, 0.24, 0.32], [16, 0, 0, -18]));
  const relationshipOpacity = useTransform(scrollYProgress, (value) => sampleTimeline(value, [0.32, 0.39, 0.68, 0.75], [0, 1, 1, 0]));
  const leftX = useTransform(scrollYProgress, (value) => -36 * (1 - ramp(value, 0.28, 0.57)));
  const rightX = useTransform(scrollYProgress, (value) => 36 * (1 - ramp(value, 0.28, 0.57)));
  const lineScale = useTransform(scrollYProgress, (value) => ramp(value, 0.34, 0.57));
  const partnerColor = useTransform(
    scrollYProgress,
    [0, 0.535, 0.57, 1],
    ["#f7f3ec", "#f7f3ec", "#ed2028", "#ed2028"],
  );
  const modelOpacity = useTransform(scrollYProgress, (value) => ramp(value, 0.76, 0.82));
  const modelY = useTransform(scrollYProgress, (value) => sampleTimeline(value, [0.62, 0.7, 0.88, 1], [20, 0, 0, -12]));
  // Keep the policy fully readable, then use a short complementary crossfade so the scene never goes blank.
  const policyOpacity = useTransform(scrollYProgress, (value) => sampleTimeline(value, [0.8, 0.85, 0.94, 0.98], [0, 1, 1, 0]));
  const policyY = useTransform(scrollYProgress, (value) => sampleTimeline(value, [0.8, 0.85, 0.94, 0.98], [12, 0, 0, -12]));
  const selectionOpacity = useTransform(scrollYProgress, (value) => ramp(value, 0.94, 0.98));
  const selectionY = useTransform(scrollYProgress, (value) => 14 * (1 - ramp(value, 0.94, 0.98)));
  const finalLineScale = useTransform(scrollYProgress, (value) => 0.35 + 0.65 * ramp(value, 0.62, 1));

  const eyebrow = (
    <ChapterHeader chapter="partnership" as="p" />
  );

  return (
    <section
      ref={sectionRef}
      aria-labelledby="home-v2-partnership-title"
      className="relative bg-[#101112] text-[#f7f3ec]"
      style={{ height: immersive ? "220svh" : "auto" }}
    >
      {immersive ? (
        <div className="sticky top-0 h-svh overflow-hidden">
          <div className="absolute inset-x-0 top-0 z-10 px-[5%] py-9">{eyebrow}</div>

          <motion.div
            className="absolute inset-y-0 left-0 flex w-[65%] items-center"
            style={{ opacity: imageOpacity, y: imageY }}
          >
            <div className="relative aspect-[1420/918] w-full overflow-hidden">
              <motion.img
                src={partnership.media.src}
                alt={partnership.media.alt}
                width={1420}
                height={918}
                className="h-full w-full object-cover"
                style={{ scale: imageScale }}
                loading="eager"
                decoding="async"
                fetchPriority="low"
              />
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#101112]/70" />
            </div>
          </motion.div>

          <motion.div
            className="absolute inset-y-0 right-[4%] flex w-[30%] flex-col justify-center"
            style={{ opacity: openingOpacity, y: openingY }}
          >
            <OpeningTitle partnership={partnership} isKorean={isKorean} />
            <p className={`mt-7 max-w-sm whitespace-pre-line text-base leading-relaxed text-zinc-300 xl:text-lg ${
              isKorean ? "tracking-[-0.015em]" : ""
            }`}>
              {partnership.description}
            </p>
          </motion.div>

          <motion.div
            className="absolute inset-0 flex items-center justify-center px-[8%]"
            style={{ opacity: relationshipOpacity }}
          >
            <div className="flex w-full max-w-6xl items-center gap-0">
              <motion.p className="mr-[clamp(1.5rem,3vw,3.5rem)] shrink-0 text-[clamp(2rem,4.3vw,4.5rem)] font-medium tracking-[-0.055em]" style={{ x: leftX }}>
                {partnership.relationship.brand}
              </motion.p>
              <motion.div aria-hidden="true" className="h-px min-w-12 flex-1 origin-left bg-[#ed2028]" style={{ scaleX: lineScale }} />
              <motion.p className="ml-[clamp(0.75rem,1vw,1.25rem)] shrink-0 text-[clamp(2rem,4.3vw,4.5rem)] font-medium tracking-[-0.055em]" style={{ x: rightX, color: partnerColor }}>
                {partnership.relationship.partner}
              </motion.p>
            </div>
          </motion.div>

          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center px-[8%] text-center"
            style={{ opacity: modelOpacity, y: modelY }}
          >
            <h3 className={`text-[clamp(3.5rem,6.7vw,7rem)] font-medium leading-none ${
              isKorean ? "tracking-[-0.04em]" : "uppercase tracking-[-0.06em]"
            }`}>
              {partnership.model}
            </h3>
            <motion.div aria-hidden="true" className="my-9 h-px w-24 bg-[#ed2028]" style={{ scaleX: finalLineScale }} />
            <div className="grid w-full max-w-2xl text-xl leading-relaxed tracking-[-0.015em] text-[#f7f3ec] xl:text-2xl">
              <motion.p className="col-start-1 row-start-1 whitespace-pre-line" style={{ opacity: policyOpacity, y: policyY }}>
                {partnership.managementPolicy}
              </motion.p>
              <motion.p className="col-start-1 row-start-1 whitespace-pre-line" style={{ opacity: selectionOpacity, y: selectionY }}>
                {partnership.partnerSelection}
              </motion.p>
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="mx-auto max-w-7xl px-6 py-12 sm:px-10 sm:py-16 lg:px-16">
          {eyebrow}
          <div className="mt-9 grid gap-9 lg:grid-cols-[1.5fr_1fr] lg:items-center lg:gap-12">
            <img
              src={partnership.media.src}
              alt={partnership.media.alt}
              width={1420}
              height={918}
              className="h-auto w-full"
              loading="lazy"
              decoding="async"
            />
            <div>
              <OpeningTitle partnership={partnership} isKorean={isKorean} />
              <p className={`mt-6 max-w-lg whitespace-pre-line text-base leading-relaxed text-zinc-300 sm:text-lg ${
                isKorean ? "tracking-[-0.015em]" : ""
              }`}>
                {partnership.description}
              </p>
            </div>
          </div>
          <div className="my-16 flex flex-wrap items-center gap-4 text-[clamp(1rem,3.5vw,2rem)] font-medium tracking-[-0.04em] sm:my-20 sm:gap-8">
            <p>{partnership.relationship.brand}</p>
            <div aria-hidden="true" className="h-px min-w-4 max-w-32 flex-1 bg-[#ed2028]" />
            <p className="text-[#ed2028]">{partnership.relationship.partner}</p>
          </div>
          <div className="max-w-3xl pb-6">
            <h3 className={`text-[clamp(1.75rem,4vw,3.5rem)] font-medium leading-tight ${
              isKorean ? "tracking-[-0.035em]" : "uppercase tracking-[-0.05em]"
            }`}>
              {partnership.model}
            </h3>
            <p className="mt-7 max-w-2xl whitespace-pre-line text-base leading-relaxed text-[#f7f3ec] sm:text-xl">
              {partnership.managementPolicy}
            </p>
            <p className="mt-8 max-w-2xl whitespace-pre-line text-base leading-relaxed text-zinc-100 sm:text-xl">
              {partnership.partnerSelection}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
