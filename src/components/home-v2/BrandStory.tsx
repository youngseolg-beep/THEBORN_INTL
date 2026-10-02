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
  type HomeV2Brand,
  type HomeV2BrandKey,
  type HomeV2BrandLabels,
  type HomeV2Image,
  type HomeV2Locale,
} from "../../data/homeV2Content";
import { useHomeV2Locale } from "./HomeV2LocaleContext";
import { useMobileLayout } from "./useMobileLayout";
import ChapterHeader from "./ChapterHeader";

type BrandPresentation = {
  brand: HomeV2Brand;
  exterior: HomeV2Image;
  exteriorObjectPosition: string;
  logoClassName: string;
  logoFilterClassName?: string;
};

type BrandPresentationConfig = Omit<BrandPresentation, "brand" | "exterior"> & {
  brandKey: HomeV2BrandKey;
  exteriorIndex: number | "primary";
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

const brandPresentationConfigs: readonly BrandPresentationConfig[] = [
  {
    brandKey: "BORNGA",
    exteriorIndex: 0,
    exteriorObjectPosition: "50% 44%",
    logoClassName: "max-w-[17rem] sm:max-w-[18rem] lg:max-w-full",
    logoFilterClassName: "invert grayscale",
  },
  {
    brandKey: "SAEMAEUL",
    exteriorIndex: 2,
    exteriorObjectPosition: "50% 50%",
    logoClassName: "max-w-[14rem] sm:max-w-[15rem] lg:max-w-[13rem] xl:max-w-[15rem]",
  },
  {
    brandKey: "PAIKS_NOODLE",
    exteriorIndex: "primary",
    exteriorObjectPosition: "50% 52%",
    logoClassName: "max-w-[13rem] scale-[1.55] sm:max-w-[14rem] lg:max-w-[12rem] xl:max-w-[14rem]",
  },
];

function createBrandPresentations(
  brands: Record<HomeV2BrandKey, HomeV2Brand>,
): readonly BrandPresentation[] {
  return brandPresentationConfigs.map(({ brandKey, exteriorIndex, ...config }) => {
    const brand = brands[brandKey];
    return {
      ...config,
      brand,
      exterior: exteriorIndex === "primary"
        ? brand.media.primary
        : brand.media.secondary[exteriorIndex],
    };
  });
}

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

function useImmersiveDesktopLayout() {
  const [desktopLayout, setDesktopLayout] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px) and (min-height: 900px)");
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
      viewBox="0 0 18 16"
      className="h-[15px] w-4 shrink-0"
      fill="none"
    >
      <path
        d="m2 8.25 4.25 4.25L16 2.75"
        stroke="#ed2028"
        strokeWidth="3.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StepLabel({
  children,
  isKorean,
}: {
  children: ReactNode;
  isKorean: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <VMark />
      <span className={`text-[10px] font-semibold text-[#ed2028] sm:text-[11px] ${
        isKorean ? "tracking-[-0.01em]" : "uppercase tracking-[0.18em]"
      }`}>
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
        {brand.displayName}
      </h3>
      <BrandLogo presentation={presentation} />
    </>
  );
}

function SignatureMenu({
  brand,
  label,
  isKorean,
}: {
  brand: HomeV2Brand;
  label: string;
  isKorean: boolean;
}) {
  return (
    <div className="border-b border-white/[0.09] pb-7 sm:pb-8">
      <StepLabel isKorean={isKorean}>{label}</StepLabel>
      <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
        {brand.signatureMenu.map((menuItem) => (
          <p
            key={menuItem}
            className={`text-[14px] font-medium leading-[1.45] text-[#f7f3ec] sm:text-[15px] ${
              isKorean ? "tracking-[-0.015em]" : "uppercase tracking-[0.025em]"
            } ${
              menuItem.length > 28 ? "sm:col-span-2" : ""
            }`}
          >
            {menuItem}
          </p>
        ))}
      </div>
    </div>
  );
}

