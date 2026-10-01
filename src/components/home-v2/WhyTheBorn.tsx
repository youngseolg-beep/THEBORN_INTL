import { motion, useReducedMotion } from "motion/react";
import { homeV2Content } from "../../data/homeV2Content";

const { whyTheBorn } = homeV2Content;

export default function WhyTheBorn() {
  const reduceMotion = Boolean(useReducedMotion());
  const reveal = reduceMotion ? false : { opacity: 0, y: 20 };

  return (
    <section
      aria-labelledby="home-v2-why-the-born-title"
      className="bg-[#090a0c] px-[5%] pb-[clamp(7rem,14svh,11rem)] text-[#f7f3ec]"
    >
      <div className="mx-auto grid max-w-7xl gap-12 border-t border-white/10 pt-[clamp(5rem,11svh,8rem)] lg:grid-cols-[minmax(0,0.44fr)_minmax(0,0.56fr)] lg:items-center lg:gap-[clamp(4rem,7vw,7rem)]">
        <motion.div
          className="aspect-[4/5] w-full overflow-hidden rounded-2xl bg-zinc-900"
          initial={reveal}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            src={whyTheBorn.media.src}
            alt={whyTheBorn.media.alt}
            width={843}
            height={796}
            className="h-full w-full object-cover object-center"
            loading="lazy"
            decoding="async"
          />
        </motion.div>

        <motion.div
          initial={reveal}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65, delay: reduceMotion ? 0 : 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#ed2028] sm:text-sm">
            {whyTheBorn.eyebrow}
          </p>
          <h2
            id="home-v2-why-the-born-title"
            className="mt-5 text-[clamp(2.5rem,4vw,3.25rem)] font-medium leading-[1.04] tracking-[-0.05em] text-white"
          >
            {whyTheBorn.title}
          </h2>
          <div className="mt-8 space-y-5 text-base leading-[1.75] text-zinc-300 sm:text-lg lg:mt-10">
            {whyTheBorn.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
