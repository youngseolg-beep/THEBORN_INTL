import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

type GalleryBrand = "bornga" | "saemaeul" | "paiks-noodle";

type GalleryImage = {
  src: string;
  alt: string;
};

type GalleryCollection = {
  id: GalleryBrand;
  label: string;
  images: GalleryImage[];
};

type LightboxSelection = {
  brandId: GalleryBrand;
  imageIndex: number;
};

const galleryCollections: GalleryCollection[] = [
  {
    id: "bornga",
    label: "BORNGA",
    images: [
      { src: "/assets/home-v2-assets/bornga/image-01.png", alt: "BORNGA gallery image 1" },
      { src: "/assets/home-v2-assets/bornga/image-06.png", alt: "BORNGA gallery image 2" },
      { src: "/assets/home-v2-assets/bornga/image-09.png", alt: "BORNGA gallery image 3" },
      { src: "/assets/home-v2-assets/bornga/image-03.png", alt: "BORNGA gallery image 4" },
      { src: "/assets/home-v2-assets/bornga/image-12.jpg", alt: "BORNGA gallery image 5" },
      { src: "/assets/home-v2-assets/bornga/image-14.png", alt: "BORNGA gallery image 6" },
      { src: "/assets/home-v2-assets/bornga/image-18.png", alt: "BORNGA gallery image 7" },
    ],
  },
  {
    id: "saemaeul",
    label: "SAEMAEUL",
    images: [
      { src: "/assets/home-v2-assets/saemaeul/image-01.webp", alt: "SAEMAEUL gallery image 1" },
      { src: "/assets/home-v2-assets/saemaeul/image-05.png", alt: "SAEMAEUL gallery image 2" },
      { src: "/assets/home-v2-assets/saemaeul/image-10.jpg", alt: "SAEMAEUL gallery image 3" },
      { src: "/assets/home-v2-assets/saemaeul/image-03.jpg", alt: "SAEMAEUL gallery image 4" },
      { src: "/assets/home-v2-assets/saemaeul/image-06.jpg", alt: "SAEMAEUL gallery image 5" },
      { src: "/assets/home-v2-assets/saemaeul/image-11.png", alt: "SAEMAEUL gallery image 6" },
      { src: "/assets/home-v2-assets/saemaeul/image-12.png", alt: "SAEMAEUL gallery image 7" },
      { src: "/assets/home-v2-assets/saemaeul/image-02.png", alt: "SAEMAEUL gallery image 8" },
    ],
  },
  {
    id: "paiks-noodle",
    label: "PAIK'S NOODLE",
    images: [
      { src: "/assets/home-v2-assets/paiks-noodle/image-02.png", alt: "PAIK'S NOODLE gallery image 1" },
      { src: "/assets/home-v2-assets/paiks-noodle/image-06.png", alt: "PAIK'S NOODLE gallery image 2" },
      { src: "/assets/home-v2-assets/paiks-noodle/image-10.png", alt: "PAIK'S NOODLE gallery image 3" },
      { src: "/assets/home-v2-assets/paiks-noodle/image-04.png", alt: "PAIK'S NOODLE gallery image 4" },
      { src: "/assets/home-v2-assets/paiks-noodle/image-14.png", alt: "PAIK'S NOODLE gallery image 5" },
      { src: "/assets/home-v2-assets/paiks-noodle/image-15.png", alt: "PAIK'S NOODLE gallery image 6" },
      { src: "/assets/home-v2-assets/paiks-noodle/image-16.png", alt: "PAIK'S NOODLE gallery image 7" },
    ],
  },
];

const galleryCollectionsById = new Map<GalleryBrand, GalleryCollection>(
  galleryCollections.map((collection) => [collection.id, collection]),
);

function getFocusableElements(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
    ),
  );
}

