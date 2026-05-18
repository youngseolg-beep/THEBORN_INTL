import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useMotionTemplate,
  useInView,
} from "framer-motion";
import { useEffect, useRef } from "react";
import { Check } from "lucide-react";

function Counter({
  from,
  to,
  label,
}: {
  from: number;
  to: number;
  label: string;
}) {
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
    <div
      ref={ref}
      className="text-center p-4 md:p-6 bg-[#18181B] rounded-2xl border border-white/10 shadow-sm"
    >
      <motion.div className="text-3xl md:text-5xl font-bold text-orange-400 mb-1 md:mb-2">
        {display}
      </motion.div>
      <div className="text-xs md:text-base text-zinc-400 font-medium">
        {label}
      </div>
    </div>
  );
}

export default function OverseasStatus({ lang }: { lang: "ko" | "en" }) {
  const descriptions =
    lang === "ko"
      ? [
          "해외 13개국에서 약 160여 개 매장을 운영하며, 국가별 시장 특성에 맞춘 운영 전략을 적용하고 있습니다.",
          "미국, 중국, 일본은 현지 지사를 통해 직접 사업을 운영하며 밀착 관리하고 있습니다.",
          "그 외 국가는 현지 전문성을 갖춘 파트너와 Master Franchise(MF) 방식으로 사업을 전개합니다.",
        ]
      : [
          "THE BORN operates approximately 160 stores in 13 countries with strategies tailored to each local market.",
          "In the US, China, and Japan, we directly manage operations through local subsidiaries.",
          "In other markets, we expand through the Master Franchise (MF) model with trusted local partners.",
        ];

  return (
    <section id="status" className="py-16 md:py-24 bg-[#0F0F10] text-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-4xl font-bold mb-8 md:mb-12 text-center tracking-tight leading-tight">
          {lang === "ko"
            ? "대한민국을 대표하는 외식 프랜차이즈 그룹, 더본코리아"
            : "Korea's Leading Restaurant Franchise Group, THE BORN"}
        </h2>

        <div className="grid grid-cols-3 gap-3 md:gap-8 mb-10 md:mb-16">
          <Counter
            from={0}
            to={2000}
            label={lang === "ko" ? "국내외 매장" : "Total Stores"}
          />
          <Counter
            from={0}
            to={10}
            label={lang === "ko" ? "진출 국가" : "Countries"}
          />
          <Counter
            from={0}
            to={20}
            label={lang === "ko" ? "브랜드" : "Brands"}
          />
        </div>

        <div className="max-w-4xl mx-auto space-y-3 md:space-y-4 text-zinc-300 leading-relaxed mb-12 md:mb-16">
          {descriptions.map((desc, index) => (
            <div key={index} className="flex items-start gap-3">
              <Check className="h-5 w-5 md:h-6 md:w-6 text-orange-400 shrink-0 mt-0.5" />
              <p className="text-sm md:text-lg">{desc}</p>
            </div>
          ))}
        </div>

        <div className="max-w-5xl mx-auto">
          <h3 className="text-xl md:text-3xl font-bold tracking-tight text-center mb-5 md:mb-6">
            {lang === "ko" ? "출점 현황" : "Store Locations"}
          </h3>

          <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#18181B] shadow-sm">
            <iframe
              src="https://www.google.com/maps/d/embed?mid=1HdX8p5EDmdluDHb_1JD7a8DFu0a1bMg"
              width="100%"
              height="420"
              className="w-full md:h-[520px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={
                lang === "ko"
                  ? "더본코리아 출점 현황 지도"
                  : "THE BORN store location map"
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}
