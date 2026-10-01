import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import {
  homeV2Content,
  type HomeV2QualificationRequirement,
} from "../../data/homeV2Content";

const { qualifications } = homeV2Content;

function ramp(value: number, start: number, end: number) {
  return Math.min(1, Math.max(0, (value - start) / (end - start)));
}

type RequirementRowProps = {
  number: string;
  requirement: HomeV2QualificationRequirement;
  progress: MotionValue<number>;
  enterStart: number;
  enterEnd: number;
  dimStart?: number;
  dimEnd?: number;
  animate: boolean;
};

const requirementBreaks = [
  ["at least 3 years", "of F&B or related"],
  ["Sufficient capital for"],
  ["Franchise business experience"],
] as const;

function splitAfterPhrases(text: string, phrases: readonly string[]) {
  const lines: Array<{ text: string; start: number }> = [];
  let lineStart = 0;

  phrases.forEach((phrase) => {
    const phraseStart = text.indexOf(phrase, lineStart);
    if (phraseStart === -1) return;
    const lineEnd = phraseStart + phrase.length;
    const rawLine = text.slice(lineStart, lineEnd);
    const leadingSpaceCount = rawLine.length - rawLine.trimStart().length;
    lines.push({
      text: rawLine.trim(),
      start: lineStart + leadingSpaceCount,
    });
    lineStart = lineEnd;
  });

  const rawRemainder = text.slice(lineStart);
  const remainder = rawRemainder.trim();
  if (remainder) {
    lines.push({
      text: remainder,
      start: lineStart + rawRemainder.length - rawRemainder.trimStart().length,
    });
  }
  return lines;
}

function RequirementLine({
  text,
  lineStart,
  requirement,
}: {
  text: string;
  lineStart: number;
  requirement: HomeV2QualificationRequirement;
}) {
  const emphasisStart = requirement.text.indexOf(requirement.emphasis);
  const emphasisEnd = emphasisStart + requirement.emphasis.length;
  const lineEnd = lineStart + text.length;
  const overlapStart = Math.max(lineStart, emphasisStart);
  const overlapEnd = Math.min(lineEnd, emphasisEnd);

  if (emphasisStart === -1 || overlapStart >= overlapEnd) return text;

  const relativeStart = overlapStart - lineStart;
  const relativeEnd = overlapEnd - lineStart;

  return (
    <>
      {text.slice(0, relativeStart)}
      <span className="font-semibold text-[#ed2028]">
        {text.slice(relativeStart, relativeEnd)}
      </span>
      {text.slice(relativeEnd)}
    </>
  );
}

