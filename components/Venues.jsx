"use client";
import { Reveal } from "@/components/ui";
import { VENUES } from "@/lib/data";

export default function Venues() {
  return (
    <section id="a-venues" className="venues">
      <Reveal>
        <div className="venues-head">
          <span className="eyebrow">Venues</span>
          <h2 className="title">
            The rooms
            <br className="title-break" /> we fill
          </h2>
        </div>
      </Reveal>

      <div className="grid">
        {VENUES.map((v, i) => (
          <Reveal key={i} once={false} amount={0.5} delay={i * 160}>
            <div
              className="card"
              style={{
                backgroundImage: v.img ? `url("${v.img}")` : "none",
              }}
            >
              <div className={`badge${i === 0 ? " badge-light" : ""}`}>
                {v.capacity}
              </div>
              <div className="overlay">
                <div className="meta">{v.meta}</div>
                <h3 className="name">{v.name}</h3>
                <p className="desc">{v.desc}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <style jsx>{`
        .venues {
          padding: 120px 48px;
          background-color: #1a1a1a;
          min-height: 100vh;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .venues-head {
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

        .title {
          font-size: clamp(32px, 6vw + 12px, 52px);
          font-weight: 900;
          letter-spacing: -0.03em;
          text-transform: uppercase;
          line-height: 0.98;
          margin: 0;
          color: #fff;
        }

        @media (min-width: 768px) {
          .title-break {
            display: none;
          }
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
            grid-template-columns: 1fr 1fr;
          }
        }

        .card {
          position: relative;
          height: 340px;
          background: #1a1a1a;
          border: 1px solid #262626;
          overflow: hidden;
          background-size: cover;
          background-position: center;
        }

        .badge {
          position: absolute;
          top: 20px;
          right: 20px;
          z-index: 2;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #111;
          padding: 7px 14px;
          border-radius: 20px;
          background: #eeebe3;
        }

        .badge-light {
          background: #fff;
        }

        .overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.9) 0%,
            rgba(0, 0, 0, 0.5) 45%,
            rgba(0, 0, 0, 0.05) 100%
          );
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 26px;
          pointer-events: none;
        }

        .meta {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #f2a1a8;
          margin-bottom: 6px;
        }

        .name {
          font-size: 26px;
          font-weight: 800;
          color: #fff;
          margin: 0 0 8px;
        }

        .desc {
          font-size: 13px;
          color: #dedad0;
          line-height: 1.6;
          margin: 0;
          max-width: 440px;
        }
      `}</style>
    </section>
  );
}
