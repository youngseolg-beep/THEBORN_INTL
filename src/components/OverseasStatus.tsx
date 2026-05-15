import { motion, useMotionValue, useTransform, animate, useMotionTemplate, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import { Check } from "lucide-react";

function Counter({ from, to, label }: { from: number; to: number; label: string }) {
  const count = useMotionValue(from);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const display = useMotionTemplate`${rounded}+`;
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, to, { duration: 2, ease: "easeOut" });
      return controls.stop;
    }
  }, [isInView, count, to]);

  return (
    <div ref={ref} className="text-center p-6 bg-[#18181B] rounded-2xl border border-white/10 shadow-sm">
      <motion.div className="text-4xl md:text-5xl font-bold text-orange-400 mb-2">
        {display}
      </motion.div>
      <div className="text-sm md:text-base text-zinc-400 font-medium">{label}</div>
    </div>
  );
}

export default function OverseasStatus({ lang }: { lang: "ko" | "en" }) {
  const descriptions =
    lang === "ko"
      ? [
          "더본코리아는 해외 13개국에서 약 160여 개 매장을 운영하며, 각 국가의 시장 규모와 특성에 맞춘 차별화된 운영 전략을 적용하고 있습니다.",
          "미국, 중국, 일본은 현지 지사(더본 아메리카, 더본 차이나, 더본 재팬)를 설립하여 직접 사업을 운영하며 밀착 관리하고 있습니다.",
          "그 외 국가의 해외 가맹 사업은 현지 전문성을 갖춘 파트너와의 협업을 중시하여 Master Franchise(MF) 방식으로 전개하고 있습니다.",
        ]
      : [
          "THE BORN operates approximately 160 stores in 13 countries, applying differentiated operation strategies tailored to each country's market size and characteristics.",
          "We have established local subsidiaries in the US, China, and Japan (THE BORN America, THE BORN China, THE BORN Japan) to directly manage and support our operations.",
          "For other countries, we prioritize collaboration with local partners with expertise to expand our business through the Master Franchise (MF) model.",
        ];

  return (
    <section id="status" className="py-24 bg-[#0F0F10] text-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center tracking-tight">
          {lang === "ko"
            ? "대한민국을 대표하는 외식 프랜차이즈 그룹, 더본코리아"
            : "Korea's Leading Restaurant Franchise Group, THE BORN"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Counter from={0} to={2000} label={lang === "ko" ? "국내외 매장 갯수" : "Total Stores"} />
          <Counter from={0} to={10} label={lang === "ko" ? "해외 진출 국가" : "Countries"} />
          <Counter from={0} to={20} label={lang === "ko" ? "진출 브랜드 갯수" : "Brands"} />
        </div>

        <div className="max-w-4xl mx-auto space-y-4 text-zinc-300 leading-relaxed mb-16">
          {descriptions.map((desc, index) => (
            <div key={index} className="flex items-start gap-3">
              <Check className="h-6 w-6 text-orange-400 shrink-0 mt-0.5" />
              <p className="text-lg">{desc}</p>
            </div>
          ))}
        </div>

        <div className="max-w-5xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-center mb-6">
            {lang === "ko" ? "출점 현황" : "Store Locations"}
          </h3>

          <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#18181B] shadow-sm">
            <iframe
              src="https://www.google.com/maps/d/embed?mid=1HdX8p5EDmdluDHb_1JD7a8DFu0a1bMg"
              width="100%"
              height="520"
              className="w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={lang === "ko" ? "더본코리아 출점 현황 지도" : "THE BORN store location map"}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
