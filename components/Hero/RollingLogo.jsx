"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { asset } from "@/lib/data";
import styles from "./RollingLogo.module.css";

function useRoll(trackRef, logoRef) {
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end start"],
    layoutEffect: false,
  });
  const rawX = useTransform(
    scrollYProgress,
    (p) => p * (trackRef.current?.offsetWidth ?? 0),
  );
  const x = useSpring(rawX, { stiffness: 55, damping: 18, mass: 1 });
  const rotate = useTransform(
    x,
    // Guarded with 1, not 0: before mount the ref is null and this divides.
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
      className={styles.rollingLogo}
      style={{ x, rotate }}
    />
  );
}

export default RollingLogo;
