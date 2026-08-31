import { useEffect, useState } from "react";

// Tracks which nav link's section is centered in the viewport, so the
// matching link can be highlighted as the user scrolls.
export function useActiveSection(links) {
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    // find the active section in the viewport and make the nav link active
    const getActiveSection = () => {
      const viewportCenter = window.innerHeight / 2;
      let activeSectionId = null;
      links.forEach(({ id }) => {
        const r = document.getElementById(id)?.getBoundingClientRect();
        if (!r) return;
        if (r.top <= viewportCenter && r.bottom >= viewportCenter)
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
