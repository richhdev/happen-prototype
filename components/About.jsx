"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { EASE } from "@/lib/data";

export default function About() {
  const blockRef = useRef(null);
  const counterRef = useRef(null);
  const inView = useInView(counterRef, { amount: 1, once: false });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf;
    const target = 10;
    const duration = 1200;
    const start = performance.now();
    setCount(0);
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(eased * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView]);

  return (
    <section
      id="a-about"
      style={{
        background: "#CA0013",
        padding: "130px 48px",
        textAlign: "center",
        minHeight: "100vh",
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
      }}
    >
      <motion.div
        ref={blockRef}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.12, margin: "0px 0px -60px 0px" }}
        transition={{ duration: 0.64, ease: EASE }}
        style={{ maxWidth: 820, margin: "0 auto" }}
      >
        <span style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "#111", marginBottom: 20 }}>About</span>
        <motion.h2
          initial={{ letterSpacing: ".14em" }}
          whileInView={{ letterSpacing: "-.025em" }}
          viewport={{ once: false, amount: 0.6 }}
          transition={{ duration: 1.4, ease: EASE }}
          style={{ fontSize: 44, fontWeight: 900, whiteSpace: "nowrap", textTransform: "uppercase", color: "#fff", margin: "0 0 26px" }}
        >
          Who we are
        </motion.h2>
        <p style={{ fontSize: 20, fontWeight: 600, color: "#fff", lineHeight: 1.6, margin: "0 0 18px" }}>
          A dream team of doers and difference-makers. Sharp, reliable, and here to get it done. Each of us brings something different: creative brains, logistical minds, artist wranglers, on-ground legends.
        </p>
        <p style={{ fontSize: 20, fontWeight: 600, color: "#fff", lineHeight: 1.6, margin: "0 0 44px" }}>
          We work with grit, good humour, and zero ego. And we don&apos;t just work hard — we have a damn good time making it Happen.
        </p>
        <span ref={counterRef} style={{ display: "block", fontSize: 130, fontWeight: 900, letterSpacing: "-.03em", color: "#111", lineHeight: 0.8 }}>
          {count}+
          <span style={{ display: "block", fontSize: 12, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "#fff", marginTop: 10 }}>
            Years doing the work
          </span>
        </span>
      </motion.div>
    </section>
  );
}
