"use client";
import { Reveal } from "@/components/ui";
import { IG_TILES } from "@/lib/data";

export default function Instagram() {
  return (
    <section id="a-instagram" style={{ padding: "110px 48px", background: "#1a1a1a" }}>
      <Reveal style={{ margin: "0 auto 30px", maxWidth: 760, textAlign: "center" }}>
        <span style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "#CA0013", marginBottom: 14 }}>Instagram</span>
        <h2 style={{ fontSize: 40, fontWeight: 900, letterSpacing: "-.03em", whiteSpace: "nowrap", textTransform: "uppercase", margin: 0, color: "#fff" }}>@happengroupau</h2>
      </Reveal>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gridTemplateRows: "repeat(2,1fr)", gap: 8, maxWidth: 800, margin: "0 auto" }}>
        {IG_TILES.map((src, i) => (
          <a
            key={i}
            href="https://www.instagram.com/happengroupau/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Happen Group Instagram post"
            style={{
              display: "block",
              aspectRatio: "1",
              width: "100%",
              overflow: "hidden",
              backgroundColor: "#222",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundImage: `url('${src}')`,
            }}
          />
        ))}
      </div>
    </section>
  );
}
