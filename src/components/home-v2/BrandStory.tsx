import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { homeV2Content, type HomeV2Brand, type HomeV2Image } from "../../data/homeV2Content";

type BrandChapter = {
  brand: HomeV2Brand;
  food: HomeV2Image;
  reverse: boolean;
  background: string;
  crop: string;
  start: number;
  end: number;
  drift: number;
};

const { BORNGA, SAEMAEUL, PAIKS_NOODLE } = homeV2Content.brands;

// Use approved food assets without changing the shared data layer's media choices.
const chapters: readonly BrandChapter[] = [
  {
    brand: BORNGA,
    food: BORNGA.media.secondary[1],
    reverse: false,
    background: "#15120f",
    crop: "48% 52%",
    start: 0,
    end: 0.39,
    drift: -1.5,
  },
  {
    brand: SAEMAEUL,
    food: SAEMAEUL.media.secondary[0],
    reverse: true,
    background: "#17100f",
    crop: "50% 57%",
    start: 0.31,
    end: 0.67,
    drift: 2.5,
  },
  {
    brand: PAIKS_NOODLE,
    food: {
      src: "/assets/home-v2-assets/paiks-noodle/image-08.jpg",
      alt: "PAIK'S NOODLE dishes arranged on a table",
    },
    reverse: false,
    background: "#101112",
    crop: "51% 50%",
    start: 0.59,
    end: 1,
    drift: -1,
  },
];

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

function BrandCopy({ chapter, headingId }: { chapter: BrandChapter; headingId: string }) {
  const { brand } = chapter;

  return (
    <div className="max-w-md">
      {/* A light ground keeps the original dark/red logo artwork legible, without recoloring it. */}
      <img
        src={brand.media.logo.src}
        alt={brand.media.logo.alt}
        className={`mb-7 h-14 w-40 bg-[#f1eee8] px-3 py-2 lg:mb-9 lg:h-16 lg:w-44 ${brand.key === "PAIKS_NOODLE" ? "object-cover" : "object-contain"}`}
        loading="lazy"
        decoding="async"
      />
      <h3 id={headingId} className="text-[clamp(2.5rem,4.1vw,4.5rem)] font-medium leading-[0.98] tracking-[-0.065em] text-[#f7f3ec]">
        {brand.englishName}
      </h3>
      {brand.tagline && (
        <p className="mt-4 text-xs font-medium uppercase tracking-[0.16em] text-[#e3b9a3]">
          {brand.tagline}
        </p>
      )}
      <p className="mt-6 max-w-sm text-lg leading-relaxed tracking-[-0.025em] text-zinc-200 lg:text-xl">
        {brand.concept}
      </p>
      <p className="mt-7 max-w-sm text-xs font-medium leading-6 tracking-[0.025em] text-[#eee0d2] lg:text-sm">
        {brand.signatureMenu.slice(0, 3).join(" · ")}
      </p>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-zinc-400">
        {brand.operations}
      </p>
    </div>
  );
}

function ScrollChapter({ chapter, index, progress }: {
  chapter: BrandChapter;
  index: number;
  progress: MotionValue<number>;
}) {
  const { start, end, reverse } = chapter;
  const first = index === 0;
  const last = index === chapters.length - 1;
  // Only the incoming composition fades over the fully lit outgoing image.
  // The old copy clears first; two readable text blocks never crossfade together.
  // Callback transforms explicitly clamp chapter subranges; the installed Motion
  // version's accelerated timeline otherwise remaps them across the whole track.
  const sceneOpacity = useTransform(progress, (value) => first ? 1 : ramp(value, start, start + 0.08));
  const copyTimes = first ? [0, 0.08, 0.29, 0.335] : last ? [0.63, 0.675, 1] : [0.35, 0.395, 0.57, 0.615];
  const copyOpacity = useTransform(progress, (value) => sampleTimeline(
    value, copyTimes, first ? [0.65, 1, 1, 0] : last ? [0, 1, 1] : [0, 1, 1, 0],
  ));
  const copyY = useTransform(progress, (value) => sampleTimeline(
    value, copyTimes, first ? [18, 0, 0, -20] : last ? [22, 0, -8] : [26, 0, 0, -22],
  ));
  const imageScale = useTransform(progress, (value) => index === 1
    ? 1.085 - 0.025 * ramp(value, start, end) : 1.04 + 0.065 * ramp(value, start, end));
  const imageX = useTransform(progress, (value) => `${chapter.drift * (2 * ramp(value, start, end) - 1)}%`);
  const imageY = useTransform(progress, (value) => `${(index === 1 ? 2 : 1) * (1 - 2 * ramp(value, start, end))}%`);

  return (
    <motion.article
      aria-labelledby={`brand-story-${chapter.brand.key}`}
      className="absolute inset-0 overflow-hidden"
      style={{ backgroundColor: chapter.background, opacity: sceneOpacity }}
    >
      <div className={`absolute bottom-[6svh] top-[14svh] w-[61%] overflow-hidden ${reverse ? "right-0" : "left-0"}`}>
        <motion.img
          src={chapter.food.src}
          alt={chapter.food.alt}
          className="h-full w-full object-cover"
          style={{ objectPosition: chapter.crop, scale: imageScale, x: imageX, y: imageY }}
          loading="eager"
          decoding="async"
          fetchPriority="low"
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0"
          style={{ background: `linear-gradient(${reverse ? "90deg" : "270deg"}, ${chapter.background} 0%, transparent 18%)` }} />
      </div>
      <motion.div
        className={`absolute bottom-[6svh] top-[14svh] flex w-[36%] items-center ${reverse ? "left-[5%] pr-6" : "right-[3%] pl-5 pr-4"}`}
        style={{ opacity: copyOpacity, y: copyY }}
      >
        <BrandCopy chapter={chapter} headingId={`brand-story-${chapter.brand.key}`} />
      </motion.div>
    </motion.article>
  );
}

