import { useMemo, useState } from "react";
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
  const [selectedBrand, setSelectedBrand] = useState<"ALL" | BrandType>("ALL");
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  const items: GalleryItem[] = [
    {
      id: 1,
      brand: "BORNGA",
      src: "https://i.ibb.co/qLHNJ38M/value-03.jpg",
      alt: "BORNGA gallery image 1",
    },
    {
      id: 2,
      brand: "BORNGA",
      src: "https://i.ibb.co/5hRWcdQC/image.jpg",
      alt: "BORNGA gallery image 2",
    },
    {
      id: 3,
      brand: "BORNGA",
      src: "https://i.ibb.co/wNFT7xmf/ok-IMG-6066.jpg",
      alt: "BORNGA gallery image 3",
    },
    {
      id: 4,
      brand: "BORNGA",
      src: "https://i.ibb.co/7dCqj3HJ/468754406-1096742285182475-9107019309245594170-n.jpg",
      alt: "BORNGA gallery image 4",
    },
    {
      id: 5,
      brand: "SAEMAEUL",
      src: "https://i.ibb.co/PZ0HY3wX/Kakao-Talk-20240108-180020705.jpg",
      alt: "SAEMAEUL gallery image 1",
    },
    {
      id: 6,
      brand: "SAEMAEUL",
      src: "https://i.ibb.co/k28pS6js/7-3-9555.jpg",
      alt: "SAEMAEUL gallery image 2",
    },
    {
      id: 7,
      brand: "SAEMAEUL",
      src: "https://i.ibb.co/cP0yHS0/5-9628.webp",
      alt: "SAEMAEUL gallery image 3",
    },
    {
      id: 8,
      brand: "SAEMAEUL",
      src: "https://i.ibb.co/RTQQb92v/20180809-111702.jpg",
      alt: "SAEMAEUL gallery image 4",
    },
    {
      id: 9,
      brand: "PAIK'S NOODLE",
      src: "https://i.ibb.co/YFvgkTmh/0155.jpg",
      alt: "PAIK'S NOODLE gallery image 1",
    },
    {
      id: 10,
      brand: "PAIK'S NOODLE",
      src: "https://i.ibb.co/7tx24GdY/Kakao-Talk-20231010-231444013-06.jpg",
      alt: "PAIK'S NOODLE gallery image 2",
    },
    {
      id: 11,
      brand: "PAIK'S NOODLE",
      src: "https://i.ibb.co/Z1W6z5GR/image.png",
      alt: "PAIK'S NOODLE gallery image 3",
    },
    {
      id: 12,
      brand: "PAIK'S NOODLE",
      src: "https://i.ibb.co/xSK9Y0Gb/image.png",
      alt: "PAIK'S NOODLE gallery image 4",
    },
  ];

  const brandLabels: Record<"ALL" | BrandType, string> = {
    ALL: lang === "ko" ? "전체" : "All",
    BORNGA: lang === "ko" ? "본가" : "BORNGA",
    SAEMAEUL: lang === "ko" ? "새마을식당" : "SAEMAEUL",
    "PAIK'S NOODLE": lang === "ko" ? "홍콩반점 0410" : "PAIK'S NOODLE",
  };

  const filteredItems = useMemo(() => {
    if (selectedBrand === "ALL") return items;
    return items.filter((item) => item.brand === selectedBrand);
  }, [selectedBrand]);

  return (
    <section id="brand-gallery" className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            {lang === "ko" ? "브랜드 이미지" : "Brand Gallery"}
          </h2>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {(["ALL", "BORNGA", "SAEMAEUL", "PAIK'S NOODLE"] as const).map((brand) => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              className={`rounded-full border px-4 py-2 text-sm md:text-base font-medium transition-colors ${
                selectedBrand === brand
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-foreground hover:bg-muted"
              }`}
            >
              {brandLabels[brand]}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {filteredItems.map((item, index) => (
            <motion.button
              key={item.id}
              type="button"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true }}
              onClick={() => setSelectedImage(item)}
              className="group relative overflow-hidden rounded-2xl border bg-background shadow-sm aspect-[4/3] text-left"
            >
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              <div className="absolute left-3 bottom-3 rounded-full bg-black/60 text-white text-xs md:text-sm px-3 py-1">
                {brandLabels[item.brand]}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
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

              <div className="overflow-hidden rounded-2xl bg-background shadow-2xl">
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
