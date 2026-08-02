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
    <section id="a-about" className="about">
      <div className="title-group">
        <span className="eyebrow">About</span>
        <motion.h2
          initial={{ letterSpacing: ".14em" }}
          whileInView={{ letterSpacing: "-.025em" }}
          viewport={{ once: false, amount: 0.6 }}
          transition={{ duration: 1.4, ease: EASE }}
          style={{ margin: 0 }}
        >
          <span className="heading">Who we are</span>
        </motion.h2>
      </div>
      <p className="lede">
        A dream team of doers and difference-makers. Sharp, reliable, and here
        to get it done. Each of us brings something different: creative brains,
        logistical minds, artist wranglers, on-ground legends. <br />
        <br />
        We work with grit, good humour, and zero ego. And we don&apos;t just
        work hard — we have a damn good time making it Happen.
      </p>
      <div ref={counterRef} className="counter">
        <span>{count}+</span>
        <span className="counter-label">Years doing the work</span>
      </div>

      <style jsx>{`
        .about {
          background: #ca0013;
          padding: 130px 48px;
          text-align: center;
          min-height: 100vh;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 26px;
        }

        .title-group {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .eyebrow {
          display: block;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #111;
          margin: 0;
        }

        .heading {
          font-size: clamp(32px, 6vw + 12px, 52px);
          font-weight: 900;
          white-space: nowrap;
          text-transform: uppercase;
          color: #fff;
          margin: 0;
        }

        .lede {
          font-size: 20px;
          font-weight: 600;
          color: #fff;
          line-height: 1.6;
          max-width: 680px;
          margin: 0 auto;
        }

        .counter {
          display: block;
          font-size: 130px;
          font-weight: 900;
          letter-spacing: -0.03em;
          color: #111;
          line-height: 0.8;
          margin: 0;
        }

        .counter-label {
          display: block;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #fff;
          margin: 10px 0 0;
        }
      `}</style>
    </section>
  );
}
