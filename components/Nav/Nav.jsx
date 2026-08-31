"use client";
import { useEffect, useState } from "react";
import styles from "./Nav.module.css";
import { NAV_LINKS } from "./data";
import { useActiveSection } from "./useActiveSection";
import { TextOverline } from "@/components/Text/Text";
import { ButtonOutlineMedium } from "@/components/Button/Button";

export default function Nav() {
  const activeId = useActiveSection(NAV_LINKS);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <nav className={styles.nav}>
        <div className={styles.inner}>
          <TextOverline
            as="a"
            className={styles.title}
            onClick={(e) => scrollToSection(e, "a-hero")}
          >
            Happen Group
          </TextOverline>

          <button
            type="button"
            className={styles.menuToggle}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <TextOverline>{menuOpen ? "Close" : "Menu"}</TextOverline>
          </button>

          <div className={styles.linkGroup}>
            <div className={styles.links}>
              {NAV_LINKS.map((n) => (
                <TextOverline
                  as="a"
                  key={n.id}
                  href={`#${n.id}`}
                  onClick={(e) => scrollToSection(e, n.id)}
                  className={`${styles.link}${n.id === activeId ? ` ${styles.active}` : ""}`}
                >
                  {n.label}
                </TextOverline>
              ))}
              <ButtonOutlineMedium
                href="#a-contact"
                onClick={(e) => scrollToSection(e, "a-contact")}
                className={styles.cta}
              >
                Work with us
              </ButtonOutlineMedium>
            </div>
          </div>
        </div>
      </nav>

      <div className={`${styles.overlay}${menuOpen ? ` ${styles.open}` : ""}`}>
        {NAV_LINKS.map((n) => (
          <a
            key={n.id}
            href={`#${n.id}`}
            onClick={(e) => scrollToSection(e, n.id)}
            className={`${styles.overlayLink}${n.id === activeId ? ` ${styles.active}` : ""}`}
          >
            {n.label}
          </a>
        ))}
        <ButtonOutlineMedium
          href="#a-contact"
          onClick={(e) => scrollToSection(e, "a-contact")}
          className={styles.overlayCta}
        >
          Work with us
        </ButtonOutlineMedium>
      </div>
    </>
  );
}

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
