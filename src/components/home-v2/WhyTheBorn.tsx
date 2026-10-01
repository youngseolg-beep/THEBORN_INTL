import { type CSSProperties, useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { homeV2Content } from "../../data/homeV2Content";

const { whyTheBorn } = homeV2Content;

const closingPhotos = [
  {
    src: "/assets/home-v2-assets/bornga/image-03.png",
    alt: "Guests sharing a Korean barbecue meal at BORNGA.",
    width: 844,
    height: 842,
  },
  {
    src: "/assets/home-v2-assets/bornga/image-16.png",
    alt: "Guest raising a toast over a Korean meal at BORNGA.",
    width: 673,
    height: 781,
  },
  {
    src: "/assets/home-v2-assets/bornga/image-15.png",
    alt: "Guest enjoying drinks and a Korean meal at BORNGA.",
    width: 665,
    height: 784,
  },
] as const;

const manifestoTitleWords = whyTheBorn.title.split(" ");
const manifestoTitleLines = [
  manifestoTitleWords.slice(0, 3).join(" "),
  manifestoTitleWords.slice(3).join(" "),
];

function ManifestoTitle() {
  return (
    <>
      <span className="sr-only">{whyTheBorn.title}</span>
      <span aria-hidden="true" className="block w-full">
        {manifestoTitleLines.map((line) => (
          <span key={line} className="block whitespace-nowrap">
            {line}
          </span>
        ))}
      </span>
    </>
  );
}

function Manifesto() {
  return (
    <div className="mx-auto w-[min(92vw,52rem)] text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#ed2028] sm:text-sm">
        {whyTheBorn.eyebrow}
      </p>
      <h2
        id="home-v2-why-the-born-title"
        className="mt-5 text-[clamp(2.35rem,8vw,6.5rem)] font-medium uppercase leading-[0.98] tracking-[-0.055em] text-[#f7f3ec] md:text-[clamp(3.5rem,6vw,6.5rem)]"
      >
        <ManifestoTitle />
      </h2>
      <div className="mx-auto mt-7 max-w-3xl space-y-3 text-[clamp(0.875rem,1.25vw,1.125rem)] leading-[1.65] text-zinc-300 sm:mt-9 sm:space-y-4">
        {whyTheBorn.paragraphs.map((paragraph) => (
          <p key={paragraph} className="text-pretty">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}

function ClosingMessage() {
  const hasFinalPeriod = whyTheBorn.closingMessage.endsWith(".");
  const message = hasFinalPeriod
    ? whyTheBorn.closingMessage.slice(0, -1)
    : whyTheBorn.closingMessage;

  return (
    <p className="max-w-[92vw] text-balance text-center text-[clamp(2.5rem,12vw,5rem)] font-medium uppercase leading-[0.98] tracking-[-0.055em] text-[#f7f3ec] md:text-[clamp(3rem,6vw,6.5rem)]">
      {message}
      {hasFinalPeriod ? <span className="text-[#ed2028]">.</span> : null}
    </p>
  );
}

function Photo({ photo }: { photo: (typeof closingPhotos)[number] }) {
  return (
    <div className="flex h-[72svh] w-[calc(100vw-2.5rem)] items-center justify-center sm:h-[76svh] sm:w-[78vw]">
      <img
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        className="h-auto w-auto max-h-full max-w-full rounded-2xl object-contain"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

function ReducedMotionClosing() {
  return (
    <section
      aria-labelledby="home-v2-why-the-born-title"
      className="border-t border-white/10 bg-[#090a0c] text-[#f7f3ec]"
    >
      {closingPhotos.map((photo) => (
        <div key={photo.src} className="flex min-h-[85svh] items-center justify-center py-12">
          <Photo photo={photo} />
        </div>
      ))}
      <div className="flex min-h-svh items-center justify-center px-5 py-20">
        <Manifesto />
      </div>
      <div className="flex min-h-[80svh] items-center justify-center px-5 py-20">
        <ClosingMessage />
      </div>
    </section>
  );
}

function AnimatedClosing() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const photoOneOpacity = useTransform(
    scrollYProgress,
    [0, 0.02, 0.08, 0.18, 0.23],
    [0, 0, 1, 1, 0],
  );
  const photoOneScale = useTransform(scrollYProgress, [0.02, 0.08], [0.985, 1]);
  const photoTwoOpacity = useTransform(
    scrollYProgress,
    [0.23, 0.24, 0.3, 0.4, 0.45],
    [0, 0, 1, 1, 0],
  );
  const photoTwoScale = useTransform(scrollYProgress, [0.24, 0.3], [0.985, 1]);
  const photoThreeOpacity = useTransform(
    scrollYProgress,
    [0.45, 0.46, 0.52, 0.62, 0.67],
    [0, 0, 1, 1, 0],
  );
  const photoThreeScale = useTransform(scrollYProgress, [0.46, 0.52], [0.985, 1]);
  const manifestoOpacity = useTransform(
    scrollYProgress,
    [0.67, 0.69, 0.75, 0.86, 0.9],
    [0, 0, 1, 1, 0],
  );
  const manifestoScale = useTransform(scrollYProgress, [0.69, 0.75], [0.985, 1]);
  const closingOpacity = useTransform(
    scrollYProgress,
    [0.9, 0.91, 0.95, 1],
    [0, 0, 1, 1],
  );

  return (
    <section
      ref={sectionRef}
      aria-labelledby="home-v2-why-the-born-title"
      className="h-[500svh] border-t border-white/10 bg-[#090a0c] text-[#f7f3ec]"
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        <motion.div
          className="pointer-events-none absolute inset-y-0 left-0 flex w-screen items-center justify-center opacity-[var(--scene-opacity)] [transform:scale(var(--scene-scale))]"
          style={
            {
              "--scene-opacity": photoOneOpacity,
              "--scene-scale": photoOneScale,
            } as unknown as CSSProperties
          }
        >
          <Photo photo={closingPhotos[0]} />
        </motion.div>

        <motion.div
          className="pointer-events-none absolute inset-y-0 left-0 flex w-screen items-center justify-center opacity-[var(--scene-opacity)] [transform:scale(var(--scene-scale))]"
          style={
            {
              "--scene-opacity": photoTwoOpacity,
              "--scene-scale": photoTwoScale,
            } as unknown as CSSProperties
          }
        >
          <Photo photo={closingPhotos[1]} />
        </motion.div>

        <motion.div
          className="pointer-events-none absolute inset-y-0 left-0 flex w-screen items-center justify-center opacity-[var(--scene-opacity)] [transform:scale(var(--scene-scale))]"
          style={
            {
              "--scene-opacity": photoThreeOpacity,
              "--scene-scale": photoThreeScale,
            } as unknown as CSSProperties
          }
        >
          <Photo photo={closingPhotos[2]} />
        </motion.div>

        <motion.div
          className="absolute inset-y-0 left-0 flex w-screen items-center justify-center px-5 opacity-[var(--scene-opacity)] [transform:scale(var(--scene-scale))]"
          style={
            {
              "--scene-opacity": manifestoOpacity,
              "--scene-scale": manifestoScale,
            } as unknown as CSSProperties
          }
        >
          <Manifesto />
        </motion.div>

        <motion.div
          className="absolute inset-y-0 left-0 flex w-screen items-center justify-center px-5 opacity-[var(--scene-opacity)]"
          style={
            {
              "--scene-opacity": closingOpacity,
            } as unknown as CSSProperties
          }
        >
          <ClosingMessage />
        </motion.div>
      </div>
    </section>
  );
}

export default function WhyTheBorn() {
  const reduceMotion = Boolean(useReducedMotion());

  return reduceMotion ? <ReducedMotionClosing /> : <AnimatedClosing />;
}
