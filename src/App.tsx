import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import OverseasStatus from "./components/OverseasStatus";
import Brands from "./components/Brands";
import BrandGallery from "./components/BrandGallery";
import Requirements from "./components/Requirements";
import Process from "./components/Process";
import Contact from "./components/Contact";

export default function App() {
  const [lang, setLang] = useState<'ko' | 'en'>('ko');

  return (
    <div className="min-h-screen bg-background bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
      <Navbar lang={lang} setLang={setLang} />
      <main>
        <Hero lang={lang} />
        <OverseasStatus lang={lang} />
        <Brands lang={lang} />
        <BrandGallery lang={lang} />
        <Requirements lang={lang} />
        <Process lang={lang} />
        <Contact lang={lang} />
      </main>
    </div>
  );
}
