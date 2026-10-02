import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import type { HomeV2Process } from "../../data/homeV2Content";
import { useHomeV2Locale } from "./HomeV2LocaleContext";
import ChapterHeader from "./ChapterHeader";

const stepBoundaries = [0, 0.1, 0.21, 0.32, 0.43, 0.54, 0.65, 0.76, 0.87, 1] as const;
const transitionWidth = 0.018;
const processStepCount = 9;

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

function interpolate(value: number, start: number, end: number) {
  if (end === start) return value >= end ? 1 : 0;
  return clamp((value - start) / (end - start));
}

function getStepState(index: number, progress: number) {
  const start = stepBoundaries[index];
  const end = stepBoundaries[index + 1];
  const enterStart = index === 0 ? 0 : start - transitionWidth;
  const enterEnd = index === 0 ? 0 : start + transitionWidth;
  const exitStart = index === processStepCount - 1 ? 1 : end - transitionWidth;
  const exitEnd = index === processStepCount - 1 ? 1 : end + transitionWidth;
  const entering = index === 0 ? 1 : interpolate(progress, enterStart, enterEnd);
  const exiting = index === processStepCount - 1
    ? 0
    : interpolate(progress, exitStart, exitEnd);

  return {
    opacity: entering * (1 - exiting),
    y: 35 * (1 - entering) - 35 * exiting,
  };
}

type AnimatedStepProps = {
  key?: number;
  index: number;
  number: string;
  title: string;
  lineGroups: readonly string[];
  screenReaderLabel: string;
  isKorean: boolean;
  progress: MotionValue<number>;
};

function ProcessStepTitle({
  title,
  lineGroups,
}: {
  title: string;
  lineGroups: readonly string[];
}) {
  return (
    <>
      <span className="sr-only">{title}</span>
      <span aria-hidden="true" className="md:hidden">{title}</span>
      <span aria-hidden="true" className="hidden md:inline">
        {lineGroups.map((line) => (
          <span key={line} className="block xl:whitespace-nowrap">
            {line}
          </span>
        ))}
      </span>
    </>
  );
}

function AnimatedStep({
  index,
  number,
  title,
  lineGroups,
  screenReaderLabel,
  isKorean,
  progress,
}: AnimatedStepProps) {
  const opacity = useTransform(progress, (value) => getStepState(index, value).opacity);
  const y = useTransform(progress, (value) => getStepState(index, value).y);

  return (
    <motion.li
      className="absolute inset-0 flex items-center"
      style={{ opacity, y }}
    >
      <h3 className={`w-full min-w-0 text-[clamp(1.9rem,3vw,3.7rem)] font-medium leading-[1.1] text-[#f7f3ec] ${
        isKorean ? "tracking-[-0.03em]" : "uppercase tracking-[-0.04em]"
      }`}>
        <span className="sr-only">{screenReaderLabel} {number} / 09: </span>
        <ProcessStepTitle title={title} lineGroups={lineGroups} />
      </h3>
    </motion.li>
  );
}

