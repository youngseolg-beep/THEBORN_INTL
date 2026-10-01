import { homeV2Content } from "../../data/homeV2Content";

const { whyTheBorn } = homeV2Content;
const titleWords = whyTheBorn.title.split(" ");
const titleLines = [
  titleWords.slice(0, 3).join(" "),
  titleWords.slice(3).join(" "),
];

function ClosingMessage() {
  const hasFinalPeriod = whyTheBorn.closingMessage.endsWith(".");
  const message = hasFinalPeriod
    ? whyTheBorn.closingMessage.slice(0, -1)
    : whyTheBorn.closingMessage;

  return (
    <p className="text-center text-[clamp(1.125rem,1.5vw,1.5rem)] font-semibold uppercase leading-snug tracking-[0.12em] text-[#f7f3ec]">
      {message}
      {hasFinalPeriod ? <span className="text-[#ed2028]">.</span> : null}
    </p>
  );
}

export default function WhyTheBorn() {
  return (
    <section
      aria-labelledby="home-v2-why-the-born-title"
      className="bg-[#090a0c] px-[5%] py-[clamp(6rem,16svh,11rem)] text-[#f7f3ec]"
    >
      <div className="mx-auto max-w-6xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#ed2028] sm:text-sm">
          {whyTheBorn.eyebrow}
        </p>

        <h2
          id="home-v2-why-the-born-title"
          className="mx-auto mt-5 max-w-5xl text-[clamp(2.35rem,8vw,6.5rem)] font-medium uppercase leading-[0.98] tracking-[-0.055em] text-[#f7f3ec] md:text-[clamp(3.5rem,6vw,6.5rem)]"
        >
          {titleLines.map((line, index) => (
            <span key={line} className="block whitespace-nowrap">
              {line}
              {index === 0 ? " " : null}
            </span>
          ))}
        </h2>

        <div className="mx-auto mt-[clamp(2.5rem,5vw,4.5rem)] max-w-4xl space-y-5 text-[clamp(1rem,1.25vw,1.25rem)] leading-[1.75] text-zinc-300 sm:space-y-6">
          {whyTheBorn.paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-pretty">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mx-auto mt-[clamp(5rem,8vw,8rem)] max-w-4xl border-t border-white/10 pt-[clamp(3rem,5vw,4.5rem)]">
          <ClosingMessage />
        </div>
      </div>
    </section>
  );
}
