"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { cubicBezier, motion, useScroll, useTransform } from "motion/react";
import { SERVICES } from "./data";
import { Section } from "@/components/Section/Section";
import { Heading2, Heading3 } from "@/components/Heading/Heading";
import { TextMedium, TextOverline, TextXXLarge } from "@/components/Text/Text";
import { useIsoLayoutEffect } from "@/components/ui";
import { asset } from "@/lib/data";
import styles from "./Services.module.css";

const centre = (r) => r.top + r.height / 2;

export default function Services() {
  const sectionRef = useRef(null);
  const itemRefs = useRef([]);
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

  // The ribbon creeps up with the page rather than sitting pinned to the card,
  // so it travels the same way as the list scrolling past it, just slower.
  // Straight off scroll progress rather than the eased surface growth, or the
  // drift would stall in the middle of the section and hurry at both ends.
  const ribbonDrift = useTransform(scrollYProgress, [0, 1], ["80px", "-80px"]);

  const sync = useCallback(() => {
    const line = window.innerHeight / 2;
    let best = 0;
    let bestDist = Infinity;
    itemRefs.current.forEach((node, i) => {
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

  useIsoLayoutEffect(sync, [sync]);

  // Scroll to a specific service item
  const scrollToItem = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    window.scrollBy({
      top: centre(rect) - window.innerHeight / 2,
      behavior: "smooth",
    });
  };

  return (
    <Section
      as={motion.section}
      id="a-services"
      className={styles.services}
      ref={sectionRef}
      style={{ "--progress": grown, "--ribbon-drift": ribbonDrift }}
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

      <div className={styles.ribbonLayer} aria-hidden>
        <div className={styles.ribbonSticky}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset("/assets/ribbon-services.png")}
            alt=""
            className={styles.ribbon}
            loading="lazy"
          />
        </div>
      </div>

      <div className={styles.cardLayer} aria-hidden>
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
