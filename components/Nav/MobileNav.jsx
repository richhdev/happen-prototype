import styles from "./MobileNav.module.css";
import { LINKS } from "./data";
import { Heading3 } from "@/components/Heading/Heading";

/* The full-screen menu behind the bar's Menu button. It's a separate component
   from the bar's LinkList because almost nothing is shared: heading-sized
   links, each clipped by its own mask so the label can slide up into place,
   staggered down the stack and back out in reverse when the menu closes, and
   the active link marked by dimming the others rather than by the bar's
   sliding rule.

   The stagger is two custom properties per link rather than JS timers: --i
   counts down the list for the entrance, --r counts back up it for the exit,
   and each state picks the one it needs as its transition-delay. */
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
