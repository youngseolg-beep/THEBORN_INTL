import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

export default function Brands({ lang }: { lang: "ko" | "en" }) {
  const brands = [
    {
      name: lang === "ko" ? "본가" : "BORNGA",
      logo: "https://i.ibb.co/9mMFs0VW/image.png",
      imageUrl: "https://i.ibb.co/jkrTJ0xK/2.jpg",
      videoUrl: "https://www.youtube.com/embed/L4JR9SuM8hQ",
      details:
        lang === "ko"
          ? [
              { label: "콘셉트", value: "정통 한식 프리미엄 BBQ 다이닝" },
              { label: "타깃 고객", value: "가족 단위 고객, 비즈니스 모임, 한국 문화를 체험하고자 하는 외국인" },
              { label: "운영 특징", value: "고품질 원육과 신선한 식재료를 바탕으로 단체 회식과 가족 모임까지 수용 가능한 프리미엄 운영 모델" },
              { label: "대표 메뉴", value: "우삼겹, 꽃살, 된장찌개, 돌솥비빔밥" },
              { label: "매장 규모", value: "100~200평 내외 / 150석 이상" },
            ]
          : [
              { label: "Concept", value: "Authentic Korean Premium BBQ Dining" },
              { label: "Target", value: "Families, Business Meetings, Foreigners experiencing Korean culture" },
              { label: "Operation", value: "Premium operation model accommodating large groups and family gatherings with high-quality meat and fresh ingredients" },
              { label: "Signature", value: "Woosamgyeop, Kkotsal, Doenjang-jjigae, Dolsot Bibimbap" },
              { label: "Scale", value: "100~200 Pyeong / 150+ Seats" },
            ],
      menus:
        lang === "ko"
          ? [
              { name: "우삼겹", price: "12,000원", image: "https://i.ibb.co/KcF4B9pG/image.png" },
              { name: "꽃살", price: "28,000원", image: "https://i.ibb.co/FbpXtq1z/image.png" },
              { name: "된장찌개", price: "8,000원", image: "https://i.ibb.co/3mkqZtSy/image.png" },
              { name: "돌솥비빔밥", price: "9,000원", image: "https://i.ibb.co/Hfqgw9q5/image.png" },
            ]
          : [
              { name: "Woosamgyeop", price: "$8", image: "https://i.ibb.co/KcF4B9pG/image.png" },
              { name: "Kkotsal", price: "$20", image: "https://i.ibb.co/FbpXtq1z/image.png" },
              { name: "Doenjang-jjigae", price: "$6", image: "https://i.ibb.co/3mkqZtSy/image.png" },
              { name: "Dolsot Bibimbap", price: "$7", image: "https://i.ibb.co/Hfqgw9q5/image.png" },
            ],
    },
    {
      name: lang === "ko" ? "새마을식당" : "SAEMAEULSIKDANG",
      logo: "https://i.ibb.co/7tN67FZd/2.png",
      imageUrl: "https://i.ibb.co/xK5ybB0Y/image.jpg",
      videoUrl: "https://www.youtube.com/embed/80X0DF6MTKA",
      details:
        lang === "ko"
          ? [
              { label: "콘셉트", value: "숯불 직화 BBQ 기반 한국식 캐주얼 다이닝" },
              { label: "타깃 고객", value: "직장인, 20~40대 고객층, 연인 등 가성비 한식 안주 수요 고객" },
              { label: "운영 특징", value: "점심에는 간편한 식사, 저녁에는 푸짐한 BBQ와 주류를 즐길 수 있으며 내점·포장·배달이 모두 가능한 유연한 운영 모델" },
              { label: "대표 메뉴", value: "열탄불고기, 7분돼지김치, 삼겹살, 옛날도시락" },
              { label: "매장 규모", value: "60평 이상의 100석 내외 중소형 매장 중심" },
            ]
          : [
              { label: "Concept", value: "Korean Casual Dining based on Charcoal BBQ" },
              { label: "Target", value: "Office workers, 20s-40s, Couples looking for cost-effective Korean food" },
              { label: "Operation", value: "Flexible model for lunch, dinner BBQ/drinks, dine-in, takeout, and delivery" },
              { label: "Signature", value: "Yeoltan Bulgogi, 7-Minute Pork Kimchi Stew, Samgyeopsal, Yetnal Dosirak" },
              { label: "Scale", value: "60+ Pyeong / 100 Seats" },
            ],
      menus:
        lang === "ko"
          ? [
              { name: "열탄불고기", price: "10,900원", image: "https://i.ibb.co/RTWh1vm9/3777.png" },
              { name: "7분돼지김치", price: "8,000원", image: "https://i.ibb.co/WWWQ6LTy/ok-7-IMG-3890.jpg" },
              { name: "삼겹살", price: "15,000원", image: "https://i.ibb.co/hRd7WMTV/2136.png" },
              { name: "옛날도시락", price: "4,000원", image: "https://i.ibb.co/fdwL6Tz2/S.png" },
            ]
          : [
              { name: "Yeoltan Bulgogi", price: "$7", image: "https://i.ibb.co/RTWh1vm9/3777.png" },
              { name: "7-Minute Pork Kimchi Stew", price: "$6", image: "https://i.ibb.co/WWWQ6LTy/ok-7-IMG-3890.jpg" },
              { name: "Samgyeopsal", price: "$10", image: "https://i.ibb.co/hRd7WMTV/2136.png" },
              { name: "Yetnal Dosirak", price: "$3", image: "https://i.ibb.co/fdwL6Tz2/S.png" },
            ],
    },
    {
      name: lang === "ko" ? "홍콩반점 0410" : "PAIK'S NOODLE",
      logo: "https://i.ibb.co/9927sbhv/png-01.png",
      imageUrl: "https://i.ibb.co/j9Bqs6yK/2.jpg",
      videoUrl: "https://www.youtube.com/embed/2OHtdE98h8I",
      details:
        lang === "ko"
          ? [
              { label: "콘셉트", value: "합리적인 가격의 캐주얼 중식 전문 브랜드" },
              { label: "타깃 고객", value: "가족 단위 고객, 학생, 직장인 등 빠르고 부담 없는 식사를 선호하는 소비자" },
              { label: "운영 특징", value: "소형 매장 중심 운영으로 배달·테이크아웃에 최적화된 효율적인 운영 구조" },
              { label: "대표 메뉴", value: "짜장면, 짬뽕, 탕수육, 볶음밥" },
              { label: "매장 규모", value: "15~25평 내외 / 20석 미만" },
            ]
          : [
              { label: "Concept", value: "Reasonably priced Casual Chinese Brand" },
              { label: "Target", value: "Families, Students, Office workers seeking quick, affordable meals" },
              { label: "Operation", value: "Efficient structure optimized for small stores, delivery, and takeout" },
              { label: "Signature", value: "Jjajangmyeon, Jjamppong, Tangsuyuk, Fried Rice" },
              { label: "Scale", value: "15~25 Pyeong / <20 Seats" },
            ],
      menus:
        lang === "ko"
          ? [
              { name: "짜장면", price: "7,000원", image: "https://i.ibb.co/Dg64WRQC/ok-DSC09391.png" },
              { name: "짬뽕", price: "9,000원", image: "https://i.ibb.co/Y73jGrz9/7467.png" },
              { name: "탕수육", price: "16,800원", image: "https://i.ibb.co/4ZHPx2XT/7516.png" },
              { name: "볶음밥", price: "9,500원", image: "https://i.ibb.co/Mx7VbFfb/ok-DSC09337.png" },
            ]
          : [
              { name: "Jjajangmyeon", price: "$5", image: "https://i.ibb.co/Dg64WRQC/ok-DSC09391.png" },
              { name: "Jjamppong", price: "$7", image: "https://i.ibb.co/Y73jGrz9/7467.png" },
              { name: "Tangsuyuk", price: "$11", image: "https://i.ibb.co/4ZHPx2XT/7516.png" },
              { name: "Fried Rice", price: "$5", image: "https://i.ibb.co/Mx7VbFfb/ok-DSC09337.png" },
            ],
    },
  ];

  return (
    <section id="brands" className="py-24 bg-[#0F0F10] text-zinc-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center tracking-tight">
          {lang === "ko" ? "브랜드 소개" : "Our Brands"}
        </h2>

        <Accordion type="single" collapsible className="w-full">
          {brands.map((brand, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-white/10">
              <AccordionTrigger className="text-xl font-bold tracking-tight text-zinc-100 hover:text-orange-400">
                <div className="flex justify-center items-center w-full py-4">
                  <img
                    src={brand.logo}
                    alt={`${brand.name} logo`}
                  className={
  index === 0
    ? "w-[320px] md:w-[420px] h-auto object-contain brightness-125 contrast-125"
    : index === 1
    ? "w-auto h-16 md:h-20 object-contain"
    : "w-[220px] md:w-[260px] h-auto object-contain -mt-2"
}
                  />
                </div>
              </AccordionTrigger>

              <AccordionContent className="space-y-6 text-zinc-300">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div className="aspect-video bg-[#18181B] rounded-xl overflow-hidden border border-white/10">
                    <img src={brand.imageUrl} alt={brand.name} className="w-full h-full object-cover object-center" />
                  </div>

                  <div className="aspect-video rounded-xl overflow-hidden border border-white/10 bg-[#18181B]">
                    <iframe
                      className="w-full h-full"
                      src={brand.videoUrl}
                      title={`${brand.name} video`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </motion.div>

                <div className="mt-6">
                  <p className="mb-3 text-orange-400 font-semibold tracking-wide text-sm md:text-2xl">
                    {lang === "ko" ? "대표 메뉴" : "SIGNATURE MENU"}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {brand.menus.map((menu, menuIndex) => (
                      <div
                        key={menuIndex}
                        className="bg-[#18181B] rounded-xl p-3 text-center border border-white/10 transition transform hover:-translate-y-1 hover:shadow-lg duration-200"
                      >
                        <img src={menu.image} alt={menu.name} className="w-full h-24 object-contain rounded-md mb-2 bg-white" />
                        <p className="font-semibold text-sm min-h-[40px] flex items-center justify-center text-zinc-100">
                          {menu.name}
                        </p>
                        <p className="text-sm font-bold text-orange-400">{menu.price}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="space-y-3"
                >
                  {brand.details.map((detail, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-orange-400 shrink-0 mt-0.5" />
                      <p>
                        <span className="font-semibold text-zinc-100">{detail.label}: </span>
                        {detail.value}
                      </p>
                    </div>
                  ))}
                </motion.div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
