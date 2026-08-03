"use client";
import { Reveal } from "@/components/ui";
import { asset } from "@/lib/data";

const labels = { upcoming: "Upcoming", onsale: "On sale", soldout: "Sold out" };

const EVENTS = [
  {
    title: "Party Girl Tour - Forgotten Cities",
    status: "onsale",
    date: "Sep 5th 2026",
    description: "Torrensville, SA Thebarton Theatre",
    link: "https://www.ticketmaster.com.au/party-girl-tour-forgotten-cities-presented-torrensville-05-09-2026/event/130064E68D62206C",
    img: asset("assets/event-party-girl-tour.jpg"),
  },
  {
    title: "Party Girl Tour - Forgotten Cities",
    status: "soldout",
    date: "Sept 09 2026",
    description: "Auckland, NZ, New Zealand, The Civic, Auckland,",
    link: "https://www.ticketmaster.co.nz/party-girl-tour-forgotten-cities-presented-auckland-09-09-2026/event/240064DDB8FD1EF4?currency-locale=en-au",
    img: asset("assets/event-party-girl-tour.jpg"),
  },
  {
    title: "Danny Rants - Off The Record",
    status: "upcoming",
    date: "to be confirmed",
    description: "",
    link: "https://happengroup.fillout.com/dannyrants",
    img: asset("assets/event-off-the-record-tour.png"),
  },
  {
    title: "Chapter NYE 2026",
    status: "upcoming",
    date: "31st dec 2026",
    description: "",
    link: "https://happengroup.fillout.com/t/fQhTFKa2Ntus",
    img: asset("assets/event-chaper-nye-2026.jpg"),
  },
];

export default function WhatsOn() {
  return (
    <div>
      <section id="a-whatson" className="whatson">
        <Reveal>
          <div className="heading-group">
            <span className="eyebrow">What&apos;s On</span>
            <h2 className="heading">What&apos;s Happening</h2>
          </div>
        </Reveal>

        <div className="grid">
          {EVENTS.map((ev, i) => {
            const soldout = ev.status === "soldout";
            return (
              <Reveal key={i} once={false} amount={0.5} delay={i * 130}>
                <div className="card">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={ev.img} alt={ev.title} className="image" />
                  <div className="body">
                    <span className={`status status-${ev.status}`}>
                      {labels[ev.status]}
                    </span>
                    <h3 className="title">{ev.title}</h3>
                    <div className="date">{ev.date}</div>
                    <div className="description">{ev.description}</div>
                    <a
                      href={ev.link}
                      rel="noopener noreferrer"
                      target="_blank"
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
            max-width: 600px;
            width: 100%;
            margin: 0 auto;
          }

          @media (min-width: 768px) {
            .grid {
              grid-template-columns: repeat(2, 1fr);
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

          .status {
            display: inline-block;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 0.06em;
            text-transform: uppercase;
            padding: 4px 9px;
          }

          .status-upcoming {
            background: #111;
            color: #fff;
          }

          .status-onsale {
            background: #ca0013;
            color: #fff;
          }

          .status-soldout {
            background: transparent;
            color: #7a756a;
            border: 1px solid #d8d3c5;
          }

          .title {
            font-size: 19px;
            font-weight: 800;
            margin: 12px 0 6px;
          }

          .date {
            font-size: 12px;
            color: #7a756a;
            margin-bottom: 18px;
          }

          .description {
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
    </div>
  );
}
