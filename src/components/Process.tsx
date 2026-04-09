import { Mail, MapPin, FileText, ClipboardCheck, FileSignature, FileUp, Search, Handshake, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Step = {
  title: string;
  desc: ReactNode;
  icon: React.ElementType;
};

export default function Process({ lang }: { lang: 'ko' | 'en' }) {
  const steps: Step[] = lang === 'ko'
    ? [
        { title: "STEP 01", desc: "사업신청서 접수", icon: Mail },
        { title: "STEP 02", desc: "적격성 평가를 위한 수권 서류 제출", icon: ClipboardCheck },
        {
          title: "STEP 03",
          desc: (
            <>
              사업 관련 비대면 미팅
              <br />
              (화상미팅)
            </>
          ),
          icon: FileSignature
        },
        { title: "STEP 04", desc: "사업성 검토 및 적격성 평가 진행", icon: FileUp },
        { title: "STEP 05", desc: "가맹사업 진행 여부 확정", icon: Search },
        { title: "STEP 06", desc: "비밀유지 협약서(NDA) 체결", icon: Handshake },
        { title: "STEP 07", desc: "사업정보 공유 및 사업계획 수립", icon: FileText },
        { title: "STEP 08", desc: "가맹계약서 체결", icon: TrendingUp },
        {
          title: "STEP 09",
          desc: (
            <>
              사업개시
              <br />
              (시장조사/교육/오픈 등)
            </>
          ),
          icon: MapPin
        },
      ]
    : [
        { title: "STEP 01", desc: "Application Submission", icon: Mail },
        { title: "STEP 02", desc: "Submission of Authorization Documents", icon: ClipboardCheck },
        { title: "STEP 03", desc: "Non-face-to-face Meeting", icon: FileSignature },
        { title: "STEP 04", desc: "Feasibility Study & Evaluation", icon: FileUp },
        { title: "STEP 05", desc: "Confirmation of Franchise Business", icon: Search },
        { title: "STEP 06", desc: "NDA Signing", icon: Handshake },
        { title: "STEP 07", desc: "Business Info Sharing & Planning", icon: FileText },
        { title: "STEP 08", desc: "Franchise Agreement Signing", icon: TrendingUp },
        { title: "STEP 09", desc: "Business Launch (Market Research/Training/Opening)", icon: MapPin },
      ];

  return (
    <section id="process" className="py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center tracking-tight">
          {lang === 'ko' ? '출점 프로세스' : 'Franchise Process'}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 justify-items-center">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center p-6 bg-background rounded-2xl border shadow-sm w-full max-w-[200px]"
            >
              <step.icon className="h-12 w-12 text-primary mb-4" />
              <div className="text-sm font-bold text-primary mb-2">{step.title}</div>
              <p className="text-sm text-muted-foreground font-medium">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
