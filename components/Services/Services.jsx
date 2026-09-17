"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { cubicBezier, motion, useScroll, useTransform } from "framer-motion";
import { DEFAULT_IMG, SERVICES } from "./data";
import { Section } from "@/components/Section/Section";
import { Heading2, Heading3 } from "@/components/Heading/Heading";
import { TextMedium, TextOverline } from "@/components/Text/Text";
import { useIsoLayoutEffect } from "@/components/ui";
import styles from "./Services.module.css";

const debugFocusLine = false;
const mobileItemGap = 24;

// Which edge of the card counts as "current", and which edge of a title has
// to cross it. Desktop reads titles beside the card, so a title takes over at
// the card's bottom edge; mobile reads them over the card, so it's the card's
// top edge and the title's bottom.
const focusLine = (cardEl) => {
  const card = cardEl?.getBoundingClientRect();
  const fallback = window.innerHeight / 2;
  if (window.matchMedia("(min-width: 1024px)").matches) {
    return {
      at: card ? card.bottom : fallback,
      edgeOf: (el) => {
        const r = el.getBoundingClientRect();
        return r.top + r.height / 2;
      },
    };
  }
  return {
    at: card ? card.top : fallback,
    edgeOf: (el) => el.firstElementChild.getBoundingClientRect().bottom,
  };
};

export default function Services() {
  const sectionRef = useRef(null);
  const itemRefs = useRef([]);
  const cardRef = useRef(null);
  const debugLineRef = useRef(null);
  const [active, setActive] = useState(-1);

  // Track the section's scroll progress while the section is sticky
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Ease the growth of the cream surface, so it doesn't slam into the viewport edges
  const easedProgress = useTransform(scrollYProgress, [0, 1], [0, 1], {
    ease: cubicBezier(0.45, 0, 0.55, 1),
  });

  const sync = useCallback(() => {
    const { at, edgeOf } = focusLine(cardRef.current);

    if (debugFocusLine && debugLineRef.current)
      debugLineRef.current.style.top = `${at}px`;

    // Last item to have crossed the line, not the nearest one — nearest flips
    // at the midpoint between titles, well before the line.
    let next = -1;
    itemRefs.current.forEach((node, i) => {
      if (node && edgeOf(node) <= at) next = i;
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

  // Past the focus line, so the clicked service is the current one: centred on
  // the card on desktop, sat fully above it on mobile
  const scrollToItem = (e) => {
    const card = cardRef.current.getBoundingClientRect();
    const item = e.currentTarget.getBoundingClientRect();
    const top = window.matchMedia("(min-width: 1024px)").matches
      ? item.top + item.height / 2 - (card.top + card.height / 2)
      : item.bottom + mobileItemGap - card.top;
    window.scrollBy({ top, behavior: "smooth" });
  };

  return (
    <Section
      as={motion.section}
      id="a-services"
      ref={sectionRef}
      className={styles.servicesSection}
      innerClassName={styles.servicesInner}
      style={{
        "--progress": easedProgress,
      }}
    >
      <div className={styles.servicesSurfaceLayer} aria-hidden>
        <div className={styles.servicesSurface} />
      </div>

      <div className={styles.servicesContentGroup}>
        <div className={styles.servicesHead}>
          <Heading2 className={styles.servicesHeading}>
            How we make it Happen
          </Heading2>
          <TextMedium className={styles.servicesCopy}>
            We&rsquo;ve built a broad operational capability and a national
            network to match.
          </TextMedium>
        </div>

        <div className={styles.servicesList}>
          {SERVICES.map((service, i) => (
            <button
              key={service.title}
              type="button"
              ref={(el) => (itemRefs.current[i] = el)}
              onClick={scrollToItem}
              className={styles.servicesListItem}
              data-active={i === active ? "" : undefined}
            >
              <Heading3 as="span" sentence>
                {service.title}
              </Heading3>
              <TextMedium className={styles.servicesListMeta}>
                {service.meta}
              </TextMedium>
              <TextMedium as="span" className={styles.servicesListDesc}>
                {service.desc}
              </TextMedium>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.servicesCardLayer} aria-hidden>
        <div className={styles.servicesCardSticky}>
          <div className={styles.servicesCard} ref={cardRef}>
            <div
              className={styles.servicesSlide}
              data-active={active === -1 ? "" : undefined}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={DEFAULT_IMG}
                alt=""
                className={styles.servicesSlideImage}
              />
            </div>
            {SERVICES.map((service, i) => (
              <div
                key={service.title}
                className={styles.servicesSlide}
                data-active={i === active ? "" : undefined}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={service.img}
                  srcSet={`${service.img.replace(/\.webp$/, "-mobile.webp")} 800w, ${service.img} 950w`}
                  sizes="(min-width: 1024px) 600px, min(100vw, 400px)"
                  alt=""
                  className={styles.servicesSlideImage}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DEBUG: focus line */}
      {debugFocusLine && (
        <div
          ref={debugLineRef}
          aria-hidden
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            height: "2px",
            background: "limegreen",
            zIndex: 9999,
            pointerEvents: "none",
          }}
        />
      )}
    </Section>
  );
}
