import { useEffect, useState } from "react";

// Tracks which nav link's section owns the viewport, so the matching link can
// be underlined as the user scrolls. A section qualifies once it covers the
// majority of the viewport — or, for sections shorter than half the viewport,
// once the majority of the section itself is on screen — and the qualifier
// showing the most pixels wins. Nothing qualifies over the hero, so the nav
// starts with no link underlined.
export function useActiveSection(links) {
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    const getActiveSection = () => {
      const viewportHeight = window.innerHeight;
      let activeSectionId = null;
      let mostVisible = 0;
      links.forEach(({ id }) => {
        const r = document.getElementById(id)?.getBoundingClientRect();
        if (!r) return;
        const visible =
          Math.min(r.bottom, viewportHeight) - Math.max(r.top, 0);
        const majority = Math.min(viewportHeight, r.height) / 2;
        if (visible <= majority || visible <= mostVisible) return;
        mostVisible = visible;
        activeSectionId = id;
      });
      setActiveId(activeSectionId);
    };
    getActiveSection();
    window.addEventListener("scroll", getActiveSection, {
      passive: true,
    });
    window.addEventListener("resize", getActiveSection, {
      passive: true,
    });
    return () => {
      window.removeEventListener("scroll", getActiveSection);
      window.removeEventListener("resize", getActiveSection);
    };
  }, [links]);

  return activeId;
}
