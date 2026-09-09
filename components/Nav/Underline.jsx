import { useLayoutEffect, useState } from "react";
import styles from "./Nav.module.css";

/* One underline for the list, sliding to the active link. CSS can't size an
   element from a sibling (no anchor positioning in Firefox), so it's measured
   against the list box — both axes, for the row bar and the stacked overlay.
   Must render inside `list`, which is its containing block and scroll box. */
export default function Underline({ list, link }) {
  // Keeps its last geometry while nothing is active, so the rule fades out
  // where it was instead of collapsing to the left of the list.
  const [rule, setRule] = useState({ x: 0, y: 0, width: 0, visible: false });

  useLayoutEffect(() => {
    if (!list || !link) {
      setRule((r) => ({ ...r, visible: false }));
      return;
    }

    const measure = () => {
      const listBox = list.getBoundingClientRect();
      const linkBox = link.getBoundingClientRect();
      setRule({
        x: linkBox.left - listBox.left + list.scrollLeft,
        y: linkBox.bottom - listBox.top + list.scrollTop,
        width: linkBox.width,
        visible: true,
      });
    };
    measure();

    // Catches the viewport resizing, the list scrolling sideways on a narrow
    // bar, and the webfont landing and changing the link's width.
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    observer.observe(link);
    list.addEventListener("scroll", measure, { passive: true });
    return () => {
      observer.disconnect();
      list.removeEventListener("scroll", measure);
    };
  }, [list, link]);

  return (
    <span
      aria-hidden="true"
      className={`${styles.navUnderline}${rule.visible ? ` ${styles.navUnderlineVisible}` : ""}`}
      style={{
        width: `${rule.width}px`,
        transform: `translate(${rule.x}px, ${rule.y}px)`,
      }}
    />
  );
}
