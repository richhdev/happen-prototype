import { useState } from "react";
import styles from "./Nav.module.css";
import { LINKS } from "./data";
import { TextOverline } from "@/components/Text/Text";
import Underline from "./Underline";

export default function LinkList({ activeId, scrollToSection }) {
  const [list, setList] = useState(null);
  const [activeLink, setActiveLink] = useState(null);

  return (
    <div className={styles.links} ref={setList}>
      {LINKS.map((n) => (
        <TextOverline
          as="a"
          key={n.id}
          href={`#${n.id}`}
          ref={n.id === activeId ? setActiveLink : null}
          onClick={(e) => scrollToSection(e, n.id)}
          className={`${styles.link}${n.id === activeId ? ` ${styles.active}` : ""}`}
          aria-current={n.id === activeId ? "true" : undefined}
        >
          {n.label}
        </TextOverline>
      ))}
      <Underline list={list} link={activeLink} />
    </div>
  );
}
