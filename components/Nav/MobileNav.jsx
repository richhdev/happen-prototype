import styles from "./MobileNav.module.css";
import { LINKS } from "./data";
import { Heading3 } from "@/components/Heading/Heading";

export default function MobileNav({ open, activeId, scrollToSection }) {
  return (
    <div
      className={`${styles.mobileNavOverlay}${open ? ` ${styles.mobileNavOpen}` : ""}`}
      inert={!open || undefined}
    >
      <div className={styles.mobileNavLinks}>
        {LINKS.map((n, i) => (
          <a
            key={n.id}
            href={`#${n.id}`}
            onClick={(e) => scrollToSection(e, n.id)}
            className={`${styles.mobileNavLink}${n.id === activeId ? ` ${styles.mobileNavActive}` : ""}`}
            aria-current={n.id === activeId ? "true" : undefined}
            style={{ "--i": i, "--r": LINKS.length - 1 - i }}
          >
            <span className={styles.mobileNavMask}>
              <Heading3
                as="span"
                animateTracking={false}
                className={styles.mobileNavLabel}
              >
                {n.label}
              </Heading3>
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
