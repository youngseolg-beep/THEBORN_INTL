import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useMobileLayout } from "./useMobileLayout";

type SectionTransitionProps = {
  number: string;
  title: string;
};

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

export default function SectionTransition({ number, title }: SectionTransitionProps) {
  const { mobile } = useMobileLayout();
  if (mobile) {
    return (
      <div role="separator" aria-label={`Chapter ${number}: ${title}`} className="bg-[#08090b] text-[#f7f3ec]">
        <div className="flex flex-col items-center justify-center px-5 text-center" aria-hidden="true">
          <p className="text-xs font-semibold tracking-[0.32em] text-[#ed2028]">{number}</p>
          <p className="font-medium uppercase leading-none tracking-[-0.06em]">{title}</p>
        </div>
      </div>
    );
  }
  return <DesktopSectionTransition number={number} title={title} />;
}

function DesktopSectionTransition({ number, title }: SectionTransitionProps) {
  const transitionRef = useRef<HTMLDivElement>(null);
  const reduceMotion = Boolean(useReducedMotion());
  const { scrollYProgress } = useScroll({
    target: transitionRef,
    offset: ["start start", "end end"],
  });

  const contentOpacity = useTransform(scrollYProgress, (value) =>
    sampleTimeline(value, [0, 0.15, 0.55, 0.9, 1], [0.88, 1, 1, 0, 0]),
  );
  const contentScale = useTransform(scrollYProgress, (value) =>
    sampleTimeline(value, [0, 0.2, 0.55, 0.9, 1], [0.985, 1, 1, 1.03, 1.03]),
  );
  const contentY = useTransform(scrollYProgress, (value) =>
    sampleTimeline(value, [0, 0.2, 0.55, 0.9, 1], [8, 0, 0, -20, -20]),
  );
  const sceneBackground = useTransform(scrollYProgress, (value) =>
    `rgba(8, 9, 11, ${sampleTimeline(value, [0, 0.55, 0.9, 1], [1, 1, 0, 0])})`,
  );

  return (
    <div
      ref={transitionRef}
      role="separator"
      aria-label={`Chapter ${number}: ${title}`}
      className={reduceMotion
        ? "h-[82svh] bg-[#08090b] sm:h-[88svh] lg:h-svh"
        : "pointer-events-none relative z-10 -mb-[60svh] h-[142svh] bg-transparent sm:h-[148svh] lg:h-[160svh]"}
    >
      <motion.div
        className={reduceMotion
          ? "flex h-full items-center justify-center overflow-hidden px-4 text-center text-[#f7f3ec] sm:px-8"
          : "sticky top-0 flex h-[82svh] items-center justify-center overflow-hidden px-4 text-center text-[#f7f3ec] sm:h-[88svh] sm:px-8 lg:h-svh"}
        style={{ backgroundColor: reduceMotion ? "#08090b" : sceneBackground }}
      >
        <motion.div
          aria-hidden="true"
          className="flex max-w-full flex-col items-center"
          style={{
            opacity: reduceMotion ? 1 : contentOpacity,
            scale: reduceMotion ? 1 : contentScale,
            y: reduceMotion ? 0 : contentY,
          }}
        >
          <p className="text-xs font-semibold tracking-[0.32em] text-[#ed2028] sm:text-sm">
            {number}
          </p>
          <p className="mt-7 max-w-[96vw] whitespace-nowrap text-[clamp(2rem,8vw,9rem)] font-medium uppercase leading-none tracking-[-0.06em] sm:mt-8">
            {title}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
