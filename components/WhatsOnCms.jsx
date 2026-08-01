"use client";
import { useEffect, useState } from "react";
import { Reveal } from "@/components/ui";
import { fetchEvents, ctfImage } from "@/lib/contentful";

const tagStyles = {
  upcoming: { background: "#111", color: "#fff" },
  onsale: { background: "#CA0013", color: "#fff" },
  soldout: { background: "transparent", color: "#7a756a", border: "1px solid #d8d3c5" },
};
const labels = { upcoming: "Upcoming", onsale: "On sale", soldout: "Sold out" };

// "2026-09-27T00:00+10:00" -> "Sat 27 Sep · Artists description"
function whenText(ev) {
  let out = "";
  if (ev.date) {
    try {
      out = new Date(ev.date).toLocaleDateString("en-AU", {
        weekday: "short",
        day: "numeric",
        month: "short",
      });
    } catch {
      out = "";
    }
  }
  if (ev.description) out = out ? `${out} · ${ev.description}` : ev.description;
  return out;
}

const cardShell = { background: "#fff", border: "1px solid #d8d3c5", overflow: "hidden" };
const imgStyle = {
  display: "block",
  width: "100%",
  aspectRatio: "4/3",
  height: "auto",
  objectFit: "cover",
  objectPosition: "center top",
  background: "#dcd6c8",
};

export default function WhatsOnCms() {
  const [events, setEvents] = useState(null); // null = loading
  const [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;
    fetchEvents()
      .then((data) => alive && setEvents(data))
      .catch(() => alive && setError(true));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section
      id="a-whatson-cms"
      style={{ padding: "120px 48px", minHeight: "100vh", boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "center" }}
    >
      <Reveal style={{ margin: "0 auto 44px", maxWidth: 760, textAlign: "center" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 11, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "#CA0013", marginBottom: 14 }}>
          What&apos;s On
          <span style={{ fontSize: 9, letterSpacing: ".08em", color: "#7a756a", border: "1px solid #d8d3c5", borderRadius: 999, padding: "2px 8px" }}>
            Live · Contentful
          </span>
        </span>
        <h2 style={{ fontSize: 52, fontWeight: 900, letterSpacing: "-.03em", whiteSpace: "nowrap", textTransform: "uppercase", lineHeight: 0.98, margin: 0 }}>What&apos;s Happening</h2>
      </Reveal>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, maxWidth: 800, width: "100%", margin: "0 auto" }}>
        {/* Loading skeleton */}
        {events === null && !error &&
          [0, 1, 2].map((i) => (
            <div key={i} style={cardShell}>
              <div style={{ ...imgStyle, animation: "pulse 1.4s ease-in-out infinite" }} />
              <div style={{ padding: 22 }}>
                <div style={{ width: 70, height: 20, background: "#e7e2d6" }} />
                <div style={{ width: "60%", height: 18, background: "#e7e2d6", margin: "14px 0 8px" }} />
                <div style={{ width: "80%", height: 12, background: "#efeae0", marginBottom: 18 }} />
                <div style={{ width: 110, height: 38, border: "1.5px solid #e7e2d6" }} />
              </div>
            </div>
          ))}

        {/* Loaded events */}
        {events?.map((ev, i) => {
          const soldout = ev.tag === "soldout";
          return (
            <Reveal
              key={ev.id}
              once={false}
              amount={0.5}
              delay={i * 130}
              style={cardShell}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={ctfImage(ev.imgUrl)} alt={ev.title} style={imgStyle} />
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
                <div style={{ fontSize: 12, color: "#7a756a", marginBottom: 18 }}>{whenText(ev)}</div>
                <a
                  href={soldout ? undefined : ev.url}
                  target={soldout ? undefined : "_blank"}
                  rel={soldout ? undefined : "noopener noreferrer"}
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

      {/* Error / empty states */}
      {error && (
        <p style={{ textAlign: "center", color: "#7a756a", fontSize: 13, marginTop: 32 }}>
          Couldn&apos;t load events right now. Please try again shortly.
        </p>
      )}
      {events?.length === 0 && !error && (
        <p style={{ textAlign: "center", color: "#7a756a", fontSize: 13, marginTop: 32 }}>
          No events published yet.
        </p>
      )}

      <style>{`@keyframes pulse { 0%,100% { opacity: 1 } 50% { opacity: .55 } }`}</style>
    </section>
  );
}
