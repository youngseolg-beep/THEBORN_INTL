import { motion } from "motion/react";

export default function Hero({ lang }: { lang: 'ko' | 'en' }) {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://i.ibb.co/pjSPPScQ/2601-theborn-CEO-Paik-Jong-Won-Cooking-000028.jpg"
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>
      
      <div className="relative z-10 text-center px-4">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-lg md:text-2xl text-white/90 mb-4"
        >
          {lang === 'ko' ? '대한민국을 대표하는 외식 프랜차이즈 그룹' : 'Korea\'s Leading Restaurant Franchise Group'}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-6xl md:text-8xl font-extrabold tracking-tighter text-white mb-6"
        >
          {lang === 'ko' ? '더본코리아' : 'THE BORN'}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed px-4"
        >
          {lang === 'ko' 
            ? '더본코리아는 1993년 백종원 대표가 창립한 이후 30년 이상의 외식 운영 노하우를 축적한 글로벌 외식 기업입니다.'
            : 'THE BORN is a global restaurant company that has accumulated over 30 years of restaurant operation know-how since its founding by CEO Paik Jong-won in 1993.'
          }
        </motion.p>
      </div>
    </section>
  );
}