function AnimatedNumber({
  index,
  number,
  progress,
}: {
  key?: number;
  index: number;
  number: string;
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(progress, (value) => getStepState(index, value).opacity);
  const y = useTransform(progress, (value) => getStepState(index, value).y * 0.7);

  return (
    <motion.span
      aria-hidden="true"
      className="absolute inset-0 flex items-center text-[clamp(8rem,18vw,18rem)] font-medium leading-none tracking-[-0.08em] text-[#ed2028]"
      style={{ opacity, y }}
    >
      {number}
    </motion.span>
  );
}

function ProgressCountStep({
  index,
  number,
  progress,
}: {
  key?: number;
  index: number;
  number: string;
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(progress, (value) => getStepState(index, value).opacity);
  const y = useTransform(progress, (value) => getStepState(index, value).y * 0.2);

  return (
    <motion.span
      className="absolute inset-0 flex items-center whitespace-nowrap leading-none"
      style={{ opacity, y }}
    >
      {number} / 09
    </motion.span>
  );
}

function ProgressCount({ process, progress }: {
  process: HomeV2Process;
  progress: MotionValue<number>;
}) {
  return (
    <div
      aria-hidden="true"
      className="relative h-7 w-16 overflow-hidden text-xs font-semibold leading-none tracking-[0.2em] text-[#ed2028]"
    >
      {process.steps.map(({ step }, index) => (
        <ProgressCountStep
          key={step}
          index={index}
          number={String(step).padStart(2, "0")}
          progress={progress}
        />
      ))}
    </div>
  );
}

function StaticProcess({ process, isKorean }: {
  process: HomeV2Process;
  isKorean: boolean;
}) {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10 sm:py-24 lg:px-16">
      <ChapterHeader chapter="process" id="home-v2-process-story-title" />
      <ol className="mt-10 border-b border-white/12 sm:mt-14">
        {process.steps.map(({ step, title }) => {
          const number = String(step).padStart(2, "0");

          return (
            <li
              key={step}
              className="grid grid-cols-[3.25rem_1fr] border-t border-white/12 py-6 sm:grid-cols-[4.5rem_1fr] sm:py-8"
            >
              <span
                aria-hidden="true"
                className="pt-1 text-sm font-semibold tracking-[0.2em] text-[#ed2028] sm:text-base"
              >
                {number}
              </span>
              <h3 className={`max-w-4xl text-[clamp(1.6rem,5vw,3.25rem)] font-medium leading-[1.1] text-[#f7f3ec] ${
                isKorean ? "tracking-[-0.03em]" : "uppercase tracking-[-0.04em]"
              }`}>
                <span className="sr-only">{process.stepScreenReaderLabel} {number} / 09: </span>
                <ProcessStepTitle
                  title={title}
                  lineGroups={process.steps[step - 1].lineGroups}
                />
              </h3>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function Downloads({ process, isKorean, reduceMotion }: {
  process: HomeV2Process;
  isKorean: boolean;
  reduceMotion: boolean;
}) {
  return (
    <motion.section
      aria-labelledby="home-v2-process-downloads-title"
      className="mx-auto max-w-[96rem] px-[5%] py-[clamp(4rem,8svh,6rem)]"
      initial={reduceMotion ? false : { opacity: 0, y: 25 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <h3
        id="home-v2-process-downloads-title"
        className="text-xs font-medium uppercase tracking-[0.26em] text-zinc-300 sm:text-sm"
      >
        {process.downloads.title}
      </h3>

      <a
        href="/downloads/theborn-global-application.docx"
        download="THEBORN_Global_Application.docx"
        aria-label={process.downloads.ariaLabel}
        className="group mt-8 grid min-h-36 items-center gap-7 border-y border-white/15 py-8 transition-colors duration-300 hover:border-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed2028] focus-visible:ring-offset-4 focus-visible:ring-offset-[#0d0e10] sm:mt-10 sm:min-h-44 sm:py-10 lg:grid-cols-[1fr_auto] lg:gap-12"
      >
        <span className={`text-[clamp(2rem,4vw,4.75rem)] font-medium leading-none text-[#f7f3ec] transition-transform duration-300 ease-out group-hover:translate-x-2 group-focus-visible:translate-x-2 ${
          isKorean ? "tracking-[-0.035em]" : "tracking-[-0.05em]"
        }`}>
          {process.downloads.applicationForm}
        </span>

        <span className="flex items-center justify-between gap-8 lg:justify-end lg:gap-12">
          <span className="text-xs font-semibold tracking-[0.2em] text-zinc-500">
            DOCX
          </span>
          <span className={`text-sm font-semibold text-[#ed2028] ${
            isKorean ? "tracking-[-0.01em]" : "tracking-[0.16em]"
          }`}>
            {process.downloads.action}
            <span
              aria-hidden="true"
              className="ml-2 inline-block transition-transform duration-300 ease-out group-hover:translate-x-1.5 group-hover:translate-y-1.5 group-focus-visible:translate-x-1.5 group-focus-visible:translate-y-1.5"
            >
              ↘
            </span>
          </span>
        </span>
      </a>
    </motion.section>
  );
}

export default function ProcessStory() {
  const { content, locale } = useHomeV2Locale();
  const { process } = content;
  const isKorean = locale === "ko";
  const journeyRef = useRef<HTMLDivElement>(null);
  const reduceMotion = Boolean(useReducedMotion());
  const [immersiveViewport, setImmersiveViewport] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px) and (min-height: 800px)");
    const update = () => setImmersiveViewport(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const immersive = immersiveViewport && !reduceMotion;
  const { scrollYProgress } = useScroll({
    target: journeyRef,
    offset: ["start start", "end end"],
  });
  const progressScale = useTransform(scrollYProgress, [0, 1], [1 / 9, 1]);

  return (
    <section
      aria-labelledby="home-v2-process-story-title"
      className="relative bg-[#0d0e10] text-[#f7f3ec]"
    >
      <div
        ref={journeyRef}
        style={{ height: immersive ? "260svh" : "auto" }}
      >
        {immersive ? (
          <div className="sticky top-0 h-svh overflow-hidden">
            <div className="mx-auto flex h-full max-w-[96rem] flex-col pt-[clamp(2rem,5vh,3.5rem)] pb-[max(1.25rem,5vh,env(safe-area-inset-bottom))] pl-[5%] pr-[5%] lg:pr-[clamp(7rem,10vw,11rem)]">
              <header className="shrink-0">
                <ChapterHeader chapter="process" id="home-v2-process-story-title" />
              </header>

              <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,0.3fr)_minmax(0,0.7fr)] gap-[clamp(1.5rem,4vw,5rem)]">
                <div className="relative min-h-0" aria-hidden="true">
                  {process.steps.map(({ step }, index) => (
                    <AnimatedNumber
                      key={step}
                      index={index}
                      number={String(step).padStart(2, "0")}
                      progress={scrollYProgress}
                    />
                  ))}
                </div>

                <ol className="relative min-h-0 min-w-0">
                  {process.steps.map(({ step, title, lineGroups }, index) => (
                    <AnimatedStep
                      key={step}
                      index={index}
                      number={String(step).padStart(2, "0")}
                      title={title}
                      lineGroups={lineGroups}
                      screenReaderLabel={process.stepScreenReaderLabel}
                      isKorean={isKorean}
                      progress={scrollYProgress}
                    />
                  ))}
                </ol>
              </div>

              <div className="grid min-h-12 shrink-0 grid-cols-[minmax(0,0.3fr)_minmax(0,0.7fr)] items-center gap-[clamp(1.5rem,4vw,5rem)] border-t border-white/12 pt-5">
                <ProgressCount process={process} progress={scrollYProgress} />
                <div className="relative h-px self-center overflow-hidden bg-white/15">
                  <motion.div
                    aria-hidden="true"
                    className="absolute inset-0 origin-left bg-[#ed2028]"
                    style={{ scaleX: progressScale }}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <StaticProcess process={process} isKorean={isKorean} />
        )}
      </div>

      <Downloads process={process} isKorean={isKorean} reduceMotion={reduceMotion} />
    </section>
  );
}
