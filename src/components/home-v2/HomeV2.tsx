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
import { homeV2Chapters } from "./homeV2Chapters";
import "./HomeV2.mobile.css";
import "./HomeV2.chapters.css";

const chapterComponents = {
  home: HeroStory,
  "global-presence": GlobalPresence,
  "brand-story": BrandStory,
  gallery: Gallery,
  partnership: Partnership,
  qualifications: Qualifications,
  process: ProcessStory,
  contact: ContactCTA,
  "why-the-born": WhyTheBorn,
};

export default function HomeV2() {
  return (
    <HomeV2LocaleProvider>
      <HomeV2LanguageToggle />
      <SectionRailNav />
      <main aria-label="Home V2" className="home-v2-page">
        {homeV2Chapters.map(chapter => {
          const Content = chapterComponents[chapter.id];
          return (
            <div key={chapter.id} id={chapter.id} data-home-v2-nav-section={chapter.id}>
              {chapter.id !== "home" ? <SectionTransition chapter={chapter.id} /> : null}
              <Content />
            </div>
          );
        })}
      </main>
    </HomeV2LocaleProvider>
  );
}
