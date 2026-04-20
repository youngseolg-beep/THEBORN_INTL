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
    { id: 1, brand: "BORNGA", src: "https://i.ibb.co/qLHNJ38M/value-03.jpg", alt: "" },
    { id: 2, brand: "BORNGA", src: "https://i.ibb.co/5hRWcdQC/image.jpg", alt: "" },
    { id: 3, brand: "BORNGA", src: "https://i.ibb.co/wNFT7xmf/ok-IMG-6066.jpg", alt: "" },
    { id: 4, brand: "BORNGA", src: "https://i.ibb.co/7dCqj3HJ/468754406-1096742285182475-9107019309245594170-n.jpg", alt: "" },

    { id: 5, brand: "SAEMAEUL", src: "https://i.ibb.co/PZ0HY3wX/Kakao-Talk-20240108-180020705.jpg", alt: "" },
    { id: 6, brand: "SAEMAEUL", src: "https://i.ibb.co/k28pS6js/7-3-9555.jpg", alt: "" },
    { id: 7, brand: "SAEMAEUL", src: "https://i.ibb.co/cP0yHS0/5-9628.webp", alt: "" },
    { id: 8, brand: "SAEMAEUL", src: "https://i.ibb.co/RTQQb92v/20180809-111702.jpg", alt: "" },

    { id: 9, brand: "PAIK'S NOODLE", src: "https://i.ibb.co/YFvgkTmh/0155.jpg", alt: "" },
    { id: 10, brand: "PAIK'S NOODLE", src: "https://i.ibb.co/7tx24GdY/Kakao-Talk-20231010-231444013-06.jpg", alt: "" },
    { id: 11, brand: "PAIK'S NOODLE", src: "https://i.ibb.co/Z1W6z5GR/image.png", alt: "" },
    { id: 12, brand: "PAIK'S NOODLE", src: "https://i.ibb.co/xSK9Y0Gb/image.png", alt: "" },
  ];

  const brandLabels: Record<BrandType, string> = {
    BORNGA: lang === "ko" ? "본가" : "BORNGA",
    SAEMAEUL: lang === "ko" ? "새마을식당" : "SAEMAEUL",
    "PAIK'S NOODLE": lang === "ko" ? "홍콩반점 0410" : "PAIK'S NOODLE",
  };

  const brands: BrandType[] = ["BORNGA", "SAEMAEUL", "PAIK'S NOODLE"];

  return (
    <section id="brand-gallery" className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            {lang === "ko" ? "브랜드 이미지" : "Brand Gallery"}
          </h2>
        </div>

        {/* 브랜드별 섹션 */}
        {brands.map((brand) => {
          const brandItems = items.filter((item) => item.brand === brand);

          return (
            <div key={brand} className="mb-16">
              
              {/* 브랜드 타이틀 */}
              <h3 className="text-xl md:text-2xl font-bold mb-6 text-center">
                {brandLabels[brand]}
              </h3>

              {/* 이미지 그리드 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {brandItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    type="button"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    onClick={() => setSelectedImage(item)}
                    className="group relative overflow-hidden rounded-2xl border bg-background shadow-sm aspect-[4/3]"
                  >
                    <img
                      src={item.src}
                      alt={item.alt}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </motion.button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* 모달 */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"
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
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white"
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
