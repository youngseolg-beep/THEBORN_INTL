import BrandStory from "./BrandStory";
import ContactCTA from "./ContactCTA";
import GlobalPresence from "./GlobalPresence";
import HeroStory from "./HeroStory";
import Partnership from "./Partnership";
import ProcessStory from "./ProcessStory";
import Qualifications from "./Qualifications";
import SectionRailNav from "./SectionRailNav";
import SectionTransition from "./SectionTransition";

export default function HomeV2() {
  return (
    <>
      <SectionRailNav />
      <main aria-label="Home V2">
        <div id="home" data-home-v2-nav-section="home">
          <HeroStory />
        </div>
        <div id="global-presence" data-home-v2-nav-section="global-presence">
          <SectionTransition number="02" title="GLOBAL PRESENCE" />
          <GlobalPresence />
        </div>
        <div id="brand-story" data-home-v2-nav-section="brand-story">
          <SectionTransition number="03" title="BRAND STORY" />
          <BrandStory />
        </div>
        <div id="partnership" data-home-v2-nav-section="partnership">
          <SectionTransition number="04" title="PARTNERSHIP" />
          <Partnership />
        </div>
        <div id="qualifications" data-home-v2-nav-section="qualifications">
          <SectionTransition number="05" title="QUALIFICATIONS" />
          <Qualifications />
        </div>
        <div id="process" data-home-v2-nav-section="process">
          <SectionTransition number="06" title="PROCESS" />
          <ProcessStory />
        </div>
        <div id="contact" data-home-v2-nav-section="contact">
          <SectionTransition number="07" title="CONTACT" />
          <ContactCTA />
        </div>
      </main>
    </>
  );
}
