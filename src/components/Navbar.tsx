import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Navbar({ lang, setLang }: { lang: 'ko' | 'en', setLang: (l: 'ko' | 'en') => void }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <a href="/" className="flex items-center">
          <img
            src="https://i.ibb.co/LzT04R9k/2025-CI-Basic-02.png"
            alt="더본코리아 로고"
            className="h-20"
          />
        </a>

        <div className="hidden md:flex items-center gap-8 font-medium text-foreground">
          <a href="#status" className="hover:text-primary transition-colors">
            {lang === 'ko' ? '해외 가맹현황' : 'Overseas Status'}
          </a>
          <a href="#brands" className="hover:text-primary transition-colors">
            {lang === 'ko' ? '브랜드 소개' : 'Brands'}
          </a>
          <a href="#brand-gallery" className="hover:text-primary transition-colors">
            {lang === 'ko' ? '브랜드 이미지' : 'Brand Gallery'}
          </a>
          <a href="#process" className="hover:text-primary transition-colors">
            {lang === 'ko' ? '출점 프로세스' : 'Process'}
          </a>
          <a href="#contact" className="hover:text-primary transition-colors">
            {lang === 'ko' ? '문의' : 'Contact'}
          </a>
          <button
            onClick={() => setLang(lang === 'ko' ? 'en' : 'ko')}
            className="text-sm font-bold text-primary border border-primary px-3 py-1 rounded-full hover:bg-primary hover:text-white transition-colors"
          >
            {lang === 'ko' ? 'ENGLISH' : 'KOREAN'}
          </button>
        </div>
      </div>
    </nav>
  );
}
