"use client";
import { Reveal } from "@/components/ui";
import { asset } from "@/lib/data";

const labels = { upcoming: "Upcoming", onsale: "On sale", soldout: "Sold out" };

const EVENTS = [
  {
    tag: "upcoming",
    title: "Chapter",
    when: "Date · Artists",
    img: asset("/assets/event-chapter.png"),
  },
  {
    tag: "onsale",
    title: "Party Girl",
    when: "Date · Artists",
    img: asset("/assets/event-partygirl.png"),
  },
  {
    tag: "soldout",
    title: "Overdrive",
    when: "Date · Artists",
    img: asset("/assets/event-overdrive.png"),
  },
];

export default function WhatsOn() {
  return (
    <section id="a-whatson" className="whatson">
      <Reveal>
        <div className="heading-group">
          <span className="eyebrow">What&apos;s On</span>
          <h2 className="heading">What&apos;s Happening</h2>
        </div>
      </Reveal>

      <div className="grid">
        {EVENTS.map((ev, i) => {
          const soldout = ev.tag === "soldout";
          return (
            <Reveal key={i} once={false} amount={0.5} delay={i * 130}>
              <div className="card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ev.img} alt={ev.title} className="image" />
                <div className="body">
                  <span className={`tag tag-${ev.tag}`}>{labels[ev.tag]}</span>
                  <h3 className="title">{ev.title}</h3>
                  <div className="when">{ev.when}</div>
                  <a
                    href="#"
                    className={`cta${soldout ? " cta-disabled" : ""}`}
                    aria-disabled={soldout || undefined}
                  >
                    {soldout ? "Sold out" : "Get tickets ↗"}
                  </a>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      <style jsx>{`
        .whatson {
          padding: 120px 48px;
          min-height: 100vh;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: center;
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
          gap: 20px;
          max-width: 800px;
          width: 100%;
          margin: 0 auto;
        }

        @media (min-width: 768px) {
          .grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .card {
          background: #fff;
          border: 1px solid #d8d3c5;
          overflow: hidden;
        }

        .image {
          display: block;
          width: 100%;
          aspect-ratio: 4 / 3;
          height: auto;
          object-fit: cover;
          object-position: center top;
          background: #dcd6c8;
        }

        .body {
          padding: 22px;
        }

        .tag {
          display: inline-block;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 4px 9px;
        }

        .tag-upcoming {
          background: #111;
          color: #fff;
        }

        .tag-onsale {
          background: #ca0013;
          color: #fff;
        }

        .tag-soldout {
          background: transparent;
          color: #7a756a;
          border: 1px solid #d8d3c5;
        }

        .title {
          font-size: 19px;
          font-weight: 800;
          margin: 12px 0 6px;
        }

        .when {
          font-size: 12px;
          color: #7a756a;
          margin-bottom: 18px;
        }

        .cta {
          display: inline-flex;
          padding: 10px 18px;
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 0.03em;
          text-transform: uppercase;
          text-decoration: none;
          color: #111;
          border: 1.5px solid #111;
        }

        .cta-disabled {
          color: #7a756a;
          border: 1.5px solid #d8d3c5;
          opacity: 0.6;
          pointer-events: none;
        }
      `}</style>
    </section>
  );
}
