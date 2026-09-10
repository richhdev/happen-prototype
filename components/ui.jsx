"use client";
import { motion } from "framer-motion";
import { useEffect, useLayoutEffect, useState } from "react";
import { EASE } from "@/lib/data";

// Runs useLayoutEffect on the client, no-op on the server (avoids SSR warning).
export const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Fade in up
export function Reveal({
  children,
  delay = 0,
  y = 32,
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

// child of RevealGroup
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
