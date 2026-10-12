import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import {
  type HomeV2QualificationRequirement,
  type HomeV2Qualifications,
} from "../../data/homeV2Content";
import { useHomeV2Locale } from "./HomeV2LocaleContext";
import ChapterHeader from "./ChapterHeader";
import { useMobileLayout } from "./useMobileLayout";

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
  isKorean: boolean;
  index: number;
  mobileProgress: MotionValue<number>;
  mobileStory: boolean;
};

function getMobileRequirementState(index: number, value: number) {
  const centers = [0.12, 0.43, 0.72];
  const center = centers[index];
  const enter = ramp(value, center - 0.13, center);
  const exit = ramp(value, center + 0.11, center + 0.2);
  const finalHold = ramp(value, 0.88, 0.97);
  const active = enter * (1 - exit);
  const baseOpacity = value < center ? 0.58 : 0.76;

  return {
    opacity: baseOpacity + (1 - baseOpacity) * active + (0.94 - baseOpacity) * finalHold,
    y: 6 * (1 - enter) * (1 - finalHold),
    numberColor: finalHold > 0.5 || active > 0.35 ? "#ed2028" : value > center ? "#a61a20" : "#71717a",
  };
}

const mobileLineGroups = {
  en: {
    "01": ["Local company with", "at least 3 years", "of F&B or related", "business experience"],
    "02": ["Sufficient capital for", "direct-store expansion"],
    "03": ["Franchise business", "experience preferred"],
  },
  ko: {
    "01": ["최소 3년 이상의 F&B 혹은 유사업종", "사업 경력의 현지 기업"],
    "02": ["사업 확장을 위한 충분한 자본력", "(직영점 확장을 위함)"],
    "03": ["프랜차이즈 사업 경험자 우대"],
  },
} as const;

