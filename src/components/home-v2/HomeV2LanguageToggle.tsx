import { useHomeV2Locale } from "./HomeV2LocaleContext";

export default function HomeV2LanguageToggle() {
  const { locale, toggleLocale } = useHomeV2Locale();

  return (
    <button
      type="button"
      aria-label={locale === "en" ? "한국어로 전환" : "Switch to English"}
      onClick={toggleLocale}
      className="home-v2-language-toggle fixed right-4 top-4 z-[70] flex min-h-11 items-center gap-2 px-1 text-[11px] font-semibold tracking-[0.14em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed2028] focus-visible:ring-offset-4 focus-visible:ring-offset-black sm:right-6 sm:top-6 lg:right-8"
    >
      <span className={locale === "ko" ? "text-[#ed2028]" : "text-white/45"}>KOR</span>
      <span aria-hidden="true" className="text-white/25">/</span>
      <span className={locale === "en" ? "text-[#ed2028]" : "text-white/45"}>ENG</span>
    </button>
  );
}
