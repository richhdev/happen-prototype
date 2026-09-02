"use client";
import { motion } from "motion/react";
import { useEffect, useLayoutEffect, useState } from "react";
import { EASE } from "@/lib/data";

// Runs useLayoutEffect on the client, no-op on the server (avoids SSR warning).
export const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Tracks viewport height so scroll math can use live vh (SSR-safe: starts 800).
export function useViewportHeight() {
  const [vh, setVh] = useState(800);
  useEffect(() => {
    const update = () => setVh(window.innerHeight);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return vh;
}

// Fade + rise on scroll into view. Re-triggers by default (matches the original
// prototype's repeating IntersectionObservers).
export function Reveal({
  children,
  delay = 0,
  y = 30,
  once = false,
  amount = 0.12,
  style,
  as = "div",
  ...rest
}) {
  const M = motion[as] || motion.div;
  return (
    <M
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount, margin: "0px 0px -60px 0px" }}
      transition={{ duration: 0.64, ease: EASE, delay: delay / 1000 }}
      style={style}
      {...rest}
    >
      {children}
    </M>
  );
}

// One trigger for a whole set. The group watches the viewport and the items
// ride its timeline, so a grid whose lower rows are still below the fold still
// waves in as a single run rather than row by row on their own entry.
export function RevealGroup({
  children,
  stagger = 130,
  once = false,
  amount = 0,
  as = "div",
  ...rest
}) {
  const M = motion[as] || motion.div;
  return (
    <M
      initial="hidden"
      whileInView="shown"
      viewport={{ once, amount, margin: "0px 0px -60px 0px" }}
      variants={{
        hidden: {},
        shown: { transition: { staggerChildren: stagger / 1000 } },
      }}
      {...rest}
    >
      {children}
    </M>
  );
}

// A child of RevealGroup: the same fade + rise as Reveal, but with its timing
// handed down by the group instead of read from its own scroll position.
export function RevealItem({ children, y = 30, as = "div", ...rest }) {
  const M = motion[as] || motion.div;
  return (
    <M
      variants={{
        hidden: { opacity: 0, y },
        shown: { opacity: 1, y: 0, transition: { duration: 0.64, ease: EASE } },
      }}
      {...rest}
    >
      {children}
    </M>
  );
}

// Section heading: eyebrow + title where the title's letter-spacing opens wide
// and tightens as it enters view (the signature Happen reveal).
export function SectionHead({
  eyebrow,
  title,
  eyebrowColor = "#CA0013",
  color = "#000",
  tight = "-.03em",
  size = 52,
  nowrap = false,
  maxWidth = 760,
  intro,
  introColor = "#950000",
  style,
}) {
  return (
    <Reveal
      style={{
        margin: "0 auto",
        maxWidth,
        textAlign: "center",
        ...style,
      }}
    >
      <span
        style={{
          display: "block",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: ".14em",
          textTransform: "uppercase",
          color: eyebrowColor,
          marginBottom: 14,
        }}
      >
        {eyebrow}
      </span>
      <motion.h2
        initial={{ letterSpacing: ".14em" }}
        whileInView={{ letterSpacing: tight }}
        viewport={{ once: false, amount: 0.6 }}
        transition={{ duration: 1.4, ease: EASE }}
        style={{
          fontSize: size,
          fontWeight: 900,
          textTransform: "uppercase",
          lineHeight: 0.98,
          margin: 0,
          color,
          whiteSpace: nowrap ? "nowrap" : "normal",
        }}
      >
        {title}
      </motion.h2>
      {intro ? (
        <p
          style={{
            fontSize: 16,
            color: introColor,
            fontWeight: 600,
            lineHeight: 1.6,
            marginTop: 18,
            maxWidth: 640,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          {intro}
        </p>
      ) : null}
    </Reveal>
  );
}