function getLineSegments(
  requirement: HomeV2QualificationRequirement,
  lineGroups: readonly string[] = requirement.lineGroups,
) {
  let searchStart = 0;
  return lineGroups.map((text) => {
    const start = requirement.text.indexOf(text, searchStart);
    searchStart = Math.max(searchStart, start + text.length);
    return { text, start: Math.max(0, start) };
  });
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
  isKorean,
  index,
  mobileProgress,
  mobileStory,
}: RequirementRowProps) {
  const lines = getLineSegments(requirement);
  const mobileLines = getLineSegments(
    requirement,
    mobileLineGroups[isKorean ? "ko" : "en"][number as "01" | "02" | "03"],
  );
  const opacity = useTransform(progress, (value) => {
    const entered = 0.34 + 0.66 * ramp(value, enterStart, enterEnd);
    if (dimStart === undefined || dimEnd === undefined) return entered;
    return entered * (1 - 0.52 * ramp(value, dimStart, dimEnd));
  });
  const y = useTransform(progress, (value) => 34 * (1 - ramp(value, enterStart, enterEnd)));
  const dividerScale = useTransform(progress, (value) => ramp(value, enterStart, enterEnd + 0.04));
  const mobileOpacity = useTransform(mobileProgress, (value) => getMobileRequirementState(index, value).opacity);
  const mobileY = useTransform(mobileProgress, (value) => getMobileRequirementState(index, value).y);
  const mobileNumberColor = useTransform(
    mobileProgress,
    (value) => getMobileRequirementState(index, value).numberColor,
  );

  return (
    <motion.li
      className="relative grid grid-cols-[3.25rem_1fr] items-center border-t border-white/12 py-[clamp(1rem,2.25vh,1.75rem)] sm:grid-cols-[4.5rem_1fr] lg:grid-cols-[6rem_1fr]"
      style={{
        opacity: animate ? opacity : mobileStory ? mobileOpacity : 1,
        y: animate ? y : mobileStory ? mobileY : 0,
      }}
    >
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px origin-left bg-[#ed2028]"
        style={{ scaleX: animate ? dividerScale : 0 }}
      />
      <motion.span
        aria-hidden="true"
        className="self-start pt-1 text-sm font-semibold tracking-[0.2em] text-[#ed2028] sm:text-base"
        style={{ color: mobileStory ? mobileNumberColor : undefined }}
      >
        {number}
      </motion.span>
      <p className={`max-w-5xl text-[clamp(1.75rem,3.35vw,4rem)] font-medium leading-[1.04] text-[#f7f3ec] ${
        isKorean ? "tracking-[-0.035em]" : "uppercase tracking-[-0.05em]"
      }`}>
        <span className="sr-only">{requirement.text}</span>
        <span aria-hidden="true" className="md:hidden">
          {mobileLines.map((line) => (
            <span key={line.text} className="block">
              <RequirementLine
                text={line.text}
                lineStart={line.start}
                requirement={requirement}
              />
            </span>
          ))}
        </span>
        <span aria-hidden="true" className="hidden md:inline">
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

function Documents({ qualifications, isKorean, animatedStyle }: {
  qualifications: HomeV2Qualifications;
  isKorean: boolean;
  animatedStyle?: { opacity: MotionValue<number>; y: MotionValue<number> };
}) {
  const content = (
    <div className="grid gap-5 md:grid-cols-[0.24fr_0.76fr] md:gap-10">
      <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-[#ed2028]">
        {qualifications.requiredDocumentsTitle}
      </h3>
      <ol className="grid gap-5 sm:grid-cols-3 sm:gap-6">
        {qualifications.requiredDocuments.map((document, index) => (
          <li key={document} className="border-t border-white/15 pt-3">
            <span aria-hidden="true" className="text-[10px] font-semibold tracking-[0.2em] text-zinc-500">
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className={`mt-2 max-w-xs text-sm leading-relaxed text-zinc-300 sm:text-base ${
              isKorean ? "tracking-[-0.015em]" : "uppercase"
            }`}>
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
  const { content, locale } = useHomeV2Locale();
  const { qualifications } = content;
  const isKorean = locale === "ko";
  const sectionRef = useRef<HTMLElement>(null);
  const mobileListRef = useRef<HTMLOListElement>(null);
  const reduceMotion = Boolean(useReducedMotion());
  const { mobile, storyFits } = useMobileLayout();
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
  const { scrollYProgress: mobileScrollProgress } = useScroll({
    target: mobileListRef,
    offset: ["start 78%", "end 52%"],
  });
  const mobileStory = mobile && storyFits && !reduceMotion;
  const documentsOpacity = useTransform(
    scrollYProgress,
    (value) => 0.16 + 0.84 * ramp(value, 0.68, 0.9),
  );
  const documentsY = useTransform(
    scrollYProgress,
    (value) => 26 * (1 - ramp(value, 0.68, 1)),
  );

  const heading = (
    <ChapterHeader chapter="qualifications" id="home-v2-qualifications-title" />
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
                isKorean={isKorean}
                index={0}
                mobileProgress={mobileScrollProgress}
                mobileStory={false}
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
                isKorean={isKorean}
                index={1}
                mobileProgress={mobileScrollProgress}
                mobileStory={false}
              />
              <RequirementRow
                number="03"
                requirement={qualifications.requirements[2]}
                progress={scrollYProgress}
                enterStart={0.46}
                enterEnd={0.6}
                animate
                isKorean={isKorean}
                index={2}
                mobileProgress={mobileScrollProgress}
                mobileStory={false}
              />
            </ol>
            <div className="shrink-0 pt-[clamp(1rem,2.5vh,1.75rem)]">
              <Documents
                qualifications={qualifications}
                isKorean={isKorean}
                animatedStyle={{ opacity: documentsOpacity, y: documentsY }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-6xl px-6 py-14 sm:px-10 sm:py-20 lg:px-16">
          <header>{heading}</header>
          <ol ref={mobileListRef} className="mobile-qualification-list mt-10 border-b border-white/12 sm:mt-14">
            <RequirementRow
              number="01"
              requirement={qualifications.requirements[0]}
              progress={scrollYProgress}
              enterStart={0}
              enterEnd={0.12}
              animate={false}
              isKorean={isKorean}
              index={0}
              mobileProgress={mobileScrollProgress}
              mobileStory={mobileStory}
            />
            <RequirementRow
              number="02"
              requirement={qualifications.requirements[1]}
              progress={scrollYProgress}
              enterStart={0.2}
              enterEnd={0.34}
              animate={false}
              isKorean={isKorean}
              index={1}
              mobileProgress={mobileScrollProgress}
              mobileStory={mobileStory}
            />
            <RequirementRow
              number="03"
              requirement={qualifications.requirements[2]}
              progress={scrollYProgress}
              enterStart={0.46}
              enterEnd={0.6}
              animate={false}
              isKorean={isKorean}
              index={2}
              mobileProgress={mobileScrollProgress}
              mobileStory={mobileStory}
            />
          </ol>
          <div className="mt-14 sm:mt-20">
            <Documents qualifications={qualifications} isKorean={isKorean} />
          </div>
        </div>
      )}
    </section>
  );
}
