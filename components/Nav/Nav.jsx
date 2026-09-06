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

  return (
    <>
      <Bar
        activeId={activeId}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        scrollToSection={scrollToSection}
      />

      {/* keeps the navlinks from turning weird colors from `difference` */}
      <Bar
        className={styles.hueGuard}
        hidden
        activeId={activeId}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        scrollToSection={scrollToSection}
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
