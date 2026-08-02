"use client";
import { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import { SectionHead, useIsoLayoutEffect } from "@/components/ui";
import { WORK } from "@/lib/data";

export default function Work() {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const wrapRef = useRef(null);
  const cardRefs = useRef([]);
  const [max, setMax] = useState(0);
  const [active, setActive] = useState(0);

  useIsoLayoutEffect(() => {
    const measure = () => {
      if (!trackRef.current || !wrapRef.current) return;
      const m = Math.max(
        0,
        trackRef.current.scrollWidth - wrapRef.current.clientWidth,
      );
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

  useMotionValueEvent(x, "change", () => {
    if (!wrapRef.current) return;
    const center =
      wrapRef.current.getBoundingClientRect().left +
      wrapRef.current.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const mid = r.left + r.width / 2;
      const dist = Math.abs(mid - center);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    setActive((prev) => (prev === best ? prev : best));
  });

  return (
    <section id="b-work" className="work">
      <div ref={containerRef} className="work-container">
        <motion.div
          className="work-sticky"
          style={{ backgroundPositionY: bgY }}
        >
          <SectionHead
            eyebrow="Work"
            title={
              <>
                The proof is
                <br />
                in the Happening
              </>
            }
            eyebrowColor="#111"
            color="#fff"
            style={{ marginBottom: 40 }}
          />

          <div className="work-track-wrap" ref={wrapRef}>
            <motion.div ref={trackRef} className="work-track" style={{ x }}>
              {WORK.map((w, i) => (
                <div
                  key={i}
                  ref={(el) => (cardRefs.current[i] = el)}
                  className={`work-card${i === active ? " work-card-active" : ""}`}
                >
                  <div
                    className="work-card-bg"
                    style={{ backgroundImage: `url('${w.bg}')` }}
                  />
                  <div className="work-card-gradient" />
                  <div className="work-card-logo-wrap">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={w.logo}
                      alt={w.title}
                      className="work-card-logo"
                      style={{ height: w.logoH || 40 }}
                    />
                  </div>
                  <div className="work-card-text">
                    <h3 className="work-card-title">{w.title}</h3>
                    <div className="work-card-tag">{w.tag}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .work {
          padding: 0;
          border-bottom: 1px solid #950000;
          background: #ca0013;
        }

        .work-container {
          height: 280vh;
        }

        :global(.work-sticky) {
          position: sticky;
          top: 0;
          overflow: hidden;
          height: 100vh;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background-image: radial-gradient(
            rgba(255, 255, 255, 0.16) 1.5px,
            transparent 1.5px
          );
          background-size: 56px 56px;
          background-position-x: 0px;
        }

        .work-track-wrap {
          overflow: hidden;
          padding: 32px 0;
        }

        :global(.work-track) {
          display: flex;
          gap: 20px;
          padding-left: calc(50vw - 140px);
          padding-right: calc(50vw - 140px);
          will-change: transform;
        }

        .work-card {
          flex: none;
          width: 280px;
          height: 280px;
          max-height: 280px;
          box-sizing: border-box;
          position: relative;
          background: linear-gradient(135deg, #1a1a1a, #2b1416);
          border: 1px solid #3a3a3a;
          transition:
            border-color 240ms ease,
            transform 240ms ease;
          overflow: hidden;
          padding: 26px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .work-card-active {
          border-color: #fff;
          transform: scale(1.2);
          z-index: 2;
        }

        .work-card-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          opacity: 0.3;
          filter: grayscale(0.35);
        }

        .work-card-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            0deg,
            rgba(17, 17, 17, 0.88) 0%,
            rgba(17, 17, 17, 0.35) 60%,
            rgba(17, 17, 17, 0.1) 100%
          );
          pointer-events: none;
        }

        .work-card-logo-wrap {
          position: relative;
          flex: 1;
          min-height: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .work-card-logo {
          max-width: 82%;
          object-fit: contain;
          opacity: 0.92;
          display: block;
        }

        .work-card-text {
          position: relative;
        }

        .work-card-title {
          font-size: 18px;
          font-weight: 800;
          letter-spacing: -0.015em;
          margin: 0;
          color: #eeebe3;
        }

        .work-card-tag {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #c9c4b7;
          margin-top: 5px;
        }
      `}</style>
    </section>
  );
}
