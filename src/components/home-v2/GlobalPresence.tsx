import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { homeV2Content } from "../../data/homeV2Content";

const continentPaths = {
  northAmerica:
    "M54 102C75 80 100 65 128 61L165 47L201 55L228 72L258 70L282 87L268 108L244 116L233 137L213 147L198 169L206 190L231 214L237 238L221 253L202 236L190 214L171 205L157 184L134 178L119 160L95 151L79 130L57 121Z",
  greenland:
    "M250 46L286 29L323 37L334 57L315 76L279 79L255 66Z",
  southAmerica:
    "M224 250L251 244L278 255L299 278L302 309L291 337L278 358L270 389L251 424L235 442L225 418L228 387L215 361L205 330L194 306L199 278Z",
  europeAsia:
    "M414 107L438 88L467 91L482 76L512 82L537 70L572 77L600 68L632 82L665 78L695 91L729 88L761 103L796 105L823 123L857 130L881 151L869 170L839 174L819 190L790 188L774 209L746 218L721 210L699 229L670 220L648 207L621 211L599 193L572 196L553 178L526 183L510 164L488 169L473 153L449 158L430 143L407 141L395 123Z",
  africa:
    "M466 184L496 170L531 177L556 196L573 224L566 253L548 274L538 307L518 340L493 356L476 330L463 304L449 278L439 247L444 214Z",
  arabiaIndia:
    "M563 202L589 198L610 215L625 238L650 245L664 272L650 299L633 286L622 260L600 246L579 235Z",
  southEastAsia:
    "M688 237L709 232L726 247L744 254L755 273L743 288L724 279L711 292L697 278L681 267Z",
  australia:
    "M785 318L816 299L853 302L881 321L889 350L873 376L840 388L807 378L784 354Z",
  madagascar:
    "M579 319L588 328L584 357L573 372L568 345Z",
} as const;

type WorldMapProps = {
  directOpacity: number | MotionValue<number>;
  globalOpacity: number | MotionValue<number>;
};

function WorldMap({ directOpacity, globalOpacity }: WorldMapProps) {
  return (
    <svg
      viewBox="0 0 940 480"
      role="img"
      aria-labelledby="global-map-title global-map-description"
      className="h-auto w-full"
    >
      <title id="global-map-title">THEBORN global operations map</title>
      <desc id="global-map-description">
        A world map highlighting direct operations in the USA, China, and
        Japan, followed by the broader Master Franchise model.
      </desc>

      <defs>
        {Object.entries(continentPaths).map(([key, path]) => (
          <path key={key} id={`global-map-${key}`} d={path} />
        ))}
        <clipPath id="global-map-land-clip">
          {Object.keys(continentPaths).map((key) => (
            <use key={key} href={`#global-map-${key}`} />
          ))}
        </clipPath>
        <linearGradient id="global-map-red-wash" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8e1118" />
          <stop offset="0.5" stopColor="#d71920" />
          <stop offset="1" stopColor="#9d1218" />
        </linearGradient>
      </defs>

      <g aria-hidden="true">
        {Object.keys(continentPaths).map((key) => (
          <use
            key={key}
            href={`#global-map-${key}`}
            fill="#34363b"
            stroke="#555860"
            strokeWidth="1.2"
            vectorEffect="non-scaling-stroke"
          />
        ))}

        <motion.rect
          x="40"
          y="25"
          width="860"
          height="430"
          fill="url(#global-map-red-wash)"
          clipPath="url(#global-map-land-clip)"
          style={{ opacity: globalOpacity }}
        />

        <motion.g style={{ opacity: directOpacity }}>
          <path
            d="M118 139L145 126L181 128L210 139L205 160L187 177L158 175L136 163L119 153Z"
            fill="#e31b23"
          />
          <path
            d="M681 159L711 149L745 157L760 177L751 201L724 211L696 199L677 181Z"
            fill="#e31b23"
          />
          <path
            d="M790 158L797 168L795 181L802 191L797 204"
            fill="none"
            stroke="#e31b23"
            strokeLinecap="round"
            strokeWidth="6"
            vectorEffect="non-scaling-stroke"
          />

          <g fill="none" stroke="#f0444a" strokeWidth="1.5">
            <circle cx="166" cy="151" r="12" />
            <circle cx="719" cy="178" r="12" />
            <circle cx="797" cy="182" r="11" />
          </g>
          <g fill="#f0444a">
            <circle cx="166" cy="151" r="3.5" />
            <circle cx="719" cy="178" r="3.5" />
            <circle cx="797" cy="182" r="3.5" />
          </g>
        </motion.g>
      </g>
    </svg>
  );
}

