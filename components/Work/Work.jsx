"use client";
import { useCallback, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import { WORK } from "./data";
import { Section } from "@/components/Section/Section";
import { Heading2 } from "@/components/Heading/Heading";
import { Reveal, useIsoLayoutEffect } from "@/components/ui";
import styles from "./Work.module.css";

// Extra scroll left at the end so the last card can sit centred for a beat
// before the section unpins.
const HOLD_PX = 400;

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

function WorkCard({ item, index, step, x, active, cardRef }) {
  // The featured-state visuals — scale, background, image dim — are derived
  // from this in CSS, so the transition tracks the scrollbar instead of firing
  // a fixed-duration transition when the active card flips.
  const centred = useCentred(x, index, step);

  return (
    <motion.article
      ref={cardRef}
      className={`${styles.card} ${active ? styles.cardActive : ""}`}
      style={{ "--t": centred }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={item.img} alt="" className={styles.image} style={item.crop} />
      <div className={styles.overlay} />

      <div className={styles.logoWrap}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.logo}
          alt={item.name}
          className={styles.logo}
          style={{
            "--logo-w": item.logoWidth,
            "--logo-h": item.logoHeight,
            "--logo-opacity": item.logoOpacity,
          }}
        />
      </div>

      <div className={styles.content}>
        <div className={styles.text}>
          {item.tag.map((line) => (
            <div key={line}>{line}</div>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

export default function Work() {
  const containerRef = useRef(null);
  const cardRefs = useRef([]);
  const [max, setMax] = useState(0);
  const [active, setActive] = useState(0);

  // Determine how long the track needs to be to bring the last card to the centre of the viewport.
  // Remeasured if the viewport resizes.
  useIsoLayoutEffect(() => {
    const measure = () => {
      const first = cardRefs.current[0];
      const last = cardRefs.current[cardRefs.current.length - 1];
      if (!first || !last) return;
      setMax(Math.max(0, last.offsetLeft - first.offsetLeft));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Pan the track across its full width over the section's scroll distance,
  // then hold on the last card for the remaining HOLD_PX.
  const total = max + HOLD_PX;
  const panEnd = total > 0 ? max / total : 0;
  const x = useTransform(scrollYProgress, [0, panEnd], [0, -max]);

  // The card nearest the viewport centre is the featured one. The track's
  // padding centres card 0 at x=0 and every card occupies the same layout step,
  // so the index falls straight out of the pan offset. Reading rects instead
  // would measure the previous frame — "change" fires before motion paints.
  const step = WORK.length > 1 ? max / (WORK.length - 1) : 0;
  const syncActive = useCallback(
    (value) => {
      if (!step) return;
      const i = Math.round(-value / step);
      const next = Math.min(WORK.length - 1, Math.max(0, i));
      setActive((prev) => (prev === next ? prev : next));
    },
    [step],
  );

  useMotionValueEvent(x, "change", syncActive);

  // "change" only fires on later updates, so the track would keep card 0
  // featured until the first scroll — wrong for a reload part-way down the page.
  useIsoLayoutEffect(() => syncActive(x.get()), [syncActive, x]);

  return (
    <Section id="b-work" className={styles.work}>
      <div
        ref={containerRef}
        style={{ height: `calc(100vh + ${max + HOLD_PX}px)` }}
      >
        <div className={styles.pinned}>
          <div className={styles.panel}>
            <Heading2 className={styles.heading}>
              The proof is <br className="desktop-only" />
              in the Happening
            </Heading2>

            <motion.div className={styles.track} style={{ x }}>
              {WORK.map((item, i) => (
                <WorkCard
                  key={item.name}
                  item={item}
                  index={i}
                  step={step}
                  x={x}
                  active={i === active}
                  cardRef={(el) => (cardRefs.current[i] = el)}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </Section>
  );
}
