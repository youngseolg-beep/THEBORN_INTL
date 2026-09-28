import BrandStory from "./BrandStory";
import ContactCTA from "./ContactCTA";
import GlobalPresence from "./GlobalPresence";
import HeroStory from "./HeroStory";
import Partnership from "./Partnership";
import ProcessStory from "./ProcessStory";
import Qualifications from "./Qualifications";

export default function HomeV2() {
  return (
    <main aria-label="Home V2">
      <HeroStory />
      <GlobalPresence />
      <BrandStory />
      <Partnership />
      <Qualifications />
      <ProcessStory />
      <ContactCTA />
    </main>
  );
}
