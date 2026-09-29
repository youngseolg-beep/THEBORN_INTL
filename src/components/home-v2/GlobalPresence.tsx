import { useId, useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { geoArea, geoCentroid, geoInterpolate, geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { LineString, Polygon, Position } from "geojson";
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

const countryPaths = countries.features.map((country, index) => ({
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

type RegionKey = "asia" | "europe" | "oceania" | "northAmerica";
type Destination = {
  key: string;
  label?: string;
  countryId?: string;
  additionalCountryIds?: string[];
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

function createPacificUnitedStatesRoute(): string {
  const pacificEast = projection([179.5, 43])!;
  const pacificWest = projection([-179.5, 43])!;
  const westernUnitedStates = projection([-122.4, 37.7])!;

  // Two ordered subpaths cross the projection seam: Korea travels toward the
  // right edge, then resumes at the left edge and arrives in the western U.S.
  return [
    `M ${koreaPoint[0]} ${koreaPoint[1]}`,
    `C ${koreaPoint[0] + 38} ${koreaPoint[1] - 42}, ${pacificEast[0] - 35} ${pacificEast[1] - 20}, ${pacificEast[0]} ${pacificEast[1]}`,
    `M ${pacificWest[0]} ${pacificWest[1]}`,
    `C ${pacificWest[0] + 38} ${pacificWest[1] - 18}, ${westernUnitedStates[0] - 42} ${westernUnitedStates[1] - 28}, ${westernUnitedStates[0]} ${westernUnitedStates[1]}`,
  ].join(" ");
}

function createDestination(
  destination: Omit<Destination, "route">,
): Destination {
  return {
    ...destination,
    route: destination.key === "United States"
      ? createPacificUnitedStatesRoute()
      : createGeodesicRoute(destination.coordinate),
  };
}

// Each destination owns its route and arrival threshold. The order is the story order.
const destinations: Destination[] = [
  createDestination({ key: "Japan", countryId: "392", region: "asia", coordinate: [138.2529, 36.2048], start: 0.08, arrival: 0.104, fadeEnd: 0.128 }),
  createDestination({ key: "China", countryId: "156", region: "asia", coordinate: [104.1954, 35.8617], start: 0.124, arrival: 0.148, fadeEnd: 0.172 }),
  createDestination({ key: "Taiwan", countryId: "158", region: "asia", coordinate: [120.9605, 23.6978], start: 0.168, arrival: 0.192, fadeEnd: 0.216 }),
  createDestination({ key: "Mongolia", countryId: "496", region: "asia", coordinate: [103.8467, 46.8625], start: 0.212, arrival: 0.236, fadeEnd: 0.26 }),
  createDestination({ key: "Thailand", countryId: "764", region: "asia", coordinate: [100.9925, 15.87], start: 0.256, arrival: 0.28, fadeEnd: 0.304 }),
  createDestination({ key: "Cambodia", countryId: "116", region: "asia", coordinate: [104.991, 12.5657], start: 0.3, arrival: 0.324, fadeEnd: 0.348 }),
  createDestination({ key: "Malaysia", countryId: "458", region: "asia", coordinate: [101.9758, 4.2105], start: 0.344, arrival: 0.368, fadeEnd: 0.392 }),
  createDestination({ key: "Singapore", region: "asia", coordinate: singaporeCoordinate, start: 0.388, arrival: 0.412, fadeEnd: 0.436 }),
  createDestination({ key: "Indonesia", countryId: "360", region: "asia", coordinate: [113.9213, -0.7893], start: 0.432, arrival: 0.456, fadeEnd: 0.48 }),
  createDestination({ key: "Philippines", countryId: "608", region: "asia", coordinate: [121.774, 12.8797], start: 0.476, arrival: 0.5, fadeEnd: 0.524 }),
  createDestination({ key: "Germany", countryId: "276", region: "europe", coordinate: [10.4515, 51.1657], start: 0.52, arrival: 0.57, fadeEnd: 0.602 }),
  createDestination({ key: "Netherlands", countryId: "528", region: "europe", coordinate: [5.2913, 52.1326], start: 0.59, arrival: 0.64, fadeEnd: 0.675 }),
  createDestination({ key: "Australia", countryId: "036", region: "oceania", coordinate: [133.7751, -25.2744], start: 0.66, arrival: 0.755, fadeEnd: 0.79 }),
  createDestination({ key: "United States", label: "United States / Canada", countryId: "840", additionalCountryIds: ["124"], region: "northAmerica", coordinate: [-122.4, 37.7], start: 0.78, arrival: 0.895, fadeEnd: 0.925 }),
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
  // The destination begins changing only when its route is almost complete.
  const activationOpacity = useTransform(
    progress,
    [0, destination.arrival - 0.006, destination.arrival + 0.006, 1],
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

function AnimatedDestinationLabel({ destination, nextStart, progress }: {
  destination: Destination;
  nextStart?: number;
  progress: MotionValue<number>;
}) {
  const fadeInStart = Math.max(0, destination.start - 0.008);
  const fadeOutEnd = (nextStart ?? 0.92) - 0.008;
  const fadeOutStart = Math.max(destination.arrival + 0.006, fadeOutEnd - 0.008);
  const opacity = useTransform(
    progress,
    [0, fadeInStart, destination.start, fadeOutStart, fadeOutEnd, 1],
    [0, 0, 1, 1, 0, 0],
  );

  return (
    <motion.p
      className="col-start-1 row-start-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-zinc-300 sm:text-xs"
      style={{ opacity }}
    >
      {destination.label ?? destination.key}
    </motion.p>
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
        <div className="mx-auto grid h-full min-h-[32rem] max-w-7xl grid-rows-[auto_minmax(0,1fr)_auto_auto] gap-4 px-6 py-6 sm:px-10 md:gap-5 md:px-16 md:py-9">
          {heading}
          <div className="relative min-h-0 min-w-0">
            <div className="h-full w-full origin-center md:scale-[1.14]">
              <motion.div className="h-full w-full" style={{ opacity: mapOpacity, scale: mapScale }}>
                <WorldMap
                  progress={scrollYProgress}
                  originOpacity={originOpacity}
                  originRadius={originRadius}
                />
              </motion.div>
            </div>
            <div className="pointer-events-none absolute right-0 top-1 grid text-right sm:top-3">
              {destinations.map((destination, index) => (
                <AnimatedDestinationLabel
                  key={destination.key}
                  destination={destination}
                  nextStart={destinations[index + 1]?.start}
                  progress={scrollYProgress}
                />
              ))}
            </div>
          </div>
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
