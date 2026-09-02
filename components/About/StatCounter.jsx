"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { EASE } from "@/lib/data";

// Counts up from 0 to `value` each time it scrolls into view (re-triggers, like
// the other reveals in the site).
export function StatCounter({
  value,
  suffix = "",
  duration = 1.8,
  className,
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.6, margin: "0px 0px -60px 0px" });
  const reduceMotion = useReducedMotion();

  const count = useMotionValue(reduceMotion ? value : 0);
  const text = useTransform(count, (n) => Math.round(n) + suffix);

  useEffect(() => {
    if (reduceMotion) {
      count.set(value);
      return;
    }
    if (!inView) {
      count.set(0);
      return;
    }
    const controls = animate(count, value, { duration, ease: EASE });
    return () => controls.stop();
  }, [inView, reduceMotion, value, duration, count]);

  return (
    <motion.span ref={ref} className={className}>
      {text}
    </motion.span>
  );
}
