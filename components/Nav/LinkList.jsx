import { useLayoutEffect, useRef, useState } from "react";
import styles from "./Nav.module.css";
import { LINKS } from "./data";
import { TextOverline } from "@/components/Text/Text";
import { Button } from "@/components/Button/Button";

/*
  One underline for the whole list, which slides to sit under the active link
  rather than each link drawing its own. Its position has to be measured — CSS
  can't size an element from a sibling (anchor positioning isn't in Firefox) —
  so the rule is measured against the list box and moved with a transform.
  Both axes are set, which covers the bar laying the links out in a row and the
  mobile overlay stacking them.
*/
export default function LinkList({ activeId, scrollToSection }) {
  const listRef = useRef(null);
  const linkRefs = useRef(new Map());
  // Keeps its last geometry while nothing is active, so the rule fades out
  // where it was instead of collapsing to the left of the list.
  const [rule, setRule] = useState({ x: 0, y: 0, width: 0, visible: false });

  useLayoutEffect(() => {
    const list = listRef.current;
    const link = linkRefs.current.get(activeId);
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
  }, [activeId]);

  return (
    <div className={styles.linkGroup}>
      <div className={styles.links} ref={listRef}>
        {LINKS.map((n) => (
          <TextOverline
            as="a"
            key={n.id}
            href={`#${n.id}`}
            ref={(el) => {
              if (el) linkRefs.current.set(n.id, el);
              else linkRefs.current.delete(n.id);
            }}
            onClick={(e) => scrollToSection(e, n.id)}
            className={`${styles.link}${n.id === activeId ? ` ${styles.active}` : ""}`}
            aria-current={n.id === activeId ? "true" : undefined}
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
        <span
          aria-hidden="true"
          className={`${styles.underline}${rule.visible ? ` ${styles.underlineVisible}` : ""}`}
          style={{
            width: `${rule.width}px`,
            transform: `translate(${rule.x}px, ${rule.y}px)`,
          }}
        />
      </div>
    </div>
  );
}
