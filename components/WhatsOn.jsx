"use client";
import { Reveal } from "@/components/ui";
import { EVENTS } from "@/lib/data";

const tagStyles = {
  upcoming: { background: "#111", color: "#fff" },
  onsale: { background: "#CA0013", color: "#fff" },
  soldout: { background: "transparent", color: "#7a756a", border: "1px solid #d8d3c5" },
};
const labels = { upcoming: "Upcoming", onsale: "On sale", soldout: "Sold out" };

export default function WhatsOn() {
  return (
    <section
      id="a-whatson"
      style={{ padding: "120px 48px", minHeight: "100vh", boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "center" }}
    >
      <Reveal style={{ margin: "0 auto 44px", maxWidth: 760, textAlign: "center" }}>
        <span style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "#CA0013", marginBottom: 14 }}>What&apos;s On</span>
        <h2 style={{ fontSize: 52, fontWeight: 900, letterSpacing: "-.03em", whiteSpace: "nowrap", textTransform: "uppercase", lineHeight: 0.98, margin: 0 }}>What&apos;s Happening</h2>
      </Reveal>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, maxWidth: 800, width: "100%", margin: "0 auto" }}>
        {EVENTS.map((ev, i) => {
          const soldout = ev.tag === "soldout";
          return (
            <Reveal
              key={i}
              once={false}
              amount={0.5}
              delay={i * 130}
              style={{ background: "#fff", border: "1px solid #d8d3c5", overflow: "hidden" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ev.img}
                alt={ev.title}
                style={{ display: "block", width: "100%", aspectRatio: "4/3", height: "auto", objectFit: "cover", objectPosition: "center top", background: "#dcd6c8" }}
              />
              <div style={{ padding: 22 }}>
                <span
                  style={{
                    display: "inline-block",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: ".06em",
                    textTransform: "uppercase",
                    padding: "4px 9px",
                    ...tagStyles[ev.tag],
                  }}
                >
                  {labels[ev.tag]}
                </span>
                <h3 style={{ fontSize: 19, fontWeight: 800, margin: "12px 0 6px" }}>{ev.title}</h3>
                <div style={{ fontSize: 12, color: "#7a756a", marginBottom: 18 }}>{ev.when}</div>
                <a
                  href="#"
                  style={
                    soldout
                      ? { display: "inline-flex", padding: "10px 18px", fontSize: 11.5, fontWeight: 700, letterSpacing: ".03em", textTransform: "uppercase", textDecoration: "none", color: "#7a756a", border: "1.5px solid #d8d3c5", opacity: 0.6, pointerEvents: "none" }
                      : { display: "inline-flex", padding: "10px 18px", fontSize: 11.5, fontWeight: 700, letterSpacing: ".03em", textTransform: "uppercase", textDecoration: "none", color: "#111", border: "1.5px solid #111" }
                  }
                >
                  {soldout ? "Sold out" : "Get tickets ↗"}
                </a>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
