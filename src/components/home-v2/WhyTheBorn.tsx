import { useHomeV2Locale } from "./HomeV2LocaleContext";
import ChapterHeader from "./ChapterHeader";

function ClosingMessage({ closingMessage }: { closingMessage: string }) {
  const hasFinalPeriod = closingMessage.endsWith(".");
  const message = hasFinalPeriod
    ? closingMessage.slice(0, -1)
    : closingMessage;

  return (
    <p className="text-center text-[clamp(1.125rem,1.5vw,1.5rem)] font-semibold uppercase leading-snug tracking-[0.12em] text-[#f7f3ec]">
      {message}
      {hasFinalPeriod ? <span className="text-[#ed2028]">.</span> : null}
    </p>
  );
}

export default function WhyTheBorn() {
  const { content, locale } = useHomeV2Locale();
  const { whyTheBorn } = content;
  const isKorean = locale === "ko";

  return (
    <section
      aria-labelledby="home-v2-why-the-born-title"
      className="bg-[#090a0c] px-[5%] py-[clamp(6rem,16svh,11rem)] text-[#f7f3ec]"
    >
      <div className="mx-auto max-w-6xl text-center">
        <ChapterHeader chapter="why-the-born" as="p" />

        <h2
          id="home-v2-why-the-born-title"
          className={`mx-auto mt-5 max-w-5xl text-[clamp(2.35rem,8vw,6.5rem)] font-medium leading-[0.98] text-[#f7f3ec] md:text-[clamp(3.5rem,6vw,6.5rem)] ${
            isKorean ? "tracking-[-0.04em]" : "uppercase tracking-[-0.055em]"
          }`}
        >
          {whyTheBorn.titleLines.map((line, index) => (
            <span
              key={line}
              className={`block ${isKorean ? "sm:whitespace-nowrap" : "whitespace-nowrap"}`}
            >
              {line}
              {index === 0 ? " " : null}
            </span>
          ))}
        </h2>

        <div className={`mx-auto mt-[clamp(2.5rem,5vw,4.5rem)] max-w-4xl space-y-5 text-[clamp(1rem,1.25vw,1.25rem)] leading-[1.75] text-zinc-300 sm:space-y-6 ${
          isKorean ? "tracking-[-0.015em]" : ""
        }`}>
          {whyTheBorn.paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-pretty">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mx-auto mt-[clamp(5rem,8vw,8rem)] max-w-4xl border-t border-white/10 pt-[clamp(3rem,5vw,4.5rem)]">
          <ClosingMessage closingMessage={whyTheBorn.closingMessage} />
        </div>
      </div>
    </section>
  );
}
