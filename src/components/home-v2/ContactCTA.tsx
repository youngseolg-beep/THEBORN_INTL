import { motion, useReducedMotion } from "motion/react";
import { homeV2Content } from "../../data/homeV2Content";

const { contact } = homeV2Content;
const primaryContact = contact.entries[0];
const regionalContacts = contact.entries.slice(1);
const [primaryLocalPart, primaryDomainPart] = primaryContact.email.split("@");
const [guidanceBeforeEmail, guidanceAfterEmail] =
  contact.internationalInquiryGuidance.split(primaryContact.email);

export default function ContactCTA() {
  const reduceMotion = Boolean(useReducedMotion());

  return (
    <section
      aria-labelledby="home-v2-contact-title"
      className="min-h-svh bg-[#090a0c] text-[#f7f3ec]"
    >
      <div className="mx-auto max-w-[96rem] px-[5%] pb-[clamp(8rem,20svh,14rem)] pt-[clamp(5rem,12svh,9rem)]">
        <h2
          id="home-v2-contact-title"
          className="text-xs font-medium uppercase tracking-[0.26em] text-zinc-300 sm:text-sm"
        >
          {contact.title}
        </h2>

        <motion.div
          className="mt-[clamp(4.5rem,12svh,8rem)] border-b border-white/15 pb-[clamp(3rem,8svh,5.5rem)]"
          initial={reduceMotion ? false : { opacity: 0, y: 25 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#ed2028] sm:text-sm">
            {primaryContact.category}
          </p>
          <a
            href={`mailto:${primaryContact.email}`}
            aria-label={`Email ${primaryContact.category}: ${primaryContact.email}`}
            className="group mt-5 inline-flex max-w-full items-start gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed2028] focus-visible:ring-offset-4 focus-visible:ring-offset-[#090a0c] sm:mt-7 sm:gap-5"
          >
            <span className="inline-flex min-w-0 flex-col text-[clamp(2.5rem,5.2vw,5.25rem)] font-medium leading-[1.02] tracking-[-0.055em] text-[#f7f3ec] transition-transform duration-300 ease-out group-hover:translate-x-2 group-focus-visible:translate-x-2 sm:flex-row">
              <span>{primaryLocalPart}@</span>
              <span>{primaryDomainPart}</span>
            </span>
            <span
              aria-hidden="true"
              className="mt-[0.2em] shrink-0 text-[clamp(1.5rem,3vw,3rem)] leading-none text-[#ed2028] transition-transform duration-300 ease-out group-hover:translate-x-1.5 group-hover:-translate-y-1.5 group-focus-visible:translate-x-1.5 group-focus-visible:-translate-y-1.5"
            >
              ↗
            </span>
          </a>
        </motion.div>

        <ul className="grid border-b border-white/15 xl:grid-cols-3">
          {regionalContacts.map(({ category, email }, index) => (
            <motion.li
              key={category}
              className="border-b border-white/15 last:border-b-0 xl:border-b-0 xl:border-r xl:last:border-r-0"
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: 0.5,
                delay: reduceMotion ? 0 : index * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <a
                href={`mailto:${email}`}
                aria-label={`Email ${category}: ${email}`}
                className={`group flex min-h-40 flex-col justify-between gap-8 px-1 py-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#ed2028] sm:min-h-44 sm:py-10 xl:px-8 ${
                  index === 0 ? "xl:pl-0" : ""
                } ${index === regionalContacts.length - 1 ? "xl:pr-0" : ""}`}
              >
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
                  {category}
                </span>
                <span className="flex min-w-0 items-start justify-between gap-3">
                  <span className="min-w-0 whitespace-nowrap text-[clamp(1rem,1.45vw,1.5rem)] font-medium leading-tight tracking-[-0.035em] text-zinc-200 transition-transform duration-300 ease-out group-hover:translate-x-1.5 group-hover:text-white group-focus-visible:translate-x-1.5 group-focus-visible:text-white">
                    {email}
                  </span>
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-base text-[#ed2028] transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:-translate-y-1 group-focus-visible:translate-x-1 group-focus-visible:-translate-y-1"
                  >
                    ↗
                  </span>
                </span>
              </a>
            </motion.li>
          ))}
        </ul>

        <motion.p
          id="home-v2-international-guidance"
          className="max-w-3xl pt-10 text-base leading-relaxed text-zinc-400 sm:pt-12 sm:text-xl"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {guidanceBeforeEmail}
          <a
            href={`mailto:${primaryContact.email}`}
            className="text-zinc-200 underline decoration-white/30 underline-offset-4 transition-colors duration-300 hover:text-white hover:decoration-[#ed2028] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed2028] focus-visible:ring-offset-2 focus-visible:ring-offset-[#090a0c]"
          >
            {primaryContact.email}
          </a>
          {guidanceAfterEmail}
        </motion.p>
      </div>
    </section>
  );
}
