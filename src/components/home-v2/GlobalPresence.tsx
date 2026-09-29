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
const westernNorthAmericaPoint = projection([-122.5, 47])!;

type Destination = {
  key: string;
  countryIds: string[];
  includesSingapore?: boolean;
  point?: [number, number];
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
  return {
    ...details,
    point: projection(coordinate) ?? undefined,
    route: createGeodesicRoute(coordinate),
  };
}

const destinations: Destination[] = [
  createDestination({ key: "Japan", countryIds: ["392"], coordinate: [138.2529, 36.2048], start: 0.12, arrival: 0.145, activationStart: 0.138, activationEnd: 0.15, fadeEnd: 0.165 }),
  createDestination({ key: "China", countryIds: ["156"], coordinate: [104.1954, 35.8617], start: 0.15, arrival: 0.18, activationStart: 0.173, activationEnd: 0.185, fadeEnd: 0.2 }),
  createDestination({ key: "Taiwan", countryIds: ["158"], coordinate: [120.9605, 23.6978], start: 0.185, arrival: 0.215, activationStart: 0.208, activationEnd: 0.22, fadeEnd: 0.235 }),
  createDestination({ key: "Mongolia", countryIds: ["496"], coordinate: [103.8467, 46.8625], start: 0.22, arrival: 0.25, activationStart: 0.243, activationEnd: 0.255, fadeEnd: 0.27 }),
  createDestination({ key: "Thailand", countryIds: ["764"], coordinate: [100.9925, 15.87], start: 0.255, arrival: 0.285, activationStart: 0.278, activationEnd: 0.29, fadeEnd: 0.305 }),
  createDestination({ key: "Cambodia", countryIds: ["116"], coordinate: [104.991, 12.5657], start: 0.29, arrival: 0.32, activationStart: 0.313, activationEnd: 0.325, fadeEnd: 0.34 }),
  createDestination({ key: "Malaysia", countryIds: ["458"], coordinate: [101.9758, 4.2105], start: 0.325, arrival: 0.355, activationStart: 0.348, activationEnd: 0.36, fadeEnd: 0.375 }),
  createDestination({ key: "Singapore", countryIds: [], includesSingapore: true, coordinate: singaporeCoordinate, start: 0.36, arrival: 0.39, activationStart: 0.383, activationEnd: 0.395, fadeEnd: 0.41 }),
  createDestination({ key: "Indonesia", countryIds: ["360"], coordinate: [113.9213, -0.7893], start: 0.395, arrival: 0.425, activationStart: 0.418, activationEnd: 0.43, fadeEnd: 0.445 }),
  createDestination({ key: "Philippines", countryIds: ["608"], coordinate: [121.774, 12.8797], start: 0.43, arrival: 0.46, activationStart: 0.453, activationEnd: 0.465, fadeEnd: 0.48 }),
  createDestination({ key: "Germany", countryIds: ["276"], coordinate: [10.4515, 51.1657], start: 0.49, arrival: 0.535, activationStart: 0.528, activationEnd: 0.54, fadeEnd: 0.56 }),
  createDestination({ key: "Netherlands", countryIds: ["528"], coordinate: [5.2913, 52.1326], start: 0.545, arrival: 0.59, activationStart: 0.583, activationEnd: 0.595, fadeEnd: 0.615 }),
  createDestination({ key: "Australia", countryIds: ["036"], coordinate: [133.7751, -25.2744], start: 0.65, arrival: 0.72, activationStart: 0.71, activationEnd: 0.725, fadeEnd: 0.75 }),
  { key: "North America", countryIds: ["840", "124"], point: westernNorthAmericaPoint, start: 0.76, arrival: 0.86, activationStart: 0.842, activationEnd: 0.86, fadeEnd: 0.885 },
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

type AnimatedColor = string | MotionValue<string>;

function DestinationGeometry({
  destination,
  fill,
  stroke,
  glowOpacity,
  glowFilterId,
}: {
  destination: Destination;
  fill: AnimatedColor;
  stroke: AnimatedColor;
  glowOpacity: number | MotionValue<number>;
  glowFilterId: string;
}) {
  return (
    <>
      <g>
        {destination.countryIds.map((countryId) => (
          <motion.path
            key={countryId}
            d={countryPathById.get(countryId) ?? ""}
            strokeWidth="0.8"
            vectorEffect="non-scaling-stroke"
            style={{ fill, stroke }}
          />
        ))}
        {destination.includesSingapore && (
          <>
            <motion.circle
              cx={singaporePoint[0]}
              cy={singaporePoint[1]}
              r="2.6"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              style={{ fill, stroke }}
            />
            <motion.circle
              cx={singaporePoint[0]}
              cy={singaporePoint[1]}
              r="4.5"
              fill="none"
              strokeWidth="0.8"
              vectorEffect="non-scaling-stroke"
              style={{ stroke }}
            />
          </>
        )}
      </g>
      <motion.g
        filter={`url(#${glowFilterId})`}
        style={{ opacity: glowOpacity }}
      >
        {destination.countryIds.map((countryId) => (
          <path
            key={countryId}
            d={countryPathById.get(countryId) ?? ""}
            fill="#ed2028"
            fillOpacity="0.14"
            stroke="#ff4148"
            strokeWidth="1.4"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {destination.includesSingapore && (
          <circle
            cx={singaporePoint[0]}
            cy={singaporePoint[1]}
            r="4.8"
            fill="#ed2028"
            fillOpacity="0.24"
            stroke="#ff4148"
            strokeWidth="1.2"
            vectorEffect="non-scaling-stroke"
          />
        )}
      </motion.g>
    </>
  );
}

function AnimatedDestination({ destination, progress, glowFilterId }: {
  destination: Destination;
  progress: MotionValue<number>;
  glowFilterId: string;
}) {
  const activationMidpoint = destination.activationStart
    + (destination.activationEnd - destination.activationStart) * 0.58;
  const fill = useTransform(
    progress,
    [0, destination.activationStart, activationMidpoint, destination.activationEnd, 1],
    ["#303238", "#303238", "#731219", "#ed2028", "#ed2028"],
  );
  const stroke = useTransform(
    progress,
    [0, destination.activationStart, activationMidpoint, destination.activationEnd, 1],
    ["#55575e", "#55575e", "#a51d24", "#ff6b70", "#ff6b70"],
  );
  const glowOpacity = useTransform(
    progress,
    [
      0,
      destination.activationStart,
      activationMidpoint,
      destination.activationEnd,
      destination.activationEnd + 0.02,
      destination.activationEnd + 0.05,
      1,
    ],
    [0, 0, 0.28, 0.82, 0.4, 0.18, 0.18],
  );

  return (
    <DestinationGeometry
      destination={destination}
      fill={fill}
      stroke={stroke}
      glowOpacity={glowOpacity}
      glowFilterId={glowFilterId}
    />
  );
}

function GlowingRoute({
  d,
  pathLength,
  opacity,
  glowFilterId,
}: {
  d: string;
  pathLength: MotionValue<number>;
  opacity: MotionValue<number>;
  glowFilterId: string;
}) {
  return (
    <motion.g style={{ opacity }}>
      <motion.path
        d={d}
        fill="none"
        stroke="#ed2028"
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.2"
        filter={`url(#${glowFilterId})`}
        vectorEffect="non-scaling-stroke"
        style={{ pathLength }}
      />
      <motion.path
        d={d}
        fill="none"
        stroke="#ff3b42"
        strokeWidth="2.8"
        strokeLinecap="round"
        opacity="0.58"
        vectorEffect="non-scaling-stroke"
        style={{ pathLength }}
      />
      <motion.path
        d={d}
        fill="none"
        stroke="#ffd2d4"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.96"
        vectorEffect="non-scaling-stroke"
        style={{ pathLength }}
      />
    </motion.g>
  );
}

function DestinationPulse({
  point,
  opacity,
  radius,
  glowFilterId,
}: {
  point: [number, number];
  opacity: MotionValue<number>;
  radius: MotionValue<number>;
  glowFilterId: string;
}) {
  return (
    <motion.circle
      cx={point[0]}
      cy={point[1]}
      r={radius}
      fill="#ff555b"
      stroke="#ffd2d4"
      strokeWidth="0.8"
      filter={`url(#${glowFilterId})`}
      vectorEffect="non-scaling-stroke"
      style={{ opacity }}
    />
  );
}

function AnimatedRoute({ destination, progress, glowFilterId }: {
  destination: Destination;
  progress: MotionValue<number>;
  glowFilterId: string;
}) {
  const pathLength = useTransform(
    progress,
    [0, destination.start, destination.arrival, 1],
    [0, 0, 1, 1],
  );
  const opacity = useTransform(
    progress,
    [0, destination.start, destination.start + 0.004, destination.arrival, destination.fadeEnd, 1],
    [0, 0, 1, 1, 0, 0],
  );
  const pulseOpacity = useTransform(
    progress,
    [0, destination.arrival - 0.012, destination.arrival, destination.fadeEnd, 1],
    [0, 0, 0.92, 0, 0],
  );
  const pulseRadius = useTransform(
    progress,
    [destination.arrival - 0.012, destination.arrival, destination.fadeEnd],
    [1.2, 3.2, 6.5],
  );

  if (!destination.route) return null;

  return (
    <>
      <GlowingRoute
        d={destination.route}
        pathLength={pathLength}
        opacity={opacity}
        glowFilterId={glowFilterId}
      />
      {destination.point && (
        <DestinationPulse
          point={destination.point}
          opacity={pulseOpacity}
          radius={pulseRadius}
          glowFilterId={glowFilterId}
        />
      )}
    </>
  );
}

function NorthAmericaRoute({
  progress,
  glowFilterId,
}: {
  progress: MotionValue<number>;
  glowFilterId: string;
}) {
  const pathLength = useTransform(progress, [0, 0.76, 0.86, 1], [0, 0, 1, 1]);
  const opacity = useTransform(progress, [0, 0.76, 0.764, 0.86, 0.885, 1], [0, 0, 1, 1, 0, 0]);
  const pulseOpacity = useTransform(progress, [0, 0.84, 0.86, 0.885, 1], [0, 0, 0.95, 0, 0]);
  const pulseRadius = useTransform(progress, [0.84, 0.86, 0.885], [1.2, 3.8, 7]);
  const controlPointOne: [number, number] = [koreaPoint[0] - 120, 34];
  const controlPointTwo: [number, number] = [westernNorthAmericaPoint[0] + 170, 24];
  const route = [
    `M ${koreaPoint[0]} ${koreaPoint[1]}`,
    `C ${controlPointOne[0]} ${controlPointOne[1]}, ${controlPointTwo[0]} ${controlPointTwo[1]}, ${westernNorthAmericaPoint[0]} ${westernNorthAmericaPoint[1]}`,
  ].join(" ");

  return (
    <>
      <GlowingRoute
        d={route}
        pathLength={pathLength}
        opacity={opacity}
        glowFilterId={glowFilterId}
      />
      <DestinationPulse
        point={westernNorthAmericaPoint}
        opacity={pulseOpacity}
        radius={pulseRadius}
        glowFilterId={glowFilterId}
      />
    </>
  );
}

function AnimatedCountryName({ country, index, progress }: {
  country: string;
  index: number;
  progress: MotionValue<number>;
}) {
  const revealStart = 0.89 + index * 0.004;
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
  const id = useId().replace(/:/g, "");
  const titleId = `${id}-title`;
  const routeGlowId = `${id}-route-glow`;
  const destinationGlowId = `${id}-destination-glow`;

  return (
    <svg
      viewBox="0 0 1000 524"
      role="img"
      aria-labelledby={titleId}
      className="h-full w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <title id={titleId}>
        World map showing THEBORN expansion from South Korea to its overseas destinations.
      </title>
      <defs aria-hidden="true">
        <filter id={routeGlowId} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.2" result="routeBlur" />
          <feMerge>
            <feMergeNode in="routeBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={destinationGlowId} x="-35%" y="-35%" width="170%" height="170%">
          <feGaussianBlur stdDeviation="2.6" result="destinationBlur" />
          <feMerge>
            <feMergeNode in="destinationBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
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
            glowFilterId={destinationGlowId}
          />
        ))}
        {staticActive && destinations.map((destination) => (
          <DestinationGeometry
            key={destination.key}
            destination={destination}
            fill="#ed2028"
            stroke="#ff6b70"
            glowOpacity={0.18}
            glowFilterId={destinationGlowId}
          />
        ))}

        {progress && destinations
          .filter((destination) => destination.route)
          .map((destination) => (
            <AnimatedRoute
              key={destination.key}
              destination={destination}
              progress={progress}
              glowFilterId={routeGlowId}
            />
          ))}
        {progress && (
          <NorthAmericaRoute
            progress={progress}
            glowFilterId={routeGlowId}
          />
        )}

        <motion.circle
          cx={koreaPoint[0]}
          cy={koreaPoint[1]}
          r={originRadius}
          fill="none"
          stroke="#ed2028"
          strokeWidth="1.2"
          filter={`url(#${routeGlowId})`}
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

  const cameraStages = [0, 0.12, 0.25, 0.48, 0.64, 0.76, 0.88, 1];
  const cameraScaleValues = [5.4, 4.6, 3.2, 2, 1.3, 1, 1, 1];
  const cameraXValues = [
    500 - koreaPoint[0] * 5.4,
    500 - koreaPoint[0] * 4.6,
    500 - koreaPoint[0] * 3.2,
    -850,
    -280,
    0,
    0,
    0,
  ];
  const cameraYValues = [
    262 - koreaPoint[1] * 5.4,
    262 - koreaPoint[1] * 4.6,
    262 - koreaPoint[1] * 3.2,
    -45,
    5,
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
    [1, 0.95, 0.86, 0.7, 0.52, 0.38, 0.3, 0.28],
  );
  const originRadius = useTransform(
    scrollYProgress,
    cameraStages,
    [1.45, 1.5, 1.6, 1.75, 1.95, 2.15, 2.15, 2.15],
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
