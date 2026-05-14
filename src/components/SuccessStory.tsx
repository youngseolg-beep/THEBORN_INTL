import { motion } from "framer-motion";
import { useState } from "react";
import { X } from "lucide-react";

export default function SuccessStory({ lang }: { lang: "ko" | "en" }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const stories = [
    {
      brand: lang === "ko" ? "본가" : "BORNGA",
      country: lang === "ko" ? "호주" : "Australia",
      location: lang === "ko" ? "시드니 매장" : "Sydney Store",
      flag: "🇦🇺",
      mainImage: "https://i.ibb.co/7tdsSvvf/image.png",
      description:
        lang === "ko"
          ? "호주 시드니에서 성공적으로 운영 중인 프리미엄 한식 BBQ 다이닝 브랜드입니다. 현지의 높은 Korean BBQ 수요와 가족·단체 외식 문화가 결합되어, 본가는 글로벌 시장에서도 프리미엄 한식 다이닝 브랜드로 자리 잡고 있습니다."
          : "Premium Korean BBQ dining brand successfully operating in Sydney, Australia. Strong local demand for Korean BBQ culture and family-style gatherings has positioned BORNGA as a premium Korean dining destination in the global market.",
      points:
        lang === "ko"
          ? [
              "프리미엄 Korean BBQ 수요",
              "가족·단체 외식 문화와의 높은 적합성",
              "저녁 중심의 안정적인 고객 유입",
            ]
          : [
              "Premium Korean BBQ demand",
              "Family & group dining culture fit",
              "Strong dinner-focused traffic",
            ],
      images: [
        "https://i.ibb.co/qF5WpcqW/2.png",
        "https://i.ibb.co/Ng8FMTr2/4.png",
        "https://i.ibb.co/HfzrdDjF/3.png",
      ],
    },
    {
      brand: lang === "ko" ? "새마을식당" : "SAEMAEUL",
      country: lang === "ko" ? "태국" : "Thailand",
      location:
        lang === "ko"
          ? "새마을식당 메가 방나점"
          : "SAEMAEUL Mega bangna",
      flag: "🇹🇭",
      mainImage: "https://i.ibb.co/fd9Mt9hp/image.png",
      description:
        lang === "ko"
          ? "태국 방콕에서 성공적으로 운영 중인 한국식 캐주얼 다이닝 브랜드입니다. 새마을식당은 Korean BBQ, 캐주얼 다이닝, 늦은 시간까지 이어지는 소셜 다이닝 경험을 원하는 젊은 고객층에게 높은 반응을 얻고 있습니다."
          : "A Korean casual dining brand successfully operating in Bangkok, Thailand. SAEMAEUL has gained strong popularity among young customers seeking Korean BBQ, casual dining, and late-night social dining experiences.",
      points:
        lang === "ko"
          ? [
              "강한 야간 외식 수요",
              "캐주얼 한식 트렌드와의 적합성",
              "주류 페어링에 강한 메뉴 구성",
            ]
          : [
              "Strong late-night dining demand",
              "Casual Korean dining trend",
              "Alcohol pairing friendly menu",
            ],
      images: [
        "https://i.ibb.co/DPbNsQYB/646842642-1329227085921089-8121237019140067164-n.jpg",
        "https://i.ibb.co/Mx8f498Y/573050647-1227771012733364-1291417205488963522-n.jpg",
        "https://i.ibb.co/zT9h7xWj/557814221-1203147295195736-8563570105913234358-n.jpg",
      ],
    },
    {
      brand: lang === "ko" ? "홍콩반점" : "PAIK'S NOODLE",
      country: lang === "ko" ? "싱가포르" : "Singapore",
      location: lang === "ko" ? "싱가포르 매장" : "Singapore Store",
      flag: "🇸🇬",
      mainImage: "https://i.ibb.co/pCrSgwK/3.png",
      description:
        lang === "ko"
          ? "싱가포르에서 성공적으로 운영 중인 한국식 중식 캐주얼 다이닝 브랜드입니다. 홍콩반점은 합리적인 가격, 빠른 서비스, 일상 식사에 최적화된 메뉴 구조를 바탕으로 도심 상권에서 꾸준한 수요를 이끌어내고 있습니다."
          : "A Korean-Chinese casual dining brand successfully operating in Singapore. PAIK'S NOODLE continues to attract strong demand through affordable pricing, fast service, and a menu structure optimized for everyday urban dining.",
      points:
        lang === "ko"
          ? [
              "합리적인 일상 외식 수요",
              "빠르고 효율적인 운영 구조",
              "도심 상권에 적합한 높은 접근성",
            ]
          : [
              "Affordable everyday dining",
              "Fast and efficient operation",
              "Strong urban accessibility",
            ],
      images: [
        "https://i.ibb.co/gFZM9dp9/4.png",
        "https://i.ibb.co/PGZ9QddS/image.jpg",
        "https://i.ibb.co/fzhzgh3R/2.jpg",
      ],
    },
  ];

  return (
    <>
      <section id="success-story" className="py-24 bg-muted/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-bold tracking-[0.3em] text-primary mb-3">
              SUCCESS STORY
            </p>

            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              {lang === "ko"
                ? "글로벌 성공 사례"
                : "Global Success Stories"}
            </h2>

            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {lang === "ko"
                ? "해외 시장에서 실제 운영 중인 더본코리아 브랜드의 대표 사례를 소개합니다."
                : "Discover representative success cases of Theborn Korea brands operating in global markets."}
            </p>
          </div>

          <div className="space-y-16">
            {stories.map((story) => (
              <motion.article
                key={story.brand}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-background rounded-[2rem] overflow-hidden border shadow-sm"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div
                    className="relative min-h-[280px] md:min-h-[420px] overflow-hidden cursor-pointer"
                    onClick={() => setSelectedImage(story.mainImage)}
                  >
                    <img
                      src={story.mainImage}
                      alt={`${story.brand} ${story.location}`}
                      className="w-full h-full object-cover object-center absolute inset-0 transition-transform duration-700 hover:scale-105"
                    />
                  </div>

                  <div className="p-6 md:p-10 flex flex-col justify-center">
                    <div className="mb-5">
                      <p className="text-sm font-bold text-primary tracking-wide mb-2">
                        {story.flag} {story.country}
                      </p>

                      <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                        {story.brand}
                      </h3>

                      <p className="mt-1 text-lg font-semibold text-muted-foreground">
                        {story.location}
                      </p>
                    </div>

                    <p className="text-muted-foreground leading-relaxed">
                      {story.description}
                    </p>

                    <div className="mt-7">
                      <p className="text-sm font-bold tracking-[0.2em] text-foreground mb-3">
                        WHY IT WORKS
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {story.points.map((point) => (
                          <span
                            key={point}
                            className="rounded-full border bg-muted/50 px-4 py-2 text-sm font-semibold text-foreground"
                          >
                            {point}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 md:p-5 bg-muted/30">
                  {story.images.map((image, imageIndex) => (
                    <div
                      key={`${story.brand}-${imageIndex}`}
                      className="aspect-[4/3] rounded-2xl overflow-hidden bg-muted border cursor-pointer"
                      onClick={() => setSelectedImage(image)}
                    >
                      <img
                        src={image}
                        alt={`${story.brand} sub image ${imageIndex + 1}`}
                        className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
                      />
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
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-5 right-5 text-white"
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
