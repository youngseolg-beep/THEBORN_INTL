import { motion } from "framer-motion";
import { useState } from "react";
import { X } from "lucide-react";

export default function SuccessStory({ lang }: { lang: "ko" | "en" }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const stories = [
    {
      brand: lang === "ko" ? "본가" : "BORNGA",
      type:
        lang === "ko"
          ? "프리미엄 Korean BBQ 다이닝"
          : "Korean Premium BBQ Dining",
      mainCopy:
        lang === "ko"
          ? `뜨겁게 구워지는 고기,
함께 둘러앉은 테이블,
프리미엄 Korean BBQ가 만드는 따뜻한 식사 경험.

본가는 함께 굽고, 나누고, 즐기는 한국식 BBQ 문화를 담아냅니다.`
          : `Sizzling grills.
Shared tables.
Warm conversations over premium Korean BBQ.

BORNGA delivers a Korean dining experience built around gathering, grilling, and sharing together.`,
      mood:
        lang === "ko"
          ? "불맛 • 모임 • 프리미엄 BBQ • 따뜻한 분위기 • 한국식 외식 문화"
          : "Fire • Gathering • Premium BBQ • Warmth • Korean Dining Culture",
      memory:
        lang === "ko"
          ? "불판을 중심으로 사람들이 모이고, 함께 식사를 즐기는 프리미엄 Korean BBQ 경험."
          : "A premium Korean BBQ experience where people gather around the grill and share moments together.",
      mainImage: "https://i.ibb.co/7tdsSvvf/image.png",
      images: [
        "https://i.ibb.co/DP6jQFqP/1.png",
        "https://i.ibb.co/XxYqyXSR/2.png",
        "https://i.ibb.co/TBxs8hNQ/3.png",
        "https://i.ibb.co/whN5w6yQ/4.png",
        "https://i.ibb.co/xZTZsg4/5.png",
        "https://i.ibb.co/BHxNWNnb/6.png",
        "https://i.ibb.co/TxSHn9pf/7.png",
        "https://i.ibb.co/1Y7XXVdC/8.png",
        "https://i.ibb.co/3yhMmQ04/9.png",
        "https://i.ibb.co/Ld4gqLwf/10.png",
        "https://i.ibb.co/cKB5S1VQ/11.png",
        "https://i.ibb.co/LDVfKzDj/12.png",
      ],
    },
    {
      brand: lang === "ko" ? "새마을식당" : "SAEMAEULSIKDANG",
      type:
        lang === "ko"
          ? "한국식 캐주얼 BBQ & 소셜 다이닝"
          : "Korean Casual BBQ & Social Dining",
      mainCopy:
        lang === "ko"
          ? `늦은 밤까지 이어지는 활기,
연탄불 위의 불맛,
술잔과 웃음이 오가는 한국식 외식 문화.

새마을식당은 한국 특유의 활기 있는 소셜 다이닝 분위기를 담아냅니다.`
          : `Late-night energy.
Smoky grills.
Shared drinks and vibrant tables.

SAEMAEULSIKDANG captures the lively atmosphere of Korean social dining culture.`,
      mood:
        lang === "ko"
          ? "야간 외식 • 불맛 • 소셜 다이닝 • 활기 • 한국 길거리 감성"
          : "Late Night • Smoky BBQ • Social Dining • Energy • Korean Street Vibes",
      memory:
        lang === "ko"
          ? "불맛과 술잔, 늦은 밤의 활기가 어우러진 한국식 외식 경험."
          : "A lively Korean dining experience filled with smoky flavors, shared drinks, and late-night energy.",
      mainImage: "https://i.ibb.co/fd9Mt9hp/image.png",
      images: [
        "https://i.ibb.co/RTdh5TL5/1.png",
        "https://i.ibb.co/j96NCkDp/2.png",
        "https://i.ibb.co/HDT3K3rP/3.png",
        "https://i.ibb.co/VWvVqMBm/4.png",
        "https://i.ibb.co/DDc6CnWM/5.png",
        "https://i.ibb.co/hRYQX0NM/6.png",
        "https://i.ibb.co/8L33YQ23/7.png",
        "https://i.ibb.co/kgB22N81/8.png",
        "https://i.ibb.co/YF8n3gkX/9.png",
        "https://i.ibb.co/20zDL7ft/10.png",
      ],
    },
    {
      brand: lang === "ko" ? "홍콩반점" : "PAIK'S NOODLE",
      type:
        lang === "ko"
          ? "한국식 중화요리 브랜드"
          : "Korean Chinese Cuisine",
      mainCopy:
        lang === "ko"
          ? `강한 불맛,
빠르게 완성되는 한 그릇,
일상 속에서 즐기는 한국식 중화요리.

홍콩반점은 웍의 화력과 빠른 주방의 에너지를 그대로 담아냅니다.`
          : `Hot flames.
Bold wok flavors.
Fast and comforting meals made for everyday dining.

PAIK'S NOODLE brings the fast-paced energy of Korean-Chinese cuisine to the table.`,
      mood:
        lang === "ko"
          ? "웍 불맛 • 강한 풍미 • 든든한 한끼 • 빠른 식사 • 도심의 에너지"
          : "Wok Fire • Bold Flavor • Comfort Food • Fast Dining • Urban Energy",
      memory:
        lang === "ko"
          ? "강한 불맛과 빠른 주방의 에너지가 살아있는 한국식 중화요리 경험."
          : "A bold Korean-Chinese dining experience full of heat, flavor, and fast-moving kitchen energy.",
      mainImage: "https://i.ibb.co/pCrSgwK/3.png",
      images: [
        "https://i.ibb.co/qFWjvn29/1.png",
        "https://i.ibb.co/mVwsBcbz/2.png",
        "https://i.ibb.co/VWFdkmt0/3.png",
        "https://i.ibb.co/20W4qc0P/4.png",
        "https://i.ibb.co/60Phq48L/5.png",
        "https://i.ibb.co/KjhKFgSf/6.png",
        "https://i.ibb.co/ym8QpwPF/7.png",
        "https://i.ibb.co/wrr80Q4x/8.png",
        "https://i.ibb.co/3mQkSrGp/9.png",
        "https://i.ibb.co/N2GN6fqf/10.png",
        "https://i.ibb.co/DP5CnJyY/11.png",
        "https://i.ibb.co/1t9NxH9g/12.png",
      ],
    },
  ];

  return (
    <>
      <section id="success-story" className="py-20 md:py-28 bg-[#0F0F10] text-zinc-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 md:mb-20">
            <p className="text-xs md:text-sm font-bold tracking-[0.28em] md:tracking-[0.35em] text-orange-400 mb-4">
              BRAND EXPERIENCE
            </p>

            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              {lang === "ko"
                ? "한국 외식 브랜드의 에너지"
                : "The Energy of Korean Dining Brands"}
            </h2>

            <p className="mt-5 md:mt-6 text-zinc-400 max-w-3xl mx-auto leading-relaxed text-sm md:text-lg">
              {lang === "ko"
                ? "뜨거운 불맛, 활기 있는 테이블, 사람들의 웃음과 에너지. 더본코리아 브랜드가 만들어내는 한국 외식 문화의 현장감을 경험해보세요."
                : "Sizzling grills, vibrant tables, bold flavors, and the warmth of Korean dining culture. Experience the atmosphere and energy behind Theborn Korea brands."}
            </p>
          </div>

          <div className="space-y-24 md:space-y-32">
            {stories.map((story) => (
              <motion.article
                key={story.brand}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 items-center mb-8 md:mb-10">
                  <div
                    className="relative rounded-[1.5rem] md:rounded-[2rem] overflow-hidden cursor-pointer group order-1 lg:order-2"
                    onClick={() => setSelectedImage(story.mainImage)}
                  >
                    <img
                      src={story.mainImage}
                      alt={story.brand}
                      className="w-full h-[280px] md:h-[520px] object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                  </div>

                  <div className="order-2 lg:order-1">
                    <p className="text-orange-400 text-xs md:text-sm font-bold tracking-[0.22em] md:tracking-[0.25em] mb-3 md:mb-4">
                      BRAND EXPERIENCE
                    </p>

                    <h3 className="text-3xl md:text-5xl font-bold tracking-tight">
                      {story.brand}
                    </h3>

                    <p className="mt-3 md:mt-4 text-zinc-400 text-base md:text-lg font-medium">
                      {story.type}
                    </p>

                    <div className="mt-6 md:mt-8 whitespace-pre-line text-zinc-200 leading-relaxed md:leading-loose text-base md:text-lg">
                      {story.mainCopy}
                    </div>

                    <div className="mt-6 md:mt-8">
                      <p className="text-[11px] md:text-xs tracking-[0.25em] md:tracking-[0.3em] text-zinc-500 mb-3">
                        MOOD KEYWORDS
                      </p>

                      <p className="text-zinc-300 leading-relaxed text-sm md:text-base">
                        {story.mood}
                      </p>
                    </div>

                    <div className="mt-6 md:mt-8 border-l border-orange-400/50 pl-4 md:pl-5">
                      <p className="text-zinc-100 leading-relaxed text-base md:text-lg italic">
                        {story.memory}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                  {story.images.map((image, index) => (
                    <div
                      key={`${story.brand}-${index}`}
                      className="relative rounded-xl md:rounded-2xl overflow-hidden cursor-pointer group bg-[#18181B]"
                      onClick={() => setSelectedImage(image)}
                    >
                      <img
                        src={image}
                        alt={`${story.brand}-${index}`}
                        className="w-full h-[135px] sm:h-[170px] md:h-[220px] object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                      />

                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
                    </div>
                  ))}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {selectedImage && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-white"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-8 h-8" />
          </button>

          <img
            src={selectedImage}
            alt="expanded"
            className="max-w-full max-h-full object-contain rounded-2xl"
          />
        </div>
      )}
    </>
  );
}
