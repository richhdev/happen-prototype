"use client";
import { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import { SectionHead, useIsoLayoutEffect } from "@/components/ui";
import { asset } from "@/lib/data";

const HOLD_PX = 400;

const WORK = [
  {
    title: "Knotfest",
    tag: "BOH Management — Nationwide",
    logo: asset("/assets/client-knotfest.png"),
    logoH: 30,
    bg: asset("/assets/artist-jamo.jpg"),
  },
  {
    title: "Good Things Festival",
    tag: "BOH Management — Nationwide / Retail Precinct Management",
    logo: asset("/assets/client-goodthings-v2.png"),
    logoH: 52,
    bg: asset("/assets/venue-brown-alley.webp"),
  },
  {
    title: "Beyond The Valley",
    tag: "Retail Precinct Management",
    logo: asset("/assets/client-btv.svg"),
    logoH: 34,
    bg: asset("/assets/artist-laura-king.jpg"),
  },
  {
    title: "A3 Festival",
    tag: "Artist Services / Volunteer Management / Front Gate Management / Box Office Management / Accreditation",
    logo: asset("/assets/client-a3.png"),
    logoH: 46,
    bg: asset("/assets/event-chapter.png"),
  },
  {
    title: "Let Them Eat Cake",
    tag: "Artist Services / Industry Ticketing / Community Building",
    logo: asset("/assets/client-let-them-eat-cake.svg"),
    logoH: 34,
    bg: asset("/assets/artist-sasha-fern.jpg"),
  },
  {
    title: "Promiseland",
    tag: "Artist Services / Industry Ticketing / Community Building / Retail Precinct Management",
    logo: asset("/assets/client-promiseland.png"),
    logoH: 96,
    bg: asset("/assets/venue-bourke-st-courtyard.png"),
  },
  {
    title: "Eden Festival (NZ)",
    tag: "Artist Services",
    logo: asset("/assets/client-eden-fest.png"),
    logoH: 104,
    bg: asset("/assets/artist-vanna.jpg"),
  },
  {
    title: "Souled Out",
    tag: "Artist Services — Nationwide / Industry Ticketing / Community Building",
    logo: asset("/assets/client-souled-out-v2.png"),
    logoH: 76,
    bg: asset("/assets/event-overdrive.png"),
  },
  {
    title: "Happy Hour",
    tag: "End-to-end Event Delivery — Nationwide",
    logo: asset("/assets/client-happy-hour.png"),
    logoH: 40,
    bg: asset("/assets/svc-bg-1.jpg"),
  },
  {
    title: "Our City Our Sound",
    tag: "Artist Services / Box Office / Accreditation",
    logo: asset("/assets/client-our-city-our-sound.svg"),
    logoH: 70,
    bg: asset("/assets/svc-bg-2.jpg"),
  },
  {
    title: "Pitch Music and Arts",
    tag: "Industry Ticketing / Community Building / Retail Precinct Management",
    logo: asset("/assets/client-pitch.png"),
    logoH: 36,
    bg: asset("/assets/svc-bg-3.jpg"),
  },
  {
    title: "Strummingbird",
    tag: "Artist Services — Nationwide",
    logo: asset("/assets/client-strummingbird.svg"),
    logoH: 34,
    bg: asset("/assets/svc-bg-4.jpg"),
  },
  {
    title: "Chapter",
    tag: "End-to-end Event Delivery",
    logo: asset("/assets/client-chapter.png"),
    logoH: 200,
    bg: asset("/assets/svc-bg-5.jpg"),
  },
  {
    title: "Strawberry Fields",
    tag: "Industry Ticketing / Community Building",
    logo: asset("/assets/client-strawberry-fields.png"),
    logoH: 64,
    bg: asset("/assets/event-off-the-record-tour.png"),
  },
  {
    title: "Afrosoul",
    tag: "Industry Ticketing / Community Building",
    logo: asset("/assets/client-afrosoul.svg"),
    logoH: 40,
    bg: asset("/assets/event-party-girl-tour.jpg"),
  },
  {
    title: "Live Nation",
    tag: "Industry Ticketing / Community Building",
    logo: asset("/assets/client-live-nation.png"),
    logoH: 40,
    bg: asset("/assets/event-partygirl.png"),
  },
  {
    title: "Astral People",
    tag: "Industry Ticketing / Community Building",
    logo: asset("/assets/client-astral-people.svg"),
    logoH: 56,
    bg: asset("/assets/event-chaper-nye-2026.jpg"),
  },
  {
    title: "S.A.S.H",
    tag: "Artist Advancing — Nationwide",
    logo: asset("/assets/client-sash.svg"),
    logoH: 40,
    bg: asset("/assets/venue-brown-alley-c.jpg"),
  },
];

export default function Work() {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const wrapRef = useRef(null);
  const cardRefs = useRef([]);
  const [max, setMax] = useState(0);
  const [active, setActive] = useState(0);

  useIsoLayoutEffect(() => {
    const measure = () => {
      const first = cardRefs.current[0];
      const last = cardRefs.current[cardRefs.current.length - 1];
      if (!first || !last) return;
      setMax(Math.max(0, last.offsetLeft - first.offsetLeft));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const total = max + HOLD_PX;
  const panEnd = total > 0 ? max / total : 0;
  const x = useTransform(scrollYProgress, [0, panEnd], [0, -max]);
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
      <div
        ref={containerRef}
        className="work-container"
        style={{ height: `calc(100vh + ${max + HOLD_PX}px)` }}
      >
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
          height: 100vh;
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
