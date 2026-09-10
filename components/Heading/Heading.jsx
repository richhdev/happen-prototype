"use client";

import { motion } from "framer-motion";
import { EASE } from "@/lib/data";
import styles from "./Heading.module.css";

// Each component pairs a semantic heading tag with its text-style class. `as`
// lets the tag differ from the visual style (e.g. render an h1 that's styled
// like a heading2) when the document outline and the visual hierarchy need to
// diverge.

// The uppercase levels tighten their tracking as they scroll into view: the
// letters open up to their natural spacing and settle back into the tight
// display setting. `tracking` has to match the letter-spacing the level's class
// rests at in Heading.module.css, so the static and animated states agree —
// that CSS is also what pins the tracking under prefers-reduced-motion, and
// it's what a heading opted out with `animateTracking={false}` sits at.
function TrackingHeading({
  as: Tag,
  tracking,
  animate = true,
  className,
  children,
  ...rest
}) {
  if (!animate) {
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    );
  }

  const MotionTag = typeof Tag === "string" ? motion[Tag] : Tag;

  return (
    <MotionTag
      className={className}
      initial={{ letterSpacing: "0em" }}
      whileInView={{ letterSpacing: tracking }}
      viewport={{ once: false, amount: 0.9 }}
      transition={{ duration: 1.5, ease: EASE }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}

export function Heading1({
  as: Tag = "h1",
  animateTracking = false,
  className,
  children,
  ...rest
}) {
  return (
    <TrackingHeading
      as={Tag}
      tracking="-0.035em"
      animate={animateTracking}
      className={`${styles.heading1} ${className ?? ""}`}
      {...rest}
    >
      {children}
    </TrackingHeading>
  );
}

export function Heading2({
  as: Tag = "h2",
  animateTracking = false,
  className,
  children,
  ...rest
}) {
  return (
    <TrackingHeading
      as={Tag}
      tracking="-0.05em"
      animate={animateTracking}
      className={`${styles.heading2} ${className ?? ""}`}
      {...rest}
    >
      {children}
    </TrackingHeading>
  );
}

// `sentence` swaps in the heading3-sentence variant (Sentence case instead of
// UPPERCASE) — the one heading level the token doc gives a case alternative for.
// Only the uppercase variant animates its tracking; the sentence-case one reads
// as body copy, so it stays put.
export function Heading3({
  as: Tag = "h3",
  sentence = false,
  animateTracking = false,
  className,
  children,
  ...rest
}) {
  const styleClass = sentence
    ? styles.heading3Sentence
    : styles.heading3;
  return (
    <TrackingHeading
      as={Tag}
      tracking="-0.05em"
      animate={animateTracking && !sentence}
      className={`${styleClass} ${className ?? ""}`}
      {...rest}
    >
      {children}
    </TrackingHeading>
  );
}

export function Heading4({ as: Tag = "h4", className, children, ...rest }) {
  return (
    <Tag className={`${styles.heading4} ${className ?? ""}`} {...rest}>
      {children}
    </Tag>
  );
}
