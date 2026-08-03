"use client";
import { useEffect, useState } from "react";
import { Reveal } from "@/components/ui";
import { fetchEvents, ctfImage } from "@/lib/contentful";

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

export default function WhatsOnCms() {
  const [events, setEvents] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;
    fetchEvents()
      .then((data) => alive && setEvents(data))
      .catch(() => alive && setError(true));
    return () => {
      alive = false; // skip setState if fetch resolves after unmount
    };
  }, []);

  return (
    <section id="a-whatson-cms" className="whatson">
      <Reveal>
        <div className="heading-group">
          <span className="eyebrow">
            What&apos;s On
            <span className="live-badge">Live · Contentful</span>
          </span>
          <h2 className="heading">What&apos;s Happening</h2>
        </div>
      </Reveal>

      <div className="grid">
        {/* Loading skeleton */}
        {events === null &&
          !error &&
          [0, 1, 2].map((i) => (
            <div key={i} className="card">
              <div className="skeleton-img" />
              <div className="body">
                <div className="skeleton-tag" />
                <div className="skeleton-title" />
                <div className="skeleton-when" />
                <div className="skeleton-cta" />
              </div>
            </div>
          ))}

        {/* Loaded events */}
        {events?.map((ev, i) => {
          const soldout = ev.tag === "soldout";
          return (
            <Reveal key={ev.id} once={false} amount={0.5} delay={i * 130}>
              <div className="card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ctfImage(ev.imgUrl)}
                  alt={ev.title}
                  className="image"
                />
                <div className="body">
                  <span className={`tag tag-${ev.tag}`}>{labels[ev.tag]}</span>
                  <h3 className="title">{ev.title}</h3>
                  <div className="when">{whenText(ev)}</div>
                  <a
                    href={soldout ? undefined : ev.url}
                    target={soldout ? undefined : "_blank"}
                    rel={soldout ? undefined : "noopener noreferrer"}
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

      {/* Error / empty states */}
      {error && (
        <p className="status">
          Couldn&apos;t load events right now. Please try again shortly.
        </p>
      )}
      {events?.length === 0 && !error && (
        <p className="status">No events published yet.</p>
      )}

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
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #ca0013;
          margin-bottom: 14px;
        }

        .live-badge {
          font-size: 9px;
          letter-spacing: 0.08em;
          color: #7a756a;
          border: 1px solid #d8d3c5;
          border-radius: 999px;
          padding: 2px 8px;
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

        .status {
          text-align: center;
          color: #7a756a;
          font-size: 13px;
          margin-top: 32px;
        }

        .skeleton-img {
          display: block;
          width: 100%;
          aspect-ratio: 4 / 3;
          height: auto;
          background: #dcd6c8;
          animation: pulse 1.4s ease-in-out infinite;
        }

        .skeleton-tag {
          width: 70px;
          height: 20px;
          background: #e7e2d6;
        }

        .skeleton-title {
          width: 60%;
          height: 18px;
          background: #e7e2d6;
          margin: 14px 0 8px;
        }

        .skeleton-when {
          width: 80%;
          height: 12px;
          background: #efeae0;
          margin-bottom: 18px;
        }

        .skeleton-cta {
          width: 110px;
          height: 38px;
          border: 1.5px solid #e7e2d6;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.55;
          }
        }
      `}</style>
    </section>
  );
}
