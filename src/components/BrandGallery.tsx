import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

type BrandType = "BORNGA" | "SAEMAEUL" | "PAIK'S NOODLE";

type GalleryItem = {
  id: number;
  brand: BrandType;
  src: string;
  alt: string;
};

export default function BrandGallery({ lang }: { lang: "ko" | "en" }) {
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  const items: GalleryItem[] = [
    { id: 1, brand: "BORNGA", src: "https://i.ibb.co/qLHNJ38M/value-03.jpg", alt: "BORNGA gallery image 1" },
    { id: 2, brand: "BORNGA", src: "https://i.ibb.co/5hRWcdQC/image.jpg", alt: "BORNGA gallery image 2" },
    { id: 3, brand: "BORNGA", src: "https://i.ibb.co/wNFT7xmf/ok-IMG-6066.jpg", alt: "BORNGA gallery image 3" },
    { id: 4, brand: "BORNGA", src: "https://i.ibb.co/7dCqj3HJ/468754406-1096742285182475-9107019309245594170-n.jpg", alt: "BORNGA gallery image 4" },

    { id: 5, brand: "SAEMAEUL", src: "https://i.ibb.co/PZ0HY3wX/Kakao-Talk-20240108-180020705.jpg", alt: "SAEMAEUL gallery image 1" },
    { id: 6, brand: "SAEMAEUL", src: "https://i.ibb.co/k28pS6js/7-3-9555.jpg", alt: "SAEMAEUL gallery image 2" },
    { id: 7, brand: "SAEMAEUL", src: "https://i.ibb.co/cP0yHS0/5-9628.webp", alt: "SAEMAEUL gallery image 3" },
    { id: 8, brand: "SAEMAEUL", src: "https://i.ibb.co/RTQQb92v/20180809-111702.jpg", alt: "SAEMAEUL gallery image 4" },

    { id: 9, brand: "PAIK'S NOODLE", src: "https://i.ibb.co/YFvgkTmh/0155.jpg", alt: "PAIK'S NOODLE gallery image 1" },
    { id: 10, brand: "PAIK'S NOODLE", src: "https://i.ibb.co/7tx24GdY/Kakao-Talk-20231010-231444013-06.jpg", alt: "PAIK'S NOODLE gallery image 2" },
    { id: 11, brand: "PAIK'S NOODLE", src: "https://i.ibb.co/Z1W6z5GR/image.png", alt: "PAIK'S NOODLE gallery image 3" },
    { id: 12, brand: "PAIK'S NOODLE", src: "https://i.ibb.co/xSK9Y0Gb/image.png", alt: "PAIK'S NOODLE gallery image 4" },
  ];

  const brands = [
    { key: "BORNGA" as BrandType, label: lang === "ko" ? "본가" : "BORNGA" },
    { key: "SAEMAEUL" as BrandType, label: lang === "ko" ? "새마을식당" : "SAEMAEULSIKDANG" },
    { key: "PAIK'S NOODLE" as BrandType, label: lang === "ko" ? "홍콩반점" : "PAIK'S NOODLE" },
  ];

  return (
    <section id="brand-gallery" className="py-16 md:py-24 bg-[#0F0F10] text-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14">
          <p className="text-xs md:text-sm font-bold tracking-[0.28em] md:tracking-[0.35em] text-orange-400 mb-3 md:mb-4">
            BRAND MOMENTS
          </p>

          <h2 className="text-2xl md:text-4xl font-bold tracking-tight">
            {lang === "ko" ? "브랜드 이미지" : "Brand Gallery"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {brands.map((brand, brandIndex) => {
            const brandItems = items.filter((item) => item.brand === brand.key);

            return (
              <div key={brand.key}>
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: brandIndex * 0.06 }}
                  viewport={{ once: true }}
                  className="mb-4 md:mb-6 flex flex-col items-center text-center"
                >
                  <h3 className="text-lg md:text-2xl font-bold tracking-tight text-zinc-100">
                    {brand.label}
                  </h3>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-1 gap-3 md:gap-5">
                  {brandItems.map((item, index) => (
                    <motion.button
                      key={item.id}
                      type="button"
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.32, delay: index * 0.04 }}
                      viewport={{ once: true }}
                      onClick={() => setSelectedImage(item)}
                      className="group relative overflow-hidden rounded-xl md:rounded-2xl border border-white/10 bg-[#18181B] shadow-sm aspect-[4/3] text-left transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg"
                    >
                      <img
                        src={item.src}
                        alt={item.alt}
                        className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    </motion.button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              className="relative max-w-5xl w-full"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-white/80 transition-colors"
                aria-label="Close image modal"
              >
                <X className="w-8 h-8" />
              </button>

              <div className="overflow-hidden rounded-2xl bg-black shadow-2xl">
                <img
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  className="w-full max-h-[80vh] object-contain bg-black"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
