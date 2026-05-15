import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar({
  lang,
  setLang,
}: {
  lang: "ko" | "en";
  setLang: (l: "ko" | "en") => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleLang = () => setLang(lang === "ko" ? "en" : "ko");

  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0F0F10]/85 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <a href="/" className="flex items-center">
          <img
            src="https://i.ibb.co/LzT04R9k/2025-CI-Basic-02.png"
            alt="더본코리아 로고"
            className="h-14 md:h-20 w-auto"
          />
        </a>

        <div className="hidden md:flex items-center gap-7 font-medium text-zinc-200">
          <a href="#status" className="hover:text-orange-400 transition-colors">
            {lang === "ko" ? "해외 가맹현황" : "Overseas Status"}
          </a>
          <a href="#brands" className="hover:text-orange-400 transition-colors">
            {lang === "ko" ? "브랜드 소개" : "Brands"}
          </a>
          <a href="#success-story" className="hover:text-orange-400 transition-colors">
            {lang === "ko" ? "브랜드 경험" : "BRAND EXPERIENCE"}
          </a>
          <a href="#brand-gallery" className="hover:text-orange-400 transition-colors">
            {lang === "ko" ? "브랜드 이미지" : "Brand Gallery"}
          </a>
          <a href="#process" className="hover:text-orange-400 transition-colors">
            {lang === "ko" ? "출점 프로세스" : "Process"}
          </a>
          <a href="#contact" className="hover:text-orange-400 transition-colors">
            {lang === "ko" ? "문의" : "Contact"}
          </a>
          <button
            onClick={toggleLang}
            className="text-sm font-bold text-orange-400 border border-orange-400/70 px-3 py-1 rounded-full hover:bg-orange-400 hover:text-black transition-colors"
          >
            {lang === "ko" ? "ENGLISH" : "KOREAN"}
          </button>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-zinc-100 hover:bg-white/10 transition-colors"
          aria-label="Toggle mobile menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0F0F10]/95 backdrop-blur-md">
          <div className="px-4 py-4 flex flex-col gap-4 text-base font-medium text-zinc-200">
            <a href="#status" onClick={closeMobileMenu} className="hover:text-orange-400 transition-colors">
              {lang === "ko" ? "해외 가맹현황" : "Overseas Status"}
            </a>
            <a href="#brands" onClick={closeMobileMenu} className="hover:text-orange-400 transition-colors">
              {lang === "ko" ? "브랜드 소개" : "Brands"}
            </a>
            <a href="#success-story" onClick={closeMobileMenu} className="hover:text-orange-400 transition-colors">
              {lang === "ko" ? "브랜드 경험" : "BRAND EXPERIENCE"}
            </a>
            <a href="#brand-gallery" onClick={closeMobileMenu} className="hover:text-orange-400 transition-colors">
              {lang === "ko" ? "브랜드 이미지" : "Brand Gallery"}
            </a>
            <a href="#process" onClick={closeMobileMenu} className="hover:text-orange-400 transition-colors">
              {lang === "ko" ? "출점 프로세스" : "Process"}
            </a>
            <a href="#contact" onClick={closeMobileMenu} className="hover:text-orange-400 transition-colors">
              {lang === "ko" ? "문의" : "Contact"}
            </a>
            <button
              onClick={() => {
                toggleLang();
                closeMobileMenu();
              }}
              className="w-fit text-sm font-bold text-orange-400 border border-orange-400/70 px-3 py-2 rounded-full hover:bg-orange-400 hover:text-black transition-colors"
            >
              {lang === "ko" ? "ENGLISH" : "KOREAN"}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
