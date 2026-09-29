import { useId, useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { geoInterpolate, geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { LineString, Position } from "geojson";
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
const countryPathById = new Map(countryPaths.map((country) => [country.id, country.d]));

const korea: [number, number] = [127.7669, 35.9078];
const koreaPoint = projection(korea)!;
const singaporeCoordinate: [number, number] = [103.8198, 1.3521];
const singaporePoint = projection(singaporeCoordinate)!;

type RegionKey = "asia" | "europe" | "oceania" | "northAmerica";
type Destination = {
  key: string;
  countryId?: string;
  region: RegionKey;
  coordinate: [number, number];
  start: number;
  arrival: number;
  fadeEnd: number;
  route: string;
};

function createGeodesicRoute(destination: Position): string {
  const interpolate = geoInterpolate(korea, destination as [number, number]);
  const coordinates = Array.from({ length: 41 }, (_, index) => interpolate(index / 40));
  const geometry: LineString = { type: "LineString", coordinates };
  return path(geometry) ?? "";
}

function createDestination(
  destination: Omit<Destination, "route">,
): Destination {
  return { ...destination, route: createGeodesicRoute(destination.coordinate) };
}

// Each destination owns its route and arrival threshold. The order is the story order.
const destinations: Destination[] = [
  createDestination({ key: "Japan", countryId: "392", region: "asia", coordinate: [138.2529, 36.2048], start: 0.1, arrival: 0.13, fadeEnd: 0.17 }),
  createDestination({ key: "China", countryId: "156", region: "asia", coordinate: [104.1954, 35.8617], start: 0.14, arrival: 0.17, fadeEnd: 0.21 }),
  createDestination({ key: "Taiwan", countryId: "158", region: "asia", coordinate: [120.9605, 23.6978], start: 0.18, arrival: 0.21, fadeEnd: 0.25 }),
  createDestination({ key: "Mongolia", countryId: "496", region: "asia", coordinate: [103.8467, 46.8625], start: 0.22, arrival: 0.25, fadeEnd: 0.29 }),
  createDestination({ key: "Thailand", countryId: "764", region: "asia", coordinate: [100.9925, 15.87], start: 0.26, arrival: 0.29, fadeEnd: 0.33 }),
  createDestination({ key: "Cambodia", countryId: "116", region: "asia", coordinate: [104.991, 12.5657], start: 0.3, arrival: 0.33, fadeEnd: 0.37 }),
  createDestination({ key: "Malaysia", countryId: "458", region: "asia", coordinate: [101.9758, 4.2105], start: 0.34, arrival: 0.37, fadeEnd: 0.41 }),
  createDestination({ key: "Singapore", region: "asia", coordinate: singaporeCoordinate, start: 0.38, arrival: 0.41, fadeEnd: 0.45 }),
  createDestination({ key: "Indonesia", countryId: "360", region: "asia", coordinate: [113.9213, -0.7893], start: 0.42, arrival: 0.45, fadeEnd: 0.49 }),
  createDestination({ key: "Philippines", countryId: "608", region: "asia", coordinate: [121.774, 12.8797], start: 0.46, arrival: 0.49, fadeEnd: 0.53 }),
  createDestination({ key: "Germany", countryId: "276", region: "europe", coordinate: [10.4515, 51.1657], start: 0.5, arrival: 0.56, fadeEnd: 0.6 }),
  createDestination({ key: "Netherlands", countryId: "528", region: "europe", coordinate: [5.2913, 52.1326], start: 0.57, arrival: 0.63, fadeEnd: 0.67 }),
  createDestination({ key: "Australia", countryId: "036", region: "oceania", coordinate: [133.7751, -25.2744], start: 0.65, arrival: 0.73, fadeEnd: 0.78 }),
  createDestination({ key: "United States", countryId: "840", region: "northAmerica", coordinate: [-98.5795, 39.8283], start: 0.75, arrival: 0.86, fadeEnd: 0.9 }),
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

  return (
    <motion.path
      d={countryPathById.get(destination.countryId) ?? ""}
      fill="#ed2028"
      stroke="#ff6b70"
      strokeWidth="0.7"
      vectorEffect="non-scaling-stroke"
      style={{ opacity }}
    />
  );
}

function AnimatedDestination({ destination, progress }: {
  destination: Destination;
  progress: MotionValue<number>;
}) {
  // The destination begins changing only when its route is almost complete.
  const activationOpacity = useTransform(
    progress,
    [0, destination.arrival - 0.006, destination.arrival + 0.012, 1],
    [0, 0, 1, 1],
  );

  return <DestinationGeometry destination={destination} opacity={activationOpacity} />;
}

function AnimatedRoute({ destination, progress }: {
  destination: Destination;
  progress: MotionValue<number>;
}) {
  const pathLength = useTransform(
    progress,
    [0, destination.start, destination.arrival, 1],
    [0, 0, 1, 1],
  );
  const opacity = useTransform(
    progress,
    [
      0,
      destination.start,
      destination.start + 0.005,
      destination.arrival,
      destination.arrival + 0.012,
      destination.fadeEnd,
      destination.fadeEnd + 0.012,
      1,
    ],
    [0, 0, 0.72, 0.72, 0.18, 0.12, 0, 0],
  );

  return (
    <motion.path
      d={destination.route}
      fill="none"
      stroke="#ed2028"
      strokeWidth="0.85"
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
      style={{ opacity, pathLength }}
    />
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
        World map showing THEBORN expansion from South Korea to fourteen overseas operating markets.
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

        {progress && destinations.map((destination) => (
          <AnimatedRoute
            key={destination.key}
            destination={destination}
            progress={progress}
          />
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

  const mapOpacity = useTransform(scrollYProgress, [0, 0.1, 0.88, 1], [0.72, 1, 1, 0.9]);
  const mapScale = useTransform(
    scrollYProgress,
    [0, 0.1, 0.5, 0.65, 0.75, 0.88, 1],
    [0.97, 0.985, 1, 0.993, 1, 0.996, 0.985],
  );
  const originOpacity = useTransform(
    scrollYProgress,
    [0, 0.04, 0.1, 0.86, 0.9, 1],
    [0, 0.45, 0.62, 0.62, 0, 0],
  );
  const originRadius = useTransform(
    scrollYProgress,
    [0, 0.1, 0.3, 0.5, 0.65, 0.75, 0.88, 1],
    [3.8, 5.5, 4.2, 5.5, 4.3, 5.4, 4.2, 3.8],
  );

  const regionLabelOpacities = {
    asia: useTransform(scrollYProgress, [0, 0.09, 0.12, 0.48, 0.51, 1], [0, 0, 1, 1, 0, 0]),
    europe: useTransform(scrollYProgress, [0, 0.49, 0.52, 0.63, 0.66, 1], [0, 0, 1, 1, 0, 0]),
    oceania: useTransform(scrollYProgress, [0, 0.64, 0.67, 0.73, 0.76, 1], [0, 0, 1, 1, 0, 0]),
    northAmerica: useTransform(scrollYProgress, [0, 0.74, 0.77, 0.86, 0.89, 1], [0, 0, 1, 1, 0, 0]),
  };

  const businessCopyOpacity = useTransform(scrollYProgress, [0, 0.87, 0.93, 1], [0, 0, 1, 1]);
  const businessCopyVisibility = useTransform(scrollYProgress, (value) => value >= 0.87 ? "visible" : "hidden");
  const statsOpacity = useTransform(scrollYProgress, [0, 0.9, 0.96, 1], [0, 0, 1, 1]);

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
    <section ref={sectionRef} aria-labelledby={titleId} className="h-[320svh] bg-[#09090b] text-white">
      <div className="sticky top-0 h-svh overflow-x-clip overflow-y-auto bg-[#09090b]">
        <div className="mx-auto grid h-full min-h-[32rem] max-w-7xl grid-rows-[auto_minmax(0,1fr)_auto_auto] gap-4 px-6 py-6 sm:px-10 md:gap-5 md:px-16 md:py-9">
          {heading}
          <motion.div className="relative min-h-0 min-w-0" style={{ opacity: mapOpacity, scale: mapScale }}>
            <WorldMap
              progress={scrollYProgress}
              originOpacity={originOpacity}
              originRadius={originRadius}
            />
            <div className="pointer-events-none absolute right-0 top-1 grid text-right sm:top-3">
              <motion.p className="col-start-1 row-start-1 text-[10px] font-semibold tracking-[0.28em] text-zinc-300 sm:text-xs" style={{ opacity: regionLabelOpacities.asia }}>
                ASIA
              </motion.p>
              <motion.p className="col-start-1 row-start-1 text-[10px] font-semibold tracking-[0.28em] text-zinc-300 sm:text-xs" style={{ opacity: regionLabelOpacities.europe }}>
                EUROPE
              </motion.p>
              <motion.p className="col-start-1 row-start-1 text-[10px] font-semibold tracking-[0.28em] text-zinc-300 sm:text-xs" style={{ opacity: regionLabelOpacities.oceania }}>
                OCEANIA
              </motion.p>
              <motion.p className="col-start-1 row-start-1 text-[10px] font-semibold tracking-[0.28em] text-zinc-300 sm:text-xs" style={{ opacity: regionLabelOpacities.northAmerica }}>
                NORTH AMERICA
              </motion.p>
            </div>
          </motion.div>
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