export default function GlobalPresence() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const { corporate, globalPresence, partnership } = homeV2Content;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const updateViewport = () => setIsMobile(mediaQuery.matches);

    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);

    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const headingOpacity = useTransform(
    scrollYProgress,
    [0, 0.08, 0.2, 0.88, 1],
    [0.25, 1, 1, 1, 0.45],
  );
  const mapOpacity = useTransform(
    scrollYProgress,
    [0, 0.08, 0.2, 0.88, 1],
    [0.45, 0.85, 1, 1, 0.72],
  );
  const desktopMapScale = useTransform(
    scrollYProgress,
    [0, 0.2, 0.45, 0.65, 0.85, 1],
    [0.96, 1, 1.015, 1.025, 1.015, 1],
  );
  const mobileMapScale = useTransform(
    scrollYProgress,
    [0, 0.2, 0.45, 0.65, 0.85, 1],
    [0.98, 1, 1.005, 1.01, 1.005, 1],
  );
  const desktopMapY = useTransform(
    scrollYProgress,
    [0, 0.2, 0.45, 0.65, 0.85, 1],
    [18, 0, -6, -12, -18, -24],
  );
  const mobileMapY = useTransform(
    scrollYProgress,
    [0, 0.2, 0.45, 0.65, 0.85, 1],
    [10, 0, -2, -4, -6, -8],
  );
  const directOpacity = useTransform(
    scrollYProgress,
    [0, 0.18, 0.25, 0.45, 0.6, 0.65],
    [0, 0, 1, 1, 0.2, 0],
  );
  const directY = useTransform(
    scrollYProgress,
    [0.18, 0.25, 0.45, 0.65],
    [18, 0, 0, -20],
  );
  const masterOpacity = useTransform(
    scrollYProgress,
    [0, 0.55, 0.65, 0.85, 1],
    [0, 0, 1, 1, 0.8],
  );
  const masterY = useTransform(
    scrollYProgress,
    [0.55, 0.65, 0.85, 1],
    [18, 0, 0, -8],
  );
  const globalMapOpacity = useTransform(
    scrollYProgress,
    [0, 0.55, 0.65, 0.85, 1],
    [0, 0, 0.3, 0.48, 0.32],
  );
  const statsOpacity = useTransform(
    scrollYProgress,
    [0, 0.8, 0.88, 1],
    [0, 0, 1, 1],
  );
  const statsY = useTransform(
    scrollYProgress,
    [0.8, 0.88, 1],
    [12, 0, -4],
  );
  const sceneOpacity = useTransform(
    scrollYProgress,
    [0, 0.88, 1],
    [1, 1, 0.72],
  );

  const reduceMotion = Boolean(prefersReducedMotion);
  const mapScale = isMobile ? mobileMapScale : desktopMapScale;
  const mapY = isMobile ? mobileMapY : desktopMapY;

  if (reduceMotion) {
    return (
      <section
        ref={sectionRef}
        aria-labelledby="home-v2-global-presence-title"
        className="min-h-svh overflow-hidden bg-[#09090b] px-6 py-20 text-white sm:px-10 md:px-16"
      >
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.32em] text-[#e31b23]">
            {corporate.name}
          </p>
          <h2
            id="home-v2-global-presence-title"
            className="text-4xl font-medium tracking-[-0.045em] sm:text-5xl"
          >
            {globalPresence.title}
          </h2>

          <div className="mx-auto my-10 max-w-5xl">
            <WorldMap directOpacity={1} globalOpacity={0.2} />
          </div>

          <div className="grid gap-10 md:grid-cols-2 md:gap-16">
            <div>
              <p className="mb-4 text-sm uppercase tracking-[0.24em] text-zinc-400">
                Direct Operations
              </p>
              <ul className="space-y-2 text-xl text-zinc-100">
                {globalPresence.localEntities.map((entity) => (
                  <li key={entity.market}>{entity.entityName}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-4 text-sm uppercase tracking-[0.24em] text-zinc-400">
                {globalPresence.otherMarketsModel}
              </p>
              <p className="max-w-xl text-xl leading-relaxed text-zinc-100">
                {partnership.description}
              </p>
              <p className="mt-6 text-sm text-zinc-400">
                {globalPresence.overseasSummary}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      aria-labelledby="home-v2-global-presence-title"
      className="h-[240svh] bg-[#09090b] text-white"
    >
      <motion.div
        className="sticky top-0 h-svh overflow-hidden bg-[#09090b]"
        style={{ opacity: sceneOpacity }}
      >
        <motion.header
          className="absolute inset-x-0 top-0 z-20 px-6 pt-8 sm:px-10 sm:pt-10 md:px-16 md:pt-12 lg:px-24"
          style={{ opacity: headingOpacity }}
        >
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#e31b23] sm:text-xs">
            {corporate.name}
          </p>
          <h2
            id="home-v2-global-presence-title"
            className="text-3xl font-medium tracking-[-0.045em] sm:text-4xl md:text-5xl"
          >
            {globalPresence.title}
          </h2>
        </motion.header>

        <motion.div
          className="absolute inset-x-0 top-[18%] mx-auto w-[96%] max-w-6xl px-2 sm:top-[14%] sm:w-[92%] md:top-[12%]"
          style={{ opacity: mapOpacity, scale: mapScale, y: mapY }}
        >
          <WorldMap
            directOpacity={directOpacity}
            globalOpacity={globalMapOpacity}
          />
        </motion.div>

        <div className="absolute inset-x-0 bottom-0 z-20 h-[42%] px-6 pb-10 sm:px-10 sm:pb-12 md:h-[38%] md:px-16 lg:px-24">
          <motion.div
            className="absolute bottom-10 left-6 max-w-lg sm:bottom-12 sm:left-10 md:left-16 lg:left-24"
            style={{ opacity: directOpacity, y: directY }}
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#e31b23]">
              Direct Operations
            </p>
            <div className="space-y-1.5 text-2xl font-medium tracking-[-0.035em] text-white sm:text-3xl md:text-4xl">
              {globalPresence.localEntities.map((entity) => (
                <p key={entity.market}>{entity.entityName}</p>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="absolute bottom-28 left-6 max-w-xl sm:left-10 md:bottom-20 md:left-16 lg:left-24"
            style={{ opacity: masterOpacity, y: masterY }}
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#e31b23]">
              {globalPresence.otherMarketsModel}
            </p>
            <p className="max-w-lg text-xl font-medium leading-snug tracking-[-0.025em] text-white sm:text-2xl md:text-3xl">
              {partnership.description}
            </p>
          </motion.div>

          <motion.p
            className="absolute bottom-7 left-6 max-w-xs text-left text-xs leading-relaxed text-zinc-400 sm:left-10 sm:text-sm md:bottom-8 md:left-auto md:right-16 md:text-right lg:right-24"
            style={{ opacity: statsOpacity, y: statsY }}
          >
            {globalPresence.overseasSummary}
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}
