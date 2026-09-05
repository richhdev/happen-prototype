"use client";
import { useEffect, useState } from "react";
import styles from "./Nav.module.css";
import { LINKS } from "./data";
import { useActiveSection } from "./useActiveSection";
import { TextOverline } from "@/components/Text/Text";
import LinkList from "./LinkList";

// At module scope: declared inside Nav it would be a new component type on
// every render, so each scroll would remount the links and the underline would
// jump to the active link rather than sliding to it.
function Bar({
  className,
  hidden,
  activeId,
  menuOpen,
  setMenuOpen,
  scrollToSection,
}) {
  return (
    <nav
      className={`${styles.nav}${className ? ` ${className}` : ""}`}
      aria-hidden={hidden ? "true" : undefined}
      inert={hidden || undefined}
    >
      <div className={styles.inner}>
        <TextOverline
          as="a"
          href="#a-hero"
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

        <LinkList activeId={activeId} scrollToSection={scrollToSection} />
      </div>
    </nav>
  );
}

export default function Nav() {
  const activeId = useActiveSection(LINKS);
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
      <Bar
        activeId={activeId}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        scrollToSection={scrollToSection}
      />

      {/* Keeps the difference blend out of the greens, see Nav.module.css */}
      <Bar
        className={styles.hueGuard}
        hidden
        activeId={activeId}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        scrollToSection={scrollToSection}
      />

      {/* Mobile nav list */}
      <div className={`${styles.overlay}${menuOpen ? ` ${styles.open}` : ""}`}>
        <LinkList activeId={activeId} scrollToSection={scrollToSection} />
      </div>
    </>
  );
}

export function NavPlaceholder() {
  return <div className={styles.navPlaceholder} />;
}
