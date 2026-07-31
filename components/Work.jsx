"use client";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { SectionHead, useIsoLayoutEffect } from "@/components/ui";
import { WORK } from "@/lib/data";
import styles from "./Work.module.css";

// Must match the card/track layout in Work.module.css (.card width, .track gap/padding).
const CARD_W = 280;
const GAP = 20;
const PAD_LEFT = 48;
const STEP = CARD_W + GAP;

// Scales up as its center nears the viewport center, back down as it scrolls away.
function WorkCard({ w, index, x, wrapRef }) {
  const distance = useTransform(x, (latestX) => {
    const wrapW = wrapRef.current?.clientWidth || 0;
    const centerTrack = PAD_LEFT + index * STEP + CARD_W / 2;
    return centerTrack + latestX - wrapW / 2;
  });
  const z = useTransform(distance, [-STEP, 0, STEP], [-160, 80, -160]);

  return (
    <motion.div className={styles.card} style={{ z }}>
      <div
        className={styles.cardBgImage}
        style={{ backgroundImage: `url('${w.bg}')` }}
      />
      <div className={styles.cardGradient} />
      <div className={styles.logoWrap}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={w.logo}
          alt={w.title}
          className={styles.logo}
          style={{ height: w.logoH || 40 }}
        />
      </div>
      <div className={styles.textWrap}>
        <h3 className={styles.title}>{w.title}</h3>
        <div className={styles.tag}>{w.tag}</div>
      </div>
    </motion.div>
  );
}

export default function Work() {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const wrapRef = useRef(null);
  const [max, setMax] = useState(0);

  useIsoLayoutEffect(() => {
    const measure = () => {
      if (!trackRef.current || !wrapRef.current) return;
      const m = Math.max(
        0,
        trackRef.current.scrollWidth - wrapRef.current.clientWidth,
      );
      setMax(m);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, (v) => -(v * max));
  const bgY = useTransform(scrollYProgress, [0, 1], ["0px", "-400px"]);

  return (
    <section id="b-work" className={styles.section}>
      <div ref={containerRef} className={styles.container}>
        <motion.div
          className={styles.sticky}
          style={{ backgroundPositionY: bgY }}
        >
          <SectionHead
            eyebrow="Work"
            title={
              <>
                The proof is
                <br />
                in the Happening
              </>
            }
            eyebrowColor="#111"
            color="#fff"
            style={{ marginBottom: 40 }}
          />

          <div className={styles.wrap} ref={wrapRef}>
            <motion.div ref={trackRef} className={styles.track} style={{ x }}>
              {WORK.map((w, i) => (
                <WorkCard key={i} w={w} index={i} x={x} wrapRef={wrapRef} />
              ))}
              <div className={styles.spacer} />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
