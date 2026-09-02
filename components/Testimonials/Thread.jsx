"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { EASE } from "@/lib/data";
import styles from "./Testimonials.module.css";
import { TESTIMONIALS } from "./data";

// The thread plays like messages landing one after another: every bubble starts
// minimised at its tail, pops open in turn, and the feed scrolls itself so the
// one that just landed sits at the bottom of the screen.

// Pause before the first message, then how long each one holds the thread
// before the next lands. Milliseconds.
const LEAD_IN = 500;
const STEP = 2400;

// Breathing room left under a message once it has been scrolled into place.
const BOTTOM_INSET = 24;

const bubble = {
  hidden: { opacity: 0, scale: 0.4 },
  shown: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: EASE } },
};

export default function Thread() {
  const feedRef = useRef(null);
  const rowRefs = useRef([]);
  // Index of the last message to have landed; -1 is the whole thread minimised.
  const [landed, setLanded] = useState(-1);
  const inView = useInView(feedRef, { amount: 0.2 });

  // Rewinds when the section leaves view so it replays on the way back, the
  // same as the Reveal fades elsewhere on the page.
  useEffect(() => {
    if (!inView) {
      setLanded(-1);
      feedRef.current?.scrollTo({ top: 0 });
      return;
    }
    let i = -1;
    let timer;
    const step = () => {
      i += 1;
      setLanded(i);
      if (i < TESTIMONIALS.length - 1) timer = setTimeout(step, STEP);
    };
    timer = setTimeout(step, LEAD_IN);
    return () => clearTimeout(timer);
  }, [inView]);

  useEffect(() => {
    const feed = feedRef.current;
    const row = rowRefs.current[landed];
    if (landed < 0 || !feed || !row) return;

    // offsetTop rather than a client rect: the row is still scaled down at this
    // point, and offsets are layout values that transforms don't touch. Rows
    // and the feed share an offsetParent (the phone, or its screen on desktop),
    // so the difference is the row's position within the feed's content.
    const top = row.offsetTop - feed.offsetTop;
    // A message taller than the screen aligns to the top instead, so the part
    // that gets cut off is its tail rather than its opening line. It lands on
    // the feed's own top padding, which is what holds a message clear of the
    // notch on desktop and out from under the scrim on mobile.
    const topInset =
      parseFloat(getComputedStyle(feed).paddingTop) || BOTTOM_INSET;
    const overflows =
      row.offsetHeight > feed.clientHeight - topInset - BOTTOM_INSET;
    const target = overflows
      ? top - topInset
      : top + row.offsetHeight - feed.clientHeight + BOTTOM_INSET;

    feed.scrollTo({ top: Math.max(0, target), behavior: "smooth" });
  }, [landed]);

  return (
    <ol className={styles.feed} ref={feedRef}>
      {TESTIMONIALS.map((item, i) => {
        // Even entries sit on the left in red, odd on the right in charcoal,
        // mirroring a two-way message thread.
        const flipped = i % 2 === 1;
        return (
          <motion.li
            key={`${item.name}-${i}`}
            ref={(el) => {
              rowRefs.current[i] = el;
            }}
            className={`${styles.row} ${flipped ? styles.rowFlipped : ""}`}
            variants={bubble}
            initial="hidden"
            animate={i <= landed ? "shown" : "hidden"}
          >
            <figure className={styles.bubble}>
              <figcaption className={styles.author}>
                {item.name} - {item.role}
              </figcaption>
              <blockquote className={styles.quote}>{item.quote}</blockquote>
              <span className={styles.tail} aria-hidden="true" />
            </figure>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.avatar}
              alt={`${item.name}, ${item.role}`}
              className={styles.avatar}
              width={50}
              height={50}
              loading="lazy"
            />
          </motion.li>
        );
      })}
    </ol>
  );
}
