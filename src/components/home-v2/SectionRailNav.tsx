import { useEffect, useRef, useState, type MouseEvent } from "react";
import { useReducedMotion } from "motion/react";

export const homeV2NavItems = [
  { id: "home", label: "HOME" },
  { id: "global-presence", label: "GLOBAL" },
  { id: "brand-story", label: "BRANDS" },
  { id: "gallery", label: "GALLERY" },
  { id: "partnership", label: "PARTNERSHIP" },
  { id: "qualifications", label: "QUALIFICATIONS" },
  { id: "process", label: "PROCESS" },
  { id: "contact", label: "CONTACT" },
] as const;

type SectionId = (typeof homeV2NavItems)[number]["id"];

function findActiveSection(elements: readonly HTMLElement[], referencePoint: number) {
  let closest = elements[0];
  let closestDistance = Number.POSITIVE_INFINITY;

  for (const element of elements) {
    const rect = element.getBoundingClientRect();

    if (rect.top <= referencePoint && rect.bottom > referencePoint) {
      return element.dataset.homeV2NavSection as SectionId;
    }

    const distance = referencePoint < rect.top
      ? rect.top - referencePoint
      : referencePoint - rect.bottom;

    if (distance < closestDistance) {
      closest = element;
      closestDistance = distance;
    }
  }

  return closest?.dataset.homeV2NavSection as SectionId | undefined;
}

export default function SectionRailNav() {
  const reduceMotion = Boolean(useReducedMotion());
  const [activeId, setActiveId] = useState<SectionId>(homeV2NavItems[0].id);
  const activeIdRef = useRef<SectionId>(homeV2NavItems[0].id);

  useEffect(() => {
    const elements = homeV2NavItems
      .map(({ id }) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);
    let frameId: number | null = null;

    const update = () => {
      frameId = null;
      const nextId = findActiveSection(elements, window.innerHeight * 0.45);

      if (nextId && nextId !== activeIdRef.current) {
        activeIdRef.current = nextId;
        setActiveId(nextId);
      }
    };

    const requestUpdate = () => {
      if (frameId === null) {
        frameId = window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, []);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>, id: SectionId) => {
    const target = document.getElementById(id);
    if (!target) return;

    event.preventDefault();
    if (reduceMotion) {
      const root = document.documentElement;
      const previousScrollBehavior = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto";
      target.scrollIntoView({ behavior: "auto", block: "start" });
      root.style.scrollBehavior = previousScrollBehavior;
    } else {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    const hash = `#${id}`;
    if (window.location.hash !== hash) {
      window.history.pushState(null, "", hash);
    }
  };

  return (
    <nav
      aria-label="Home page sections"
      className="group/rail fixed right-[clamp(1rem,2vw,2rem)] top-1/2 z-40 hidden -translate-y-1/2 lg:block"
    >
      <ul>
        {homeV2NavItems.map(({ id, label }) => {
          const active = id === activeId;

          return (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={active ? "location" : undefined}
                onClick={(event) => handleClick(event, id)}
                className="group/item flex h-9 w-44 items-center justify-end gap-3 focus-visible:outline-none"
              >
                <span
                  className={`translate-x-2 text-right text-[0.625rem] font-semibold uppercase tracking-[0.2em] opacity-0 transition-[opacity,transform,color] duration-300 ease-out group-hover/rail:translate-x-0 group-hover/rail:opacity-100 group-focus-within/rail:translate-x-0 group-focus-within/rail:opacity-100 group-focus-visible/item:text-white ${
                    active ? "text-zinc-100" : "text-zinc-500"
                  }`}
                >
                  {label}
                </span>
                <span
                  aria-hidden="true"
                  className={`shrink-0 origin-right transition-[width,height,background-color,opacity] duration-300 ease-out group-focus-visible/item:bg-white group-focus-visible/item:opacity-100 ${
                    active
                      ? "h-0.5 w-8 bg-[#ed2028] opacity-100"
                      : "h-px w-3 bg-white opacity-35"
                  }`}
                />
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
