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

  const backgroundNumberOpacity = useTransform(scrollYProgress, (value) =>
    sampleTimeline(value, [0, 0.16, 0.38, 0.64, 0.86, 1], [0.02, 0.09, 0.12, 0.12, 0.06, 0.015]),
  );
  const backgroundNumberX = useTransform(scrollYProgress, (value) =>
    `${sampleTimeline(value, [0, 0.16, 0.38, 0.64, 0.86, 1], [8, 5, 0, -2, -8, -9])}vw`,
  );
  const backgroundNumberScale = useTransform(scrollYProgress, (value) =>
    sampleTimeline(value, [0, 0.38, 0.64, 1], [0.96, 1, 1.005, 1.015]),
  );
  const smallNumberOpacity = useTransform(scrollYProgress, (value) =>
    sampleTimeline(value, [0, 0.16, 0.64, 0.84, 1], [0, 1, 1, 0, 0]),
  );
  const smallNumberY = useTransform(scrollYProgress, (value) =>
    sampleTimeline(value, [0, 0.16, 0.64, 0.84, 1], [16, 0, 0, -16, -16]),
  );
  const titleOpacity = useTransform(scrollYProgress, (value) =>
    sampleTimeline(value, [0, 0.12, 0.34, 0.64, 0.86, 1], [0, 0, 1, 1, 0, 0]),
  );
  const titleY = useTransform(scrollYProgress, (value) =>
    sampleTimeline(value, [0, 0.12, 0.34, 0.64, 0.86, 1], [80, 80, 0, 0, -70, -70]),
  );
  const lineScale = useTransform(scrollYProgress, (value) =>
    sampleTimeline(value, [0, 0.27, 0.46, 0.64, 0.86, 1], [0, 0, 1, 1, 0, 0]),
  );
  const lineOpacity = useTransform(scrollYProgress, (value) =>
    sampleTimeline(value, [0, 0.27, 0.38, 0.64, 0.86, 1], [0, 0, 1, 1, 0, 0]),
  );
  const depthX = useTransform(scrollYProgress, (value) =>
    `${sampleTimeline(value, [0, 0.5, 1], [4, 0, -4])}vw`,
  );
  const depthOpacity = useTransform(scrollYProgress, (value) =>
    sampleTimeline(value, [0, 0.38, 0.64, 1], [0.35, 1, 1, 0.3]),
  );

  return (
    <div
      ref={transitionRef}
      role="separator"
      aria-label={`Chapter ${number}: ${title}`}
      className="relative isolate flex h-[38svh] min-h-60 items-center justify-center overflow-hidden bg-[#08090b] px-6 text-center text-[#f7f3ec] sm:h-[42svh] sm:px-10 lg:h-[50svh] lg:min-h-80 [@media(max-height:600px)]:h-[42svh] [@media(max-height:600px)]:min-h-44"
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-y-1/2 left-[5%] w-[90%]"
        style={{
          background: "radial-gradient(ellipse at center, rgba(237,32,40,0.075) 0%, rgba(70,29,33,0.045) 38%, transparent 72%)",
          opacity: reduceMotion ? 1 : depthOpacity,
          x: reduceMotion ? 0 : depthX,
        }}
      />

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-end">
        <motion.p
          className="mr-[-0.035em] select-none text-[48vw] font-semibold leading-[0.72] tracking-[-0.09em] text-[#6b3036] sm:text-[40vw] lg:text-[26vw] [@media(max-height:600px)]:text-[30vh]"
          style={{
            opacity: reduceMotion ? 0.12 : backgroundNumberOpacity,
            scale: reduceMotion ? 1 : backgroundNumberScale,
            x: reduceMotion ? 0 : backgroundNumberX,
          }}
        >
          {number}
        </motion.p>
      </div>

      <div aria-hidden="true" className="relative z-10 flex w-full flex-col items-center">
        <motion.p
          className="text-xs font-semibold tracking-[0.3em] text-[#ed2028] sm:text-sm"
          style={{
            opacity: reduceMotion ? 1 : smallNumberOpacity,
            y: reduceMotion ? 0 : smallNumberY,
          }}
        >
          {number}
        </motion.p>
        <div className="mt-4 max-w-full overflow-hidden px-2 pb-[0.1em] pt-[0.05em] sm:mt-5">
          <motion.p
            className="text-[clamp(1.9rem,7vw,6.5rem)] font-medium uppercase leading-none tracking-[-0.055em] [@media(max-height:600px)]:text-[clamp(1.75rem,12vh,3.75rem)]"
            style={{
              opacity: reduceMotion ? 1 : titleOpacity,
              y: reduceMotion ? 0 : titleY,
            }}
          >
            {title}
          </motion.p>
        </div>
        <motion.div
          className="mt-7 h-px w-[82vw] max-w-6xl origin-left bg-[#ed2028] sm:mt-8 sm:w-[78vw] lg:w-[72vw] [@media(max-height:600px)]:mt-5"
          style={{
            opacity: reduceMotion ? 1 : lineOpacity,
            scaleX: reduceMotion ? 1 : lineScale,
          }}
        />
      </div>
    </div>
  );
}
