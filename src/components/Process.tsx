import {
  Mail,
  MapPin,
  FileText,
  ClipboardCheck,
  FileSignature,
  FileUp,
  Search,
  Handshake,
  TrendingUp,
  Download,
} from "lucide-react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Step = {
  title: string;
  desc: ReactNode;
  icon: React.ElementType;
};

type DownloadItem = {
  title: string;
  desc: string;
  href: string;
  fileName: string;
};

export default function Process({ lang }: { lang: "ko" | "en" }) {
  const steps: Step[] =
    lang === "ko"
      ? [
          { title: "STEP 01", desc: "사업신청서 접수", icon: Mail },
          { title: "STEP 02", desc: "수권 서류 제출", icon: ClipboardCheck },
          { title: "STEP 03", desc: "비대면 미팅", icon: FileSignature },
          { title: "STEP 04", desc: "사업성 검토", icon: FileUp },
          { title: "STEP 05", desc: "진행 여부 확정", icon: Search },
          { title: "STEP 06", desc: "NDA 체결", icon: Handshake },
          { title: "STEP 07", desc: "사업계획 수립", icon: FileText },
          { title: "STEP 08", desc: "가맹계약 체결", icon: TrendingUp },
          { title: "STEP 09", desc: "사업개시", icon: MapPin },
        ]
      : [
          { title: "STEP 01", desc: "Application", icon: Mail },
          { title: "STEP 02", desc: "Documents", icon: ClipboardCheck },
          { title: "STEP 03", desc: "Online Meeting", icon: FileSignature },
          { title: "STEP 04", desc: "Feasibility Review", icon: FileUp },
          { title: "STEP 05", desc: "Confirmation", icon: Search },
          { title: "STEP 06", desc: "NDA Signing", icon: Handshake },
          { title: "STEP 07", desc: "Business Planning", icon: FileText },
          { title: "STEP 08", desc: "Agreement", icon: TrendingUp },
          { title: "STEP 09", desc: "Launch", icon: MapPin },
        ];

  const downloadItems: DownloadItem[] =
    lang === "ko"
      ? [
          {
            title: "사업신청서",
            desc: "출점 검토를 위한 기본 신청 서류 다운로드",
            href: "/downloads/theborn-global-application.docx",
            fileName: "더본코리아 글로벌사업 신청서.docx",
          },
          {
            title: "브랜드 브로슈어",
            desc: "브랜드 소개 및 가맹 정보 브로슈어 다운로드",
            href: "/downloads/brand-brochure.pdf",
            fileName: "브랜드-브로슈어.pdf",
          },
        ]
      : [
          {
            title: "Application Form",
            desc: "Download the basic application document for franchise review",
            href: "/downloads/application-form.pdf",
            fileName: "Application-Form.pdf",
          },
          {
            title: "Brand Brochure",
            desc: "Download the brand introduction and franchise brochure",
            href: "/downloads/brand-brochure.pdf",
            fileName: "Brand-Brochure.pdf",
          },
        ];

  return (
    <section id="process" className="py-16 md:py-24 bg-[#0F0F10] text-zinc-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-4xl font-bold mb-10 md:mb-16 text-center tracking-tight">
          {lang === "ko" ? "출점 프로세스" : "Franchise Process"}
        </h2>

        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-8 justify-items-center">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.04 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center p-3 md:p-6 bg-[#18181B] rounded-2xl border border-white/10 shadow-sm w-full max-w-[200px]"
            >
              <step.icon className="h-7 w-7 md:h-12 md:w-12 text-orange-400 mb-2 md:mb-4" />
              <div className="text-[11px] md:text-sm font-bold text-orange-400 mb-1 md:mb-2">
                {step.title}
              </div>
              <p className="text-[11px] md:text-sm text-zinc-400 font-medium leading-snug">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          viewport={{ once: true }}
          className="mt-12 md:mt-16"
        >
          <div className="rounded-3xl border border-white/10 bg-[#18181B] shadow-sm p-5 md:p-8">
            <div className="text-center mb-6 md:mb-8">
              <h3 className="text-xl md:text-3xl font-bold tracking-tight">
                {lang === "ko" ? "자료 다운로드" : "Download Documents"}
              </h3>
              <p className="mt-2 text-xs md:text-base text-zinc-400">
                {lang === "ko"
                  ? "사업 진행에 필요한 주요 서류를 다운로드할 수 있습니다."
                  : "Download key documents required for the franchise process."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {downloadItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  download={item.fileName}
                  className="group rounded-2xl border border-white/10 bg-[#0F0F10] p-4 md:p-6 hover:shadow-lg hover:-translate-y-1 transition duration-200"
                >
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="shrink-0 rounded-2xl bg-[#18181B] border border-white/10 p-3 md:p-4">
                      <Download className="h-5 w-5 md:h-7 md:w-7 text-orange-400" />
                    </div>

                    <div className="flex-1">
                      <div className="text-base md:text-lg font-bold tracking-tight text-zinc-100">
                        {item.title}
                      </div>
                      <p className="mt-1.5 md:mt-2 text-xs md:text-sm text-zinc-400 leading-relaxed">
                        {item.desc}
                      </p>
                      <div className="mt-3 md:mt-4 inline-flex items-center text-xs md:text-sm font-semibold text-orange-400">
                        {lang === "ko" ? "다운로드" : "Download"}
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
