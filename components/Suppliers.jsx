"use client";
import { Reveal } from "@/components/ui";
import { asset } from "@/lib/data";

const SUPPLIERS = [
  { name: "Hertz", src: asset("/assets/supplier-hertz-dark.png"), h: 29 },
  { name: "Avis", src: asset("/assets/supplier-avis-dark.png"), h: 27 },
  {
    name: "Network Transfers",
    src: asset("/assets/supplier-network-transfers-dark.png"),
    h: 26,
  },
  { name: "Kmart", src: asset("/assets/supplier-kmart-dark.png"), h: 21 },
  { name: "Coles", src: asset("/assets/supplier-coles-dark.png"), h: 27 },
  {
    name: "Dan Murphy's",
    src: asset("/assets/supplier-dan-murphys-dark.png"),
    h: 25,
  },
  { name: "Bunnings", src: asset("/assets/supplier-bunnings-dark.png"), h: 28 },
  { name: "Valiant", src: asset("/assets/supplier-valiant-dark.png"), h: 21 },
  { name: "Gig", src: asset("/assets/supplier-gig-dark.png"), h: 30 },
  { name: "Social", src: asset("/assets/supplier-social-dark.png"), h: 25 },
];

export default function Suppliers() {
  return (
    <section id="a-suppliers" style={{ padding: "110px 48px", background: "#D9CFC0" }}>
      <Reveal style={{ margin: "0 auto 44px", maxWidth: 760, textAlign: "center" }}>
        <span style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "#CA0013", marginBottom: 14 }}>Suppliers</span>
        <h2 style={{ fontSize: 52, fontWeight: 900, letterSpacing: "-.03em", whiteSpace: "nowrap", textTransform: "uppercase", lineHeight: 0.98, margin: "0 0 18px" }}>We know everyone</h2>
        <p style={{ fontSize: 16, color: "#950000", fontWeight: 600, lineHeight: 1.6, maxWidth: 640, marginLeft: "auto", marginRight: "auto" }}>
          A trusted nationwide supplier network — the reach and relationships to deliver shows efficiently and cost-effectively across Australia.
        </p>
      </Reveal>

      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 14 }}>
          {SUPPLIERS.map((c, i) => (
            <Reveal
              key={i}
              once
              amount={0.9}
              delay={i * 60}
              style={{ display: "flex", height: 92, alignItems: "center", justifyContent: "center" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.src} alt={c.name} style={{ height: c.h || 28, maxWidth: "78%", objectFit: "contain" }} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
