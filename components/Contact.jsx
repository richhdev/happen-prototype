"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { Reveal } from "@/components/ui";
import { EASE, asset } from "@/lib/data";

const LOGO_H = 125;
const CIRCUMFERENCE = Math.PI * LOGO_H;

export default function Contact() {
  const sectionRef = useRef(null);
  const [winW, setWinW] = useState(1440);

  useEffect(() => {
    const update = () => setWinW(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Logo rolls in from off the left edge to rest at centre as the section enters.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start start"],
  });
  const rawX = useTransform(scrollYProgress, [0, 1], [-(winW / 2 + 400), 0]);
  const x = useSpring(rawX, { stiffness: 55, damping: 18, mass: 1 });
  const rotate = useTransform(x, (v) => (v / CIRCUMFERENCE) * 360);

  const socialLink = { fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".04em", color: "#c9c4b7", textDecoration: "none" };

  return (
    <section ref={sectionRef} id="a-contact" style={{ padding: "130px 48px 90px", background: "#111", color: "#EEEBE3" }}>
      <Reveal style={{ margin: "0 auto 56px", maxWidth: 760, textAlign: "center" }}>
        <span style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "#CA0013", marginBottom: 16 }}>Contact</span>
        <motion.h2
          initial={{ letterSpacing: ".14em" }}
          whileInView={{ letterSpacing: "-.035em" }}
          viewport={{ once: false, amount: 0.6 }}
          transition={{ duration: 1.4, ease: EASE }}
          style={{ fontSize: 76, fontWeight: 900, textTransform: "uppercase", lineHeight: 0.95, margin: "0 0 20px", color: "#fff" }}
        >
          Let&apos;s make<br />it Happen
        </motion.h2>
        <p style={{ fontSize: 16, color: "#c9c4b7", fontWeight: 600, maxWidth: 640, lineHeight: 1.6, marginLeft: "auto", marginRight: "auto", textWrap: "balance" }}>
          Got a festival to run? A market village to fill? An artist who needs looking after? Tell us what you need.
        </p>
      </Reveal>

      <div style={{ overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 0 64px" }}>
        <motion.img
          src={asset("/assets/logo.svg")}
          alt="Happen logo"
          style={{ display: "block", height: LOGO_H, width: "auto", willChange: "transform", x, rotate }}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, maxWidth: 800, width: "100%", margin: "0 auto" }}>
        <div style={{ background: "#1b1b1b", border: "1px solid #333", padding: 40 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "#CA0013", marginBottom: 10 }}>General enquiries</div>
          <a href="mailto:hello@happengroup.com.au" style={{ display: "inline-block", fontSize: 26, fontWeight: 800, letterSpacing: "-.01em", color: "#fff", textDecoration: "none", marginBottom: 34 }}>
            hello@happengroup.com.au
          </a>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "#CA0013", marginBottom: 10 }}>Follow along</div>
          <div style={{ display: "flex", gap: 20 }}>
            <a href="https://www.instagram.com/happengroupau/" target="_blank" rel="noopener noreferrer" style={socialLink}>Instagram</a>
            <a href="https://www.facebook.com/happengroupau" target="_blank" rel="noopener noreferrer" style={socialLink}>Facebook</a>
            <a href="https://www.youtube.com/@HappenGroup" target="_blank" rel="noopener noreferrer" style={socialLink}>YouTube</a>
          </div>
        </div>

        <div style={{ background: "#1b1b1b", border: "1px solid #333", padding: "8px 32px" }}>
          <a href="#" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 4px", borderBottom: "1px solid #444", textDecoration: "none", color: "#fff" }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>Project inquiry</h3>
              <p style={{ fontSize: 12, color: "#8f8a7e", margin: "4px 0 0" }}>Tell us about your event</p>
            </div>
            <span style={{ fontSize: 20 }}>↗</span>
          </a>
          <a href="#" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 4px", textDecoration: "none", color: "#fff" }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>Email sign-up</h3>
              <p style={{ fontSize: 12, color: "#8f8a7e", margin: "4px 0 0" }}>Events worth showing up for, before anyone else knows</p>
            </div>
            <span style={{ fontSize: 20 }}>↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
