import {
  createContext,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  motion,
  useMotionValue,
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
import type {
  HomeV2CountryKey,
  HomeV2GlobalPresence,
} from "../../data/homeV2Content";
import { useHomeV2Locale } from "./HomeV2LocaleContext";

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

const operatingCountries: readonly HomeV2CountryKey[] = [
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

const mapCompletionProgress = 2 / 3;

function rangeProgress(value: number, start: number, end: number) {
  return Math.min(1, Math.max(0, (value - start) / (end - start)));
}

function useDesktopStory() {
  const [desktopStory, setDesktopStory] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    const update = () => setDesktopStory(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return desktopStory;
}

type AnimatedColor = string | MotionValue<string>;

// Share the rendered map scale so light widths remain consistent during zoom.
const EffectsScaleContext = createContext<MotionValue<number> | null>(null);

function useEffectsScale(): MotionValue<number> {
  const scale = useContext(EffectsScaleContext);
  if (!scale) throw new Error("Map effects require an EffectsScaleContext");
  return scale;
}

// Projected bounds only determine mask coverage; the country paths stay intact.
const revealRadiusByDestination = new Map(destinations.map((destination) => {
  const point = destination.point ?? koreaPoint;
  const distances = destination.countryIds.flatMap((id) => {
    const country = countries.features.find((item) => String(item.id).padStart(3, "0") === id);
    const geometry = id === "840" ? contiguousUnitedStates : country;
    if (!geometry) return [];
    const [[left, top], [right, bottom]] = path.bounds(geometry);
    return [[left, top], [right, top], [left, bottom], [right, bottom]]
      .map(([x, y]) => Math.hypot(x - point[0], y - point[1]));
  });
  // Overscan puts every edge inside the mask's fully opaque inner 82%.
  return [destination.key, (Math.max(8, ...distances) + 3) / 0.82];
}));

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
      </motion.g>
    </>
  );
}

function AnimatedDestination({ destination, progress, glowFilterId }: {
  destination: Destination;
  progress: MotionValue<number>;
  glowFilterId: string;
}) {
  const maskId = `destination-${useId().replace(/:/g, "")}`;
  const gradientId = `${maskId}-edge`;
  const point = destination.point ?? koreaPoint;
  const revealRadius = useTransform(
    progress,
    [destination.activationStart, destination.activationEnd],
    [0, revealRadiusByDestination.get(destination.key) ?? 12],
  );
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
    [0, 0, 0.45, 0.95, 0.3, 0.08, 0.08],
  );

  return (
    <>
      <defs>
        <radialGradient id={gradientId}>
          <stop offset="0.82" stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask id={maskId} maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse"
          x="-50" y="-50" width="1100" height="624" style={{ maskType: "alpha" }}>
          <motion.circle cx={point[0]} cy={point[1]} r={revealRadius}
            fill={`url(#${gradientId})`} />
        </mask>
      </defs>
      <g mask={`url(#${maskId})`}>
        <DestinationGeometry
          destination={destination}
          fill={fill}
          stroke={stroke}
          glowOpacity={glowOpacity}
          glowFilterId={glowFilterId}
        />
      </g>
    </>
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
  const measurementRef = useRef<SVGPathElement>(null);
  const samples = useMotionValue<[number, number][]>([koreaPoint]);
  const effectsScale = useEffectsScale();
  const outerWidth = useTransform(effectsScale, (scale) => 12 / scale);
  const middleWidth = useTransform(effectsScale, (scale) => 4.5 / scale);
  const coreWidth = useTransform(effectsScale, (scale) => 1.8 / scale);
  const headScale = useTransform(effectsScale, (scale) => 1 / scale);

  useLayoutEffect(() => {
    const element = measurementRef.current;
    if (!element) return;
    const length = element.getTotalLength();
    // Sample once per path, not once per frame. Scroll only interpolates two points.
    samples.set(Array.from({ length: 257 }, (_, index) => {
      const point = element.getPointAtLength(length * index / 256);
      return [point.x, point.y] as [number, number];
    }));
  }, [d, samples]);

  const headTransform = useTransform(() => {
    const points = samples.get();
    const cursor = Math.min(1, Math.max(0, pathLength.get())) * (points.length - 1);
    const index = Math.floor(cursor);
    const next = points[Math.min(index + 1, points.length - 1)];
    const blend = cursor - index;
    const x = points[index][0] + (next[0] - points[index][0]) * blend;
    const y = points[index][1] + (next[1] - points[index][1]) * blend;
    return `translate(${x}px, ${y}px)`;
  });
  // Highlight the last 18% of the revealed route as a short luminous tail.
  const tailLength = useTransform(pathLength, (value) => Math.min(0.18, value));
  const tailOffset = useTransform(pathLength, (value) => Math.max(0, value - 0.18));
  const headOpacity = useTransform([pathLength, opacity], ([drawn, visible]: number[]) =>
    Math.min(1, drawn / 0.025) * Math.pow(visible, 3));

  return (
    <>
      <motion.g style={{ opacity }}>
        <path ref={measurementRef} d={d} fill="none" stroke="none" />
        {/* Scale-compensated widths preserve dash/head alignment at every zoom.
            Non-scaling-stroke changes normalized dash lengths in some browsers. */}
        <motion.path d={d} fill="none" stroke="#ed2028" strokeLinecap="round"
          opacity="0.38" filter={`url(#${glowFilterId})`}
          style={{ pathLength, strokeWidth: outerWidth }} />
        <motion.path d={d} fill="none" stroke="#fa2632" strokeLinecap="round"
          opacity="0.78" style={{ pathLength, strokeWidth: middleWidth }} />
        <motion.path d={d} fill="none" stroke="#ffd4d6" strokeLinecap="round"
          opacity="0.62" style={{ pathLength, strokeWidth: coreWidth }} />
        <motion.path d={d} fill="none" stroke="#fff2ee" strokeLinecap="round"
          style={{ pathLength: tailLength, pathOffset: tailOffset, strokeWidth: coreWidth }} />
      </motion.g>
      <motion.g style={{ transform: headTransform, transformBox: "view-box",
        originX: 0, originY: 0, opacity: headOpacity }}>
        <motion.g style={{ scale: headScale, transformBox: "view-box", originX: 0, originY: 0 }}>
          <circle r="13" fill={`url(#${glowFilterId}-light)`} opacity="0.85" />
          <circle r="4" fill="#ff3342" opacity="0.82" />
          <circle r="1.9" fill="#fff5ee" />
        </motion.g>
      </motion.g>
    </>
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
  const effectsScale = useEffectsScale();
  const transform = useTransform(() =>
    `translate(${point[0]}px, ${point[1]}px) scale(${1 / effectsScale.get()})`);
  const bloomRadius = useTransform(radius, (value) => 8 + value * 2.2);
  const haloRadius = useTransform(radius, (value) => value * 1.15);
  const centerOpacity = useTransform(opacity, (value) => value * value);

  return (
    <motion.g style={{ transform, transformBox: "view-box", originX: 0, originY: 0, opacity }}>
      <motion.circle r={bloomRadius} fill={`url(#${glowFilterId}-light)`} />
      <motion.circle r={haloRadius} fill="#ff3542" fillOpacity="0.22" />
      <motion.circle r="2.5" fill="#fff4ed" style={{ opacity: centerOpacity }} />
    </motion.g>
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

function AnimatedCountryName({ country, label, index, progress, isKorean }: {
  key?: HomeV2CountryKey;
  country: HomeV2CountryKey;
  label: string;
  index: number;
  progress: MotionValue<number>;
  isKorean: boolean;
}) {
  const revealStart = 0.85 + index * 0.005;
  const revealEnd = revealStart + 0.035;
  const opacity = useTransform(progress, (value) =>
    rangeProgress(value, revealStart, revealEnd));
  const y = useTransform(opacity, (value) => 14 * (1 - value));

  return (
    <motion.li
      className={`text-center text-[15px] font-medium text-zinc-200 md:text-base ${
        isKorean ? "tracking-[-0.015em]" : "uppercase tracking-[0.07em]"
      }`}
      style={{ opacity, y }}
    >
      {label}
    </motion.li>
  );
}

function StaticCountryList({
  countryNames,
  isKorean,
}: {
  countryNames: HomeV2GlobalPresence["countryNames"];
  isKorean: boolean;
}) {
  return (
    <ul className="mx-auto grid w-full max-w-5xl grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 lg:grid-cols-5">
      {operatingCountries.map((country) => (
        <li
          key={country}
          className={`text-center text-[15px] font-medium text-zinc-200 md:text-base ${
            isKorean ? "tracking-[-0.015em]" : "uppercase tracking-[0.07em]"
          }`}
        >
          {countryNames[country]}
        </li>
      ))}
    </ul>
  );
}

function OverseasSummaryCopy({
  summary,
}: {
  summary: HomeV2GlobalPresence["overseasSummary"];
}) {
  return (
    <>
      <span className="sr-only">{summary.accessibleText}</span>
      <span aria-hidden="true">
        {summary.lines.map((line, index) => (
          <span key={`${line.before}-${line.number ?? index}`} className="md:block">
            {line.before}
            {line.number ? (
              <strong className="font-bold text-[#ed2028]">{line.number}</strong>
            ) : null}
            {line.after}
            {index < summary.lines.length - 1 ? " " : null}
          </span>
        ))}
      </span>
    </>
  );
}

function SummaryAccent() {
  return (
    <span
      aria-hidden="true"
      className="mx-auto mb-4 block h-px w-12 bg-[#ed2028]/85 md:mb-5"
    />
  );
}

type WorldMapProps = {
  ariaLabel: string;
  progress?: MotionValue<number>;
  cameraTransform?: string | MotionValue<string>;
  originOpacity: number | MotionValue<number>;
  originRadius: number | MotionValue<number>;
  staticActive?: boolean;
};

function WorldMap({
  ariaLabel,
  progress,
  cameraTransform = "translate(0 0) scale(1)",
  originOpacity,
  originRadius,
  staticActive = false,
}: WorldMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const viewportScale = useMotionValue(1);
  const effectsScale = useTransform(() => {
    const transform = typeof cameraTransform === "string" ? cameraTransform : cameraTransform.get();
    const zoom = Number(transform.match(/scale\(([^)]+)\)/)?.[1] ?? 1);
    return Math.max(0.01, viewportScale.get() * zoom);
  });
  const routeBlur = useTransform(effectsScale, (scale) => 6 / scale);
  const countryBlur = useTransform(effectsScale, (scale) => 3 / scale);
  const originHaloRadius = useTransform(() => {
    const radius = typeof originRadius === "number" ? originRadius : originRadius.get();
    const value = progress?.get() ?? 1;
    const pulse = value < 0.12 ? 1 + 0.12 * Math.sin(value / 0.12 * Math.PI * 2) : 1;
    return radius * 3.8 * pulse;
  });

  useLayoutEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const measure = () => {
      const box = svg.getBoundingClientRect();
      viewportScale.set(Math.min(box.width / 1000, box.height / 524));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(svg);
    return () => observer.disconnect();
  }, [viewportScale]);

  const id = useId().replace(/:/g, "");
  const titleId = `${id}-title`;
  const routeGlowId = `${id}-route-glow`;
  const destinationGlowId = `${id}-destination-glow`;

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 1000 524"
      role="img"
      aria-labelledby={titleId}
      className="h-full w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <title id={titleId}>
        {ariaLabel}
      </title>
      <defs aria-hidden="true">
        <radialGradient id={`${routeGlowId}-light`}>
          <stop offset="0" stopColor="#fff2e9" stopOpacity="0.98" />
          <stop offset="0.18" stopColor="#ff7277" stopOpacity="0.9" />
          <stop offset="0.42" stopColor="#ff2635" stopOpacity="0.58" />
          <stop offset="1" stopColor="#ed2028" stopOpacity="0" />
        </radialGradient>
        {/* User-space regions keep short/nearly horizontal routes from clipping. */}
        <filter id={routeGlowId} filterUnits="userSpaceOnUse"
          x="-100" y="-100" width="1200" height="724" colorInterpolationFilters="sRGB">
          <motion.feGaussianBlur stdDeviation={routeBlur} />
        </filter>
        <filter id={destinationGlowId} x="-35%" y="-35%" width="170%" height="170%"
          colorInterpolationFilters="sRGB">
          <motion.feGaussianBlur stdDeviation={countryBlur} result="destinationBlur" />
          <feMerge>
            <feMergeNode in="destinationBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <EffectsScaleContext.Provider value={effectsScale}>
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
            glowOpacity={0.08}
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
          r={originHaloRadius}
          fill={`url(#${routeGlowId}-light)`}
          style={{ opacity: originOpacity }}
        />
        <motion.circle
          cx={koreaPoint[0]}
          cy={koreaPoint[1]}
          r={originRadius}
          fill="none"
          stroke="#ed2028"
          strokeWidth="1.2"
          vectorEffect="non-scaling-stroke"
          style={{ opacity: originOpacity }}
        />
        <motion.circle
          cx={koreaPoint[0]}
          cy={koreaPoint[1]}
          r="0.85"
          fill="#fff2ec"
          style={{ opacity: originOpacity }}
        />
      </motion.g>
      </EffectsScaleContext.Provider>
    </svg>
  );
}

export default function GlobalPresence() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const reduceMotion = Boolean(useReducedMotion());
  const desktopStory = useDesktopStory();
  const { content, locale } = useHomeV2Locale();
  const { corporate, globalPresence } = content;
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const mapProgress = useTransform(scrollYProgress, (value) =>
    rangeProgress(value, 0, mapCompletionProgress));

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
    mapProgress,
    cameraStages,
    cameraScaleValues.map((scale, index) => {
      const x = cameraXValues[index];
      const y = cameraYValues[index];
      return `translate(${x}px, ${y}px) scale(${scale})`;
    }),
  );
  const mapOpacity = useTransform(mapProgress, [0, 0.04, 1], [0.9, 1, 1]);
  const originOpacity = useTransform(
    mapProgress,
    cameraStages,
    [1, 0.95, 0.86, 0.7, 0.52, 0.38, 0.3, 0.28],
  );
  const originRadius = useTransform(
    mapProgress,
    cameraStages,
    [1.45, 1.5, 1.6, 1.75, 1.95, 2.15, 2.15, 2.15],
  );
  const summaryOpacity = useTransform(scrollYProgress, (value) => {
    const reveal = rangeProgress(value, 0.68, 0.75);
    const exit = rangeProgress(value, 0.82, 0.88);
    return reveal * (1 - exit);
  });
  const summaryY = useTransform(scrollYProgress, (value) => {
    const reveal = rangeProgress(value, 0.68, 0.75);
    const settle = rangeProgress(value, 0.80, 0.88);
    return 20 * (1 - reveal) + 170 * settle;
  });
  const summaryScale = useTransform(scrollYProgress, (value) => {
    const reveal = rangeProgress(value, 0.68, 0.75);
    const settle = rangeProgress(value, 0.80, 0.88);
    return 0.98 + reveal * 0.02 - settle * 0.22;
  });

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

  if (reduceMotion || !desktopStory) {
    return (
      <section
        aria-labelledby={titleId}
        className="min-h-svh bg-[#09090b] py-12 text-white md:py-16"
      >
        <div ref={sectionRef}>
          <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 md:px-16">
            {heading}
          </div>
          <div className="mx-auto my-8 aspect-[1000/524] w-[calc(100vw-3rem)] sm:w-[calc(100vw-5rem)] md:w-[min(96vw,150svh)]">
            <WorldMap
              ariaLabel={globalPresence.mapAriaLabel}
              staticActive
              originOpacity={0}
              originRadius={3.8}
            />
          </div>
          <div className="mx-auto max-w-7xl px-6 sm:px-10 md:px-16">
            <div className="mx-auto max-w-5xl text-center">
              <SummaryAccent />
              <p className="text-3xl font-semibold leading-[1.08] tracking-[-0.04em] text-[#f7f3ec] [text-shadow:0_2px_16px_rgba(0,0,0,0.42)] sm:text-4xl md:text-5xl lg:text-6xl">
                <OverseasSummaryCopy summary={globalPresence.overseasSummary} />
              </p>
            </div>
            <div className="mt-10 md:mt-14">
              <StaticCountryList
                countryNames={globalPresence.countryNames}
                isKorean={locale === "ko"}
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby={titleId} className="bg-[#09090b] text-white">
      <div ref={sectionRef} className="h-[400svh]">
        <div className="sticky top-0 h-svh overflow-x-clip overflow-y-auto bg-[#09090b]">
          <div className="flex h-full min-h-[32rem] w-full flex-col py-5 md:py-6">
            <div className="relative z-10 mx-auto w-full max-w-7xl shrink-0 px-6 sm:px-10 md:px-16">
              {heading}
            </div>
            <div className="relative mt-3 flex min-h-0 w-full flex-1 items-center justify-center md:mt-4">
              <motion.div
                className="aspect-[1000/524] w-[calc(100vw-3rem)] shrink-0 sm:w-[calc(100vw-5rem)] md:w-[min(96vw,150svh)]"
                style={{ opacity: mapOpacity }}
              >
                <WorldMap
                  ariaLabel={globalPresence.mapAriaLabel}
                  progress={mapProgress}
                  cameraTransform={cameraTransform}
                  originOpacity={originOpacity}
                  originRadius={originRadius}
                />
              </motion.div>

              <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-8 lg:px-16">
                <motion.div
                  className="relative isolate w-full max-w-[68rem] text-center"
                  style={{ opacity: summaryOpacity, y: summaryY, scale: summaryScale }}
                >
                  <span
                    aria-hidden="true"
                    className="absolute -inset-x-16 -inset-y-10 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.48)_0%,rgba(0,0,0,0.24)_42%,rgba(0,0,0,0)_74%)]"
                  />
                  <SummaryAccent />
                  <p className="text-[clamp(3rem,4vw,4rem)] font-semibold leading-[1.04] tracking-[-0.045em] text-[#f7f3ec] [text-shadow:0_2px_18px_rgba(0,0,0,0.58)]">
                    <OverseasSummaryCopy summary={globalPresence.overseasSummary} />
                  </p>
                </motion.div>
              </div>

              <div className="pointer-events-none absolute inset-x-0 bottom-6 z-20 px-10 lg:bottom-8 lg:px-16">
                <ul className="mx-auto grid w-full max-w-5xl grid-cols-3 gap-x-7 gap-y-3 lg:grid-cols-5 lg:gap-x-10">
                {operatingCountries.map((country, index) => (
                  <AnimatedCountryName
                    key={country}
                    country={country}
                    label={globalPresence.countryNames[country]}
                    index={index}
                    progress={scrollYProgress}
                    isKorean={locale === "ko"}
                  />
                ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
