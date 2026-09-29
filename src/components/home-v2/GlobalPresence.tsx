import { useId, useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { geoArea, geoCentroid, geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Polygon } from "geojson";
import type { GeometryCollection, Topology } from "topojson-specification";
import countriesData from "world-atlas/countries-110m.json";
import { homeV2Content } from "../../data/homeV2Content";

// Natural Earth 1:110m country geometry, bundled by Vite; no runtime request.
const topology = countriesData as unknown as Topology<{ countries: GeometryCollection }>;
const countries = feature(topology, topology.objects.countries);
const projection = geoNaturalEarth1().fitExtent([[16, 12], [984, 512]], countries);
const path = geoPath(projection);

// Select the contiguous mainland polygon from Natural Earth's U.S. MultiPolygon.
// Alaska and Hawaii are omitted without substituting any handmade geometry.
const unitedStatesFeature = countries.features.find(
  (country) => String(country.id).padStart(3, "0") === "840",
);
const contiguousUnitedStates = unitedStatesFeature?.geometry.type === "MultiPolygon"
  ? unitedStatesFeature.geometry.coordinates
      .map((coordinates): Polygon => ({ type: "Polygon", coordinates }))
      .filter((polygon) => {
        const [longitude, latitude] = geoCentroid(polygon);
        return longitude >= -130 && longitude <= -60 && latitude >= 20 && latitude <= 55;
      })
      .sort((left, right) => geoArea(right) - geoArea(left))[0]
  : undefined;
const contiguousUnitedStatesPath = contiguousUnitedStates
  ? path(contiguousUnitedStates) ?? ""
  : "";

const countryPaths = countries.features
  .filter((country) => String(country.id).padStart(3, "0") !== "010")
  .map((country, index) => ({
    id: country.id == null ? `unassigned-${index}` : String(country.id).padStart(3, "0"),
    d: String(country.id).padStart(3, "0") === "840"
      ? contiguousUnitedStatesPath
      : path(country) ?? "",
  }));
const countryPathById = new Map(countryPaths.map((country) => [country.id, country.d]));

const korea: [number, number] = [127.7669, 35.9078];
const koreaPoint = projection(korea)!;
const singaporeCoordinate: [number, number] = [103.8198, 1.3521];
const singaporePoint = projection(singaporeCoordinate)!;

type Destination = {
  key: string;
  countryId?: string;
  additionalCountryIds?: string[];
  start: number;
  arrival: number;
};

const destinations: Destination[] = [
  { key: "Japan", countryId: "392", start: 0.08, arrival: 0.104 },
  { key: "China", countryId: "156", start: 0.124, arrival: 0.148 },
  { key: "Taiwan", countryId: "158", start: 0.168, arrival: 0.192 },
  { key: "Mongolia", countryId: "496", start: 0.212, arrival: 0.236 },
  { key: "Thailand", countryId: "764", start: 0.256, arrival: 0.28 },
  { key: "Cambodia", countryId: "116", start: 0.3, arrival: 0.324 },
  { key: "Malaysia", countryId: "458", start: 0.344, arrival: 0.368 },
  { key: "Singapore", start: 0.388, arrival: 0.412 },
  { key: "Indonesia", countryId: "360", start: 0.432, arrival: 0.456 },
  { key: "Philippines", countryId: "608", start: 0.476, arrival: 0.5 },
  { key: "Germany", countryId: "276", start: 0.52, arrival: 0.57 },
  { key: "Netherlands", countryId: "528", start: 0.59, arrival: 0.64 },
  { key: "Australia", countryId: "036", start: 0.66, arrival: 0.755 },
  { key: "United States", countryId: "840", additionalCountryIds: ["124"], start: 0.78, arrival: 0.895 },
];

const operatingCountries = [
  "United States",
  "Canada",
  "Japan",
  "China",
  "Taiwan",
  "Mongolia",
  "Thailand",
  "Cambodia",
  "Malaysia",
  "Singapore",
  "Indonesia",
  "Philippines",
  "Germany",
  "Netherlands",
  "Australia",
];

function DestinationGeometry({ destination, opacity }: {
  destination: Destination;
  opacity: number | MotionValue<number>;
}) {
  if (!destination.countryId) {
    return (
      <motion.g style={{ opacity }}>
        <circle
          cx={singaporePoint[0]}
          cy={singaporePoint[1]}
          r="2.6"
          fill="#ed2028"
          stroke="#ff6b70"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
        <circle
          cx={singaporePoint[0]}
          cy={singaporePoint[1]}
          r="4.5"
          fill="none"
          stroke="#ff6b70"
          strokeWidth="0.7"
          opacity="0.65"
          vectorEffect="non-scaling-stroke"
        />
      </motion.g>
    );
  }

  const countryIds = [destination.countryId, ...(destination.additionalCountryIds ?? [])];

  return (
    <motion.g style={{ opacity }}>
      {countryIds.map((countryId) => (
        <path
          key={countryId}
          d={countryPathById.get(countryId) ?? ""}
          fill="#ed2028"
          stroke="#ff6b70"
          strokeWidth="0.7"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </motion.g>
  );
}

function AnimatedDestination({ destination, progress }: {
  destination: Destination;
  progress: MotionValue<number>;
}) {
  // Each destination's assigned window is the visible country-color transition.
  const activationOpacity = useTransform(
    progress,
    [0, destination.start, destination.arrival, 1],
    [0, 0, 1, 1],
  );

  return <DestinationGeometry destination={destination} opacity={activationOpacity} />;
}

function AnimatedCountryName({ country, index, progress }: {
  country: string;
  index: number;
  progress: MotionValue<number>;
}) {
  const revealStart = 0.91 + index * 0.004;
  const revealEnd = revealStart + 0.018;
  const opacity = useTransform(
    progress,
    [0, revealStart, revealEnd, 1],
    [0, 0, 1, 1],
  );
  const y = useTransform(progress, [0, revealStart, revealEnd, 1], [10, 10, 0, 0]);

  return (
    <motion.li
      className="text-center text-[11px] tracking-[0.08em] text-zinc-300 sm:text-xs"
      style={{ opacity, y }}
    >
      {country}
    </motion.li>
  );
}

function StaticCountryList() {
  return (
    <ul className="mx-auto grid max-w-4xl grid-cols-2 gap-x-5 gap-y-2 sm:grid-cols-3 lg:grid-cols-5">
      {operatingCountries.map((country) => (
        <li key={country} className="text-center text-[11px] tracking-[0.08em] text-zinc-300 sm:text-xs">
          {country}
        </li>
      ))}
    </ul>
  );
}

type WorldMapProps = {
  progress?: MotionValue<number>;
  originOpacity: number | MotionValue<number>;
  originRadius: number | MotionValue<number>;
  staticActive?: boolean;
};

function WorldMap({ progress, originOpacity, originRadius, staticActive = false }: WorldMapProps) {
  const id = useId();

  return (
    <svg
      viewBox="0 0 1000 524"
      role="img"
      aria-labelledby={id}
      className="h-full w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <title id={id}>
        World map showing THEBORN expansion from South Korea to its overseas destinations.
      </title>
      <g aria-hidden="true" strokeLinejoin="round">
        {countryPaths.map((country) => (
          <path
            key={country.id}
            d={country.d}
            fill="#303238"
            stroke="#55575e"
            strokeWidth="0.45"
            vectorEffect="non-scaling-stroke"
          />
        ))}

        {/* Singapore is absent from the 1:110m geometry, so it begins as a neutral marker. */}
        <circle
          cx={singaporePoint[0]}
          cy={singaporePoint[1]}
          r="2.6"
          fill="#303238"
          stroke="#676970"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />

        {progress && destinations.map((destination) => (
          <AnimatedDestination
            key={destination.key}
            destination={destination}
            progress={progress}
          />
        ))}
        {staticActive && destinations.map((destination) => (
          <DestinationGeometry key={destination.key} destination={destination} opacity={1} />
        ))}

        <motion.circle
          cx={koreaPoint[0]}
          cy={koreaPoint[1]}
          r={originRadius}
          fill="none"
          stroke="#ed2028"
          strokeWidth="0.85"
          vectorEffect="non-scaling-stroke"
          style={{ opacity: originOpacity }}
        />
        <motion.circle
          cx={koreaPoint[0]}
          cy={koreaPoint[1]}
          r="1.8"
          fill="#ed2028"
          style={{ opacity: originOpacity }}
        />
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

  const mapOpacity = useTransform(scrollYProgress, [0, 0.08, 0.91, 1], [0.72, 1, 1, 0.9]);
  const mapScale = useTransform(
    scrollYProgress,
    [0, 0.08, 0.52, 0.66, 0.78, 0.91, 1],
    [0.97, 0.985, 1, 0.993, 1, 0.996, 0.985],
  );
  const originOpacity = useTransform(
    scrollYProgress,
    [0, 0.035, 0.08, 0.895, 0.93, 1],
    [0, 0.45, 0.62, 0.62, 0, 0],
  );
  const originRadius = useTransform(
    scrollYProgress,
    [0, 0.08, 0.3, 0.52, 0.66, 0.78, 0.91, 1],
    [3.8, 5.5, 4.2, 5.5, 4.3, 5.4, 4.2, 3.8],
  );

  const businessCopyOpacity = useTransform(scrollYProgress, [0, 0.91, 0.96, 1], [0, 0, 1, 1]);
  const businessCopyVisibility = useTransform(scrollYProgress, (value) => value >= 0.91 ? "visible" : "hidden");
  const statsOpacity = useTransform(scrollYProgress, [0, 0.92, 0.98, 1], [0, 0, 1, 1]);

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
      <h3 className="mb-2 text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-500 sm:text-xs">
        Direct Operations
      </h3>
      <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm font-medium tracking-tight text-zinc-200 sm:text-base">
        {globalPresence.localEntities.map((entity) => (
          <li key={entity.market}>{entity.entityName}</li>
        ))}
      </ul>
    </div>
  );
  const masterCopy = (
    <div>
      <h3 className="mb-2 text-base font-medium tracking-tight text-zinc-200 sm:text-lg">
        {globalPresence.otherMarketsModel}
      </h3>
      <p className="max-w-xl text-xs leading-relaxed text-zinc-500 sm:text-sm">
        {partnership.description}
      </p>
    </div>
  );

  if (reduceMotion) {
    return (
      <section
        ref={sectionRef}
        aria-labelledby={titleId}
        className="min-h-svh bg-[#09090b] px-6 py-12 text-white sm:px-10 md:px-16"
      >
        <div className="mx-auto max-w-6xl">
          {heading}
          <div className="my-8 aspect-[1000/524]">
            <WorldMap staticActive originOpacity={0} originRadius={3.8} />
          </div>
          <StaticCountryList />
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
    <section ref={sectionRef} aria-labelledby={titleId} className="h-[400svh] bg-[#09090b] text-white">
      <div className="sticky top-0 h-svh overflow-x-clip overflow-y-auto bg-[#09090b]">
        <div className="mx-auto grid h-full min-h-[32rem] max-w-7xl grid-rows-[auto_minmax(0,1fr)_auto_auto_auto] gap-4 px-6 py-6 sm:px-10 md:gap-5 md:px-16 md:py-9">
          {heading}
          <div className="relative min-h-0 min-w-0">
            <div className="h-full w-full origin-center md:scale-[1.32]">
              <motion.div className="h-full w-full" style={{ opacity: mapOpacity, scale: mapScale }}>
                <WorldMap
                  progress={scrollYProgress}
                  originOpacity={originOpacity}
                  originRadius={originRadius}
                />
              </motion.div>
            </div>
          </div>
          <ul className="mx-auto grid w-full max-w-4xl grid-cols-2 gap-x-5 gap-y-2 sm:grid-cols-3 lg:grid-cols-5">
            {operatingCountries.map((country, index) => (
              <AnimatedCountryName
                key={country}
                country={country}
                index={index}
                progress={scrollYProgress}
              />
            ))}
          </ul>
          <motion.div
            className="grid gap-3 md:grid-cols-2 md:gap-8"
            style={{ opacity: businessCopyOpacity, visibility: businessCopyVisibility }}
          >
            {directCopy}
            {masterCopy}
          </motion.div>
          <motion.p className="max-w-xl text-xs leading-relaxed text-zinc-400 sm:text-sm" style={{ opacity: statsOpacity }}>
            {globalPresence.overseasSummary}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
