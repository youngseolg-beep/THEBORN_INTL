import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

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
  const transitionRef = useRef<HTMLDivElement>(null);
  const reduceMotion = Boolean(useReducedMotion());
  const { scrollYProgress } = useScroll({
    target: transitionRef,
    offset: ["start end", "end start"],
  });

  const numberOpacity = useTransform(scrollYProgress, (value) =>
    sampleTimeline(value, [0, 0.12, 0.28, 0.72, 0.9, 1], [0, 1, 1, 1, 0, 0]),
  );
  const titleOpacity = useTransform(scrollYProgress, (value) =>
    sampleTimeline(value, [0, 0.16, 0.3, 0.7, 0.9, 1], [0, 0.55, 1, 1, 0, 0]),
  );
  const titleY = useTransform(scrollYProgress, (value) =>
    sampleTimeline(value, [0, 0.16, 0.3, 0.7, 0.9, 1], [28, 18, 0, 0, -24, -24]),
  );
  const lineScale = useTransform(scrollYProgress, (value) =>
    sampleTimeline(value, [0, 0.2, 0.36, 0.7, 0.92, 1], [0, 0.2, 1, 1, 0, 0]),
  );
  const lineOpacity = useTransform(scrollYProgress, (value) =>
    sampleTimeline(value, [0, 0.16, 0.3, 0.74, 0.92, 1], [0, 0.65, 1, 1, 0, 0]),
  );

  return (
    <div
      ref={transitionRef}
      role="separator"
      aria-label={`Chapter ${number}: ${title}`}
      className="flex h-[38svh] min-h-60 items-center justify-center overflow-hidden bg-[#08090b] px-6 text-center text-[#f7f3ec] sm:h-[42svh] sm:px-10 lg:h-[50svh] lg:min-h-80 [@media(max-height:600px)]:h-[42svh] [@media(max-height:600px)]:min-h-44"
    >
      <div aria-hidden="true" className="flex flex-col items-center">
        <motion.p
          className="text-xs font-semibold tracking-[0.3em] text-[#ed2028] sm:text-sm"
          style={{ opacity: reduceMotion ? 1 : numberOpacity }}
        >
          {number}
        </motion.p>
        <motion.p
          className="mt-5 text-[clamp(2.25rem,6vw,6.5rem)] font-medium uppercase leading-none tracking-[-0.055em] sm:mt-6"
          style={{
            opacity: reduceMotion ? 1 : titleOpacity,
            y: reduceMotion ? 0 : titleY,
          }}
        >
          {title}
        </motion.p>
        <motion.div
          className="mt-7 h-px w-16 origin-center bg-[#ed2028] sm:mt-9 sm:w-20"
          style={{
            opacity: reduceMotion ? 1 : lineOpacity,
            scaleX: reduceMotion ? 1 : lineScale,
          }}
        />
      </div>
    </div>
  );
}