export default function Gallery() {
  const reduceMotion = Boolean(useReducedMotion());
  const [lightbox, setLightbox] = useState<LightboxSelection | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const selectedCollection = lightbox
    ? galleryCollectionsById.get(lightbox.brandId)
    : undefined;
  const activeImage = lightbox && selectedCollection
    ? selectedCollection.images[lightbox.imageIndex]
    : undefined;
  const lightboxOpen = lightbox !== null;

  const closeLightbox = () => setLightbox(null);
  const showPrevious = () => {
    setLightbox((current) => {
      if (!current) return null;
      const imageCount = galleryCollectionsById.get(current.brandId)?.images.length ?? 0;
      if (imageCount === 0) return null;
      return {
        ...current,
        imageIndex: (current.imageIndex - 1 + imageCount) % imageCount,
      };
    });
  };
  const showNext = () => {
    setLightbox((current) => {
      if (!current) return null;
      const imageCount = galleryCollectionsById.get(current.brandId)?.images.length ?? 0;
      if (imageCount === 0) return null;
      return {
        ...current,
        imageIndex: (current.imageIndex + 1) % imageCount,
      };
    });
  };

  useEffect(() => {
    if (!lightboxOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeLightbox();
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showPrevious();
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        showNext();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = getFocusableElements(dialogRef.current);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      window.requestAnimationFrame(() => lastTriggerRef.current?.focus());
    };
  }, [lightboxOpen]);

  return (
    <section
      aria-labelledby="home-v2-gallery-title"
      className="relative overflow-hidden bg-[#08090b] px-5 py-20 text-[#f7f3ec] sm:px-10 sm:py-28 lg:px-[7%] lg:py-36"
    >
      <div className="mx-auto max-w-[1600px]">
        <h2 id="home-v2-gallery-title" className="sr-only">
          Gallery
        </h2>

        <div className="grid grid-cols-1 items-start gap-y-16 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-20 lg:grid-cols-3 lg:gap-x-5 xl:gap-x-6">
          {galleryCollections.map((collection, brandIndex) => (
            <article
              key={collection.id}
              aria-labelledby={`gallery-heading-${collection.id}`}
              className={brandIndex === 2
                ? "sm:col-span-2 sm:mx-auto sm:w-[calc(50%-0.5rem)] lg:col-span-1 lg:mx-0 lg:w-auto"
                : undefined}
            >
              <h3
                id={`gallery-heading-${collection.id}`}
                className="mb-5 text-center text-[22px] font-semibold uppercase tracking-[0.1em] text-[#f7f3ec] sm:mb-6 sm:text-2xl md:text-[26px] xl:text-[30px]"
              >
                {collection.label}
              </h3>

              <div className="flex flex-col gap-3 sm:gap-4">
                {collection.images.map((image, imageIndex) => (
                  <motion.button
                    key={image.src}
                    type="button"
                    className="group relative w-full overflow-hidden bg-zinc-900 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed2028] focus-visible:ring-offset-4 focus-visible:ring-offset-[#08090b]"
                    onClick={(event) => {
                      lastTriggerRef.current = event.currentTarget;
                      setLightbox({ brandId: collection.id, imageIndex });
                    }}
                    aria-label={`Open ${collection.label} image ${imageIndex + 1} of ${collection.images.length}`}
                    initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.08 }}
                    transition={{
                      duration: reduceMotion ? 0 : 0.48,
                      delay: reduceMotion ? 0 : Math.min(imageIndex * 0.035, 0.16),
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="h-auto w-full transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.02]"
                      loading="lazy"
                      decoding="async"
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10"
                    />
                  </motion.button>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeImage && lightbox && selectedCollection ? (
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedCollection.label} image ${lightbox.imageIndex + 1} of ${selectedCollection.images.length}`}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/95 px-4 py-16 sm:px-10"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.22 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) closeLightbox();
            }}
          >
            <button
              ref={closeButtonRef}
              type="button"
              aria-label="Close gallery"
              onClick={closeLightbox}
              className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center text-3xl font-light text-white/75 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed2028] sm:right-8 sm:top-8"
            >
              <span aria-hidden="true">×</span>
            </button>

            <button
              type="button"
              aria-label="Previous image"
              onClick={showPrevious}
              className="absolute bottom-4 left-[calc(50%-3.75rem)] flex h-12 w-12 items-center justify-center text-2xl text-white/75 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed2028] sm:bottom-auto sm:left-5 sm:top-1/2 sm:-translate-y-1/2"
            >
              <span aria-hidden="true">←</span>
            </button>

            <motion.img
              key={activeImage.src}
              src={activeImage.src}
              alt={activeImage.alt}
              className="max-h-[78svh] max-w-[92vw] object-contain sm:max-h-[84svh] sm:max-w-[84vw]"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: reduceMotion ? 0 : 0.24, ease: "easeOut" }}
              decoding="async"
            />

            <button
              type="button"
              aria-label="Next image"
              onClick={showNext}
              className="absolute bottom-4 right-[calc(50%-3.75rem)] flex h-12 w-12 items-center justify-center text-2xl text-white/75 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed2028] sm:bottom-auto sm:right-5 sm:top-1/2 sm:-translate-y-1/2"
            >
              <span aria-hidden="true">→</span>
            </button>

            <p className="absolute bottom-5 left-5 text-[10px] font-medium tracking-[0.2em] text-white/45 sm:bottom-8 sm:left-1/2 sm:-translate-x-1/2 sm:text-xs">
              {String(lightbox.imageIndex + 1).padStart(2, "0")} / {String(selectedCollection.images.length).padStart(2, "0")}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
