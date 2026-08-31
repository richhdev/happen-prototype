"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { SERVICES } from "./data";
import { Section } from "@/components/Section/Section";
import { Heading2, Heading3 } from "@/components/Heading/Heading";
import { TextMedium, TextOverline, TextXXLarge } from "@/components/Text/Text";
import { useIsoLayoutEffect } from "@/components/ui";
import styles from "./Services.module.css";

const DESKTOP = "(min-width: 768px)";

// Where the active row lines up against the card. Both breakpoints read the
// card's live rect, so CSS stays the single source of truth for the geometry:
// desktop shares a centre line with the card, mobile sits the row straight on
// top of it. `anchor` is the edge of a row that has to reach `line`.
function focus(card) {
  const rect = card.getBoundingClientRect();
  return window.matchMedia(DESKTOP).matches
    ? { line: rect.top + rect.height / 2, anchor: (r) => r.top + r.height / 2 }
    : { line: rect.top, anchor: (r) => r.bottom };
}

export default function Services() {
  const cardRef = useRef(null);
  const rowRefs = useRef([]);
  const [active, setActive] = useState(0);

  const sync = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    const { line, anchor } = focus(card);
    let best = 0;
    let bestDist = Infinity;
    rowRefs.current.forEach((node, i) => {
      if (!node) return;
      const dist = Math.abs(anchor(node.getBoundingClientRect()) - line);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    setActive((prev) => (prev === best ? prev : best));
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync, { passive: true });
    return () => {
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [sync]);

  // Scroll listeners only fire on later updates, so the card would show service
  // one until the first scroll — wrong on a reload part-way down the page.
  useIsoLayoutEffect(sync, [sync]);

  const scrollToRow = (i) => {
    const node = rowRefs.current[i];
    const card = cardRef.current;
    if (!node || !card) return;
    const { line, anchor } = focus(card);
    window.scrollBy({
      top: anchor(node.getBoundingClientRect()) - line,
      behavior: "smooth",
    });
  };

  return (
    <Section id="a-services" className={styles.services}>
      <div className={styles.panel}>
        <div className={styles.panelBg} aria-hidden />

        <div className={styles.container}>
          <div className={styles.head}>
            <Heading2 className={styles.heading}>
              How we make it Happen
            </Heading2>
            <TextMedium className={styles.intro}>
              We&rsquo;ve built a broad operational capability and a national
              network to match.
            </TextMedium>
          </div>

          <div className={styles.list}>
            {SERVICES.map((service, i) => (
              <button
                key={service.title}
                type="button"
                ref={(el) => (rowRefs.current[i] = el)}
                onClick={() => scrollToRow(i)}
                className={styles.row}
                data-active={i === active ? "" : undefined}
              >
                <Heading3 as="span" sentence className={styles.rowTitle}>
                  {service.title}
                </Heading3>
                <TextOverline className={styles.rowMeta}>
                  {service.meta}
                </TextOverline>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.preview} aria-hidden>
        <div className={styles.previewSticky}>
          <div className={styles.card} ref={cardRef}>
            {SERVICES.map((service, i) => (
              <div
                key={service.title}
                className={styles.slide}
                data-active={i === active ? "" : undefined}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={service.img}
                  alt=""
                  className={styles.slideImage}
                  loading={i === 0 ? undefined : "lazy"}
                />
                <div className={styles.slideGradient} />
                <TextXXLarge className={styles.slideText}>
                  {service.desc}
                </TextXXLarge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
