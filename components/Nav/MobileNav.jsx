import styles from "./MobileNav.module.css";
import { LINKS } from "./data";
import { Heading3 } from "@/components/Heading/Heading";

export default function MobileNav({ open, activeId, scrollToSection }) {
  return (
    <div
      className={`${styles.overlay}${open ? ` ${styles.open}` : ""}`}
      inert={!open || undefined}
    >
      <div className={styles.links}>
        {LINKS.map((n, i) => (
          <a
            key={n.id}
            href={`#${n.id}`}
            onClick={(e) => scrollToSection(e, n.id)}
            className={`${styles.link}${n.id === activeId ? ` ${styles.active}` : ""}`}
            aria-current={n.id === activeId ? "true" : undefined}
            style={{ "--i": i, "--r": LINKS.length - 1 - i }}
          >
            <span className={styles.mask}>
              <Heading3
                as="span"
                animateTracking={false}
                className={styles.label}
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
