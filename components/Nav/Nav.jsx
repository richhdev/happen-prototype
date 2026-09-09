"use client";
import { useEffect, useState } from "react";
import styles from "./Nav.module.css";
import { LINKS } from "./data";
import { useActiveSection } from "./useActiveSection";
import { TextOverline } from "@/components/Text/Text";
import LinkList from "./LinkList";
import MobileNav from "./MobileNav";

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
      block: id === "b-artists" ? "end" : "start", // artists section should land at the end of its animation
    });
  };

  const scrollToTop = (e) => {
    e.preventDefault();
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Bar
        activeId={activeId}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        scrollToSection={scrollToSection}
        scrollToTop={scrollToTop}
      />

      {/* keeps the navlinks from turning weird colors from `difference` */}
      <Bar
        className={styles.navHueGuard}
        hidden
        activeId={activeId}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        scrollToSection={scrollToSection}
        scrollToTop={scrollToTop}
      />

      <MobileNav
        open={menuOpen}
        activeId={activeId}
        scrollToSection={scrollToSection}
      />
    </>
  );
}

// Reserves the fixed bar's height in the page flow
export function NavPlaceholder() {
  return <div className={styles.navPlaceholder} />;
}

function Bar({
  className,
  hidden,
  activeId,
  menuOpen,
  setMenuOpen,
  scrollToSection,
  scrollToTop,
}) {
  return (
    <nav
      className={`${styles.navNav}${className ? ` ${className}` : ""}`}
      aria-hidden={hidden ? "true" : undefined}
      inert={hidden || undefined}
    >
      <div className={styles.navInner}>
        <TextOverline
          as="a"
          href="/"
          className={styles.navTitle}
          onClick={scrollToTop}
        >
          Happen Group
        </TextOverline>

        <button
          type="button"
          className={styles.navMenuToggle}
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
