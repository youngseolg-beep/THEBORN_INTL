import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import {
  homeV2Content,
  type HomeV2Brand,
  type HomeV2Image,
} from "../../data/homeV2Content";

type BrandPresentation = {
  brand: HomeV2Brand;
  exterior: HomeV2Image;
  exteriorObjectPosition: string;
  logoClassName: string;
  logoFilterClassName?: string;
};

type RevealWindow = [number, number];
type RevealWindows = readonly [
  RevealWindow,
  RevealWindow,
  RevealWindow,
  RevealWindow,
  RevealWindow,
  RevealWindow,
  RevealWindow,
];

const { BORNGA, SAEMAEUL, PAIKS_NOODLE } = homeV2Content.brands;

const brandPresentations: readonly BrandPresentation[] = [
  {
    brand: BORNGA,
    exterior: BORNGA.media.secondary[0],
    exteriorObjectPosition: "50% 44%",
    logoClassName: "max-w-[17rem] sm:max-w-[18rem] lg:max-w-full",
    logoFilterClassName: "invert grayscale",
  },
  {
    brand: SAEMAEUL,
    exterior: SAEMAEUL.media.secondary[2],
    exteriorObjectPosition: "50% 50%",
    logoClassName: "max-w-[14rem] sm:max-w-[15rem] lg:max-w-[13rem] xl:max-w-[15rem]",
  },
  {
    brand: PAIKS_NOODLE,
    exterior: PAIKS_NOODLE.media.primary,
    exteriorObjectPosition: "50% 52%",
    logoClassName: "max-w-[13rem] scale-[1.55] sm:max-w-[14rem] lg:max-w-[12rem] xl:max-w-[14rem]",
  },
];

const desktopRevealWindows: readonly RevealWindows[] = [
  [
    [0.03, 0.07],
    [0.07, 0.11],
    [0.11, 0.16],
    [0.16, 0.20],
    [0.20, 0.24],
    [0.24, 0.28],
    [0.28, 0.32],
  ],
  [
    [0.35, 0.39],
    [0.39, 0.43],
    [0.43, 0.48],
    [0.48, 0.52],
    [0.52, 0.56],
    [0.56, 0.60],
    [0.60, 0.64],
  ],
  [
    [0.67, 0.71],
    [0.71, 0.75],
    [0.75, 0.80],
    [0.80, 0.84],
    [0.84, 0.88],
    [0.88, 0.92],
    [0.92, 0.96],
  ],
];

const normalizedRevealWindows: RevealWindows = [
  [0, 0.13],
  [0.13, 0.26],
  [0.26, 0.41],
  [0.41, 0.55],
  [0.55, 0.69],
  [0.69, 0.84],
  [0.84, 1],
];

function scaleWindows(start: number, end: number): RevealWindows {
  const duration = end - start;
  return normalizedRevealWindows.map(([windowStart, windowEnd]) => [
    start + windowStart * duration,
    start + windowEnd * duration,
  ]) as unknown as RevealWindows;
}

const localRevealWindows = scaleWindows(0.04, 0.96);
const tabletBorngaWindows = scaleWindows(0.03, 0.48);
const tabletSaemaeulWindows = scaleWindows(0.52, 0.97);

function revealProgress(value: number, [start, end]: RevealWindow) {
  return Math.min(1, Math.max(0, (value - start) / (end - start)));
}

function useTabletLayout() {
  const [tabletLayout, setTabletLayout] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 640px) and (max-width: 1023px)");
    const update = () => setTabletLayout(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return tabletLayout;
}

function useDesktopLayout() {
  const [desktopLayout, setDesktopLayout] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const update = () => setDesktopLayout(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return desktopLayout;
}

function VMark() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 12 9"
      className="h-[9px] w-3 shrink-0"
      fill="none"
    >
      <path
        d="M1 1.25 6 7.75 11 1.25"
        stroke="#ed2028"
        strokeWidth="1.35"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

function StepLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-2.5">
      <VMark />
      <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#ed2028] sm:text-xs">
        {children}
      </span>
    </div>
  );
}

