import BrandStory from "./BrandStory";
import ContactCTA from "./ContactCTA";
import Gallery from "./Gallery";
import GlobalPresence from "./GlobalPresence";
import HeroStory from "./HeroStory";
import Partnership from "./Partnership";
import ProcessStory from "./ProcessStory";
import Qualifications from "./Qualifications";
import SectionRailNav from "./SectionRailNav";
import SectionTransition from "./SectionTransition";
import WhyTheBorn from "./WhyTheBorn";

export default function HomeV2() {
  return (
    <>
      <SectionRailNav />
      <main aria-label="Home V2">
        <div id="home" data-home-v2-nav-section="home">
          <HeroStory />
        </div>
        <div id="global-presence" data-home-v2-nav-section="global-presence">
          <SectionTransition number="02" title="GLOBAL" />
          <GlobalPresence />
        </div>
        <div id="brand-story" data-home-v2-nav-section="brand-story">
          <SectionTransition number="03" title="OUR BRANDS" />
          <BrandStory />
        </div>
        <div id="gallery" data-home-v2-nav-section="gallery">
          <SectionTransition number="04" title="BRAND GALLERY" />
          <Gallery />
        </div>
        <div id="partnership" data-home-v2-nav-section="partnership">
          <SectionTransition number="05" title="PARTNERSHIP" />
          <Partnership />
        </div>
        <div id="qualifications" data-home-v2-nav-section="qualifications">
          <SectionTransition number="06" title="QUALIFICATIONS" />
          <Qualifications />
        </div>
        <div id="process" data-home-v2-nav-section="process">
          <SectionTransition number="07" title="PROCESS" />
          <ProcessStory />
        </div>
        <div id="contact" data-home-v2-nav-section="contact">
          <SectionTransition number="08" title="CONTACT" />
          <ContactCTA />
          <WhyTheBorn />
        </div>
      </main>
    </>
  );
}
