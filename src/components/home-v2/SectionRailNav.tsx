import { useEffect, useRef, useState, type MouseEvent } from "react";
import { useReducedMotion } from "motion/react";
import { homeV2Chapters, type HomeV2ChapterId } from "./homeV2Chapters";

function findActiveSection(elements: readonly HTMLElement[], referencePoint: number) {
  let closest = elements[0];
  let closestDistance = Number.POSITIVE_INFINITY;
  for (const element of elements) {
    const rect = element.getBoundingClientRect();
    if (rect.top <= referencePoint && rect.bottom > referencePoint) {
      return element.dataset.homeV2NavSection as HomeV2ChapterId;
    }
    const distance = referencePoint < rect.top ? rect.top - referencePoint : referencePoint - rect.bottom;
    if (distance < closestDistance) {
      closest = element;
      closestDistance = distance;
    }
  }
  return closest?.dataset.homeV2NavSection as HomeV2ChapterId | undefined;
}

export default function SectionRailNav() {
  const reduceMotion = Boolean(useReducedMotion());
  const [activeId, setActiveId] = useState<HomeV2ChapterId>("home");
  const activeIdRef = useRef<HomeV2ChapterId>("home");
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const activeChapter = homeV2Chapters.find(chapter => chapter.id === activeId)!;

  useEffect(() => {
    const elements = homeV2Chapters
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
      if (frameId === null) frameId = window.requestAnimationFrame(update);
    };
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(false);
      requestUpdate();
    };
    // Locale changes and lazy image loading can move chapter boundaries without a scroll event.
    const observer = new ResizeObserver(requestUpdate);
    elements.forEach(element => observer.observe(element));
    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", onResize);
      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const panel: HTMLDivElement | null = panelRef.current;
    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const bodyPadding = Number.parseFloat(window.getComputedStyle(document.body).paddingRight) || 0;
    document.body.style.overflow = "hidden";
    // Keep text wrapping and image heights stable while opening/closing the menu.
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${bodyPadding + scrollbarWidth}px`;
    panel?.querySelector<HTMLAnchorElement>('a[aria-current="location"]')?.focus({ preventScroll: true });
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
      }
      if (event.key !== "Tab" || !panel) return;
      const targets = Array.from(panel.querySelectorAll<HTMLElement>("button, a[href]"));
      const first = targets[0];
      const last = targets[targets.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      document.removeEventListener("keydown", onKeyDown);
      triggerRef.current?.focus({ preventScroll: true });
    };
  }, [open]);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>, id: HomeV2ChapterId) => {
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    setOpen(false);
    if (reduceMotion) {
      const root = document.documentElement;
      const previousScrollBehavior = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto";
      target.scrollIntoView({ behavior: "auto", block: "start" });
      root.style.scrollBehavior = previousScrollBehavior;
    } else {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    const hash = homeV2Chapters.find(chapter => chapter.id === id)!.anchor;
    if (window.location.hash !== hash) window.history.pushState(null, "", hash);
  };

  return (
    <>
      <nav aria-label="Home page chapters" className="group/rail fixed right-[clamp(1rem,2vw,2rem)] top-1/2 z-40 hidden -translate-y-1/2 lg:block">
        <ul>
          {homeV2Chapters.map(({ id, number, title, anchor }) => {
            const active = id === activeId;
            return (
              <li key={id}>
                <a href={anchor} aria-current={active ? "location" : undefined}
                  onClick={event => handleClick(event, id)}
                  className="group/item flex h-9 w-44 items-center justify-end gap-3 focus-visible:outline-none">
                  <span className={`translate-x-2 text-right text-[0.625rem] font-semibold uppercase tracking-[0.14em] opacity-0 transition-[opacity,transform,color] duration-300 ease-out motion-reduce:transition-none group-hover/rail:translate-x-0 group-hover/rail:opacity-100 group-focus-within/rail:translate-x-0 group-focus-within/rail:opacity-100 group-focus-visible/item:text-white ${active ? "text-zinc-100" : "text-zinc-500"}`}>
                    <span className={active ? "text-[#ed2028]" : ""}>{number}</span>{" "}{title}
                  </span>
                  <span aria-hidden="true" className={`shrink-0 origin-right transition-[width,height,background-color,opacity] duration-300 ease-out motion-reduce:transition-none group-focus-visible/item:bg-white group-focus-visible/item:opacity-100 ${active ? "h-0.5 w-8 bg-[#ed2028] opacity-100" : "h-px w-3 bg-white opacity-35"}`} />
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="chapter-nav-compact">
        <button ref={triggerRef} type="button" className="chapter-nav-trigger"
          aria-label={`Open chapters, current: ${activeChapter.number} ${activeChapter.title}`}
          aria-haspopup="dialog" aria-expanded={open} aria-controls="home-v2-chapter-menu"
          onClick={() => setOpen(true)}>
          <span>{activeChapter.number}</span><span>{activeChapter.title}</span>
          <span aria-hidden="true"><i /><i /></span>
        </button>
      </div>
      {open ? (
        <div className="chapter-nav-overlay" onClick={event => { if (event.target === event.currentTarget) setOpen(false); }}>
          <div ref={panelRef} id="home-v2-chapter-menu" className="chapter-nav-panel"
            role="dialog" aria-modal="true" aria-labelledby="home-v2-chapter-menu-title">
            <div className="chapter-nav-panel-head">
              <h2 id="home-v2-chapter-menu-title">CHAPTERS</h2>
              <button type="button" className="chapter-nav-close" aria-label="Close chapters" onClick={() => setOpen(false)}>×</button>
            </div>
            <nav aria-label="Home page chapters">
              <ol>
                {homeV2Chapters.map(({ id, number, title, anchor }) => (
                  <li key={id}>
                    <a href={anchor} aria-current={id === activeId ? "location" : undefined} onClick={event => handleClick(event, id)}>
                      <span>{number}</span><span>{title}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </div>
      ) : null}
    </>
  );
}