function ScrollReveal({
  progress,
  revealWindow,
  reduceMotion,
  className,
  children,
}: {
  key?: string;
  progress: MotionValue<number>;
  revealWindow: RevealWindow;
  reduceMotion: boolean;
  className?: string;
  children: ReactNode;
}) {
  const reveal = useTransform(progress, (value) => revealProgress(value, revealWindow));
  const y = useTransform(reveal, (value) => 24 * (1 - value));
  const scale = useTransform(reveal, (value) => 0.99 + value * 0.01);

  return (
    <motion.div
      className={className}
      style={{
        opacity: reduceMotion ? 1 : reveal,
        y: reduceMotion ? 0 : y,
        scale: reduceMotion ? 1 : scale,
      }}
    >
      {children}
    </motion.div>
  );
}

function BrandLogo({ presentation }: { presentation: BrandPresentation }) {
  const { brand, logoClassName, logoFilterClassName } = presentation;

  return (
    <div className="flex h-40 items-center justify-center overflow-hidden sm:h-44 lg:h-40 xl:h-44">
      <img
        src={brand.media.logo.src}
        alt={brand.media.logo.alt}
        className={`h-full w-full object-contain ${logoClassName} ${logoFilterClassName ?? ""}`}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

function BrandIdentity({ presentation }: { presentation: BrandPresentation }) {
  const { brand } = presentation;

  return (
    <>
      <h3 id={`brand-story-${brand.key}`} className="sr-only">
        {brand.englishName}
      </h3>
      <BrandLogo presentation={presentation} />
    </>
  );
}

function SignatureMenu({ brand }: { brand: HomeV2Brand }) {
  return (
    <div className="border-t border-white/10 pt-5">
      <StepLabel>Signature Menu</StepLabel>
      <div className="mt-4 space-y-2">
        {brand.signatureMenu.map((menuItem) => (
          <p key={menuItem} className="text-[15px] leading-relaxed text-[#f7f3ec] sm:text-base">
            {menuItem}
          </p>
        ))}
      </div>
    </div>
  );
}

function InformationStep({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt>
        <StepLabel>{label}</StepLabel>
      </dt>
      <dd className="mt-2 text-[15px] leading-relaxed text-zinc-300 sm:text-base">
        {value}
      </dd>
    </>
  );
}

function BrandColumn({
  presentation,
  progress,
  revealWindows,
  reduceMotion,
  columnY,
}: {
  key?: string;
  presentation: BrandPresentation;
  progress: MotionValue<number>;
  revealWindows: RevealWindows;
  reduceMotion: boolean;
  columnY?: MotionValue<string>;
}) {
  const { brand, exterior, exteriorObjectPosition } = presentation;
  const information = [
    { label: "CONCEPT", value: brand.concept },
    { label: "TARGET", value: brand.target },
    { label: "OPERATION", value: brand.operations },
    { label: "SCALE", value: brand.recommendedStoreSize.join(" · ") },
  ] as const;

  return (
    <motion.article
      aria-labelledby={`brand-story-${brand.key}`}
      style={{ y: reduceMotion ? 0 : columnY }}
    >
      <BrandIdentity presentation={presentation} />

      <div className="mt-6 space-y-5">
        <ScrollReveal
          progress={progress}
          revealWindow={revealWindows[0]}
          reduceMotion={reduceMotion}
          className="mx-auto aspect-[3/2] w-full max-w-[26rem] overflow-hidden bg-zinc-900"
        >
          <img
            src={exterior.src}
            alt={exterior.alt}
            className="h-full w-full object-cover"
            style={{ objectPosition: exteriorObjectPosition }}
            loading="lazy"
            decoding="async"
          />
        </ScrollReveal>

        <ScrollReveal
          progress={progress}
          revealWindow={revealWindows[1]}
          reduceMotion={reduceMotion}
          className="mx-auto w-full max-w-[26rem]"
        >
          <iframe
            src={brand.media.videoEmbedUrl}
            title={`${brand.englishName} brand film`}
            className="aspect-video w-full border-0"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </ScrollReveal>
      </div>

      <ScrollReveal
        progress={progress}
        revealWindow={revealWindows[2]}
        reduceMotion={reduceMotion}
        className="mt-9"
      >
        <SignatureMenu brand={brand} />
      </ScrollReveal>

      <dl className="mt-9">
        {information.map(({ label, value }, index) => (
          <ScrollReveal
            key={label}
            progress={progress}
            revealWindow={revealWindows[index + 3]}
            reduceMotion={reduceMotion}
            className="border-t border-white/10 py-4"
          >
            <InformationStep label={label} value={value} />
          </ScrollReveal>
        ))}
      </dl>
    </motion.article>
  );
}

function DesktopBrandColumn({
  presentation,
  progress,
  revealWindows,
  reduceMotion,
}: {
  key?: string;
  presentation: BrandPresentation;
  progress: MotionValue<number>;
  revealWindows: RevealWindows;
  reduceMotion: boolean;
}) {
  const columnProgress = useTransform(progress, (value) =>
    revealProgress(value, [revealWindows[2][0], revealWindows[6][1]]),
  );
  const columnY = useTransform(columnProgress, (value) => `${value * -43}%`);

  return (
    <BrandColumn
      presentation={presentation}
      progress={progress}
      revealWindows={revealWindows}
      reduceMotion={reduceMotion}
      columnY={columnY}
    />
  );
}

function FlowBrandColumn({
  presentation,
  revealWindows,
  reduceMotion,
  className,
}: {
  key?: string;
  presentation: BrandPresentation;
  revealWindows: RevealWindows;
  reduceMotion: boolean;
  className?: string;
}) {
  const articleRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: articleRef,
    offset: ["start 88%", "end 18%"],
  });

  return (
    <div ref={articleRef} className={className}>
      <BrandColumn
        presentation={presentation}
        progress={scrollYProgress}
        revealWindows={revealWindows}
        reduceMotion={reduceMotion}
      />
    </div>
  );
}

