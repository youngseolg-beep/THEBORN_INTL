import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import OverseasStatus from "./components/OverseasStatus";
import Brands from "./components/Brands";
import SuccessStory from "./components/SuccessStory";
import BrandGallery from "./components/BrandGallery";
import Requirements from "./components/Requirements";
import Process from "./components/Process";
import Contact from "./components/Contact";

export default function App() {
  const [lang, setLang] = useState<"ko" | "en">("ko");

  return (
    <div className="min-h-screen bg-[#0F0F10] text-zinc-100">
      <Navbar lang={lang} setLang={setLang} />

      <main className="bg-[#0F0F10]">
        <Hero lang={lang} />
        <OverseasStatus lang={lang} />
        <Brands lang={lang} />
        <SuccessStory lang={lang} />
        <BrandGallery lang={lang} />
        <Requirements lang={lang} />
        <Process lang={lang} />
        <Contact lang={lang} />
      </main>
    </div>
  );
}
