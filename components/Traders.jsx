"use client";
import { Reveal } from "@/components/ui";

const MARRKETSTALL = [
  {
    title: "Good things 2026",
    body: "Retail vendor stall applications 2026",
    cta: "Get your stall",
    href: "https://form.jotform.com/261311126413846",
  },
  {
    title: "Beyond the valley 2026",
    body: "Retail vendor stall applications 2026",
    cta: "Get your stall",
    href: "https://form.jotform.com/261448233625861",
  },
];

export default function Traders() {
  return (
    <section id="a-traders" className="traders">
      <Reveal>
        <div className="traders-heading-group">
          <span className="traders-eyebrow">Want in?</span>
          <h2 className="traders-heading">
            Market Stall <br /> Applications
          </h2>
        </div>
      </Reveal>

      <div className="traders-grid">
        {MARRKETSTALL.map((c, i) => (
          <Reveal key={i} once={false} amount={0.5} delay={i * 160}>
            <div className="traders-card">
              <h3 className="traders-title">{c.title}</h3>
              <p className="traders-body">{c.body}</p>
              <a
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="traders-cta"
              >
                {c.cta} <span className="traders-cta-arrow">↗</span>
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

        .traders-heading-group {
          margin: 44px auto 44px;
          max-width: 760px;
          text-align: center;
        }

        .traders-eyebrow {
          display: block;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #ca0013;
          margin-bottom: 14px;
        }

        .traders-heading {
          font-size: 52px;
          font-weight: 900;
          letter-spacing: -0.03em;
          white-space: nowrap;
          text-transform: uppercase;
          line-height: 0.98;
          margin: 0;
        }

        .traders-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          max-width: 800px;
          width: 100%;
          margin: 0 auto;
        }

        @media (min-width: 768px) {
          .traders-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .traders-card {
          background: linear-gradient(180deg, #2c2c2c, #000000);
          border: 1px solid #262626;
          padding: 44px;
          height: 100%;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
        }

        .traders-kicker {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #ca0013;
          margin-bottom: 12px;
        }

        .traders-title {
          font-size: 28px;
          font-weight: 800;
          letter-spacing: -0.01em;
          margin: 0 0 16px;
          color: #eeebe3;
        }

        .traders-body {
          font-size: 14.5px;
          color: #c9c4b7;
          line-height: 1.65;
          margin: 0 0 26px;
        }

        .traders-cta {
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

        .traders-cta-arrow {
          font-size: 15px;
        }
      `}</style>
    </section>
  );
}
