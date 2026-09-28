import { useId, useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import countriesData from "world-atlas/countries-110m.json";
import { homeV2Content } from "../../data/homeV2Content";

// Natural Earth 1:110m country geometry, bundled by Vite; no runtime request.
const topology = countriesData as unknown as Topology<{ countries: GeometryCollection }>;
const countries = feature(topology, topology.objects.countries);
const projection = geoNaturalEarth1().fitExtent([[16, 12], [984, 512]], countries);
const path = geoPath(projection);
const countryPaths = countries.features.map((country, index) => ({
  id: country.id == null ? `unassigned-${index}` : String(country.id).padStart(3, "0"),
  d: path(country) ?? "",
}));
// ISO 3166-1 numeric identifiers supplied by world-atlas.
const directCountryIds = new Set(["840", "156", "392"]);
const operatingCountryIds = new Set([
  "840", // United States
  "156", // China
  "392", // Japan
  "360", // Indonesia
  "608", // Philippines
  "158", // Taiwan
  "458", // Malaysia
  "496", // Mongolia
  "528", // Netherlands
  "276", // Germany
  "036", // Australia
  "764", // Thailand
  "116", // Cambodia
]);
// Singapore is omitted from Natural Earth's 1:110m country geometry.
const singapore = projection([103.8198, 1.3521])!;

type MapProps = {
  directEmphasis: number | MotionValue<number>;
  masterEmphasis: number | MotionValue<number>;
};

function WorldMap({ directEmphasis, masterEmphasis }: MapProps) {
  const id = useId();
  return (
    <svg viewBox="0 0 1000 524" role="img" aria-labelledby={id}
      className="h-full w-full" preserveAspectRatio="xMidYMid meet">
      <title id={id}>World map showing direct operations in the United States, China, and Japan, followed by all current operating countries.</title>
      <g aria-hidden="true" strokeLinejoin="round">
        {countryPaths.map((country) => (
          <path key={country.id} d={country.d} fill="#303238" stroke="#55575e"
            strokeWidth="0.45" vectorEffect="non-scaling-stroke" />
        ))}
        <g opacity="0.78">
          {countryPaths.filter((country) => operatingCountryIds.has(country.id)).map((country) => (
            <path key={country.id} d={country.d} fill="#b5161d" stroke="#d63a40"
              strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
          ))}
          {/* Accurate coordinate fallback for Singapore, absent at 1:110m. */}
          <circle cx={singapore[0]} cy={singapore[1]} r="2.6" fill="#b5161d"
            stroke="#d63a40" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <circle cx={singapore[0]} cy={singapore[1]} r="4.5" fill="none"
            stroke="#d63a40" strokeWidth="0.6" opacity="0.55"
            vectorEffect="non-scaling-stroke" />
        </g>
        <motion.g style={{ opacity: directEmphasis }}>
          {countryPaths.filter((country) => directCountryIds.has(country.id)).map((country) => (
            <path key={country.id} d={country.d} fill="#ed2028" stroke="#ff6b70"
              strokeWidth="0.7" vectorEffect="non-scaling-stroke" />
          ))}
        </motion.g>
        <motion.g style={{ opacity: masterEmphasis }}>
          {countryPaths.filter((country) =>
            operatingCountryIds.has(country.id) && !directCountryIds.has(country.id)
          ).map((country) => (
            <path key={country.id} d={country.d} fill="#ed2028" stroke="#ff6b70"
              strokeWidth="0.7" vectorEffect="non-scaling-stroke" />
          ))}
          <circle cx={singapore[0]} cy={singapore[1]} r="2.6" fill="#ed2028"
            stroke="#ff6b70" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <circle cx={singapore[0]} cy={singapore[1]} r="4.5" fill="none"
            stroke="#ff6b70" strokeWidth="0.7" opacity="0.65"
            vectorEffect="non-scaling-stroke" />
        </motion.g>
      </g>
    </svg>
  );
}

export default function GlobalPresence() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleId = useId();
  const reduceMotion = useReducedMotion();
  const { corporate, globalPresence, partnership } = homeV2Content;
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const mapOpacity = useTransform(scrollYProgress, [0, 0.2, 0.88, 1], [0.65, 1, 1, 0.85]);
  // Scale stays inside its layout cell, including on mobile.
  const mapScale = useTransform(scrollYProgress, [0, 0.25, 0.55, 0.85, 1], [0.97, 0.985, 1, 0.99, 0.98]);
  const directCopyOpacity = useTransform(scrollYProgress, [0, 0.18, 0.25, 0.48, 0.55, 1], [0, 0, 1, 1, 0, 0]);
  const directEmphasis = useTransform(scrollYProgress, [0, 0.18, 0.25, 0.48, 0.55, 1], [0, 0, 0.38, 0.38, 0, 0]);
  // Outgoing copy is completely gone before incoming copy starts.
  const masterCopyOpacity = useTransform(scrollYProgress, [0, 0.58, 0.65, 1], [0, 0, 1, 1]);
  const masterEmphasis = useTransform(scrollYProgress, [0, 0.58, 0.65, 0.85, 0.92, 1], [0, 0, 0.34, 0.34, 0.16, 0]);
  const directVisibility = useTransform(scrollYProgress, (value) =>
    value >= 0.18 && value < 0.55 ? "visible" : "hidden");
  const masterVisibility = useTransform(scrollYProgress, (value) =>
    value > 0.58 ? "visible" : "hidden");
  const statsOpacity = useTransform(scrollYProgress, [0, 0.83, 0.94, 1], [0, 0, 1, 1]);

  const heading = (
    <header>
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#e31b23] sm:text-xs">
        {corporate.name}
      </p>
      <h2 id={titleId} className="text-3xl font-medium tracking-[-0.045em] sm:text-4xl md:text-5xl">
        {globalPresence.title}
      </h2>
    </header>
  );
  const directCopy = (
    <div>
      <h3 className="mb-3 text-xs font-medium uppercase tracking-[0.22em] text-zinc-400">
        Direct Operations
      </h3>
      <ul className="space-y-1 text-xl font-medium tracking-tight sm:text-2xl md:text-3xl">
        {globalPresence.localEntities.map((entity) => (
          <li key={entity.market}>{entity.entityName}</li>
        ))}
      </ul>
    </div>
  );
  const masterCopy = (
    <div>
      <h3 className="mb-3 text-xl font-medium tracking-tight sm:text-2xl md:text-3xl">
        {globalPresence.otherMarketsModel}
      </h3>
      <p className="max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base">
        {partnership.description}
      </p>
    </div>
  );

  if (reduceMotion) {
    return (
      <section ref={sectionRef} aria-labelledby={titleId}
        className="min-h-svh bg-[#09090b] px-6 py-12 text-white sm:px-10 md:px-16">
        <div className="mx-auto max-w-6xl">
          {heading}
          <div className="my-8 aspect-[1000/524]">
            <WorldMap directEmphasis={0} masterEmphasis={0} />
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {directCopy}
            {masterCopy}
          </div>
          <p className="mt-8 text-sm text-zinc-400">{globalPresence.overseasSummary}</p>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} aria-labelledby={titleId} className="h-[240svh] bg-[#09090b] text-white">
      <div className="sticky top-0 h-svh overflow-x-clip overflow-y-auto bg-[#09090b]">
        {/* Separate grid rows reserve space for the map, copy, and statistics.
            Short viewports can scroll internally instead of clipping content. */}
        <div className="mx-auto grid h-full min-h-[32rem] max-w-7xl grid-rows-[auto_minmax(0,1fr)_auto_auto] gap-4 px-6 py-6 sm:px-10 md:gap-5 md:px-16 md:py-9">
          {heading}
          <motion.div className="min-h-0 min-w-0"
            style={{ opacity: mapOpacity, scale: mapScale }}>
            <WorldMap directEmphasis={directEmphasis} masterEmphasis={masterEmphasis} />
          </motion.div>
          <div className="grid min-w-0">
            <motion.div className="col-start-1 row-start-1"
              style={{ opacity: directCopyOpacity, visibility: directVisibility }}>
              {directCopy}
            </motion.div>
            <motion.div className="col-start-1 row-start-1"
              style={{ opacity: masterCopyOpacity, visibility: masterVisibility }}>
              {masterCopy}
            </motion.div>
          </div>
          <motion.p className="max-w-xl text-xs leading-relaxed text-zinc-400 sm:text-sm"
            style={{ opacity: statsOpacity }}>
            {globalPresence.overseasSummary}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
