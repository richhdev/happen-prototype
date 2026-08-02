"use client";
import { useEffect, useState } from "react";
import { NAV_LINKS } from "@/lib/data";

const cssEase = "cubic-bezier(.16,1,.3,1)";

// Tracks which nav link's section is centered in the viewport, so the
// matching link can be highlighted as the user scrolls.
function useActiveSection(links) {
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

export default function Nav() {
  const activeId = useActiveSection(NAV_LINKS);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      // when scrolling artists section. anchor should be in the middle of viewport which is the end of the scroll animation.
      block: id === "b-artists" ? "center" : "start",
    });
    document.getElementById(id);
  };

  return (
    <>
      <nav className="nav">
        <div className="nav-inner">
          <a
            className="nav-title"
            onClick={(e) => {
              scrollToSection(e, "a-hero");
              alert();
            }}
          >
            Happen Group
          </a>
          <div className="nav-link-group">
            <div className="nav-links">
              {NAV_LINKS.map((n) => (
                <a
                  key={n.id}
                  href={`#${n.id}`}
                  onClick={(e) => scrollToSection(e, n.id)}
                  className={`nav-link${n.id === activeId ? " active" : ""}`}
                >
                  {n.label}
                </a>
              ))}
            </div>
            <a
              href="#a-contact"
              onClick={(e) => scrollToSection(e, "a-contact")}
              className="nav-cta"
            >
              Work with us
            </a>
            <button
              type="button"
              className="nav-menu-toggle"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </nav>

      <div className={`nav-overlay${menuOpen ? " open" : ""}`}>
        {NAV_LINKS.map((n) => (
          <a
            key={n.id}
            href={`#${n.id}`}
            onClick={(e) => scrollToSection(e, n.id)}
            className={`nav-overlay-link${n.id === activeId ? " active" : ""}`}
          >
            {n.label}
          </a>
        ))}
        <a
          href="#a-contact"
          onClick={(e) => scrollToSection(e, "a-contact")}
          className="nav-overlay-cta"
        >
          Work with us
        </a>
      </div>

      <style jsx>{`
        .nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 48px;
          height: 76px;
          background: transparent;
          mix-blend-mode: difference;
        }

        .nav-inner {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
        }

        .nav-title {
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          color: #e2231a;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .nav-link-group {
          display: flex;
          gap: 26px;
          align-items: center;
          flex: 1;
          min-width: max-content;
          justify-content: flex-end;
          overflow-x: auto;
        }

        .nav-links {
          display: flex;
          gap: 26px;
          align-items: center;
          flex: 1;
          min-width: 0;
          justify-content: flex-end;
          overflow-x: auto;
        }

        .nav-link {
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          text-decoration: none;
          color: #fff;
          opacity: 0.55;
          transition: opacity 200ms ${cssEase};
          white-space: nowrap;
          flex-shrink: 0;
        }

        .nav-link.active {
          opacity: 1;
        }

        .nav-cta {
          display: inline-flex;
          align-items: center;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          text-decoration: none;
          color: #fff;
          border: 1.5px solid #fff;
          padding: 9px 18px;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .nav-menu-toggle {
          display: none;
          font-family: inherit;
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          color: #fff;
          background: transparent;
          border: none;
          padding: 0;
          cursor: pointer;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .nav-overlay {
          position: fixed;
          inset: 0;
          z-index: 45;
          background: #0a0a0a;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 30px;
          opacity: 0;
          visibility: hidden;
          transition:
            opacity 300ms ${cssEase},
            visibility 300ms ${cssEase};
        }

        .nav-overlay.open {
          opacity: 1;
          visibility: visible;
        }

        .nav-overlay-link {
          font-size: 22px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          text-decoration: none;
          color: #fff;
          opacity: 0.55;
        }

        .nav-overlay-link.active {
          opacity: 1;
        }

        .nav-overlay-cta {
          display: inline-flex;
          align-items: center;
          margin-top: 10px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          text-decoration: none;
          color: #fff;
          border: 1.5px solid #fff;
          padding: 12px 24px;
        }

        @media (max-width: 640px) {
          .nav {
            padding: 0 20px;
          }

          .nav-inner {
            gap: 16px;
          }

          .nav-link-group {
            gap: 16px;
          }

          .nav-links {
            display: none;
          }

          .nav-cta {
            display: none;
          }

          .nav-menu-toggle {
            display: block;
          }
        }
      `}</style>
    </>
  );
}
