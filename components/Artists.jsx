"use client";
import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
} from "motion/react";
import { asset, EASE } from "@/lib/data";

const ARTISTS = [
  {
    genre: "Electronic",
    name: "JÄMO",
    img: asset("/assets/artist-jamo.jpg"),
    desc: "Australian DJ, producer and founder of Critical Feeling — recognised for a euphoric, emotionally charged sound and electrifying live sets. An official Calvin Harris remix and standout appearances at Let Them Eat Cake, Beyond The Valley and A3 Festival.",
    instagramHandle: "@jamo.wav",
    instagram: "https://instagram.com/jamo.wav",
    musicHandle: "Spotify",
    music: "https://open.spotify.com/artist/5BatmKqX0n63qHXQTcKoPr",
  },
  {
    genre: "Techno / Trance",
    name: "Laura King",
    img: asset("/assets/artist-laura-king.jpg"),
    desc: "A leading force in Australia's contemporary techno/trance scene, bridging global trends and local flavour. High-energy sets blending hard dance, groove techno, hip hop vocals and psychedelic trance.",
    instagramHandle: "@laura.king.music",
    instagram: "https://instagram.com/laura.king.music",
    musicHandle: "Soundcloud",
    music: "https://soundcloud.com/laurakingofficial",
  },
  {
    genre: "House",
    name: "Sasha Fern",
    img: asset("/assets/artist-sasha-fern.jpg"),
    desc: "Known for all things steezy, in style and in sound. A tasteful flow of Tech & Latino House, Jackin', Garage and bouncy rhythms. Has warmed up for Peggy Gou, Sharam Jey and Boys Noize.",
    instagramHandle: "@sashafernn",
    instagram: "https://instagram.com/sashafernn",
    musicHandle: "Soundcloud",
    music: "",
  },
  {
    genre: "Rave",
    name: "Vanna",
    img: asset("/assets/artist-vanna.jpg"),
    desc: 'Melbourne-based, self-described "Naarm/Melbourne Rave Chic" and "bpm pusher." Has played Revolver Upstairs and venues in Paris and Dortmund.',
    instagramHandle: "@vannaspins",
    instagram: "https://instagram.com/vannaspins",
    musicHandle: "SoundCloud",
    music: "https://soundcloud.com/vannaspins",
  },
];

export default function Artists() {
  const containerRef = useRef(null);
  const [bioOpen, setBioOpen] = useState({});
  const [activeCard, setActiveCard] = useState(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const bgY = useTransform(scrollYProgress, (p) => `${p * -400}px`);

  const scrollToEnd = () => {
    if (!containerRef.current) return;
    const cRect = containerRef.current.getBoundingClientRect();
    const total = cRect.height - window.innerHeight;
    if (total <= 0) return;
    window.scrollBy({ top: cRect.top + total, behavior: "smooth" });
  };

  const handleClick = (i) => {
    setBioOpen((prev) => ({ ...prev, [i]: !prev[i] }));
    setActiveCard(i);
    scrollToEnd();
  };

  return (
    <section id="b-artists" className="artists-section">
      <div ref={containerRef} className="artists-shell">
        <motion.div
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            boxSizing: "border-box",
            overflow: "hidden",
            perspective: "1400px",
            perspectiveOrigin: "50% 45%",
            backgroundImage:
              "radial-gradient(rgba(255,255,255,.14) 1.5px, transparent 1.5px)",
            backgroundSize: "56px 56px",
            backgroundPositionX: "0px",
            backgroundPositionY: bgY,
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, amount: 0.4 }}
            transition={{ duration: 0.64, ease: EASE }}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%,-50%)",
              textAlign: "center",
              zIndex: 20,
              pointerEvents: "none",
            }}
          >
            <span className="artists-eyebrow">Artists</span>
            <motion.h2
              initial={{ letterSpacing: ".14em" }}
              whileInView={{ letterSpacing: "-.03em" }}
              viewport={{ once: false, amount: 0.6 }}
              transition={{ duration: 1.4, ease: EASE }}
              style={{
                fontSize: 64,
                fontWeight: 900,
                whiteSpace: "nowrap",
                textTransform: "uppercase",
                lineHeight: 0.98,
                margin: 0,
                color: "#EEEBE3",
              }}
            >
              Our artists
            </motion.h2>
          </motion.div>

          {ARTISTS.map((ar, i) => (
            <ArtistCard
              key={i}
              ar={ar}
              i={i}
              progress={scrollYProgress}
              bioOpen={!!bioOpen[i]}
              active={activeCard === i}
              onClick={() => handleClick(i)}
            />
          ))}
        </motion.div>
      </div>

      <style jsx>{`
        .artists-section {
          background: #111;
        }

        .artists-shell {
          height: 160vh;
        }

        .artists-eyebrow {
          display: block;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #ca0013;
          margin-bottom: 14px;
        }
      `}</style>
    </section>
  );
}

