"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { TRUSTED, asset } from "@/lib/data";

const LOGO_H_MOBILE = 160;
const LOGO_H_DESKTOP = 250;

// Tracks viewport width so layout math (logo size, roll distance) can react to it.
function useWindowWidth(initial) {
  const [winW, setWinW] = useState(initial);
  useEffect(() => {
    const update = () => setWinW(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return winW;
}

// Logo rolls off to the right as the hero scrolls away; rotation follows distance
// travelled, scaled to the circumference of the logo at its current display size.
function useLogoRoll(headerRef, winW) {
  const LOGO_H = winW >= 768 ? LOGO_H_DESKTOP : LOGO_H_MOBILE;
  const CIRCUMFERENCE = Math.PI * LOGO_H;

  const { scrollYProgress } = useScroll({
    target: headerRef,
    offset: ["start start", "end start"],
  });
  const rawX = useTransform(scrollYProgress, [0, 1], [0, winW + 400]);
  const x = useSpring(rawX, { stiffness: 55, damping: 18, mass: 1 });
  const rotate = useTransform(x, (v) => (v / CIRCUMFERENCE) * 360);

  return { LOGO_H, x, rotate };
}

export default function Hero() {
  const headerRef = useRef(null);

  const winW = useWindowWidth(1440);
  const { LOGO_H, x, rotate } = useLogoRoll(headerRef, winW);

  const trustedLoop = TRUSTED.concat(TRUSTED);

  return (
    <header id="a-hero" ref={headerRef} className="hero">
      <video
        src={asset("/assets/hero-bg.mp4")}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="hero-video"
      />
      <div className="hero-overlay" />

      <div className="hero-content">
        <div className="headline-group">
          <div className="logo-wrap">
            <motion.img
              src={asset("/assets/logo.svg")}
              alt="Happen logo"
              className="logo"
              style={{ height: LOGO_H, x, rotate }}
            />
          </div>
          <motion.h1
            initial={{ letterSpacing: "0em" }}
            whileInView={{ letterSpacing: "-.2em" }}
            viewport={{ once: false, amount: 0.9 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="headline"
          >
            <span className="headline-line">Behind every</span>
            <span className="headline-line">event, is a team</span>
            <span className="headline-line">making it Happen</span>
          </motion.h1>
        </div>

        <p className="lede">
          A Melbourne-based events agency built on over 10 years of doing the
          work — and doing it well. We move fast, think creatively, and always
          show up.
        </p>

        <div className="cta-row">
          <a href="#a-contact" className="cta cta-primary">
            Work with us
          </a>
          <a href="#b-work" className="cta cta-secondary">
            See our work
          </a>
        </div>

        <div className="trusted">
          <div className="trusted-mask">
            <div className="trusted-track">
              {trustedLoop.map((c, i) => (
                <div className="trusted-item" key={i} title={c.name}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.src}
                    alt={c.name}
                    style={{ height: c.h }}
                    className="trusted-logo"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero {
          position: relative;
          background: #111111;
          color: #eeebe3;
          box-sizing: border-box;
          height: 100svh;
          min-height: 560px;
          display: flex;
          align-items: center;
          overflow: hidden;
          padding: 28px 0;
        }

        .hero-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 0;
          filter: grayscale(1) brightness(0.7);
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: rgba(17, 17, 17, 0.75);
          z-index: 1;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 30px;
          width: 100%;
          box-sizing: border-box;
        }

        @media (min-width: 768px) {
          .hero-content {
            padding: 0 48px;
          }
        }

        .eyebrow {
          display: block;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #ca0013;
          margin-bottom: 14px;
        }

        .headline-group {
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: start;
          gap: 24px;
        }

        .headline {
          margin: 0;
          font-weight: 700;
          text-transform: uppercase;
        }

        .headline-line {
          display: block;
          font-size: clamp(48px, 4vw + 20px, 76px);
          white-space: nowrap;
          text-transform: uppercase;
          line-height: 1;
        }

        .logo-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media (min-width: 768px) {
          .headline-group {
            flex-direction: row-reverse;
            justify-content: space-between;
            align-items: center;
            gap: 0;
          }

          .headline {
            order: 0;
          }

          .logo-wrap {
            order: 0;
            flex: 1;
          }
        }

        .logo {
          display: block;
          width: auto;
          transform-origin: center center;
          will-change: transform;
        }

        .lede {
          max-width: 520px;
          margin-top: 16px;
          color: #c9c4b7;
          font-size: clamp(16px, 1vw + 12px, 20px);
          line-height: 1.55;
        }

        .cta-row {
          display: flex;
          gap: 16px;
          margin-top: 22px;
        }

        .cta {
          display: inline-flex;
          padding: 16px 30px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.03em;
          text-transform: uppercase;
          text-decoration: none;
        }

        .cta-primary {
          color: #fff;
          background: #ca0013;
        }

        .cta-secondary {
          color: #eeebe3;
          border: 1.5px solid rgba(238, 235, 227, 0.5);
        }

        .trusted {
          margin-top: 36px;
        }

        .trusted-mask {
          overflow: hidden;
          -webkit-mask-image: linear-gradient(
            90deg,
            transparent,
            #000 6%,
            #000 94%,
            transparent
          );
          mask-image: linear-gradient(
            90deg,
            transparent,
            #000 6%,
            #000 94%,
            transparent
          );
        }

        .trusted-track {
          display: flex;
          width: max-content;
          animation: marquee 26s linear infinite;
          gap: 16px;
        }

        .trusted-item {
          width: 168px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex: none;
        }

        .trusted-logo {
          max-width: 132px;
          object-fit: contain;
          opacity: 0.82;
          display: block;
        }
      `}</style>
    </header>
  );
}
