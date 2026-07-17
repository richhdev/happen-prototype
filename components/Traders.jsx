"use client";
import { Reveal } from "@/components/ui";

const CARDS = [
  {
    kicker: "Market traders",
    title: "Set up a stall at a major festival.",
    body: "We manage market villages at Australia's biggest events. If you've got a stall worth bringing, we've got the space, the crowd, and the process handled from application through to show day.",
    cta: "Get your stall",
    href: "https://docs.google.com/forms/d/e/1FAIpQLSckRb2G14DYaI8nsFkefg57j11VgkiwvdGxYnOqG9SUGjYu_g/viewform",
  },
  {
    kicker: "Hosts & promoters",
    title: "Become part of the Happen team.",
    body: "We're always looking for well-connected individuals and magnetic group leaders — social, influential, and the life of the party — to join our community building network.",
    cta: "Join the team",
    href: "https://docs.google.com/forms/d/e/1FAIpQLSfGExZGlBSpbc4ciG6nipO5i0NgDDcdFpXRqtsu3CWuMCBO9Q/viewform",
  },
];

export default function Traders() {
  return (
    <section
      id="a-traders"
      style={{ padding: "120px 48px", minHeight: "100vh", boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "center", background: "#E4DBCB" }}
    >
      <Reveal style={{ margin: "0 auto 44px", maxWidth: 760, textAlign: "center" }}>
        <span style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "#CA0013", marginBottom: 14 }}>Traders &amp; Hosts</span>
        <h2 style={{ fontSize: 52, fontWeight: 900, letterSpacing: "-.03em", whiteSpace: "nowrap", textTransform: "uppercase", lineHeight: 0.98, margin: 0 }}>Want in?</h2>
      </Reveal>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, maxWidth: 800, width: "100%", margin: "0 auto" }}>
        {CARDS.map((c, i) => (
          <Reveal
            key={i}
            once={false}
            amount={0.5}
            delay={i * 160}
            style={{ background: "linear-gradient(180deg, #2C2C2C, #000000)", border: "1px solid #262626", padding: 44 }}
          >
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "#CA0013", marginBottom: 12 }}>{c.kicker}</div>
            <h3 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-.01em", margin: "0 0 16px", color: "#EEEBE3" }}>{c.title}</h3>
            <p style={{ fontSize: 14.5, color: "#c9c4b7", lineHeight: 1.65, margin: "0 0 26px" }}>{c.body}</p>
            <a
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 26px", fontSize: 12, fontWeight: 700, letterSpacing: ".03em", textTransform: "uppercase", textDecoration: "none", color: "#EEEBE3", border: "1.5px solid rgba(238,235,227,.5)" }}
            >
              {c.cta} <span style={{ fontSize: 15 }}>↗</span>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
