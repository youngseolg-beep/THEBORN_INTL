import { motion, useReducedMotion } from "motion/react";
import {
  homeV2Content,
  type HomeV2Brand,
  type HomeV2Image,
} from "../../data/homeV2Content";

type BrandPresentation = {
  brand: HomeV2Brand;
  exterior: HomeV2Image;
  logoClassName: string;
  logoFilterClassName?: string;
};

const { BORNGA, SAEMAEUL, PAIKS_NOODLE } = homeV2Content.brands;

const brandPresentations: readonly BrandPresentation[] = [
  {
    brand: BORNGA,
    exterior: BORNGA.media.secondary[0],
    logoClassName: "max-w-[17rem] sm:max-w-[18rem] lg:max-w-full",
    logoFilterClassName: "invert grayscale",
  },
  {
    brand: SAEMAEUL,
    exterior: SAEMAEUL.media.secondary[2],
    logoClassName: "max-w-[14rem] sm:max-w-[15rem] lg:max-w-[13rem] xl:max-w-[15rem]",
  },
  {
    brand: PAIKS_NOODLE,
    exterior: PAIKS_NOODLE.media.primary,
    logoClassName: "max-w-[13rem] scale-[1.55] sm:max-w-[14rem] lg:max-w-[12rem] xl:max-w-[14rem]",
  },
];

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
          <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#ed2028]">
            {label}
          </dt>
          <dd className="mt-2 text-sm leading-relaxed text-zinc-300">
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
  const { brand, exterior } = presentation;
  const headingId = `brand-story-${brand.key}`;

  return (
    <motion.article
      aria-labelledby={headingId}
      className={index === 2 ? "sm:col-span-2 lg:col-span-1" : undefined}
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{
        duration: reduceMotion ? 0 : 0.58,
        delay: reduceMotion ? 0 : index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <BrandLogo presentation={presentation} />

      <div className="mt-6 min-h-24 text-center sm:mt-7">
        <h3
          id={headingId}
          className="text-[clamp(1.5rem,2.1vw,2.25rem)] font-medium uppercase leading-tight tracking-[-0.045em] text-[#f7f3ec]"
        >
          {brand.englishName}
        </h3>
        {brand.koreanName ? (
          <p className="mt-2 text-xs tracking-[0.08em] text-zinc-500">
            {brand.koreanName}
          </p>
        ) : null}
        {brand.tagline ? (
          <p className="mt-3 text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-400 sm:text-xs">
            {brand.tagline}
          </p>
        ) : null}
      </div>

      <div className="mt-7 space-y-3">
        <div className="aspect-[4/3] overflow-hidden bg-zinc-900">
          <img
            src={exterior.src}
            alt={exterior.alt}
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
        <iframe
          src={brand.media.videoEmbedUrl}
          title={`${brand.englishName} brand film`}
          className="aspect-video w-full border-0"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <p className="mt-8 text-base leading-relaxed tracking-[-0.015em] text-zinc-200">
        {brand.concept}
      </p>

      <div className="mt-9 border-t border-white/10 pt-5">
        <h4 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Signature Menu
        </h4>
        <div className="mt-4 space-y-2">
          {brand.signatureMenu.map((menuItem) => (
            <p key={menuItem} className="text-sm leading-relaxed text-[#f7f3ec]">
              {menuItem}
            </p>
          ))}
        </div>
      </div>

      <BrandInformation brand={brand} />
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
