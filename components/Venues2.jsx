import { motion } from "motion/react";

// Shared cubic-bezier easing used across every animation.
export const EASE = [0.16, 1, 0.3, 1];

const VENUES = [
  {
    meta: "629 Bourke St, CBD",
    name: "Bourke Street Courtyard",
    img: asset("/assets/venue-bourke-st-courtyard.png"),
    desc: "A heritage bluestone courtyard in the heart of the CBD. Industrial, open-air, and built for all-day and all-night events.",
    capacity: "Capacity 800",
  },
  {
    meta: "Corner of King & Lonsdale St, CBD",
    name: "Brown Alley",
    img: asset("/assets/venue-brown-alley.webp"),
    desc: "Melbourne's most iconic underground club — four rooms, world-class sound, and a 24-hour licence inside a heritage building on King Street.",
    capacity: "Capacity 1200",
  },
];

// Fade + rise on scroll into view. Re-triggers by default (matches the original
// prototype's repeating IntersectionObservers).
export function Reveal({
  children,
  delay = 0,
  y = 30,
  once = false,
  amount = 0.12,
  style,
  as = "div",
  ...rest
}) {
  const M = motion[as] || motion.div;
  return (
    <M
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount, margin: "0px 0px -60px 0px" }}
      transition={{ duration: 0.64, ease: EASE, delay: delay / 1000 }}
      style={style}
      {...rest}
    >
      {children}
    </M>
  );
}

export default function Venues() {
  return (
    <section
      id="a-venues"
      style={{
        padding: "120px 48px",
        backgroundColor: "#1a1a1a",
        minHeight: "100vh",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Reveal
        style={{ margin: "0 auto 44px", maxWidth: 760, textAlign: "center" }}
      >
        <span
          style={{
            display: "block",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: ".14em",
            textTransform: "uppercase",
            color: "#CA0013",
            marginBottom: 14,
          }}
        >
          Venues
        </span>
        <h2
          style={{
            fontSize: 52,
            fontWeight: 900,
            letterSpacing: "-.03em",
            whiteSpace: "nowrap",
            textTransform: "uppercase",
            lineHeight: 0.98,
            margin: 0,
            color: "#fff",
          }}
        >
          The rooms we fill
        </h2>
      </Reveal>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
          maxWidth: 800,
          width: "100%",
          margin: "0 auto",
        }}
      >
        {VENUES.map((v, i) => (
          <Reveal
            key={i}
            once={false}
            amount={0.5}
            delay={i * 160}
            style={{
              position: "relative",
              height: 340,
              background: "#1a1a1a",
              border: "1px solid #262626",
              overflow: "hidden",
              backgroundImage: v.img ? `url("${v.img}")` : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 20,
                right: 20,
                zIndex: 2,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: ".05em",
                textTransform: "uppercase",
                color: "#111",
                padding: "7px 14px",
                borderRadius: 20,
                background: i === 0 ? "#FFFFFF" : "#EEEBE3",
              }}
            >
              {v.capacity}
            </div>
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(0deg, rgba(0,0,0,.9) 0%, rgba(0,0,0,.5) 45%, rgba(0,0,0,.05) 100%)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                padding: 26,
                pointerEvents: "none",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: ".08em",
                  textTransform: "uppercase",
                  color: "#f2a1a8",
                  marginBottom: 6,
                }}
              >
                {v.meta}
              </div>
              <h3
                style={{
                  fontSize: 26,
                  fontWeight: 800,
                  color: "#fff",
                  margin: "0 0 8px",
                }}
              >
                {v.name}
              </h3>
              <p
                style={{
                  fontSize: 13,
                  color: "#dedad0",
                  lineHeight: 1.6,
                  margin: 0,
                  maxWidth: 440,
                }}
              >
                {v.desc}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
