import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
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

const gridLayouts = [
  "sm:col-span-2 lg:col-span-7 lg:aspect-[16/10]",
  "lg:col-span-5 lg:aspect-[4/5]",
  "lg:col-span-5 lg:aspect-[4/3]",
  "lg:col-span-7 lg:aspect-[16/9]",
  "sm:col-span-2 lg:col-span-8 lg:aspect-[16/10]",
  "lg:col-span-4 lg:aspect-[3/4]",
  "sm:col-span-2 lg:col-span-12 lg:aspect-[21/9]",
] as const;

function getFocusableElements(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
    ),
  );
}

export default function Gallery() {
  const reduceMotion = Boolean(useReducedMotion());
  const [activeBrand, setActiveBrand] = useState<GalleryBrand>(galleryCollections[0].id);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const collection = galleryCollections.find(({ id }) => id === activeBrand) ?? galleryCollections[0];
  const lightboxOpen = activeImageIndex !== null;
  const activeImage = activeImageIndex === null ? null : collection.images[activeImageIndex];

  const closeLightbox = () => setActiveImageIndex(null);
  const showPrevious = () => {
    setActiveImageIndex((current) => {
      if (current === null) return null;
      return (current - 1 + collection.images.length) % collection.images.length;
    });
  };
  const showNext = () => {
    setActiveImageIndex((current) => {
      if (current === null) return null;
      return (current + 1) % collection.images.length;
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
  }, [lightboxOpen, collection.images.length]);

  const handleBrandKeyDown = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    currentIndex: number,
  ) => {
    let nextIndex = currentIndex;
    if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % galleryCollections.length;
    else if (event.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + galleryCollections.length) % galleryCollections.length;
    } else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = galleryCollections.length - 1;
    else return;

    event.preventDefault();
    const nextBrand = galleryCollections[nextIndex].id;
    setActiveBrand(nextBrand);
    document.getElementById(`gallery-tab-${nextBrand}`)?.focus();
  };

  const handleDialogKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && event.target === event.currentTarget) closeLightbox();
  };

  return (
    <section
      aria-labelledby="home-v2-gallery-title"
      className="relative overflow-hidden bg-[#08090b] px-5 py-20 text-[#f7f3ec] sm:px-10 sm:py-28 lg:px-[7%] lg:py-36"
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-col gap-8 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <h2
            id="home-v2-gallery-title"
            className="text-[10px] font-semibold uppercase tracking-[0.26em] text-[#ed2028] sm:text-xs"
          >
            Gallery
          </h2>

          <div
            role="tablist"
            aria-label="Gallery brands"
            className="flex max-w-full gap-x-6 gap-y-3 overflow-x-auto pb-1 sm:flex-wrap sm:gap-x-9 lg:mr-24 xl:mr-32"
          >
            {galleryCollections.map(({ id, label }, index) => {
              const selected = activeBrand === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  id={`gallery-tab-${id}`}
                  aria-selected={selected}
                  aria-controls="gallery-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActiveBrand(id)}
                  onKeyDown={(event) => handleBrandKeyDown(event, index)}
                  className={`shrink-0 border-b py-2 text-xs font-semibold uppercase tracking-[0.18em] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed2028] focus-visible:ring-offset-4 focus-visible:ring-offset-[#08090b] sm:text-sm ${
                    selected
                      ? "border-[#ed2028] text-white"
                      : "border-transparent text-zinc-500 hover:text-zinc-200"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div
          id="gallery-panel"
          role="tabpanel"
          aria-labelledby={`gallery-tab-${activeBrand}`}
          className="pt-8 sm:pt-12"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeBrand}
              className="grid grid-cols-1 items-start gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-12 lg:gap-5"
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: reduceMotion ? 0 : 0.28, ease: "easeOut" }}
            >
              {collection.images.map((image, index) => (
                <motion.button
                  key={image.src}
                  type="button"
                  className={`group relative aspect-[4/3] w-full overflow-hidden bg-zinc-900 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed2028] focus-visible:ring-offset-4 focus-visible:ring-offset-[#08090b] ${gridLayouts[index]}`}
                  onClick={(event) => {
                    lastTriggerRef.current = event.currentTarget;
                    setActiveImageIndex(index);
                  }}
                  aria-label={`Open ${collection.label} image ${index + 1} of ${collection.images.length}`}
                  initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.14 }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.5,
                    delay: reduceMotion ? 0 : Math.min(index * 0.045, 0.2),
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.025]"
                    loading="lazy"
                    decoding="async"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10"
                  />
                </motion.button>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {activeImage && activeImageIndex !== null ? (
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${collection.label} image ${activeImageIndex + 1} of ${collection.images.length}`}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/95 px-4 py-16 sm:px-10"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.22 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) closeLightbox();
            }}
            onKeyDown={handleDialogKeyDown}
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
              {String(activeImageIndex + 1).padStart(2, "0")} / {String(collection.images.length).padStart(2, "0")}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
