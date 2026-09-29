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

// ISO 3166-1 numeric identifiers supplied by world-atlas.
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

const regionalCountryIds = {
  asia: new Set(["156", "392", "360", "608", "158", "458", "496", "764", "116"]),
  europe: new Set(["528", "276"]),
  oceania: new Set(["036"]),
  northAmerica: new Set(["840"]),
};

const korea: Position = [127.7669, 35.9078];
const singaporeCoordinate: Position = [103.8198, 1.3521];
const singapore = projection(singaporeCoordinate)!;
const koreaPoint = projection(korea)!;

type RegionKey = keyof typeof regionalCountryIds;
type Route = { d: string; mobilePriority: boolean };

function createGeodesicRoute(destination: Position): string {
  const interpolate = geoInterpolate(korea as [number, number], destination as [number, number]);
  const coordinates = Array.from({ length: 41 }, (_, index) => interpolate(index / 40));
  const geometry: LineString = { type: "LineString", coordinates };
  return path(geometry) ?? "";
}

// Routes use sampled great-circle interpolation before entering the map's projection.
const regionalRoutes: Record<RegionKey, Route[]> = {
  asia: [
    { d: createGeodesicRoute([104.1954, 35.8617]), mobilePriority: true }, // China
    { d: createGeodesicRoute([138.2529, 36.2048]), mobilePriority: true }, // Japan
    { d: createGeodesicRoute([120.9605, 23.6978]), mobilePriority: false }, // Taiwan
    { d: createGeodesicRoute([103.8467, 46.8625]), mobilePriority: false }, // Mongolia
    { d: createGeodesicRoute([100.9925, 15.87]), mobilePriority: true }, // Thailand
    { d: createGeodesicRoute([104.991, 12.5657]), mobilePriority: false }, // Cambodia
    { d: createGeodesicRoute([101.9758, 4.2105]), mobilePriority: false }, // Malaysia
    { d: createGeodesicRoute(singaporeCoordinate), mobilePriority: false }, // Singapore
    { d: createGeodesicRoute([113.9213, -0.7893]), mobilePriority: true }, // Indonesia
    { d: createGeodesicRoute([121.774, 12.8797]), mobilePriority: false }, // Philippines
  ],
  europe: [
    { d: createGeodesicRoute([10.4515, 51.1657]), mobilePriority: true }, // Germany
    { d: createGeodesicRoute([5.2913, 52.1326]), mobilePriority: true }, // Netherlands
  ],
  oceania: [
    { d: createGeodesicRoute([133.7751, -25.2744]), mobilePriority: true }, // Australia
  ],
  northAmerica: [
    { d: createGeodesicRoute([-98.5795, 39.8283]), mobilePriority: true }, // United States
  ],
};

type AnimatedValue = number | MotionValue<number>;
type RegionMotion = {
  emphasis: AnimatedValue;
  pathLength: AnimatedValue;
  routeOpacity: AnimatedValue;
};
type MapProps = {
  regions: Record<RegionKey, RegionMotion>;
  originOpacity: AnimatedValue;
  originRadius: AnimatedValue;
};

function RegionRoutes({ region, motionState }: {
  region: RegionKey;
  motionState: RegionMotion;
}) {
  return (
    <g>
      {regionalRoutes[region].map((route, index) => (
        <motion.path
          key={`${region}-${index}`}
          d={route.d}
          className={route.mobilePriority ? undefined : "hidden sm:block"}
          fill="none"
          stroke="#ed2028"
          strokeWidth="0.85"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={{ opacity: motionState.routeOpacity, pathLength: motionState.pathLength }}
        />
      ))}
    </g>
  );
}

