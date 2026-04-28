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
          {
            title: "STEP 02",
            desc: "적격성 평가를 위한 수권 서류 제출",
            icon: ClipboardCheck,
          },
          {
            title: "STEP 03",
            desc: (
              <>
                사업 관련 비대면 미팅
                <br />
                (화상미팅)
              </>
            ),
            icon: FileSignature,
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
            icon: MapPin,
          },
        ]
      : [
          { title: "STEP 01", desc: "Application Submission", icon: Mail },
          {
            title: "STEP 02",
            desc: "Submission of Authorization Documents",
            icon: ClipboardCheck,
          },
          { title: "STEP 03", desc: "Non-face-to-face Meeting", icon: FileSignature },
          { title: "STEP 04", desc: "Feasibility Study & Evaluation", icon: FileUp },
          { title: "STEP 05", desc: "Confirmation of Franchise Business", icon: Search },
          { title: "STEP 06", desc: "NDA Signing", icon: Handshake },
          { title: "STEP 07", desc: "Business Info Sharing & Planning", icon: FileText },
          { title: "STEP 08", desc: "Franchise Agreement Signing", icon: TrendingUp },
          {
            title: "STEP 09",
            desc: "Business Launch (Market Research/Training/Opening)",
            icon: MapPin,
          },
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
    <section id="process" className="py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center tracking-tight">
          {lang === "ko" ? "출점 프로세스" : "Franchise Process"}
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="rounded-3xl border bg-background shadow-sm p-6 md:p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
                {lang === "ko" ? "자료 다운로드" : "Download Documents"}
              </h3>
              <p className="mt-2 text-sm md:text-base text-muted-foreground">
                {lang === "ko"
                  ? "사업 진행에 필요한 주요 서류를 아래에서 다운로드할 수 있습니다."
                  : "You can download the key documents required for the franchise process below."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {downloadItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  download={item.fileName}
                  className="group rounded-2xl border bg-muted/30 p-6 hover:shadow-lg hover:-translate-y-1 transition duration-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 rounded-2xl bg-background border p-4">
                      <Download className="h-7 w-7 text-primary" />
                    </div>

                    <div className="flex-1">
                      <div className="text-lg font-bold tracking-tight">{item.title}</div>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                        {item.desc}
                      </p>
                      <div className="mt-4 inline-flex items-center text-sm font-semibold text-primary">
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