function RequirementRow({
  number,
  requirement,
  progress,
  enterStart,
  enterEnd,
  dimStart,
  dimEnd,
  animate,
}: RequirementRowProps) {
  const requirementIndex = Number(number) - 1;
  const lines = splitAfterPhrases(
    requirement.text,
    requirementBreaks[requirementIndex] ?? [],
  );
  const opacity = useTransform(progress, (value) => {
    const entered = 0.34 + 0.66 * ramp(value, enterStart, enterEnd);
    if (dimStart === undefined || dimEnd === undefined) return entered;
    return entered * (1 - 0.52 * ramp(value, dimStart, dimEnd));
  });
  const y = useTransform(progress, (value) => 34 * (1 - ramp(value, enterStart, enterEnd)));
  const dividerScale = useTransform(progress, (value) => ramp(value, enterStart, enterEnd + 0.04));

  return (
    <motion.li
      className="relative grid grid-cols-[3.25rem_1fr] items-center border-t border-white/12 py-[clamp(1rem,2.25vh,1.75rem)] sm:grid-cols-[4.5rem_1fr] lg:grid-cols-[6rem_1fr]"
      style={{ opacity: animate ? opacity : 1, y: animate ? y : 0 }}
    >
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px origin-left bg-[#ed2028]"
        style={{ scaleX: animate ? dividerScale : 0 }}
      />
      <span aria-hidden="true" className="self-start pt-1 text-sm font-semibold tracking-[0.2em] text-[#ed2028] sm:text-base">
        {number}
      </span>
      <p className="max-w-5xl text-[clamp(1.75rem,3.35vw,4rem)] font-medium uppercase leading-[1.04] tracking-[-0.05em] text-[#f7f3ec]">
        <span className="sr-only">{requirement.text}</span>
        <span aria-hidden="true">
          {lines.map((line) => (
            <span key={line.text} className="block lg:whitespace-nowrap">
              <RequirementLine
                text={line.text}
                lineStart={line.start}
                requirement={requirement}
              />
            </span>
          ))}
        </span>
      </p>
    </motion.li>
  );
}

function Documents({ animatedStyle }: {
  animatedStyle?: { opacity: MotionValue<number>; y: MotionValue<number> };
}) {
  const content = (
    <div className="grid gap-5 md:grid-cols-[0.24fr_0.76fr] md:gap-10">
      <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-[#ed2028]">
        Required Documents
      </h3>
      <ol className="grid gap-5 sm:grid-cols-3 sm:gap-6">
        {qualifications.requiredDocuments.map((document, index) => (
          <li key={document} className="border-t border-white/15 pt-3">
            <span aria-hidden="true" className="text-[10px] font-semibold tracking-[0.2em] text-zinc-500">
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className="mt-2 max-w-xs text-sm uppercase leading-relaxed text-zinc-300 sm:text-base">
              {document}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );

  if (!animatedStyle) return content;

  return (
    <motion.div style={animatedStyle}>
      {content}
    </motion.div>
  );
}

export default function Qualifications() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = Boolean(useReducedMotion());
  const [immersiveViewport, setImmersiveViewport] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px) and (min-height: 650px)");
    const update = () => setImmersiveViewport(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const immersive = immersiveViewport && !reduceMotion;
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const documentsOpacity = useTransform(
    scrollYProgress,
    (value) => 0.16 + 0.84 * ramp(value, 0.68, 0.9),
  );
  const documentsY = useTransform(
    scrollYProgress,
    (value) => 26 * (1 - ramp(value, 0.68, 1)),
  );

  const heading = (
    <h2
      id="home-v2-qualifications-title"
      className="text-xs font-medium uppercase tracking-[0.26em] text-zinc-300 sm:text-sm"
    >
      {qualifications.title}
    </h2>
  );

  return (
    <section
      ref={sectionRef}
      aria-labelledby="home-v2-qualifications-title"
      className="relative bg-[#0d0e10] text-[#f7f3ec]"
      style={{ height: immersive ? "165svh" : "auto" }}
    >
      {immersive ? (
        <div className="sticky top-0 h-svh overflow-hidden">
          <div className="mx-auto flex h-full max-w-[96rem] flex-col px-[5%] py-[clamp(1.5rem,4vh,2.75rem)]">
            <header className="shrink-0 pb-3">{heading}</header>
            <ol className="flex min-h-0 flex-1 flex-col justify-center border-b border-white/12">
              <RequirementRow
                number="01"
                requirement={qualifications.requirements[0]}
                progress={scrollYProgress}
                enterStart={0}
                enterEnd={0.12}
                dimStart={0.25}
                dimEnd={0.38}
                animate
              />
              <RequirementRow
                number="02"
                requirement={qualifications.requirements[1]}
                progress={scrollYProgress}
                enterStart={0.2}
                enterEnd={0.34}
                dimStart={0.5}
                dimEnd={0.64}
                animate
              />
              <RequirementRow
                number="03"
                requirement={qualifications.requirements[2]}
                progress={scrollYProgress}
                enterStart={0.46}
                enterEnd={0.6}
                animate
              />
            </ol>
            <div className="shrink-0 pt-[clamp(1rem,2.5vh,1.75rem)]">
              <Documents animatedStyle={{ opacity: documentsOpacity, y: documentsY }} />
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-6xl px-6 py-14 sm:px-10 sm:py-20 lg:px-16">
          <header>{heading}</header>
          <ol className="mt-10 border-b border-white/12 sm:mt-14">
            <RequirementRow
              number="01"
              requirement={qualifications.requirements[0]}
              progress={scrollYProgress}
              enterStart={0}
              enterEnd={0.12}
              animate={false}
            />
            <RequirementRow
              number="02"
              requirement={qualifications.requirements[1]}
              progress={scrollYProgress}
              enterStart={0.2}
              enterEnd={0.34}
              animate={false}
            />
            <RequirementRow
              number="03"
              requirement={qualifications.requirements[2]}
              progress={scrollYProgress}
              enterStart={0.46}
              enterEnd={0.6}
              animate={false}
            />
          </ol>
          <div className="mt-14 sm:mt-20">
            <Documents />
          </div>
        </div>
      )}
    </section>
  );
}