function InformationStep({
  label,
  value,
  experienceHeading,
  description,
  featured = false,
  isKorean,
}: {
  label: string;
  value: string;
  experienceHeading?: string;
  description?: string;
  featured?: boolean;
  isKorean: boolean;
}) {
  return (
    <>
      <dt>
        <StepLabel isKorean={isKorean}>{label}</StepLabel>
      </dt>
      <dd className={`mt-3 ${isKorean ? "tracking-[-0.015em]" : "uppercase"}`}>
        <p
          className={
            featured
              ? "max-w-[32rem] text-balance text-[clamp(1.25rem,1.55vw,1.7rem)] font-medium leading-[1.16] tracking-[-0.025em] text-[#f7f3ec]"
              : "max-w-[34rem] text-pretty text-[14px] font-normal leading-[1.55] tracking-[0.02em] text-zinc-200 sm:text-[15px]"
          }
        >
          {value}
        </p>
        {experienceHeading ? (
          <p className="mt-4 max-w-[34rem] text-[15px] font-semibold leading-[1.5] text-zinc-100 sm:text-base">
            {experienceHeading}
          </p>
        ) : null}
        {description ? (
          <p className={`${experienceHeading ? "mt-2.5" : "mt-4"} max-w-[36rem] text-pretty text-[13px] leading-[1.65] text-zinc-400 sm:text-sm ${
            isKorean ? "tracking-[-0.01em]" : "tracking-[0.025em]"
          }`}>
            {description}
          </p>
        ) : null}
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
  labels,
  locale,
}: {
  key?: string;
  presentation: BrandPresentation;
  progress: MotionValue<number>;
  revealWindows: RevealWindows;
  reduceMotion: boolean;
  columnY?: MotionValue<string>;
  labels: HomeV2BrandLabels;
  locale: HomeV2Locale;
}) {
  const { brand, exterior, exteriorObjectPosition } = presentation;
  const isKorean = locale === "ko";
  const information: readonly {
    label: string;
    value: string;
    experienceHeading?: string;
    description?: string;
  }[] = [
    {
      label: labels.concept,
      value: brand.concept,
      experienceHeading: brand.experienceHeading,
      description: brand.experience,
    },
    { label: labels.target, value: brand.target },
    { label: labels.operation, value: brand.operations },
    { label: labels.scale, value: brand.recommendedStoreSize.join(" · ") },
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
            title={`${brand.displayName} brand film`}
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
        className="mt-9 sm:mt-10"
      >
        <SignatureMenu
          brand={brand}
          label={labels.signatureMenu}
          isKorean={isKorean}
        />
      </ScrollReveal>

      <dl className="mt-8 sm:mt-9">
        {information.map(({ label, value, experienceHeading, description }, index) => (
          <ScrollReveal
            key={label}
            progress={progress}
            revealWindow={revealWindows[index + 3]}
            reduceMotion={reduceMotion}
            className={index === 0 ? "border-b border-white/[0.09] pb-8 sm:pb-9" : "pt-6 sm:pt-7"}
          >
            <InformationStep
              label={label}
              value={value}
              experienceHeading={experienceHeading}
              description={description}
              featured={index === 0}
              isKorean={isKorean}
            />
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
  labels,
  locale,
}: {
  key?: string;
  presentation: BrandPresentation;
  progress: MotionValue<number>;
  revealWindows: RevealWindows;
  reduceMotion: boolean;
  labels: HomeV2BrandLabels;
  locale: HomeV2Locale;
}) {
  const columnProgress = useTransform(progress, (value) =>
    revealProgress(value, [revealWindows[2][0], revealWindows[6][1]]),
  );
  const columnY = useTransform(columnProgress, (value) => `${value * -48}%`);

  return (
    <BrandColumn
      presentation={presentation}
      progress={progress}
      revealWindows={revealWindows}
      reduceMotion={reduceMotion}
      columnY={columnY}
      labels={labels}
      locale={locale}
    />
  );
}

function FlowBrandColumn({
  presentation,
  revealWindows,
  reduceMotion,
  className,
  labels,
  locale,
}: {
  key?: string;
  presentation: BrandPresentation;
  revealWindows: RevealWindows;
  reduceMotion: boolean;
  className?: string;
  labels: HomeV2BrandLabels;
  locale: HomeV2Locale;
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
        labels={labels}
        locale={locale}
      />
    </div>
  );
}

function SectionHeader() {
  return (
    <header className="border-b border-white/10 pb-7 sm:pb-9">
      <ChapterHeader chapter="brand-story" />
    </header>
  );
}

function NaturalFlowBrands({
  presentations,
  labels,
  locale,
  reduceMotion,
}: {
  presentations: readonly BrandPresentation[];
  labels: HomeV2BrandLabels;
  locale: HomeV2Locale;
  reduceMotion: boolean;
}) {
  const tabletLayout = useTabletLayout();
  const { mobile } = useMobileLayout();

  return (
    <div className="px-[5%] py-20 sm:py-28 lg:px-[6%] lg:py-36">
      <div className="mx-auto max-w-[1600px]">
        <SectionHeader />
        <div className="mt-12 grid grid-cols-1 items-start gap-x-6 gap-y-24 sm:mt-16 sm:grid-cols-2 sm:gap-y-28 lg:grid-cols-3 lg:gap-x-8 xl:gap-x-10">
          {presentations.map((presentation, index) => {
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
                reduceMotion={reduceMotion || mobile}
                labels={labels}
                locale={locale}
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
  const { content, locale } = useHomeV2Locale();
  const { brands, brandLabels } = content;
  const brandPresentations = createBrandPresentations(brands);
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = Boolean(useReducedMotion());
  const desktopLayout = useImmersiveDesktopLayout();
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
                  labels={brandLabels}
                  locale={locale}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <NaturalFlowBrands
          presentations={brandPresentations}
          labels={brandLabels}
          locale={locale}
          reduceMotion={reduceMotion}
        />
      )}
    </section>
  );
}
