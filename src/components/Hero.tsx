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
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={backgrounds[current]}
            src={backgrounds[current]}
            alt="Hero background"
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
          />
        </AnimatePresence>

        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="relative z-10 text-center px-4">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-lg md:text-2xl text-white/90 mb-4"
        >
          {lang === "ko"
            ? "대한민국을 대표하는 외식 프랜차이즈 그룹"
            : "Korea's Leading Restaurant Franchise Group"}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-6xl md:text-8xl font-extrabold tracking-tighter text-white mb-6"
        >
          {lang === "ko" ? "더본코리아" : "THE BORN"}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed px-4"
        >
          {lang === "ko"
            ? "더본코리아는 1993년 백종원 대표가 창립한 이후 30년 이상의 외식 운영 노하우를 축적한 글로벌 외식 기업입니다."
            : "THE BORN is a global restaurant company that has accumulated over 30 years of restaurant operation know-how since its founding by CEO Paik Jong-won in 1993."}
        </motion.p>
      </div>
    </section>
  );
}
