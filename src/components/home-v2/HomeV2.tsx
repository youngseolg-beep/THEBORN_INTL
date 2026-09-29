import BrandStory from "./BrandStory";
import ContactCTA from "./ContactCTA";
import GlobalPresence from "./GlobalPresence";
import HeroStory from "./HeroStory";
import Partnership from "./Partnership";
import ProcessStory from "./ProcessStory";
import Qualifications from "./Qualifications";
import SectionTransition from "./SectionTransition";

export default function HomeV2() {
  return (
    <main aria-label="Home V2">
      <HeroStory />
      <SectionTransition number="02" title="GLOBAL PRESENCE" />
      <GlobalPresence />
      <SectionTransition number="03" title="BRAND STORY" />
      <BrandStory />
      <SectionTransition number="04" title="PARTNERSHIP" />
      <Partnership />
      <SectionTransition number="05" title="QUALIFICATIONS" />
      <Qualifications />
      <SectionTransition number="06" title="PROCESS" />
      <ProcessStory />
      <SectionTransition number="07" title="CONTACT" />
      <ContactCTA />
    </main>
  );
}
