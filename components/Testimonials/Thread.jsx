"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { EASE } from "@/lib/data";
import styles from "./Testimonials.module.css";
import { TESTIMONIALS } from "./data";

// The thread plays like messages being written one after another: a bubble pops
// in at its tail as a typing pill — avatar plus three dots — then expands into
// the message itself, and the feed scrolls so the live one sits at the bottom
// of the screen.

// Pause before the first message, how long the dots run before the message
// expands, and how long a message holds the thread before the next starts
// typing. Milliseconds.
const LEAD_IN = 500;
const TYPING = 900;
const STEP = 2400;

// Breathing room left under a message once it has been scrolled into place.
const BOTTOM_INSET = 24;

const bubble = {
  hidden: { opacity: 0, scale: 0.4 },
  shown: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: EASE } },
};

// The pill-to-message growth. A motion layout animation rather than a CSS
// height transition because it puts the row at its final size in the DOM
// straight away and fakes the old one with transforms — which is what lets the
// scroll below measure where the message ends up while it's still opening.
const expand = { duration: 0.45, ease: EASE };

export default function Thread() {
  const feedRef = useRef(null);
  const rowRefs = useRef([]);
  // Index of the last message to have expanded, and of the one currently
  // showing its dots; -1 each means the thread hasn't got there yet.
  const [landed, setLanded] = useState(-1);
  const [typing, setTyping] = useState(-1);
  const inView = useInView(feedRef, { amount: 0.2 });
  // The row at the live end of the thread, whether it's still typing or done.
  const active = Math.max(landed, typing);

  // Rewinds when the section leaves view so it replays on the way back, the
  // same as the Reveal fades elsewhere on the page.
  useEffect(() => {
    if (!inView) {
      setLanded(-1);
      setTyping(-1);
      feedRef.current?.scrollTo({ top: 0 });
      return;
    }
    // One pair of timers per message rather than a self-rescheduling step: each
    // bubble has two beats now, and a flat timeline keeps them from drifting.
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

  // Runs on both beats: once to bring the dots into view, again once the
  // message has expanded and pushed the bottom of the thread down.
  useEffect(() => {
    const feed = feedRef.current;
    const row = rowRefs.current[active];
    if (active < 0 || !feed || !row) return;

    // offsetTop rather than a client rect: the row is still scaled down at this
    // point, and offsets are layout values that transforms don't touch — which
    // is also why the message's final height is readable while it's still
    // opening. Rows and the feed share an offsetParent (the phone, or its
    // screen on desktop), so the difference is the row's position within the
    // feed's content.
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
  }, [active, landed]);

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
            animate={i <= active ? "shown" : "hidden"}
          >
            <motion.figure
              layout
              transition={expand}
              className={`${styles.bubble} ${
                i > landed ? styles.bubbleTyping : ""
              }`}
            >
              {i > landed ? (
                <span className={styles.dots} aria-hidden="true">
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                </span>
              ) : (
                // Fades up over the growing bubble, which also covers the
                // moment the layout animation is still scaling the text.
                <div className={styles.message}>
                  <figcaption className={styles.author}>
                    {item.name} - {item.role}
                  </figcaption>
                  <blockquote className={styles.quote}>{item.quote}</blockquote>
                </div>
              )}
              {/* Both carry layout of their own so the growth doesn't stretch
                  the tail or leave the avatar stranded mid-animation. */}
              <motion.span
                layout
                transition={expand}
                className={styles.tail}
                aria-hidden="true"
              />
            </motion.figure>
            <motion.img
              layout
              transition={expand}
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
