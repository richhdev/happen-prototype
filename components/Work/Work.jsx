"use client";
import { useCallback, useRef, useState } from "react";
import {
  cubicBezier,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import { WORK } from "./data";
import { Section } from "@/components/Section/Section";
import { Heading2 } from "@/components/Heading/Heading";
import { useIsoLayoutEffect } from "@/components/ui";
import { useSidewaysScroll } from "./useSidewaysScroll";
import styles from "./Work.module.css";

// The red surface's pull-back curve: quick off the viewport edges, then easing
// down into the frame. Roughly easeOutQuad — steeper front-loads the break away
// but leaves a long crawl at the end.
const SHRINK_EASE = cubicBezier(0.5, 1, 0.89, 1);

export default function Work() {
  const containerRef = useRef(null);
  const cardRefs = useRef([]);
  const [maxOffset, setMaxOffset] = useState(0);
  const [active, setActive] = useState(0);

  // Determine how long the track needs to be to bring the last card to the centre of the viewport.
  // Remeasured if the viewport resizes.
  useIsoLayoutEffect(() => {
    const measure = () => {
      const first = cardRefs.current[0];
      const last = cardRefs.current[cardRefs.current.length - 1];
      if (!first || !last) return;
      setMaxOffset(Math.max(0, last.offsetLeft - first.offsetLeft));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // The track pans its full width across the section's whole scroll distance, so
  // the section unpins on the frame the last card reaches the centre.
  const trackX = useTransform(scrollYProgress, [0, 1], [0, -maxOffset]);

  // The surface pulls back over that same stretch, landing framed as the last
  // card does. Eased out so it breaks away from the viewport edges quickly and
  // then creeps the last of the way in — a linear run this long reads as the
  // frame barely moving at the start.
  const framed = useTransform(scrollYProgress, [0, 1], [0, 1], {
    ease: SHRINK_EASE,
  });

  // The card nearest the viewport centre is the featured one.
  const step = WORK.length > 1 ? maxOffset / (WORK.length - 1) : 0;
  const syncActive = useCallback(
    (value) => {
      if (!step) return;
      const i = Math.round(-value / step);
      const next = Math.min(WORK.length - 1, Math.max(0, i));
      setActive((prev) => (prev === next ? prev : next));
    },
    [step],
  );

  useMotionValueEvent(trackX, "change", syncActive);

  // Clicking a card scrolls it to the center
  const scrollToCard = useCallback(
    (index) => {
      const container = containerRef.current;
      if (!container || !step) return;
      const top = container.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top + index * step, behavior: "smooth" });
    },
    [step],
  );

  // A sideways gesture over the section drives the same vertical scroll, so
  // reaching for the cards directly moves them instead of doing nothing.
  useSidewaysScroll(containerRef);

  // "change" only fires on later updates, so the track would keep card 0
  // featured until the first scroll — wrong for a reload part-way down the page.
  useIsoLayoutEffect(() => syncActive(trackX.get()), [syncActive, trackX]);

  return (
    <Section id="b-work" className={styles.workSection}>
      <div
        ref={containerRef}
        className={styles.workScrollContainer}
        style={{ height: `calc(100vh + ${maxOffset}px)` }}
      >
        <div className={styles.workPinned}>
          <motion.div
            className={styles.workContentGroup}
            style={{
              "--progress": framed,
            }}
          >
            <div className={styles.workSurface} />

            <Heading2 className={styles.workHeading}>
              The proof is <br className="desktop-only" />
              in the Happening
            </Heading2>

            <motion.div className={styles.workTrack} style={{ x: trackX }}>
              {WORK.map((item, i) => (
                <WorkCard
                  key={item.name}
                  item={item}
                  index={i}
                  step={step}
                  x={trackX}
                  active={i === active}
                  cardRef={(el) => (cardRefs.current[i] = el)}
                  onActivate={scrollToCard}
                />
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}

function WorkCard({ item, index, step, x, active, cardRef, onActivate }) {
  // The featured-state visuals — scale, background, image dim — are derived
  // from this in CSS, so the transition tracks the scrollbar instead of firing
  // a fixed-duration transition when the active card flips.
  const centred = useCentred(x, index, step);

  return (
    <motion.article
      ref={cardRef}
      className={`${styles.workCard} ${active ? styles.workCardActive : ""}`}
      style={{ "--centred": centred }}
      onClick={active ? undefined : () => onActivate(index)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.img}
        alt=""
        className={styles.workImage}
        style={item.crop}
      />

      <div className={styles.workOverlay} />

      <div className={styles.workLogoWrap}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.logo}
          alt={item.name}
          className={styles.workLogo}
          style={{
            "--logo-w": item.logoWidth,
            "--logo-h": item.logoHeight,
            "--logo-opacity": item.logoOpacity,
          }}
        />
      </div>

      <div className={styles.workContent}>
        <div className={styles.workText}>
          {item.tag.map((line) => (
            <div key={line}>{line}</div>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

// How centred a card is, 0 (a full step away or more) to 1 (dead centre), on a
// smoothstep curve so it holds its size for a beat at the centre and hands over
// quickly in between. Card i sits at the centre when x === -i * step.
function useCentred(x, index, step) {
  return useTransform(x, (value) => {
    if (!step) return 0;
    const distance = Math.abs(value + index * step) / step;
    const t = distance >= 1 ? 0 : 1 - distance;
    return t * t * (3 - 2 * t);
  });
}
