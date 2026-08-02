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
    <section id="a-traders" className="traders">
      <Reveal>
        <div className="heading-group">
          <span className="eyebrow">Traders &amp; Hosts</span>
          <h2 className="heading">Want in?</h2>
        </div>
      </Reveal>

      <div className="grid">
        {CARDS.map((c, i) => (
          <Reveal key={i} once={false} amount={0.5} delay={i * 160}>
            <div className="card">
              <div className="kicker">{c.kicker}</div>
              <h3 className="title">{c.title}</h3>
              <p className="body">{c.body}</p>
              <a href={c.href} target="_blank" rel="noopener noreferrer" className="cta">
                {c.cta} <span className="cta-arrow">↗</span>
              </a>
            </div>
          </Reveal>
        ))}
      </div>

      <style jsx>{`
        .traders {
          padding: 120px 48px;
          min-height: 100vh;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: #e4dbcb;
        }

        .heading-group {
          margin: 0 auto 44px;
          max-width: 760px;
          text-align: center;
        }

        .eyebrow {
          display: block;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #ca0013;
          margin-bottom: 14px;
        }

        .heading {
          font-size: 52px;
          font-weight: 900;
          letter-spacing: -0.03em;
          white-space: nowrap;
          text-transform: uppercase;
          line-height: 0.98;
          margin: 0;
        }

        .grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          max-width: 800px;
          width: 100%;
          margin: 0 auto;
        }

        @media (min-width: 768px) {
          .grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .card {
          background: linear-gradient(180deg, #2c2c2c, #000000);
          border: 1px solid #262626;
          padding: 44px;
          height: 100%;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
        }

        .kicker {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #ca0013;
          margin-bottom: 12px;
        }

        .title {
          font-size: 28px;
          font-weight: 800;
          letter-spacing: -0.01em;
          margin: 0 0 16px;
          color: #eeebe3;
        }

        .body {
          font-size: 14.5px;
          color: #c9c4b7;
          line-height: 1.65;
          margin: 0 0 26px;
        }

        .cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 26px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.03em;
          text-transform: uppercase;
          text-decoration: none;
          color: #eeebe3;
          border: 1.5px solid rgba(238, 235, 227, 0.5);
          margin-top: auto;
          align-self: flex-start;
        }

        .cta-arrow {
          font-size: 15px;
        }
      `}</style>
    </section>
  );
}