function SectionHeader() {
  return (
    <header className="border-b border-white/10 pb-7 sm:pb-9">
      <h2 className="text-xs font-medium uppercase tracking-[0.24em] text-zinc-300 sm:text-sm">
        Our Brands
      </h2>
    </header>
  );
}

function NaturalFlowBrands({ reduceMotion }: { reduceMotion: boolean }) {
  const tabletLayout = useTabletLayout();

  return (
    <div className="px-[5%] py-20 sm:py-28 lg:px-[6%] lg:py-36">
      <div className="mx-auto max-w-[1600px]">
        <SectionHeader />
        <div className="mt-12 grid grid-cols-1 items-start gap-x-6 gap-y-24 sm:mt-16 sm:grid-cols-2 sm:gap-y-28 lg:grid-cols-3 lg:gap-x-8 xl:gap-x-10">
          {brandPresentations.map((presentation, index) => {
            const revealWindows = tabletLayout && index === 0
              ? tabletBorngaWindows
              : tabletLayout && index === 1
                ? tabletSaemaeulWindows
                : localRevealWindows;

            return (
              <FlowBrandColumn
                key={presentation.brand.key}
                presentation={presentation}
                revealWindows={revealWindows}
                reduceMotion={reduceMotion}
                className={index === 2 ? "sm:col-span-2 lg:col-span-1" : undefined}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function BrandStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = Boolean(useReducedMotion());
  const desktopLayout = useDesktopLayout();
  const useDesktopStory = desktopLayout && !reduceMotion;
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  return (
    <section
      ref={sectionRef}
      aria-label="Our Brands"
      className={`bg-[#101112] text-white ${useDesktopStory ? "lg:h-[240svh]" : ""}`}
    >
      {useDesktopStory ? (
        <div className="sticky top-0 h-svh overflow-hidden px-[6%] py-7">
          <div className="mx-auto max-w-[1600px]">
            <SectionHeader />
            <div className="mt-7 grid grid-cols-3 items-start gap-x-8 xl:gap-x-10">
              {brandPresentations.map((presentation, index) => (
                <DesktopBrandColumn
                  key={presentation.brand.key}
                  presentation={presentation}
                  progress={scrollYProgress}
                  revealWindows={desktopRevealWindows[index]}
                  reduceMotion={false}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <NaturalFlowBrands reduceMotion={reduceMotion} />
      )}
    </section>
  );
}