const cssEase = "cubic-bezier(.16,1,.3,1)";

const SPREAD = 0.4;
const N = ARTISTS.length;
const SCATTER = [
  { sx: -115, sy: -140, ex: -220, ey: -0.68, r: -7, sz: -820 },
  { sx: 145, sy: -155, ex: 205, ey: -0.82, r: 5, sz: -980 },
  { sx: -120, sy: 90, ex: -245, ey: 0.66, r: 4, sz: -680 },
  { sx: 115, sy: 100, ex: 185, ey: 0.78, r: -8, sz: -900 },
];

function progresses(p, i) {
  const s = SCATTER[i];
  const start = (i / N) * SPREAD;
  const pr = Math.max(0, Math.min(1, (p - start) / (1 - SPREAD)));
  const p_i = 1 - Math.pow(1 - pr, 3);
  return { s, p_i, a: 1 - p_i };
}

function ArtistCard({ ar, i, progress, bioOpen, active, onClick }) {
  const s = SCATTER[i];
  const txv = useTransform(progress, (p) => {
    const { p_i, a } = progresses(p, i);
    return s.sx * a + s.ex * p_i;
  });
  const tyv = useTransform(progress, (p) => {
    const { p_i, a } = progresses(p, i);
    return `calc(${s.sy * a}px + (50vh - 160px) * ${s.ey * p_i})`;
  });
  const tzv = useTransform(progress, (p) => {
    const { a } = progresses(p, i);
    return s.sz * a;
  });
  const rotv = useTransform(progress, (p) => {
    const { p_i } = progresses(p, i);
    return s.r * (1 - p_i * 0.6);
  });
  const transform = useMotionTemplate`translate(-50%,-50%) translate3d(${txv}px, ${tyv}, ${tzv}px) rotate(${rotv}deg)`;

  return (
    <motion.div
      onClick={onClick}
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: 240,
        height: 280,
        cursor: "pointer",
        background: "#1a1a1a",
        border: "1px solid #262626",
        overflow: "hidden",
        backgroundImage: ar.img ? `url("${ar.img}")` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        transform,
        zIndex: active ? 15 : 14 - i,
        willChange: "transform",
      }}
    >
      <div className="artist-overlay">
        <div className="artist-badge">{ar.genre}</div>
        <h3 className="artist-name">{ar.name}</h3>
        <p
          className="artist-desc"
          style={{
            opacity: bioOpen ? 1 : 0,
            maxHeight: bioOpen ? 200 : 0,
            transition: `opacity 420ms ${cssEase}, max-height 420ms ${cssEase}`,
          }}
        >
          {ar.desc}
        </p>

        {ar.instagram && ar.instagramHandle && (
          <ArtistLink href={ar.instagram}>{ar.instagramHandle}</ArtistLink>
        )}

        {ar.music && ar.musicHandle && (
          <ArtistLink href={ar.music}>{ar.musicHandle}</ArtistLink>
        )}
      </div>
      <style jsx>{`
        .artist-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 90px 20px 20px;
          pointer-events: none;
          background: linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.92) 0%,
            rgba(0, 0, 0, 0.55) 42%,
            rgba(0, 0, 0, 0.05) 100%
          );
        }

        .artist-badge {
          display: inline-block;
          align-self: flex-start;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #111;
          background: #ca0013;
          padding: 5px 10px;
          margin-bottom: 12px;
        }

        .artist-name {
          font-size: 21px;
          font-weight: 900;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          color: #fff;
          margin: 0 0 8px;
        }

        .artist-desc {
          font-size: 12.5px;
          color: #dedad0;
          line-height: 1.55;
          margin: 0 0 8px;
          overflow: hidden;
        }
      `}</style>
    </motion.div>
  );
}

function ArtistLink({ href, children }) {
  return (
    <div className="artist-link">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </a>
      <style jsx>{`
        .artist-link {
          font-size: 11px;
          color: #c9c4b7;
          font-weight: 600;
          pointer-events: auto;
        }

        .artist-link a {
          font-size: 11px;
          color: #c9c4b7;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