function WorldMap({ regions, originOpacity, originRadius }: MapProps) {
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
        World map showing all current operating countries and regional connections from South Korea.
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

        {/* Every operating market remains visible throughout the complete scroll sequence. */}
        <g opacity="0.76">
          {countryPaths
            .filter((country) => operatingCountryIds.has(country.id))
            .map((country) => (
              <path
                key={country.id}
                d={country.d}
                fill="#b5161d"
                stroke="#d63a40"
                strokeWidth="0.5"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          {/* Accurate coordinate fallback for Singapore, absent at 1:110m. */}
          <circle
            cx={singapore[0]}
            cy={singapore[1]}
            r="2.6"
            fill="#b5161d"
            stroke="#d63a40"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
          <circle
            cx={singapore[0]}
            cy={singapore[1]}
            r="4.5"
            fill="none"
            stroke="#d63a40"
            strokeWidth="0.6"
            opacity="0.55"
            vectorEffect="non-scaling-stroke"
          />
        </g>

        {(Object.keys(regionalCountryIds) as RegionKey[]).map((region) => (
          <motion.g key={region} style={{ opacity: regions[region].emphasis }}>
            {countryPaths
              .filter((country) => regionalCountryIds[region].has(country.id))
              .map((country) => (
                <path
                  key={country.id}
                  d={country.d}
                  fill="#ed2028"
                  stroke="#ff6b70"
                  strokeWidth="0.7"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            {region === "asia" && (
              <>
                <circle
                  cx={singapore[0]}
                  cy={singapore[1]}
                  r="2.6"
                  fill="#ed2028"
                  stroke="#ff6b70"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
                <circle
                  cx={singapore[0]}
                  cy={singapore[1]}
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
        ))}

        {(Object.keys(regionalRoutes) as RegionKey[]).map((region) => (
          <RegionRoutes key={region} region={region} motionState={regions[region]} />
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

  const mapOpacity = useTransform(scrollYProgress, [0, 0.15, 0.86, 1], [0.68, 1, 1, 0.88]);
  // Continuous restrained framing changes keep the scroll track visually active.
  const mapScale = useTransform(
    scrollYProgress,
    [0, 0.15, 0.38, 0.52, 0.66, 0.75, 0.86, 1],
    [0.97, 0.985, 1, 0.992, 1, 0.994, 1, 0.985],
  );

  const asiaEmphasis = useTransform(scrollYProgress, [0, 0.15, 0.24, 0.36, 0.52, 1], [0, 0, 0.34, 0.34, 0, 0]);
  const asiaPathLength = useTransform(scrollYProgress, [0, 0.15, 0.36, 1], [0, 0, 1, 1]);
  const asiaRouteOpacity = useTransform(scrollYProgress, [0, 0.15, 0.2, 0.36, 0.52, 1], [0, 0, 0.58, 0.58, 0, 0]);

  const europeEmphasis = useTransform(scrollYProgress, [0, 0.52, 0.58, 0.64, 0.69, 1], [0, 0, 0.34, 0.34, 0, 0]);
  const europePathLength = useTransform(scrollYProgress, [0, 0.52, 0.64, 1], [0, 0, 1, 1]);
  const europeRouteOpacity = useTransform(scrollYProgress, [0, 0.52, 0.56, 0.64, 0.69, 1], [0, 0, 0.62, 0.62, 0, 0]);

  const oceaniaEmphasis = useTransform(scrollYProgress, [0, 0.66, 0.7, 0.74, 0.78, 1], [0, 0, 0.34, 0.34, 0, 0]);
  const oceaniaPathLength = useTransform(scrollYProgress, [0, 0.66, 0.74, 1], [0, 0, 1, 1]);
  const oceaniaRouteOpacity = useTransform(scrollYProgress, [0, 0.66, 0.69, 0.74, 0.78, 1], [0, 0, 0.62, 0.62, 0, 0]);

  const northAmericaEmphasis = useTransform(scrollYProgress, [0, 0.75, 0.79, 0.84, 0.89, 1], [0, 0, 0.34, 0.34, 0, 0]);
  const northAmericaPathLength = useTransform(scrollYProgress, [0, 0.75, 0.84, 1], [0, 0, 1, 1]);
  const northAmericaRouteOpacity = useTransform(scrollYProgress, [0, 0.75, 0.78, 0.84, 0.89, 1], [0, 0, 0.62, 0.62, 0, 0]);

  const originOpacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.19, 0.38, 0.48, 0.52, 0.56, 0.84, 0.89, 1],
    [0, 0, 0.62, 0.62, 0, 0, 0.56, 0.56, 0, 0],
  );
  const originRadius = useTransform(
    scrollYProgress,
    [0, 0.15, 0.38, 0.52, 0.66, 0.75, 0.86, 1],
    [3.8, 3.8, 6, 3.8, 5.5, 4.2, 5.5, 3.8],
  );

  const regionLabelOpacities = {
    asia: useTransform(scrollYProgress, [0, 0.15, 0.2, 0.36, 0.43, 1], [0, 0, 1, 1, 0, 0]),
    europe: useTransform(scrollYProgress, [0, 0.52, 0.56, 0.64, 0.68, 1], [0, 0, 1, 1, 0, 0]),
    oceania: useTransform(scrollYProgress, [0, 0.66, 0.69, 0.74, 0.77, 1], [0, 0, 1, 1, 0, 0]),
    northAmerica: useTransform(scrollYProgress, [0, 0.75, 0.78, 0.84, 0.88, 1], [0, 0, 1, 1, 0, 0]),
  };

  const directCopyOpacity = useTransform(scrollYProgress, [0, 0.1, 0.16, 0.34, 0.42, 1], [0, 0, 1, 1, 0, 0]);
  const masterCopyOpacity = useTransform(scrollYProgress, [0, 0.48, 0.54, 0.8, 0.86, 1], [0, 0, 1, 1, 0, 0]);
  const directVisibility = useTransform(scrollYProgress, (value) => value >= 0.1 && value < 0.43 ? "visible" : "hidden");
  const masterVisibility = useTransform(scrollYProgress, (value) => value >= 0.48 && value < 0.87 ? "visible" : "hidden");
  const statsOpacity = useTransform(scrollYProgress, [0, 0.86, 0.94, 1], [0, 0, 1, 1]);

  const regions: Record<RegionKey, RegionMotion> = {
    asia: { emphasis: asiaEmphasis, pathLength: asiaPathLength, routeOpacity: asiaRouteOpacity },
    europe: { emphasis: europeEmphasis, pathLength: europePathLength, routeOpacity: europeRouteOpacity },
    oceania: { emphasis: oceaniaEmphasis, pathLength: oceaniaPathLength, routeOpacity: oceaniaRouteOpacity },
    northAmerica: { emphasis: northAmericaEmphasis, pathLength: northAmericaPathLength, routeOpacity: northAmericaRouteOpacity },
  };

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
    const staticRegions: Record<RegionKey, RegionMotion> = {
      asia: { emphasis: 0, pathLength: 0, routeOpacity: 0 },
      europe: { emphasis: 0, pathLength: 0, routeOpacity: 0 },
      oceania: { emphasis: 0, pathLength: 0, routeOpacity: 0 },
      northAmerica: { emphasis: 0, pathLength: 0, routeOpacity: 0 },
    };

    return (
      <section
        ref={sectionRef}
        aria-labelledby={titleId}
        className="min-h-svh bg-[#09090b] px-6 py-12 text-white sm:px-10 md:px-16"
      >
        <div className="mx-auto max-w-6xl">
          {heading}
          <div className="my-8 aspect-[1000/524]">
            <WorldMap regions={staticRegions} originOpacity={0} originRadius={3.8} />
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
        <div className="mx-auto grid h-full min-h-[32rem] max-w-7xl grid-rows-[auto_minmax(0,1fr)_auto_auto] gap-4 px-6 py-6 sm:px-10 md:gap-5 md:px-16 md:py-9">
          {heading}
          <motion.div className="relative min-h-0 min-w-0" style={{ opacity: mapOpacity, scale: mapScale }}>
            <WorldMap regions={regions} originOpacity={originOpacity} originRadius={originRadius} />
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
          <div className="grid min-w-0">
            <motion.div className="col-start-1 row-start-1" style={{ opacity: directCopyOpacity, visibility: directVisibility }}>
              {directCopy}
            </motion.div>
            <motion.div className="col-start-1 row-start-1" style={{ opacity: masterCopyOpacity, visibility: masterVisibility }}>
              {masterCopy}
            </motion.div>
          </div>
          <motion.p className="max-w-xl text-xs leading-relaxed text-zinc-400 sm:text-sm" style={{ opacity: statsOpacity }}>
            {globalPresence.overseasSummary}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
