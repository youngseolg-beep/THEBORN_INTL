import { motion, useReducedMotion, type Variants } from "motion/react";
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

const columnVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (index: number) => ({
    opacity: 1,
    transition: {
      delay: index * 0.22,
      duration: 0.16,
      ease: [0.22, 1, 0.36, 1],
      when: "beforeChildren",
      staggerChildren: 0.075,
    },
  }),
};

const cascadeItemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.48,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

function BrandLogo({ presentation }: { presentation: BrandPresentation }) {
  const { brand, logoClassName, logoFilterClassName } = presentation;

  return (
    <div className="flex h-28 items-center justify-center overflow-hidden sm:h-32">
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

function BrandInformation({ brand }: { brand: HomeV2Brand }) {
  const information = [
    { label: "CONCEPT", value: brand.concept },
    { label: "TARGET", value: brand.target },
    { label: "OPERATION", value: brand.operations },
    { label: "SCALE", value: brand.recommendedStoreSize.join(" · ") },
  ] as const;

  return (
    <dl className="mt-9">
      {information.map(({ label, value }) => (
        <div key={label} className="border-t border-white/10 py-4">
          <dt className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#ed2028] sm:text-xs">
            {label}
          </dt>
          <dd className="mt-2 text-[15px] leading-relaxed text-zinc-300 sm:text-base">
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function BrandColumn({
  presentation,
  index,
  reduceMotion,
}: {
  key?: string;
  presentation: BrandPresentation;
  index: number;
  reduceMotion: boolean;
}) {
  const { brand, exterior, exteriorObjectPosition } = presentation;
  const headingId = `brand-story-${brand.key}`;

  return (
    <motion.article
      aria-labelledby={headingId}
      className={index === 2 ? "sm:col-span-2 lg:col-span-1" : undefined}
      custom={index}
      variants={columnVariants}
      initial={reduceMotion ? false : "hidden"}
      whileInView={reduceMotion ? undefined : "visible"}
      viewport={{ once: true, amount: 0.15 }}
    >
      <h3 id={headingId} className="sr-only">
        {brand.englishName}
      </h3>

      <motion.div variants={cascadeItemVariants}>
        <BrandLogo presentation={presentation} />
      </motion.div>

      <motion.div
        className="mt-5 flex min-h-14 flex-col items-center justify-start text-center sm:mt-6"
        variants={cascadeItemVariants}
      >
        {brand.koreanName ? (
          <p className="text-xs tracking-[0.08em] text-zinc-500">
            {brand.koreanName}
          </p>
        ) : null}
        {brand.tagline ? (
          <p className="mt-3 text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-400 sm:text-xs">
            {brand.tagline}
          </p>
        ) : null}
      </motion.div>

      <div className="mt-6 space-y-3">
        <motion.div
          className="aspect-[3/2] max-h-[17.5rem] overflow-hidden bg-zinc-900"
          variants={cascadeItemVariants}
        >
          <img
            src={exterior.src}
            alt={exterior.alt}
            className="h-full w-full object-cover"
            style={{ objectPosition: exteriorObjectPosition }}
            loading="lazy"
            decoding="async"
          />
        </motion.div>
        <motion.div
          className="mx-auto w-[88%] max-w-[25rem]"
          variants={cascadeItemVariants}
        >
          <iframe
            src={brand.media.videoEmbedUrl}
            title={`${brand.englishName} brand film`}
            className="aspect-video w-full border-0"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </motion.div>
      </div>

      <motion.p
        className="mt-8 text-[15px] leading-relaxed tracking-[-0.015em] text-zinc-200 sm:text-base"
        variants={cascadeItemVariants}
      >
        {brand.concept}
      </motion.p>

      <motion.div
        className="mt-9 border-t border-white/10 pt-5"
        variants={cascadeItemVariants}
      >
        <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#ed2028] sm:text-xs">
          Signature Menu
        </h4>
        <div className="mt-4 space-y-2">
          {brand.signatureMenu.map((menuItem) => (
            <p key={menuItem} className="text-[15px] leading-relaxed text-[#f7f3ec] sm:text-base">
              {menuItem}
            </p>
          ))}
        </div>
      </motion.div>

      <motion.div variants={cascadeItemVariants}>
        <BrandInformation brand={brand} />
      </motion.div>
    </motion.article>
  );
}

export default function BrandStory() {
  const reduceMotion = Boolean(useReducedMotion());

  return (
    <section
      aria-labelledby="home-v2-brand-story-title"
      className="bg-[#101112] px-[5%] py-20 text-white sm:py-28 lg:px-[6%] lg:py-36"
    >
      <div className="mx-auto max-w-[1600px]">
        <header className="border-b border-white/10 pb-7 sm:pb-9">
          <h2
            id="home-v2-brand-story-title"
            className="text-xs font-medium uppercase tracking-[0.24em] text-zinc-300 sm:text-sm"
          >
            Our Brands
          </h2>
        </header>

        <div className="mt-12 grid grid-cols-1 items-start gap-x-6 gap-y-24 sm:mt-16 sm:grid-cols-2 sm:gap-y-28 lg:grid-cols-3 lg:gap-x-8 xl:gap-x-10">
          {brandPresentations.map((presentation, index) => (
            <BrandColumn
              key={presentation.brand.key}
              presentation={presentation}
              index={index}
              reduceMotion={reduceMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
