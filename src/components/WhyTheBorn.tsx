import { motion } from "framer-motion";

export default function WhyTheBorn({
  lang,
}: {
  lang: "ko" | "en";
}) {
  return (
    <section
      id="why-the-born"
      className="py-24 bg-[#18181B] text-zinc-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl">
              <img
                src="https://i.ibb.co/JWckcn22/Generated-Image-May-15-2026-5-35-PM.jpg"
                alt="WHY THE BORN"
                className="w-full h-[680px] object-cover object-center"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-sm font-bold tracking-[0.35em] text-orange-400 mb-5">
              WHY THE BORN
            </p>

            <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-8">
              {lang === "ko"
                ? "사람이 기억에 남는 브랜드"
                : "A Brand People Remember"}
            </h2>

            <div className="space-y-6 text-lg md:text-xl leading-relaxed text-zinc-300">
              {lang === "ko" ? (
                <>
                  <p>
                    더본의 브랜드는 단순히 음식을 판매하는 공간이
                    아닙니다.
                  </p>

                  <p>
                    사람들이 함께 웃고,
                    이야기하고,
                    따뜻한 한 끼를 나누는 공간을 만듭니다.
                  </p>

                  <p>
                    빠르고 활기찬 한국 외식 문화 속에서도
                    사람의 온기를 잃지 않는 브랜드.
                  </p>

                  <p>
                    그것이 더본이 추구하는 글로벌 외식 브랜드의
                    방향입니다.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    THE BORN brands are more than restaurants.
                  </p>

                  <p>
                    We create spaces where people gather,
                    share stories,
                    and enjoy warm meals together.
                  </p>

                  <p>
                    Even within the fast-paced energy of Korean dining culture,
                    we believe warmth and hospitality should always remain.
                  </p>

                  <p>
                    That is the direction THE BORN pursues
                    as a global restaurant brand.
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
