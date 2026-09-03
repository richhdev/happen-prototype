"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { asset } from "@/lib/data";
import styles from "./RollingLogo.module.css";

// Rolls off to the right as `trackRef` scrolls away; rotation follows distance
// travelled, scaled to the circumference of the logo at whatever size CSS is
// currently drawing it. Both are measured off the DOM so no resize listener is
// needed — the refs are null until mount, where progress is 0 and nothing moves.
function useRoll(trackRef, logoRef) {
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end start"],
    // trackRef belongs to the parent, and React assigns child refs first, so the
    // measurement has to wait for a passive effect or it reads a null target.
    layoutEffect: false,
  });
  const rawX = useTransform(
    scrollYProgress,
    (p) => p * ((trackRef.current?.offsetWidth ?? 0) + 400),
  );
  const x = useSpring(rawX, { stiffness: 55, damping: 18, mass: 1 });
  const rotate = useTransform(
    x,
    (v) => (v / (Math.PI * (logoRef.current?.offsetWidth || 1))) * 360,
  );

  return { x, rotate };
}

export function RollingLogo({ trackRef }) {
  const logoRef = useRef(null);
  const { x, rotate } = useRoll(trackRef, logoRef);

  return (
    <motion.img
      ref={logoRef}
      src={asset("/assets/logo.svg")}
      alt="Happen logo"
      className={styles.logo}
      style={{ x, rotate }}
    />
  );
}

export default RollingLogo;
