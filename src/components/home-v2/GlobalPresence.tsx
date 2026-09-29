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

type ActivationGroup = {
  key: string;
  countryIds: string[];
  includesSingapore?: boolean;
  start: number;
  end: number;
};

const activationGroups: ActivationGroup[] = [
  {
    key: "asia",
    countryIds: ["392", "156", "158", "496", "764", "116", "458", "360", "608"],
    includesSingapore: true,
    start: 0.22,
    end: 0.42,
  },
  {
    key: "europe-oceania",
    countryIds: ["276", "528", "036"],
    start: 0.48,
    end: 0.66,
  },
  {
    key: "north-america",
    countryIds: ["840", "124"],
    start: 0.7,
    end: 0.8,
  },
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

function ActivationGeometry({ group, opacity }: {
  group: ActivationGroup;
  opacity: number | MotionValue<number>;
}) {
  return (
    <motion.g style={{ opacity }}>
      {group.countryIds.map((countryId) => (
        <path
          key={countryId}
          d={countryPathById.get(countryId) ?? ""}
          fill="#ed2028"
          stroke="#ff6b70"
          strokeWidth="0.7"
          vectorEffect="non-scaling-stroke"
        />
      ))}
      {group.includesSingapore && (
        <>
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
        </>
      )}
    </motion.g>
  );
}

function AnimatedActivationGroup({ group, progress }: {
  group: ActivationGroup;
  progress: MotionValue<number>;
}) {
  const activationOpacity = useTransform(
    progress,
    [0, group.start, group.end, 1],
    [0, 0, 1, 1],
  );

  return <ActivationGeometry group={group} opacity={activationOpacity} />;
}

function AnimatedCountryName({ country, index, progress }: {
  country: string;
  index: number;
  progress: MotionValue<number>;
}) {
  const revealStart = 0.85 + index * 0.0052;
  const revealEnd = revealStart + 0.014;
  const opacity = useTransform(progress, (value) =>
    Math.min(1, Math.max(0, (value - revealStart) / (revealEnd - revealStart))));
  const y = useTransform(opacity, (value) => 10 * (1 - value));

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
  cameraTransform?: string | MotionValue<string>;
  originOpacity: number | MotionValue<number>;
  originRadius: number | MotionValue<number>;
  staticActive?: boolean;
};

function WorldMap({
  progress,
  cameraTransform = "translate(0 0) scale(1)",
  originOpacity,
  originRadius,
  staticActive = false,
}: WorldMapProps) {
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
      <motion.g
        aria-hidden="true"
        strokeLinejoin="round"
        style={{
          transform: cameraTransform,
          transformBox: "view-box",
          originX: 0,
          originY: 0,
        }}
      >
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

        {progress && activationGroups.map((group) => (
          <AnimatedActivationGroup
            key={group.key}
            group={group}
            progress={progress}
          />
        ))}
        {staticActive && activationGroups.map((group) => (
          <ActivationGeometry key={group.key} group={group} opacity={1} />
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
      </motion.g>
    </svg>
  );
}

export default function GlobalPresence() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const reduceMotion = useReducedMotion();
  const { corporate, globalPresence, partnership } = homeV2Content;
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const cameraStages = [0, 0.2, 0.45, 0.68, 0.82, 1];
  const cameraScaleValues = [5.4, 4.1, 2.3, 1.35, 1, 1];
  const cameraTransform = useTransform(
    scrollYProgress,
    cameraStages,
    cameraScaleValues.map((scale, index) => {
      const x = index < 4 ? 500 - koreaPoint[0] * scale : 0;
      const y = index < 4 ? 262 - koreaPoint[1] * scale : 0;
      return `translate(${x}px, ${y}px) scale(${scale})`;
    }),
  );
  const mapOpacity = useTransform(scrollYProgress, [0, 0.04, 1], [0.9, 1, 1]);
  const originOpacity = useTransform(
    scrollYProgress,
    cameraStages,
    [0.9, 0.85, 0.72, 0.55, 0.35, 0.3],
  );
  const originRadius = useTransform(
    scrollYProgress,
    cameraStages,
    [1.2, 1.3, 1.5, 1.8, 2.1, 2.1],
  );

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
        aria-labelledby={titleId}
        className="min-h-svh bg-[#09090b] px-6 py-12 text-white sm:px-10 md:px-16"
      >
        <div ref={sectionRef} className="mx-auto max-w-6xl">
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
    <section aria-labelledby={titleId} className="bg-[#09090b] text-white">
      <div ref={sectionRef} className="h-[280svh]">
        <div className="sticky top-0 h-svh overflow-x-clip overflow-y-auto bg-[#09090b]">
          <div className="mx-auto flex h-full min-h-[32rem] max-w-7xl flex-col px-6 py-5 sm:px-10 md:px-16 md:py-6">
            <div className="relative z-10 shrink-0">
              {heading}
            </div>
            <div className="mt-3 flex min-h-0 flex-1 items-center justify-center md:mt-4">
              <motion.div
                className="aspect-[1000/524] w-full shrink-0 md:w-[min(90vw,140svh)] md:max-w-none"
                style={{ opacity: mapOpacity }}
              >
                <WorldMap
                  progress={scrollYProgress}
                  cameraTransform={cameraTransform}
                  originOpacity={originOpacity}
                  originRadius={originRadius}
                />
              </motion.div>
            </div>
            <ul className="mx-auto mt-2 grid w-full max-w-4xl shrink-0 grid-cols-2 gap-x-5 gap-y-2 sm:grid-cols-3 lg:grid-cols-5">
              {operatingCountries.map((country, index) => (
                <AnimatedCountryName
                  key={country}
                  country={country}
                  index={index}
                  progress={scrollYProgress}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10 md:px-16 md:py-20">
        <div className="grid gap-8 md:grid-cols-2">
          {directCopy}
          {masterCopy}
        </div>
        <p className="mt-8 max-w-xl text-sm leading-relaxed text-zinc-400">
          {globalPresence.overseasSummary}
        </p>
      </div>
    </section>
  );
}
