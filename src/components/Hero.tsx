import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function Hero({ lang }: { lang: "ko" | "en" }) {
  const backgrounds = [
    "https://i.ibb.co/pjSPPScQ/2601-theborn-CEO-Paik-Jong-Won-Cooking-000028.jpg",
    "https://i.ibb.co/WWnFZmP8/bornga.jpg",
    "https://i.ibb.co/YBZqkB46/saemaeul.jpg",
    "https://i.ibb.co/PGk7YdYZ/paiksnoodle.png",
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % backgrounds.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [backgrounds.length]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0F0F10]">
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={backgrounds[current]}
            src={backgrounds[current]}
            alt="Hero background"
            className="absolute inset-0 w-full h-full object-cover object-center"
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -80 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
          />
        </AnimatePresence>

        <div className="absolute inset-0 bg-black/70 md:bg-black/65" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-[#0F0F10]" />
      </div>

      <div className="relative z-10 text-center px-5 pt-10">
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-sm md:text-2xl text-zinc-200 mb-3 md:mb-4 tracking-wide"
        >
          {lang === "ko"
            ? "대한민국 대표 외식 프랜차이즈 그룹"
            : "Korea's Leading Restaurant Franchise Group"}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-5xl md:text-8xl font-extrabold tracking-tighter text-white mb-5 md:mb-6"
        >
          {lang === "ko" ? "더본코리아" : "THE BORN"}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-sm md:text-xl text-zinc-300 max-w-3xl mx-auto leading-relaxed px-2 md:px-4"
        >
          {lang === "ko"
            ? "30년 이상의 외식 운영 노하우를 바탕으로 한국 외식 브랜드의 에너지를 세계 시장에 전합니다."
            : "Bringing the energy of Korean dining brands to global markets, built on over 30 years of restaurant operation know-how."}
        </motion.p>
      </div>
    </section>
  );
}
