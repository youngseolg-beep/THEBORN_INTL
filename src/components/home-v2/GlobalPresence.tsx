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
const pacificSeamLatitude = 43;
const pacificEastPoint = projection([179.9, pacificSeamLatitude])!;
const pacificWestPoint = projection([-179.9, pacificSeamLatitude])!;
const westernNorthAmericaPoint = projection([-122.5, 47])!;

type Destination = {
  key: string;
  countryIds: string[];
  includesSingapore?: boolean;
  start: number;
  arrival: number;
  activationStart: number;
  activationEnd: number;
  fadeEnd: number;
  route?: string;
};

function createGeodesicRoute(destination: Position): string {
  const interpolate = geoInterpolate(korea, destination as [number, number]);
  const coordinates = Array.from({ length: 41 }, (_, index) => interpolate(index / 40));
  const geometry: LineString = { type: "LineString", coordinates };
  return path(geometry) ?? "";
}

function createDestination(
  destination: Omit<Destination, "route"> & { coordinate: [number, number] },
): Destination {
  const { coordinate, ...details } = destination;
  return { ...details, route: createGeodesicRoute(coordinate) };
}

const destinations: Destination[] = [
  createDestination({ key: "Japan", countryIds: ["392"], coordinate: [138.2529, 36.2048], start: 0.1, arrival: 0.125, activationStart: 0.121, activationEnd: 0.13, fadeEnd: 0.145 }),
  createDestination({ key: "China", countryIds: ["156"], coordinate: [104.1954, 35.8617], start: 0.135, arrival: 0.16, activationStart: 0.156, activationEnd: 0.165, fadeEnd: 0.18 }),
  createDestination({ key: "Taiwan", countryIds: ["158"], coordinate: [120.9605, 23.6978], start: 0.17, arrival: 0.195, activationStart: 0.191, activationEnd: 0.2, fadeEnd: 0.215 }),
  createDestination({ key: "Mongolia", countryIds: ["496"], coordinate: [103.8467, 46.8625], start: 0.205, arrival: 0.23, activationStart: 0.226, activationEnd: 0.235, fadeEnd: 0.25 }),
  createDestination({ key: "Thailand", countryIds: ["764"], coordinate: [100.9925, 15.87], start: 0.24, arrival: 0.265, activationStart: 0.261, activationEnd: 0.27, fadeEnd: 0.285 }),
  createDestination({ key: "Cambodia", countryIds: ["116"], coordinate: [104.991, 12.5657], start: 0.275, arrival: 0.3, activationStart: 0.296, activationEnd: 0.305, fadeEnd: 0.32 }),
  createDestination({ key: "Malaysia", countryIds: ["458"], coordinate: [101.9758, 4.2105], start: 0.31, arrival: 0.335, activationStart: 0.331, activationEnd: 0.34, fadeEnd: 0.355 }),
  createDestination({ key: "Singapore", countryIds: [], includesSingapore: true, coordinate: singaporeCoordinate, start: 0.345, arrival: 0.37, activationStart: 0.366, activationEnd: 0.375, fadeEnd: 0.39 }),
  createDestination({ key: "Indonesia", countryIds: ["360"], coordinate: [113.9213, -0.7893], start: 0.38, arrival: 0.405, activationStart: 0.401, activationEnd: 0.41, fadeEnd: 0.425 }),
  createDestination({ key: "Philippines", countryIds: ["608"], coordinate: [121.774, 12.8797], start: 0.415, arrival: 0.44, activationStart: 0.436, activationEnd: 0.445, fadeEnd: 0.46 }),
  createDestination({ key: "Germany", countryIds: ["276"], coordinate: [10.4515, 51.1657], start: 0.47, arrival: 0.515, activationStart: 0.51, activationEnd: 0.52, fadeEnd: 0.54 }),
  createDestination({ key: "Netherlands", countryIds: ["528"], coordinate: [5.2913, 52.1326], start: 0.525, arrival: 0.57, activationStart: 0.565, activationEnd: 0.575, fadeEnd: 0.595 }),
  createDestination({ key: "Australia", countryIds: ["036"], coordinate: [133.7751, -25.2744], start: 0.585, arrival: 0.64, activationStart: 0.635, activationEnd: 0.645, fadeEnd: 0.665 }),
  { key: "North America", countryIds: ["840", "124"], start: 0.7, arrival: 0.84, activationStart: 0.825, activationEnd: 0.84, fadeEnd: 0.86 },
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
  return (
    <motion.g style={{ opacity }}>
      {destination.countryIds.map((countryId) => (
        <path
          key={countryId}
          d={countryPathById.get(countryId) ?? ""}
          fill="#ed2028"
          stroke="#ff6b70"
          strokeWidth="0.7"
          vectorEffect="non-scaling-stroke"
        />
      ))}
      {destination.includesSingapore && (
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

function AnimatedDestination({ destination, progress }: {
  destination: Destination;
  progress: MotionValue<number>;
}) {
  const activationOpacity = useTransform(
    progress,
    [0, destination.activationStart, destination.activationEnd, 1],
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
    [0, destination.start, destination.start + 0.004, destination.arrival, destination.fadeEnd, 1],
    [0, 0, 0.68, 0.68, 0, 0],
  );

  if (!destination.route) return null;

  return (
    <motion.path
      d={destination.route}
      fill="none"
      stroke="#ed2028"
      strokeWidth="0.8"
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
      style={{ opacity, pathLength }}
    />
  );
}

function NorthAmericaRoute({ progress }: { progress: MotionValue<number> }) {
  const segmentAPathLength = useTransform(progress, [0, 0.7, 0.76, 1], [0, 0, 1, 1]);
  const segmentAOpacity = useTransform(progress, [0, 0.7, 0.704, 0.76, 0.785, 1], [0, 0, 0.7, 0.7, 0, 0]);
  const segmentBPathLength = useTransform(progress, [0, 0.76, 0.84, 1], [0, 0, 1, 1]);
  const segmentBOpacity = useTransform(progress, [0, 0.76, 0.764, 0.84, 0.86, 1], [0, 0, 0.7, 0.7, 0, 0]);

  const segmentA = [
    `M ${koreaPoint[0]} ${koreaPoint[1]}`,
    `C ${koreaPoint[0] + 36} ${koreaPoint[1] - 38}, ${pacificEastPoint[0] - 34} ${pacificEastPoint[1] - 18}, ${pacificEastPoint[0]} ${pacificEastPoint[1]}`,
  ].join(" ");
  const segmentB = [
    `M ${pacificWestPoint[0]} ${pacificWestPoint[1]}`,
    `C ${pacificWestPoint[0] + 38} ${pacificWestPoint[1] - 18}, ${westernNorthAmericaPoint[0] - 42} ${westernNorthAmericaPoint[1] - 24}, ${westernNorthAmericaPoint[0]} ${westernNorthAmericaPoint[1]}`,
  ].join(" ");

  return (
    <>
      <motion.path d={segmentA} fill="none" stroke="#ed2028" strokeWidth="0.85"
        strokeLinecap="round" vectorEffect="non-scaling-stroke"
        style={{ opacity: segmentAOpacity, pathLength: segmentAPathLength }} />
      <motion.path d={segmentB} fill="none" stroke="#ed2028" strokeWidth="0.85"
        strokeLinecap="round" vectorEffect="non-scaling-stroke"
        style={{ opacity: segmentBOpacity, pathLength: segmentBPathLength }} />
    </>
  );
}

function AnimatedCountryName({ country, index, progress }: {
  country: string;
  index: number;
  progress: MotionValue<number>;
}) {
  const revealStart = 0.9 + index * 0.0038;
  const revealEnd = revealStart + 0.012;
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

        {progress && destinations.map((destination) => (
          <AnimatedDestination
            key={destination.key}
            destination={destination}
            progress={progress}
          />
        ))}
        {staticActive && destinations.map((destination) => (
          <DestinationGeometry
            key={destination.key}
            destination={destination}
            opacity={1}
          />
        ))}

        {progress && destinations
          .filter((destination) => destination.route)
          .map((destination) => (
            <AnimatedRoute
              key={destination.key}
              destination={destination}
              progress={progress}
            />
          ))}
        {progress && <NorthAmericaRoute progress={progress} />}

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

  const cameraStages = [0, 0.1, 0.25, 0.45, 0.6, 0.7, 0.85, 0.9, 1];
  const cameraScaleValues = [5.4, 4.6, 3.2, 2.1, 1.35, 1, 1, 1, 1];
  const cameraXValues = [
    500 - koreaPoint[0] * 5.4,
    500 - koreaPoint[0] * 4.6,
    500 - koreaPoint[0] * 3.2,
    -900,
    -300,
    0,
    0,
    0,
    0,
  ];
  const cameraYValues = [
    262 - koreaPoint[1] * 5.4,
    262 - koreaPoint[1] * 4.6,
    262 - koreaPoint[1] * 3.2,
    -42,
    40,
    0,
    0,
    0,
    0,
  ];
  const cameraTransform = useTransform(
    scrollYProgress,
    cameraStages,
    cameraScaleValues.map((scale, index) => {
      const x = cameraXValues[index];
      const y = cameraYValues[index];
      return `translate(${x}px, ${y}px) scale(${scale})`;
    }),
  );
  const mapOpacity = useTransform(scrollYProgress, [0, 0.04, 1], [0.9, 1, 1]);
  const originOpacity = useTransform(
    scrollYProgress,
    cameraStages,
    [0.9, 0.88, 0.8, 0.68, 0.55, 0.4, 0.35, 0.32, 0.3],
  );
  const originRadius = useTransform(
    scrollYProgress,
    cameraStages,
    [1.2, 1.3, 1.45, 1.6, 1.8, 2.1, 2.1, 2.1, 2.1],
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
      <div ref={sectionRef} className="h-[300svh]">
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
