"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { cubicBezier, motion, useScroll, useTransform } from "motion/react";
import { SERVICES } from "./data";
import { Section } from "@/components/Section/Section";
import { Heading2, Heading3 } from "@/components/Heading/Heading";
import { TextMedium, TextOverline, TextXXLarge } from "@/components/Text/Text";
import { useIsoLayoutEffect } from "@/components/ui";
import styles from "./Services.module.css";

/* Where a title has to get to before it is the current service, and which of
   its edges has to get there. Both breakpoints measure against the card, since
   that is what the title is being read alongside — but against opposite edges
   of it, because the card sits in a different place in each. On desktop it is
   beside the list, so a title takes over as it draws level with the card's
   bottom. On mobile it is over the lower half of the screen, so the line is the
   card's top and it is the title's bottom that has to cross it — the moment the
   whole title has been revealed from behind the card. */
const focusLine = (cardEl) => {
  const card = cardEl?.getBoundingClientRect();
  const fallback = window.innerHeight / 2;
  if (window.matchMedia("(min-width: 768px)").matches) {
    return {
      at: card ? card.bottom : fallback,
      edgeOf: (r) => r.top + r.height / 2,
    };
  }
  return { at: card ? card.top : fallback, edgeOf: (r) => r.bottom };
};

export default function Services() {
  const sectionRef = useRef(null);
  const itemRefs = useRef([]);
  const cardRef = useRef(null);
  const [active, setActive] = useState(0);

  // Track the section's scroll progress while the section is sticky
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Ease the growth of the cream surface, so it doesn't slam into the viewport edges
  const grown = useTransform(scrollYProgress, [0, 1], [0, 1], {
    ease: cubicBezier(0.45, 0, 0.55, 1),
  });

  const sync = useCallback(() => {
    const { at, edgeOf } = focusLine(cardRef.current);
    // The last title to have crossed the line, rather than the one nearest it.
    // Nearest flips at the midpoint between two titles, so a title would take
    // over while it was still half a gap short of the line — and these gaps are
    // large enough that half of one is most of the way down the screen. Items
    // are in document order, so the last one to test as crossed is the lowest.
    let next = 0;
    itemRefs.current.forEach((node, i) => {
      if (node && edgeOf(node.getBoundingClientRect()) <= at) next = i;
    });
    setActive((prev) => (prev === next ? prev : next));
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync, { passive: true });
    return () => {
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [sync]);

  useIsoLayoutEffect(sync, [sync]);

  // Scroll a service up to the same line, so clicking it makes it the current one
  const scrollToItem = (e) => {
    const { at, edgeOf } = focusLine(cardRef.current);
    window.scrollBy({
      top: edgeOf(e.currentTarget.getBoundingClientRect()) - at,
      behavior: "smooth",
    });
  };

  return (
    <Section
      as={motion.section}
      id="a-services"
      className={styles.services}
      ref={sectionRef}
      style={{
        "--progress": grown,
      }}
    >
      <div className={styles.surfaceLayer} aria-hidden>
        <div className={styles.surface} />
      </div>

      <div className={styles.copy}>
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
              ref={(el) => (itemRefs.current[i] = el)}
              onClick={scrollToItem}
              className={styles.listItem}
              data-active={i === active ? "" : undefined}
            >
              <Heading3 as="span" sentence>
                {service.title}
              </Heading3>
              <TextOverline>{service.meta}</TextOverline>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.cardLayer} aria-hidden>
        <div className={styles.cardSticky}>
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
