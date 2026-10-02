import BrandStory from "./BrandStory";
import ContactCTA from "./ContactCTA";
import Gallery from "./Gallery";
import GlobalPresence from "./GlobalPresence";
import HeroStory from "./HeroStory";
import HomeV2LanguageToggle from "./HomeV2LanguageToggle";
import { HomeV2LocaleProvider } from "./HomeV2LocaleContext";
import Partnership from "./Partnership";
import ProcessStory from "./ProcessStory";
import Qualifications from "./Qualifications";
import SectionRailNav from "./SectionRailNav";
import SectionTransition from "./SectionTransition";
import WhyTheBorn from "./WhyTheBorn";
import "./HomeV2.mobile.css";

export default function HomeV2() {
  return (
    <HomeV2LocaleProvider>
      <HomeV2LanguageToggle />
      <SectionRailNav />
      <main aria-label="Home V2" className="home-v2-page">
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
        </div>
        <div id="why-the-born" data-home-v2-nav-section="why-the-born">
          <SectionTransition number="09" title="WHY THE BORN" />
          <WhyTheBorn />
        </div>
      </main>
    </HomeV2LocaleProvider>
  );
}
