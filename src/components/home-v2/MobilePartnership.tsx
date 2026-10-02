import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useHomeV2Locale } from "./HomeV2LocaleContext";
import ChapterHeader from "./ChapterHeader";
import { getMobileImageSource } from "./responsiveImages";

function ramp(value: number, start: number, end: number) {
  return Math.min(1, Math.max(0, (value - start) / (end - start)));
}

export default function MobilePartnership({ storyFits }: { storyFits: boolean }) {
  const { content, locale } = useHomeV2Locale();
  const { partnership } = content;
  const reduceMotion = Boolean(useReducedMotion());
  const animate = storyFits && !reduceMotion;
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: progress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  const relationshipOpacity = useTransform(progress, value => 1 - ramp(value, 0.45, 0.55));
  const lineScale = useTransform(progress, [0.06, 0.27], [0, 1]);
  const partnerOpacity = useTransform(progress, value => ramp(value, 0.15, 0.23));
  const partnerColor = useTransform(progress, [0.25, 0.29], ["#f7f3ec", "#ed2028"]);
  const modelOpacity = useTransform(progress, value => ramp(value, 0.51, 0.60));
  const modelY = useTransform(progress, [0.51, 0.60], [14, 0]);
  const policyOpacity = useTransform(progress, value => ramp(value, 0.57, 0.64) * (1 - ramp(value, 0.80, 0.85)));
  const selectionOpacity = useTransform(progress, value => ramp(value, 0.83, 0.9));
  const progressScale = useTransform(progress, [0, 1], [0, 1]);

  return (
    <section className="mobile-partnership" aria-labelledby="mobile-partnership-title">
      <div className="mobile-partnership-intro">
        <ChapterHeader chapter="partnership" as="p" />
        <picture className="block w-full">
          <source
            media="(max-width: 767px)"
            srcSet={getMobileImageSource(partnership.media.src)}
            type="image/webp"
          />
          <img
            src={partnership.media.src}
            alt={partnership.media.alt}
            width={1420}
            height={918}
            loading="lazy"
            decoding="async"
          />
        </picture>
        <h2 id="mobile-partnership-title" className={locale === "en" ? "uppercase" : ""}>{partnership.title}</h2>
        <p className="mobile-body text-zinc-300">{partnership.description}</p>
      </div>
      <div ref={trackRef} className={animate ? "mobile-partnership-track" : "mobile-partnership-flow"} data-mobile-story={animate ? "partnership" : "static-partnership"}>
        <div className={animate ? "mobile-partnership-scene" : ""}>
          {animate ? (
            <div className="sr-only">
              <p>{partnership.relationship.brand} — {partnership.relationship.partner}</p>
              <h3>{partnership.model}</h3>
              <p>{partnership.managementPolicy}</p>
              <p>{partnership.partnerSelection}</p>
            </div>
          ) : null}
          <motion.div aria-hidden={animate || undefined} className="mobile-relationship" style={{ opacity: animate ? relationshipOpacity : 1 }}>
            <p>{partnership.relationship.brand}</p>
            <motion.div aria-hidden="true" className="mobile-connection-line" style={{ scaleY: animate ? lineScale : 1 }} />
            <motion.p style={{ opacity: animate ? partnerOpacity : 1, color: animate ? partnerColor : "#ed2028" }}>{partnership.relationship.partner}</motion.p>
          </motion.div>
          <motion.div aria-hidden={animate || undefined} className="mobile-partnership-model" style={{ opacity: animate ? modelOpacity : 1, y: animate ? modelY : 0 }}>
            <h3 className={locale === "en" ? "uppercase" : ""}>{partnership.model}</h3>
            <div className="mobile-model-divider" aria-hidden="true" />
            <div className="mobile-partnership-statements">
              <motion.p className="mobile-body" style={{ opacity: animate ? policyOpacity : 1 }}>{partnership.managementPolicy}</motion.p>
              <motion.p className="mobile-body" style={{ opacity: animate ? selectionOpacity : 1 }}>{partnership.partnerSelection}</motion.p>
            </div>
          </motion.div>
          {animate ? <div className="mobile-story-progress" aria-hidden="true"><motion.div style={{ scaleX: progressScale }} /></div> : null}
        </div>
      </div>
    </section>
  );
}
