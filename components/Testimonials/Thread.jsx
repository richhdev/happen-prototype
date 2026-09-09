"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { EASE } from "@/lib/data";
import styles from "./Testimonials.module.css";
import { TESTIMONIALS } from "./data";

// Each message pops in as a typing pill, expands into the bubble, and the feed
// scrolls to keep the live one at the bottom of the screen.

// Milliseconds: pause before the first message, dots before it expands, and the
// gap between messages.
const LEAD_IN = 500;
const TYPING = 900;
const STEP = 2400;

// Breathing room under a message once scrolled into place.
const BOTTOM_INSET = 24;

const bubble = {
  hidden: { opacity: 0, scale: 0.4 },
  shown: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: EASE } },
};

// A layout animation rather than a height transition, so the row is at its
// final size in the DOM and the scroll below can measure it while it opens.
const expand = { duration: 0.45, ease: EASE };

export default function Thread() {
  const feedRef = useRef(null);
  const rowRefs = useRef([]);
  // Last message to have expanded, and the one showing its dots; -1 is not yet.
  const [landed, setLanded] = useState(-1);
  const [typing, setTyping] = useState(-1);
  const inView = useInView(feedRef, { amount: 0.2 });
  // Once the visitor scrolls the thread themselves the messages keep arriving,
  // but the feed stops dragging itself to the newest one.
  const takenOver = useRef(false);
  const active = Math.max(landed, typing);

  // Rewinds out of view so it replays on the way back.
  useEffect(() => {
    if (!inView) {
      setLanded(-1);
      setTyping(-1);
      takenOver.current = false;
      feedRef.current?.scrollTo({ top: 0 });
      return;
    }
    // A flat timeline of two timers per message keeps the beats from drifting.
    const timers = TESTIMONIALS.flatMap((_, i) => {
      const at = LEAD_IN + i * STEP;
      return [
        setTimeout(() => setTyping(i), at),
        setTimeout(() => {
          setTyping(-1);
          setLanded(i);
        }, at + TYPING),
      ];
    });
    return () => timers.forEach(clearTimeout);
  }, [inView]);

  // Input events only, never scroll itself, which the smooth scroll below fires.
  useEffect(() => {
    const feed = feedRef.current;
    if (!feed) return;
    const takeOver = () => {
      takenOver.current = true;
    };
    feed.addEventListener("wheel", takeOver, { passive: true });
    feed.addEventListener("touchmove", takeOver, { passive: true });
    feed.addEventListener("keydown", takeOver);
    return () => {
      feed.removeEventListener("wheel", takeOver);
      feed.removeEventListener("touchmove", takeOver);
      feed.removeEventListener("keydown", takeOver);
    };
  }, []);

  // Runs on both beats: the dots arriving, then the message pushing the thread
  // down as it expands.
  useEffect(() => {
    const feed = feedRef.current;
    const row = rowRefs.current[active];
    if (active < 0 || !feed || !row || takenOver.current) return;

    // offsetTop, not a client rect: the row is still scaled down, and offsets
    // ignore transforms. It shares an offsetParent with the feed.
    const top = row.offsetTop - feed.offsetTop;
    // A message taller than the screen aligns to the top padding instead, so
    // what gets cut off is its tail rather than its opening line.
    const topInset =
      parseFloat(getComputedStyle(feed).paddingTop) || BOTTOM_INSET;
    const overflows =
      row.offsetHeight > feed.clientHeight - topInset - BOTTOM_INSET;
    const target = overflows
      ? top - topInset
      : top + row.offsetHeight - feed.clientHeight + BOTTOM_INSET;

    feed.scrollTo({ top: Math.max(0, target), behavior: "smooth" });
  }, [active, landed]);

  return (
    <ol className={styles.testimonialsFeed} ref={feedRef}>
      {TESTIMONIALS.map((item, i) => {
        // Odd entries mirror to the other side of the thread.
        const flipped = i % 2 === 1;
        return (
          <motion.li
            key={`${item.name}-${i}`}
            ref={(el) => {
              rowRefs.current[i] = el;
            }}
            className={`${styles.testimonialsRow} ${flipped ? styles.testimonialsRowFlipped : ""}`}
            variants={bubble}
            initial="hidden"
            animate={i <= active ? "shown" : "hidden"}
          >
            <motion.figure
              layout
              transition={expand}
              className={`${styles.testimonialsBubble} ${
                i > landed ? styles.testimonialsBubbleTyping : ""
              }`}
            >
              {i > landed ? (
                <span className={styles.testimonialsDots} aria-hidden="true">
                  <span className={styles.testimonialsDot} />
                  <span className={styles.testimonialsDot} />
                  <span className={styles.testimonialsDot} />
                </span>
              ) : (
                <div className={styles.testimonialsMessage}>
                  <figcaption className={styles.testimonialsAuthor}>
                    {item.name} - {item.role}
                  </figcaption>
                  <blockquote className={styles.testimonialsQuote}>{item.quote}</blockquote>
                </div>
              )}
              {/* Own layout, so the growth doesn't stretch the tail. */}
              <motion.span
                layout
                transition={expand}
                className={styles.testimonialsTail}
                aria-hidden="true"
              />
            </motion.figure>
            <motion.img
              layout
              transition={expand}
              src={item.avatar}
              alt={`${item.name}, ${item.role}`}
              className={styles.testimonialsAvatar}
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
