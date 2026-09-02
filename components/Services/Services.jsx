"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { SERVICES } from "./data";
import { Section } from "@/components/Section/Section";
import { Heading2, Heading3 } from "@/components/Heading/Heading";
import { TextMedium, TextOverline, TextXXLarge } from "@/components/Text/Text";
import { useIsoLayoutEffect } from "@/components/ui";
import styles from "./Services.module.css";

const centre = (r) => r.top + r.height / 2;

export default function Services() {
  const rowRefs = useRef([]);
  const [active, setActive] = useState(0);

  const sync = useCallback(() => {
    const line = window.innerHeight / 2;
    let best = 0;
    let bestDist = Infinity;
    rowRefs.current.forEach((node, i) => {
      if (!node) return;
      const dist = Math.abs(centre(node.getBoundingClientRect()) - line);
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
    if (!node) return;
    window.scrollBy({
      top: centre(node.getBoundingClientRect()) - window.innerHeight / 2,
      behavior: "smooth",
    });
  };

  return (
    <Section id="a-services" className={styles.services}>
      <div className={styles.container}>
        <div className={styles.head}>
          <Heading2 className={styles.heading}>How we make it Happen</Heading2>
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

      <div className={styles.surface} aria-hidden>
        <div className={styles.surfaceBg} />
        <div className={styles.cardSticky}>
          <div className={styles.card}>
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
