"use client";
import { useEffect, useState } from "react";
import styles from "./Nav.module.css";
import { LINKS } from "./data";
import { useActiveSection } from "./useActiveSection";
import { TextOverline } from "@/components/Text/Text";
import { Button } from "@/components/Button/Button";

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

  const LinkList = () => (
    <div className={styles.linkGroup}>
      <div className={styles.links}>
        {LINKS.map((n) => (
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
        {/* <Button
          href="#a-contact"
          onClick={(e) => scrollToSection(e, "a-contact")}
          className={styles.cta}
        >
          Work with us
        </Button> */}
      </div>
    </div>
  );

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

          <LinkList />
        </div>
      </nav>

      {/* Mobile nav list */}
      <div className={`${styles.overlay}${menuOpen ? ` ${styles.open}` : ""}`}>
        <LinkList />
      </div>
    </>
  );
}

export function NavPlaceholder() {
  return <div className={styles.navPlaceholder} />;
}
