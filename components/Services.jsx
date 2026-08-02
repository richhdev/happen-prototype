"use client";
import { useEffect, useRef, useState } from "react";
import { SectionHead } from "@/components/ui";
import { SERVICES, SVC_BGS } from "@/lib/data";

const cssEase = "cubic-bezier(.16,1,.3,1)";
const headStyle = { padding: "120px 48px 56px" };
const CARD_HEIGHT = 380;
const CARD_BOTTOM_GAP = 48;
const MOBILE_BREAKPOINT = 768;

export default function Services() {
  const rowRefs = useRef([]);
  const [active, setActive] = useState(0);
  const [cardActive, setCardActive] = useState(0);
  const [cardVisible, setCardVisible] = useState(true);
  const fadeTimer = useRef(null);

  const getCenter = () => {
    const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
    return isMobile
      ? (window.innerHeight - CARD_HEIGHT - CARD_BOTTOM_GAP) / 2
      : window.innerHeight / 2;
  };

  useEffect(() => {
    const update = () => {
      const center = getCenter();
      let best = -1;
      let bestDist = Infinity;
      rowRefs.current.forEach((node, i) => {
        if (!node) return;
        const r = node.getBoundingClientRect();
        if (r.height === 0) return;
        const mid = r.top + r.height / 2;
        const dist = Math.abs(mid - center);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      if (best >= 0) {
        setActive((prev) => {
          if (best === prev) return prev;
          setCardVisible(false);
          if (fadeTimer.current) clearTimeout(fadeTimer.current);
          fadeTimer.current = setTimeout(() => {
            setCardActive(best);
            setCardVisible(true);
          }, 55);
          return best;
        });
      }
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      if (fadeTimer.current) clearTimeout(fadeTimer.current);
    };
  }, []);

  const scrollToRow = (i) => {
    const node = rowRefs.current[i];
    if (!node) return;
    const r = node.getBoundingClientRect();
    const mid = r.top + r.height / 2;
    window.scrollBy({ top: mid - getCenter(), behavior: "smooth" });
  };

  const svc = SERVICES[cardActive];
  const bg = SVC_BGS[cardActive % SVC_BGS.length];

  return (
    <section id="a-services" className="services">
      <SectionHead
        eyebrow="Services"
        title={
          <>
            How we make
            <br />
            it Happen
          </>
        }
        maxWidth={760}
        intro="Artist services, market villages, promoter ticketing, venue bookings and wellness activations — a broad operational capability and an extensive national network."
        style={headStyle}
      />

      <div className="services-body">
        <div className="services-list">
          {SERVICES.map((s, i) => {
            const on = i === active;
            return (
              <div
                key={i}
                ref={(el) => (rowRefs.current[i] = el)}
                onClick={() => scrollToRow(i)}
                className="services-row"
              >
                <span
                  className="services-row-title"
                  style={{
                    fontSize: on ? 32 : 27,
                    letterSpacing: on ? "-.05em" : "0em",
                    color: on ? "#CA0013" : "rgba(17,17,17,.35)",
                  }}
                >
                  {s.title}
                </span>
                <span
                  className="services-row-meta"
                  style={{ color: on ? "#950000" : "rgba(17,17,17,.3)" }}
                >
                  {s.meta}
                </span>
              </div>
            );
          })}
        </div>

        <div className="services-preview">
          <div className="services-preview-sticky">
            <div className="services-card">
              <div
                className="services-card-bg"
                style={{ backgroundImage: `url('${bg}')` }}
              />
              <div className="services-card-gradient" />
              <div
                className="services-card-fade"
                style={{
                  opacity: cardVisible ? 1 : 0,
                  transform: cardVisible
                    ? "translateY(0px)"
                    : "translateY(8px)",
                }}
              >
                <p className="services-card-desc">{svc.desc}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="services-footer">&nbsp;</div>

      <style jsx>{`
        .services {
          background: #eeebe3;
          min-height: 100vh;
          box-sizing: border-box;
        }

        .services-body {
          position: relative;
          max-width: 960px;
          margin: 0 auto;
        }

        .services-list {
          background: #eeebe3;
          padding: 64px 32px
            calc(${CARD_HEIGHT}px + ${CARD_BOTTOM_GAP}px + 40px);
          box-sizing: border-box;
        }

        .services-row {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          gap: 6px;
          height: 120px;
          padding: 0 4px;
          box-sizing: border-box;
          cursor: pointer;
          background: transparent;
        }

        .services-row-title {
          white-space: nowrap;
          font-weight: 800;
          transition:
            color 320ms ${cssEase},
            letter-spacing 320ms ${cssEase},
            font-size 320ms ${cssEase};
        }

        .services-row-meta {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          transition: color 320ms ${cssEase};
        }

        .services-preview {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 2;
        }

        .services-preview-sticky {
          position: sticky;
          top: calc(100vh - ${CARD_HEIGHT}px - ${CARD_BOTTOM_GAP}px);
          padding: 0 32px;
          box-sizing: border-box;
          pointer-events: none;
        }

        .services-card {
          position: relative;
          width: 100%;
          height: ${CARD_HEIGHT}px;
          box-sizing: border-box;
          background: #1a1a1a;
          border: 1px solid #262626;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 26px;
        }

        @media (min-width: ${MOBILE_BREAKPOINT}px) {
          .services-list {
            padding-top: 226px;
            padding-bottom: 120px;
          }

          .services-row {
            align-items: flex-start;
            text-align: left;
          }

          .services-preview-sticky {
            top: calc(50vh - 190px);
          }

          .services-card {
            max-width: 400px;
            margin-left: auto;
          }
        }

        .services-card-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          opacity: 0.4;
          filter: grayscale(0.35);
          transition: background-image 0.4s ease;
          pointer-events: none;
        }

        .services-card-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.92) 0%,
            rgba(0, 0, 0, 0.55) 42%,
            rgba(0, 0, 0, 0.05) 100%
          );
          pointer-events: none;
        }

        .services-card-fade {
          transition:
            opacity 75ms ${cssEase},
            transform 75ms ${cssEase};
        }

        .services-card-desc {
          position: relative;
          font-size: 18px;
          color: #dedad0;
          line-height: 1.6;
          margin: 0;
        }
        .services-footer {
          height: calc(50vh - (380px / 2));
        }
      `}</style>
    </section>
  );
}
