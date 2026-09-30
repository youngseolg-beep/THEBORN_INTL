import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { homeV2Content } from "../../data/homeV2Content";

const { process } = homeV2Content;

const stepBoundaries = [0, 0.1, 0.21, 0.32, 0.43, 0.54, 0.65, 0.76, 0.87, 1] as const;
const transitionWidth = 0.018;

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
  const exitStart = index === process.steps.length - 1 ? 1 : end - transitionWidth;
  const exitEnd = index === process.steps.length - 1 ? 1 : end + transitionWidth;
  const entering = index === 0 ? 1 : interpolate(progress, enterStart, enterEnd);
  const exiting = index === process.steps.length - 1
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
  progress: MotionValue<number>;
};

function AnimatedStep({ index, number, title, progress }: AnimatedStepProps) {
  const opacity = useTransform(progress, (value) => getStepState(index, value).opacity);
  const y = useTransform(progress, (value) => getStepState(index, value).y);

  return (
    <motion.li
      className="absolute inset-0 flex items-center"
      style={{ opacity, y }}
    >
      <h3 className="max-w-[13ch] text-[clamp(2.5rem,4.7vw,5.5rem)] font-medium leading-[1.02] tracking-[-0.055em] text-[#f7f3ec]">
        <span className="sr-only">Step {number} of 09: </span>
        {title}
      </h3>
    </motion.li>
  );
}

function AnimatedNumber({
  index,
  number,
  progress,
}: Omit<AnimatedStepProps, "title">) {
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
}: Omit<AnimatedStepProps, "title">) {
  const opacity = useTransform(progress, (value) => getStepState(index, value).opacity);
  const y = useTransform(progress, (value) => getStepState(index, value).y * 0.2);

  return (
    <motion.span
      className="absolute inset-0 whitespace-nowrap"
      style={{ opacity, y }}
    >
      {number} / 09
    </motion.span>
  );
}

function ProgressCount({ progress }: { progress: MotionValue<number> }) {
  return (
    <div
      aria-hidden="true"
      className="relative h-5 w-14 overflow-hidden text-xs font-semibold tracking-[0.2em] text-[#ed2028]"
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

function StaticProcess() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10 sm:py-24 lg:px-16">
      <h2
        id="home-v2-process-story-title"
        className="text-xs font-medium uppercase tracking-[0.26em] text-zinc-300 sm:text-sm"
      >
        {process.title}
      </h2>
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
              <h3 className="max-w-4xl text-[clamp(1.75rem,5.8vw,3.75rem)] font-medium leading-[1.05] tracking-[-0.045em] text-[#f7f3ec]">
                <span className="sr-only">Step {number} of 09: </span>
                {title}
              </h3>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function Downloads({ reduceMotion }: { reduceMotion: boolean }) {
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
        Downloads
      </h3>

      <a
        href="/downloads/theborn-global-application.docx"
        download="THEBORN_Global_Application.docx"
        aria-label="Download Application Form (DOCX)"
        className="group mt-8 grid min-h-36 items-center gap-7 border-y border-white/15 py-8 transition-colors duration-300 hover:border-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed2028] focus-visible:ring-offset-4 focus-visible:ring-offset-[#0d0e10] sm:mt-10 sm:min-h-44 sm:py-10 lg:grid-cols-[1fr_auto] lg:gap-12"
      >
        <span className="text-[clamp(2rem,4vw,4.75rem)] font-medium leading-none tracking-[-0.05em] text-[#f7f3ec] transition-transform duration-300 ease-out group-hover:translate-x-2 group-focus-visible:translate-x-2">
          APPLICATION FORM
        </span>

        <span className="flex items-center justify-between gap-8 lg:justify-end lg:gap-12">
          <span className="text-xs font-semibold tracking-[0.2em] text-zinc-500">
            DOCX
          </span>
          <span className="text-sm font-semibold tracking-[0.16em] text-[#ed2028]">
            DOWNLOAD
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
  const journeyRef = useRef<HTMLDivElement>(null);
  const reduceMotion = Boolean(useReducedMotion());
  const [immersiveViewport, setImmersiveViewport] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px) and (min-height: 700px)");
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
            <div className="mx-auto flex h-full max-w-[96rem] flex-col px-[5%] py-[clamp(2rem,5vh,3.5rem)]">
              <header className="shrink-0">
                <h2
                  id="home-v2-process-story-title"
                  className="text-xs font-medium uppercase tracking-[0.26em] text-zinc-300 sm:text-sm"
                >
                  {process.title}
                </h2>
              </header>

              <div className="grid min-h-0 flex-1 grid-cols-[0.42fr_0.58fr] gap-[clamp(2rem,6vw,8rem)]">
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

                <ol className="relative min-h-0">
                  {process.steps.map(({ step, title }, index) => (
                    <AnimatedStep
                      key={step}
                      index={index}
                      number={String(step).padStart(2, "0")}
                      title={title}
                      progress={scrollYProgress}
                    />
                  ))}
                </ol>
              </div>

              <div className="grid shrink-0 grid-cols-[0.42fr_0.58fr] gap-[clamp(2rem,6vw,8rem)] border-t border-white/12 pt-5">
                <ProgressCount progress={scrollYProgress} />
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
          <StaticProcess />
        )}
      </div>

      <Downloads reduceMotion={reduceMotion} />
    </section>
  );
}
