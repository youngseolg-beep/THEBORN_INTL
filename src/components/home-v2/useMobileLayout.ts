import { useEffect, useState } from "react";

// Phone layouts have their own story; desktop breakpoint rules remain independent.
export function useMobileLayout() {
  const [layout, setLayout] = useState({ mobile: false, storyFits: false });
  useEffect(() => {
    const phone = window.matchMedia("(max-width: 767px)");
    const tallEnough = window.matchMedia("(min-height: 600px)");
    const update = () => setLayout({ mobile: phone.matches, storyFits: tallEnough.matches });
    update();
    phone.addEventListener("change", update);
    tallEnough.addEventListener("change", update);
    return () => {
      phone.removeEventListener("change", update);
      tallEnough.removeEventListener("change", update);
    };
  }, []);
  return layout;
}
