// One source of truth for page order, intros, content headers and navigation.
// Chapter names intentionally stay English in both locales.
export const homeV2Chapters = [
  { id: "home", number: "01", title: "HOME", anchor: "#home" },
  { id: "global-presence", number: "02", title: "GLOBAL", anchor: "#global-presence" },
  { id: "brand-story", number: "03", title: "OUR BRANDS", anchor: "#brand-story" },
  { id: "gallery", number: "04", title: "BRAND GALLERY", anchor: "#gallery" },
  { id: "partnership", number: "05", title: "PARTNERSHIP", anchor: "#partnership" },
  { id: "qualifications", number: "06", title: "QUALIFICATIONS", anchor: "#qualifications" },
  { id: "process", number: "07", title: "PROCESS", anchor: "#process" },
  { id: "contact", number: "08", title: "CONTACT", anchor: "#contact" },
  { id: "why-the-born", number: "09", title: "WHY THE BORN", anchor: "#why-the-born" },
] as const;

export type HomeV2Chapter = (typeof homeV2Chapters)[number];
export type HomeV2ChapterId = HomeV2Chapter["id"];

export function getHomeV2Chapter(id: HomeV2ChapterId): HomeV2Chapter {
  return homeV2Chapters.find(chapter => chapter.id === id)!;
}