function FlowChapter({ chapter, reduceMotion }: { chapter: BrandChapter; reduceMotion: boolean }) {
  const chapterRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: chapterRef, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, (value) => 1.02 + 0.025 * ramp(value, 0, 1));
  const y = useTransform(scrollYProgress, (value) => `${-ramp(value, 0, 1)}%`);

  return (
    <article
      ref={chapterRef}
      aria-labelledby={`brand-story-${chapter.brand.key}`}
      className={`grid gap-8 pb-16 lg:items-center lg:gap-14 lg:px-16 lg:py-16 ${chapter.reverse ? "lg:grid-cols-[0.8fr_1.2fr]" : "lg:grid-cols-[1.2fr_0.8fr]"}`}
      style={{ backgroundColor: chapter.background }}
    >
      <div className={`relative h-[52svh] min-h-64 max-h-[38rem] overflow-hidden lg:h-[65svh] ${chapter.reverse ? "lg:order-2" : ""}`}>
        <motion.img
          src={chapter.food.src}
          alt={chapter.food.alt}
          className="h-full w-full object-cover"
          style={{ objectPosition: chapter.crop, scale: reduceMotion ? 1 : scale, y: reduceMotion ? 0 : y }}
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="px-6 sm:px-10 lg:px-0">
        <BrandCopy chapter={chapter} headingId={`brand-story-${chapter.brand.key}`} />
      </div>
    </article>
  );
}

export default function BrandStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = Boolean(useReducedMotion());
  const [immersiveViewport, setImmersiveViewport] = useState(false);

  useEffect(() => {
    // Natural document scrolling keeps narrow/short screens readable, including zoomed text.
    const query = window.matchMedia("(min-width: 1024px) and (min-height: 700px)");
    const update = () => setImmersiveViewport(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const immersive = immersiveViewport && !reduceMotion;
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const introY = useTransform(scrollYProgress, (value) => 10 * (1 - ramp(value, 0, 0.08)));
  const heading = (
    <header className="flex items-center justify-between gap-6 px-6 py-7 sm:px-10 lg:px-[5%] lg:py-9">
      <h2 id="home-v2-brand-story-title" className="text-xs font-medium uppercase tracking-[0.24em] text-zinc-200 sm:text-sm">
        OUR BRANDS
      </h2>
      <p className="text-[10px] font-semibold tracking-[0.26em] text-[#ed2028] sm:text-xs">
        {homeV2Content.corporate.name}
      </p>
    </header>
  );

  return (
    <section
      ref={sectionRef}
      aria-labelledby="home-v2-brand-story-title"
      className="relative bg-[#15120f] text-white"
      style={{ height: immersive ? "320svh" : "auto" }}
    >
      {immersive ? (
        <div className="sticky top-0 h-svh overflow-hidden">
          <motion.div className="pointer-events-none absolute inset-x-0 top-0 z-10" style={{ y: introY }}>
            {heading}
          </motion.div>
          {chapters.map((chapter, index) => (
            <div key={chapter.brand.key}>
              <ScrollChapter chapter={chapter} index={index} progress={scrollYProgress} />
            </div>
          ))}
        </div>
      ) : (
        <>
          {heading}
          {chapters.map((chapter) => (
            <div key={chapter.brand.key}>
              <FlowChapter chapter={chapter} reduceMotion={reduceMotion} />
            </div>
          ))}
        </>
      )}
    </section>
  );
}
