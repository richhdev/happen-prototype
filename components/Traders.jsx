"use client";
import { Reveal } from "@/components/ui";

const CARDS = [
  {
    kicker: "Retail Vendor",
    title: "Set up as a retail vendor at a major festival.",
    body: "We manage retail precincts at festivals across Australia. If you've got a shop and would like to trade, fill out an application and we'll be in touch if there's a good fit.",
    ctas: [
      {
        label: "Good Things 2026",
        href: "https://form.jotform.com/261311126413846",
      },
      {
        label: "Beyond The Valley 2026",
        href: "https://form.jotform.com/261448233625861",
      },
    ],
  },
  {
    kicker: "Hosts & Promoters",
    title: "Turn your network into a side hustle.",
    body: "Become a Happen Group promoter, hook your mates up with tickets to some of Australia's best events and earn money along the way.",
    ctas: [
      {
        label: "Join the team",
        href: "https://docs.google.com/forms/d/e/1FAIpQLSdxwNLMLijvqMuaeHtV8M2FsPSfGB4g0ZVlATtbpdbBntmL6A/viewform",
      },
    ],
  },
  {
    kicker: "Casual Event Workers",
    title: "Pick up casual work at Australia's biggest events.",
    body: "Please fill out the below form if you are interested in hearing about casual work opportunities in the events industry.",
    ctas: [
      {
        label: "Register your interest",
        href: "https://docs.google.com/forms/d/e/1FAIpQLSfGExZGlBSpbc4ciG6nipO5i0NgDDcdFpXRqtsu3CWuMCBO9Q/viewform",
      },
    ],
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
              <div className="cta-row">
                {c.ctas.map((cta, j) => (
                  <a
                    key={j}
                    href={cta.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cta"
                  >
                    {cta.label} <span className="cta-arrow">↗</span>
                  </a>
                ))}
              </div>
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
          max-width: 1100px;
          width: 100%;
          margin: 0 auto;
        }

        @media (min-width: 768px) {
          .grid {
            grid-template-columns: repeat(3, 1fr);
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

        .cta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: auto;
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
        }

        .cta-arrow {
          font-size: 15px;
        }
      `}</style>
    </section>
  );
}
