import { useEffect, useState } from "react";

// Which section owns the viewport, so its nav link can be underlined. A section
// qualifies on covering half the viewport — or half of itself, if it's shorter
// — and the most visible one wins. Nothing qualifies over the hero.
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
        const visible = Math.min(r.bottom, viewportHeight) - Math.max(r.top, 0);
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
