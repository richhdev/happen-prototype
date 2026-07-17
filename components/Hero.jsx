"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { TRUSTED, asset } from "@/lib/data";

const LOGO_H = 250;
const CIRCUMFERENCE = Math.PI * LOGO_H;

export default function Hero() {
  const headerRef = useRef(null);
  const videoRef = useRef(null);
  const [winW, setWinW] = useState(1440);

  useEffect(() => {
    const update = () => setWinW(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Keep the hero video muted + playing no matter what the browser does.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.defaultMuted = true;
    v.muted = true;
    v.volume = 0;
    const tryPlay = () => {
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    };
    tryPlay();
    v.addEventListener("canplay", tryPlay);
    v.addEventListener("ended", tryPlay);
    const kick = () => { if (v.paused) tryPlay(); };
    const evs = ["click", "touchstart", "scroll", "keydown"];
    evs.forEach((e) => document.addEventListener(e, kick, { passive: true }));
    return () => {
      v.removeEventListener("canplay", tryPlay);
      v.removeEventListener("ended", tryPlay);
      evs.forEach((e) => document.removeEventListener(e, kick));
    };
  }, []);

  // Logo rolls off to the right as the hero scrolls away; rotation follows distance.
  const { scrollYProgress } = useScroll({
    target: headerRef,
    offset: ["start start", "end start"],
  });
  const rawX = useTransform(scrollYProgress, [0, 1], [0, winW + 400]);
  const x = useSpring(rawX, { stiffness: 55, damping: 18, mass: 1 });
  const rotate = useTransform(x, (v) => (v / CIRCUMFERENCE) * 360);

  const trustedLoop = TRUSTED.concat(TRUSTED);

  const lineStyle = {
    display: "block",
    fontSize: "clamp(46px, 8.5vh, 76px)",
    whiteSpace: "nowrap",
  };

  return (
    <header
      ref={headerRef}
      style={{
        position: "relative",
        background: "#111111",
        color: "#EEEBE3",
        boxSizing: "border-box",
        height: "100svh",
        minHeight: 560,
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        padding: "28px 0",
      }}
    >
      <video
        ref={videoRef}
        src={asset("/assets/hero-bg.mp4")}
        muted
        autoPlay
        loop
        playsInline
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
          filter: "grayscale(1) brightness(.7)",
        }}
      />
      <div style={{ position: "absolute", inset: 0, background: "rgba(17,17,17,.75)", zIndex: 1 }} />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 1180,
          margin: "0 auto",
          padding: "0 48px",
          width: "100%",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        <span
          style={{
            display: "block",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: ".16em",
            textTransform: "uppercase",
            color: "#CA0013",
            marginBottom: 14,
          }}
        >
          Melbourne · Est. 10+ years
        </span>

        <div style={{ boxSizing: "border-box", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <motion.h1
            initial={{ letterSpacing: "0em" }}
            whileInView={{ letterSpacing: "-.08em" }}
            viewport={{ once: false, amount: 0.9 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              margin: 0,
              fontWeight: 700,
              textTransform: "uppercase",
              lineHeight: 0.92,
            }}
          >
            <span style={lineStyle}>Behind every</span>
            <span style={lineStyle}>event, is a team</span>
            <span style={lineStyle}>making it Happen</span>
          </motion.h1>

          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <motion.img
              src={asset("/assets/logo.svg")}
              alt="Happen logo"
              style={{
                display: "block",
                height: LOGO_H,
                width: "auto",
                transformOrigin: "center center",
                willChange: "transform",
                x,
                rotate,
              }}
            />
          </div>
        </div>

        <p style={{ maxWidth: 520, marginTop: 16, color: "#c9c4b7", fontSize: 16, lineHeight: 1.55 }}>
          A Melbourne-based events agency built on over 10 years of doing the work — and doing it well. We move fast, think creatively, and always show up.
        </p>

        <div style={{ display: "flex", gap: 16, marginTop: 22 }}>
          <a
            href="#a-contact"
            style={{
              display: "inline-flex",
              padding: "16px 30px",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: ".03em",
              textTransform: "uppercase",
              textDecoration: "none",
              color: "#fff",
              background: "#CA0013",
            }}
          >
            Work with us
          </a>
          <a
            href="#b-work"
            style={{
              display: "inline-flex",
              padding: "16px 30px",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: ".03em",
              textTransform: "uppercase",
              textDecoration: "none",
              color: "#EEEBE3",
              border: "1.5px solid rgba(238,235,227,.5)",
            }}
          >
            See our work
          </a>
        </div>

        <div style={{ marginTop: 36 }}>
          <span
            style={{
              display: "block",
              marginBottom: 14,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: ".16em",
              textTransform: "uppercase",
              color: "#CA0013",
            }}
          >
            Trusted by
          </span>
          <div
            style={{
              overflow: "hidden",
              WebkitMaskImage: "linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)",
              maskImage: "linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)",
            }}
          >
            <div style={{ display: "flex", width: "max-content", animation: "marquee 26s linear infinite", gap: 16 }}>
              {trustedLoop.map((c, i) => (
                <div
                  key={i}
                  style={{ width: 168, height: 64, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}
                  title={c.name}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.src}
                    alt={c.name}
                    style={{ height: c.h, maxWidth: 132, objectFit: "contain", opacity: 0.82, display: "block" }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
