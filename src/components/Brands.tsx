import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

export default function Brands({ lang }: { lang: 'ko' | 'en' }) {
  const brands = [
    {
      name: lang === 'ko' ? "본가" : "BORNGA",
      logo: "https://i.ibb.co/6q7JGsB/image.png",
      imageUrl: "https://i.ibb.co/WWnFZmP8/bornga.jpg",
      videoUrl: "https://www.youtube.com/embed/L4JR9SuM8hQ",
      details: lang === 'ko' 
        ? [
            { label: "콘셉트", value: "정통 한식 프리미엄 BBQ 다이닝" },
            { label: "타깃 고객", value: "가족 단위 고객, 비즈니스 모임, 한국 문화를 체험하고자 하는 외국인" },
            { label: "운영 특징", value: "고품질 원육과 신선한 식재료를 바탕으로 단체 회식과 가족 모임까지 수용 가능한 프리미엄 운영 모델" },
            { label: "대표 메뉴", value: "우삼겹, 꽃살, 된장찌개, 돌솥비빔밥" },
            { label: "매장 규모", value: "100~200평 내외 / 150석 이상" }
          ]
        : [
            { label: "Concept", value: "Authentic Korean Premium BBQ Dining" },
            { label: "Target", value: "Families, Business Meetings, Foreigners experiencing Korean culture" },
            { label: "Operation", value: "Premium operation model accommodating large groups and family gatherings with high-quality meat and fresh ingredients" },
            { label: "Signature", value: "Woo-samgyeop, Flower Beef, Soybean Paste Stew, Stone Pot Bibimbap" },
            { label: "Scale", value: "100~200 Pyeong / 150+ Seats" }
          ]
    },
    {
      name: lang === 'ko' ? "새마을식당" : "SAEMAEUL",
      logo: "https://i.ibb.co/7tN67FZd/2.png",
      imageUrl: "https://i.ibb.co/YBZqkB46/saemaeul.jpg",
      videoUrl: "https://www.youtube.com/embed/80X0DF6MTKA",
      details: lang === 'ko'
        ? [
            { label: "콘셉트", value: "숯불 직화 BBQ 기반 한국식 캐주얼 다이닝" },
            { label: "타깃 고객", value: "직장인, 20~40대 고객층, 연인 등 가성비 한식 안주 수요 고객" },
            { label: "운영 특징", value: "점심에는 간편한 식사, 저녁에는 푸짐한 BBQ와 주류를 즐길 수 있으며 내점·포장·배달이 모두 가능한 유연한 운영 모델" },
            { label: "대표 메뉴", value: "열탄불고기, 7분돼지김치, 삼겹살/목살/돼지껍데기, 옛날도시락, 백밥(고기정식)" },
            { label: "매장 규모", value: "60평 이상의 100석 내외 중소형 매장 중심" }
          ]
        : [
            { label: "Concept", value: "Korean Casual Dining based on Charcoal BBQ" },
            { label: "Target", value: "Office workers, 20s-40s, Couples looking for cost-effective Korean food" },
            { label: "Operation", value: "Flexible model for lunch, dinner BBQ/drinks, dine-in, takeout, and delivery" },
            { label: "Signature", value: "Yeoltan Bulgogi, 7-minute Pork Kimchi, Pork Belly/Neck/Skin, Dosirak, Baek-bap" },
            { label: "Scale", value: "60+ Pyeong / 100 Seats" }
          ]
    },
    {
      name: lang === 'ko' ? "홍콩반점 0410" : "PAIK'S NOODLE",
      logo: "https://i.ibb.co/9927sbhv/png-01.png",
      imageUrl: "https://i.ibb.co/PGk7YdYZ/paiksnoodle.png",
      videoUrl: "https://www.youtube.com/embed/2OHtdE98h8I",
      details: lang === 'ko'
        ? [
            { label: "콘셉트", value: "합리적인 가격의 캐주얼 중식 전문 브랜드" },
            { label: "타깃 고객", value: "가족 단위 고객, 학생, 직장인 등 빠르고 부담 없는 식사를 선호하는 소비" },
            { label: "운영 특징", value: "소형 매장 중심 운영으로 배달·테이크아웃에 최적화된 효율적인 운영 구조" },
            { label: "대표 메뉴", value: "짜장면, 짬뽕, 탕수육" },
            { label: "매장 규모", value: "15~25평 내외 / 20석 미만" }
          ]
        : [
            { label: "Concept", value: "Reasonably priced Casual Chinese Brand" },
            { label: "Target", value: "Families, Students, Office workers seeking quick, affordable meals" },
            { label: "Operation", value: "Efficient structure optimized for small stores, delivery, and takeout" },
            { label: "Signature", value: "Jajangmyeon, Jjamppong, Tangsuyuk" },
            { label: "Scale", value: "15~25 Pyeong / <20 Seats" }
          ]
    }
  ];

  return (
    <section id="brands" className="py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center tracking-tight">{lang === 'ko' ? '브랜드 소개' : 'Our Brands'}</h2>
        <Accordion type="single" collapsible className="w-full">
          {brands.map((brand, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
       <AccordionTrigger className="text-xl font-bold tracking-tight">
  <div className="flex justify-center items-center w-full py-4">
    <img
      src={brand.logo}
      alt={`${brand.name} logo`}
     className={
  brand.name.includes("본가")
    ? "w-auto h-14 object-contain"
    : brand.name.includes("새마을식당")
    ? "w-auto h-12 object-contain"
    : "w-[200px] h-auto object-contain -mt-2"
}
    />
  </div>
</AccordionTrigger>
              <AccordionContent className="space-y-6 text-muted-foreground">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div className="aspect-video bg-muted rounded-xl overflow-hidden border">
                    <img src={brand.imageUrl} alt={brand.name} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="aspect-video rounded-xl overflow-hidden border">
                    <iframe
                      className="w-full h-full"
                      src={brand.videoUrl}
                      title={`${brand.name} video`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </motion.div>
               {brand.name.includes("본가") && (
  <div className="mt-6">
    <p className="text-sm text-gray-500 mb-3">대표 메뉴</p>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      
      {/* 메뉴 1 */}
      <div className="bg-muted/50 rounded-xl p-3 text-center">
        <img
          src="https://i.ibb.co/WWnFZmP8/bornga.jpg"
          className="w-full h-24 object-cover rounded-md mb-2"
        />
        <p className="font-semibold text-sm">우삼겹</p>
        <p className="text-sm font-bold">18,000원</p>
      </div>

      {/* 메뉴 2 */}
      <div className="bg-muted/50 rounded-xl p-3 text-center">
        <img
          src="https://i.ibb.co/WWnFZmP8/bornga.jpg"
          className="w-full h-24 object-cover rounded-md mb-2"
        />
        <p className="font-semibold text-sm">꽃살</p>
        <p className="text-sm font-bold">22,000원</p>
      </div>

      {/* 메뉴 3 */}
      <div className="bg-muted/50 rounded-xl p-3 text-center">
        <img
          src="https://i.ibb.co/WWnFZmP8/bornga.jpg"
          className="w-full h-24 object-cover rounded-md mb-2"
        />
        <p className="font-semibold text-sm">된장찌개</p>
        <p className="text-sm font-bold">9,000원</p>
      </div>

      {/* 메뉴 4 */}
      <div className="bg-muted/50 rounded-xl p-3 text-center">
        <img
          src="https://i.ibb.co/WWnFZmP8/bornga.jpg"
          className="w-full h-24 object-cover rounded-md mb-2"
        />
        <p className="font-semibold text-sm">돌솥비빔밥</p>
        <p className="text-sm font-bold">12,000원</p>
      </div>

    </div>
  </div>
)}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="space-y-3"
                >
                  {brand.details.map((detail, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <p>
                        <span className="font-semibold text-foreground">{detail.label}: </span>
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

