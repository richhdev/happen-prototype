"use client";
import { useEffect, useRef, useState } from "react";
import { SectionHead } from "@/components/ui";
import { SERVICES, SVC_BGS } from "@/lib/data";

const cssEase = "cubic-bezier(.16,1,.3,1)";

export default function Services() {
  const rowRefs = useRef([]);
  const [active, setActive] = useState(0);
  const [cardActive, setCardActive] = useState(0);
  const [cardVisible, setCardVisible] = useState(true);
  const fadeTimer = useRef(null);

  useEffect(() => {
    const update = () => {
      const center = window.innerHeight / 2;
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
    window.scrollBy({ top: mid - window.innerHeight / 2, behavior: "smooth" });
  };

  const svc = SERVICES[cardActive];
  const bg = SVC_BGS[cardActive % SVC_BGS.length];

  return (
    <section id="a-services" style={{ background: "#EEEBE3", minHeight: "100vh", boxSizing: "border-box" }}>
      <SectionHead
        eyebrow="Services"
        title={<>How we make<br />it Happen</>}
        maxWidth={760}
        intro="Artist services, market villages, promoter ticketing, venue bookings and wellness activations — a broad operational capability and an extensive national network."
        style={{ padding: "120px 48px 56px" }}
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", alignItems: "stretch", maxWidth: 960, margin: "0 auto" }}>
        <div style={{ background: "#EEEBE3", padding: "226px 32px calc(50vh - 60px)", boxSizing: "border-box" }}>
          {SERVICES.map((s, i) => {
            const on = i === active;
            return (
              <div
                key={i}
                ref={(el) => (rowRefs.current[i] = el)}
                onClick={() => scrollToRow(i)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  gap: 6,
                  height: 120,
                  padding: "0 4px",
                  boxSizing: "border-box",
                  cursor: "pointer",
                  background: "transparent",
                }}
              >
                <span
                  style={{
                    whiteSpace: "nowrap",
                    fontSize: on ? 32 : 27,
                    fontWeight: 800,
                    letterSpacing: on ? "-.05em" : "0em",
                    color: on ? "#CA0013" : "rgba(17,17,17,.35)",
                    transition: `color 320ms ${cssEase}, letter-spacing 320ms ${cssEase}, font-size 320ms ${cssEase}`,
                  }}
                >
                  {s.title}
                </span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: ".1em",
                    textTransform: "uppercase",
                    color: on ? "#950000" : "rgba(17,17,17,.3)",
                    transition: `color 320ms ${cssEase}`,
                  }}
                >
                  {s.meta}
                </span>
              </div>
            );
          })}
        </div>

        <div style={{ padding: "96px 32px calc(50vh - 190px)", boxSizing: "border-box", position: "relative" }}>
          <div style={{ position: "sticky", top: "calc(50vh - 190px)" }}>
            <div
              style={{
                position: "relative",
                width: "100%",
                maxWidth: 400,
                height: 380,
                margin: "0 auto",
                boxSizing: "border-box",
                background: "#1a1a1a",
                border: "1px solid #262626",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                padding: 26,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  opacity: 0.4,
                  filter: "grayscale(.35)",
                  transition: "background-image .4s ease",
                  backgroundImage: `url('${bg}')`,
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(0deg, rgba(0,0,0,.92) 0%, rgba(0,0,0,.55) 42%, rgba(0,0,0,.05) 100%)",
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  opacity: cardVisible ? 1 : 0,
                  transform: cardVisible ? "translateY(0px)" : "translateY(8px)",
                  transition: `opacity 75ms ${cssEase}, transform 75ms ${cssEase}`,
                }}
              >
                <p style={{ position: "relative", fontSize: 18, color: "#dedad0", lineHeight: 1.6, margin: 0 }}>
                  {svc.desc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
