"use client";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { SectionHead, useIsoLayoutEffect } from "@/components/ui";
import { WORK } from "@/lib/data";

export default function Work() {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const wrapRef = useRef(null);
  const [max, setMax] = useState(0);

  useIsoLayoutEffect(() => {
    const measure = () => {
      if (!trackRef.current || !wrapRef.current) return;
      const m = Math.max(0, trackRef.current.scrollWidth - wrapRef.current.clientWidth);
      setMax(m);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, (v) => -(v * max));
  const bgY = useTransform(scrollYProgress, [0, 1], ["0px", "-400px"]);

  return (
    <section id="b-work" style={{ padding: 0, borderBottom: "1px solid #950000", background: "#CA0013" }}>
      <div ref={containerRef} style={{ height: "280vh" }}>
        <motion.div
          style={{
            position: "sticky",
            top: 0,
            overflow: "hidden",
            height: "100vh",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            backgroundImage: "radial-gradient(rgba(255,255,255,.16) 1.5px, transparent 1.5px)",
            backgroundSize: "56px 56px",
            backgroundPositionX: "0px",
            backgroundPositionY: bgY,
          }}
        >
          <SectionHead
            eyebrow="Work"
            title={<>The proof is<br />in the Happening</>}
            eyebrowColor="#111"
            color="#fff"
            style={{ marginBottom: 40 }}
          />

          <div style={{ overflow: "hidden" }} ref={wrapRef}>
            <motion.div
              ref={trackRef}
              style={{ display: "flex", gap: 20, paddingLeft: 48, paddingRight: 48, willChange: "transform", x }}
            >
              {WORK.map((w, i) => (
                <div
                  key={i}
                  style={{
                    flex: "none",
                    width: 280,
                    height: 280,
                    maxHeight: 280,
                    boxSizing: "border-box",
                    position: "relative",
                    background: "linear-gradient(135deg, #1a1a1a, #2b1416)",
                    border: "1px solid #3a3a3a",
                    overflow: "hidden",
                    padding: 26,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundImage: `url('${w.bg}')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      opacity: 0.3,
                      filter: "grayscale(.35)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(0deg, rgba(17,17,17,.88) 0%, rgba(17,17,17,.35) 60%, rgba(17,17,17,.1) 100%)",
                      pointerEvents: "none",
                    }}
                  />
                  <div style={{ position: "relative", flex: 1, minHeight: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={w.logo}
                      alt={w.title}
                      style={{ height: w.logoH || 40, maxWidth: "82%", objectFit: "contain", opacity: 0.92, display: "block" }}
                    />
                  </div>
                  <div style={{ position: "relative" }}>
                    <h3 style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-.015em", margin: 0, color: "#EEEBE3" }}>{w.title}</h3>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: "#c9c4b7", marginTop: 5 }}>{w.tag}</div>
                  </div>
                </div>
              ))}
              <div style={{ flex: "none", width: 28 }} />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
