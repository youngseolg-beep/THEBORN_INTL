import { motion } from "framer-motion";

export default function Contact({ lang }: { lang: "ko" | "en" }) {
  const contacts = [
    { title: lang === "ko" ? "마스터프랜차이즈 문의" : "Master Franchise Inquiry", email: "international@theborn.co.kr" },
    { title: lang === "ko" ? "미국 가맹문의" : "USA Franchise Inquiry", email: "kevin.kim@theborn.co.kr" },
    { title: lang === "ko" ? "중국 가맹문의" : "China Franchise Inquiry", email: "ihsuh@theborn.cn" },
    { title: lang === "ko" ? "일본 가맹문의" : "Japan Franchise Inquiry", email: "theborn.japan@theborn.co.kr" },
  ];

  return (
    <section id="contact" className="py-16 md:py-24 bg-[#0F0F10] text-zinc-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl md:text-4xl font-bold mb-8 md:mb-12 tracking-tight">
          {lang === "ko" ? "문의" : "Contact"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {contacts.map((contact, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
              viewport={{ once: true }}
              className="bg-[#18181B] p-5 md:p-6 rounded-2xl border border-white/10 shadow-sm"
            >
              <h3 className="text-base md:text-lg font-semibold text-zinc-100 mb-2">
                {contact.title}
              </h3>

              <a
                href={`mailto:${contact.email}`}
                className="text-orange-400 hover:underline font-medium text-sm md:text-lg break-all"
              >
                {contact.email}
              </a>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-8 md:mt-10 bg-[#18181B] border border-white/10 rounded-2xl shadow-sm px-5 md:px-6 py-5"
        >
          <p className="text-sm md:text-lg font-semibold text-zinc-100 leading-relaxed text-center">
            {lang === "ko" ? (
              <>
                미국, 중국, 일본 외 모든 가맹 문의는
                <br />
                <a
                  href="mailto:international@theborn.co.kr"
                  className="text-orange-400 underline underline-offset-4 font-bold break-all"
                >
                  international@theborn.co.kr
                </a>
                로 문의 주시기 바랍니다.
              </>
            ) : (
              <>
                For franchise inquiries outside of USA, China, and Japan,
                <br />
                please contact{" "}
                <a
                  href="mailto:international@theborn.co.kr"
                  className="text-orange-400 underline underline-offset-4 font-bold break-all"
                >
                  international@theborn.co.kr
                </a>
                .
              </>
            )}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
