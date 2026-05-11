import { motion } from "framer-motion";

export default function SuccessStory({ lang }: { lang: "ko" | "en" }) {
  const stories = [
    {
      brand: lang === "ko" ? "본가" : "BORNGA",
      country: lang === "ko" ? "인도네시아" : "Indonesia",
      location: lang === "ko" ? "자카르타 플래그십" : "Jakarta Flagship",
      flag: "🇮🇩",
      mainImage:
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop",
      description:
        lang === "ko"
          ? "인도네시아 자카르타에서 성공적으로 운영 중인 프리미엄 한식 BBQ 다이닝 브랜드입니다. 현지의 높은 한식 다이닝 수요와 가족·단체 외식 문화가 결합되어, 본가는 현지 시장에서 프리미엄 Korean BBQ 브랜드로 자리 잡고 있습니다."
          : "Premium Korean BBQ dining brand successfully operating in Jakarta, Indonesia. Strong local demand for Korean dining culture and family-style gatherings has positioned BORNGA as a premium Korean BBQ destination in the local market.",
      points:
        lang === "ko"
          ? ["프리미엄 Korean BBQ 수요", "가족 외식 문화와의 높은 적합성", "저녁 중심의 안정적인 고객 유입"]
          : ["Premium Korean BBQ demand", "Family dining culture fit", "Strong dinner-focused traffic"],
      images: [
        "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=800&auto=format&fit=crop",
      ],
    },
    {
      brand: lang === "ko" ? "새마을식당" : "SAEMAEUL",
      country: lang === "ko" ? "태국" : "Thailand",
      location: lang === "ko" ? "방콕 매장" : "Bangkok Store",
      flag: "🇹🇭",
      mainImage:
        "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1200&auto=format&fit=crop",
      description:
        lang === "ko"
          ? "태국 방콕에서 성공적으로 운영 중인 한국식 캐주얼 다이닝 브랜드입니다. 새마을식당은 Korean BBQ, 캐주얼 다이닝, 늦은 시간까지 이어지는 소셜 다이닝 경험을 원하는 젊은 고객층에게 높은 반응을 얻고 있습니다."
          : "A Korean casual dining brand successfully operating in Bangkok, Thailand. SAEMAEUL has gained strong popularity among young customers seeking Korean BBQ, casual dining, and late-night social dining experiences.",
      points:
        lang === "ko"
          ? ["강한 야간 외식 수요", "캐주얼 한식 트렌드와의 적합성", "주류 페어링에 강한 메뉴 구성"]
          : ["Strong late-night dining demand", "Casual Korean dining trend", "Alcohol pairing friendly menu"],
      images: [
        "https://images.unsplash.com/photo-1529042410759-befb1204b468?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1514516345957-556ca7e814a4?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1567521464027-f127ff144326?q=80&w=800&auto=format&fit=crop",
      ],
    },
    {
      brand: lang === "ko" ? "홍콩반점" : "PAIK'S NOODLE",
      country: lang === "ko" ? "캄보디아" : "Cambodia",
      location: lang === "ko" ? "프놈펜 매장" : "Phnom Penh Store",
      flag: "🇰🇭",
      mainImage:
        "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1200&auto=format&fit=crop",
      description:
        lang === "ko"
          ? "캄보디아에서 성공적으로 운영 중인 한국식 중식 캐주얼 다이닝 브랜드입니다. 홍콩반점 0410은 합리적인 가격, 빠른 서비스, 일상 식사에 최적화된 메뉴 구조를 바탕으로 현지 고객의 꾸준한 수요를 이끌어내고 있습니다."
          : "A Korean-Chinese casual dining brand successfully operating in Cambodia. PAIK'S NOODLE continues to attract strong demand through affordable pricing, fast service, and a menu structure optimized for everyday dining.",
      points:
        lang === "ko"
          ? ["합리적인 일상 외식 수요", "빠르고 효율적인 운영 구조", "높은 현지 접근성"]
          : ["Affordable everyday dining", "Fast and efficient operation", "Strong local accessibility"],
      images: [
        "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1552611052-33e04de081de?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1565299507177-b0ac66763828?q=80&w=800&auto=format&fit=crop",
      ],
    },
  ];

  return (
    <section id="success-story" className="py-24 bg-muted/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-sm font-bold tracking-[0.3em] text-primary mb-3">
            SUCCESS STORY
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            {lang === "ko" ? "글로벌 성공 사례" : "Global Success Stories"}
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
                <div className="relative min-h-[280px] md:min-h-[420px] overflow-hidden">
                  <img
                    src={story.mainImage}
                    alt={`${story.brand} ${story.location}`}
                    className="w-full h-full object-cover absolute inset-0 transition-transform duration-700 hover:scale-105"
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

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 md:p-5 bg-muted/30">
                {story.images.map((image, imageIndex) => (
                  <div
                    key={`${story.brand}-${imageIndex}`}
                    className="aspect-[4/3] rounded-2xl overflow-hidden bg-muted border"
                  >
                    <img
                      src={image}
                      alt={`${story.brand} sub image ${imageIndex + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
