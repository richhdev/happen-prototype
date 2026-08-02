"use client";
import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
} from "motion/react";
import { useViewportHeight } from "@/components/ui";
import { EASE } from "@/lib/data";

const TESTIMONIALS = [
  {
    quote:
      "“Collaborating with the guys from Happen Group is a pleasure. Their understanding of what is required at a festival and knowledge of site infrastructure ensures a seamless exercise. They are prepared to roll up their sleeves to get the job done and have the finesse to design exciting and dynamic spaces.”",
    src: "Jeff Moss · Sound Event Group",
  },
  {
    quote:
      "“We’ve worked with the Happen team for years and it’s been smooth sailing from day one. The care they put into their shows from sound, creative, artist experience and care is unmatched. Highly recommend.”",
    src: "Jacob Malmo · Thick as Thieves",
  },
  {
    quote:
      "“Working with Happen Group has been a seamless experience from day one. Their team has helped us build meaningful community engagement through a highly effective micro-influencer campaign, while their street team has played an important role in increasing awareness and driving ticket sales for our events. They’re proactive, easy to work with, and consistently deliver with professionalism and care.”",
    src: "Daniel Hildebrand · Astral People",
  },
  {
    quote:
      "“We’ve loved working with Paris and Dana at Happen Group on the retail precinct at Beyond the Valley and Pitch Music & Arts. They come to every conversation prepared, stay on top of timelines, and make the whole process feel collaborative, which is exactly what you need in the lead-up to a major festival. We always feel like our vendor relationships are in good hands.”",
    src: "Miranda Nicol · Untitled Group",
  },
  {
    quote:
      "“I have been working with Happen Group for a number of years now, and everything from their communication, professionalism and attention to detail is top notch. They really know how to wear the hats of everyone from promoters, to punters, to site operators and everyone else, which results in a win-win for all working with them. Could not recommend highly enough.”",
    src: "Mike Toner · Thick as Thieves",
  },
  {
    quote:
      "“We absolutely love working with Happen Group. Macca, Paris and the team are incredibly easy to work with, communicate well and are super organised. No matter what gets thrown at them onsite, they’re calm, adaptable and just get on with it with a smile and a laugh.”",
    src: "Annie Tetzlaff · Good Things Festival / Destroy All Lines",
  },
];

const N = TESTIMONIALS.length;
const T_LEAD = 0.1;
const T_SETTLE = 0.12;
const STACK_STEP = 42;
const JX = [-26, 22, -14, 30, -34, 16];
const JR = [-3.5, 2.4, -1.6, 3.2, -2.8, 1.8];

function Card({ t, i, progress, vh, isTop, onClick }) {
  const offBelow = vh * 0.39;
  const restY = i * STACK_STEP - (N - 1) * STACK_STEP * 0.5;
  const jx = JX[i % 6];
  const jr = JR[i % 6];

  const yv = useTransform(progress, (p) => {
    const tS = T_LEAD + p * (N + T_SETTLE - T_LEAD);
    const local = Math.max(0, Math.min(1, tS - i));
    const eased = 1 - Math.pow(1 - local, 3);
    return restY + (1 - eased) * offBelow;
  });
  const transform = useMotionTemplate`translate(calc(-50% + ${jx}px), calc(-50% + ${yv}px)) rotate(${jr}deg)`;

  return (
    <motion.div
      onClick={onClick}
      style={{
        position: "absolute",
        left: "50%",
        top: "62%",
        width: "min(520px, calc(100% - 64px))",
        minHeight: 165,
        boxSizing: "border-box",
        transform,
        background: "#fff",
        border: "1px solid #d8d3c5",
        padding: 22,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        boxShadow: "0 -4px 18px rgba(0,0,0,.10)",
        zIndex: isTop ? 100 : i + 1,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 14 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "#CA0013" }}>{t.src}</div>
      </div>
      <p
        style={{
          fontSize: 14.5,
          fontStyle: "italic",
          color: "#3a362f",
          lineHeight: 1.5,
          margin: 0,
          textAlign: "center",
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textWrap: "pretty",
        }}
      >
        {t.quote}
      </p>
    </motion.div>
  );
}

export default function Testimonials() {
  const containerRef = useRef(null);
  const vh = useViewportHeight();
  const [topCard, setTopCard] = useState(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const bgY = useTransform(scrollYProgress, (p) => `${-(p * (520 - 100) * (vh / 100))}px`);

  return (
    <section id="a-testimonials" style={{ padding: 0 }}>
      <div ref={containerRef} style={{ height: "520vh", position: "relative" }}>
        <motion.div
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            overflow: "hidden",
            boxSizing: "border-box",
            backgroundImage: "radial-gradient(rgba(17,17,17,.10) 1.5px, transparent 1.5px)",
            backgroundSize: "56px 56px",
            backgroundPositionX: "0px",
            backgroundPositionY: bgY,
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, amount: 0.6 }}
            transition={{ duration: 0.64, ease: EASE }}
            style={{
              position: "absolute",
              left: "50%",
              top: "24%",
              transform: "translate(-50%,-50%)",
              zIndex: 30,
              width: "100%",
              maxWidth: 720,
              textAlign: "center",
            }}
          >
            <span style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "#CA0013", marginBottom: 14 }}>
              Testimonials
            </span>
            <motion.h2
              initial={{ letterSpacing: ".14em" }}
              whileInView={{ letterSpacing: "-.03em" }}
              viewport={{ once: false, amount: 0.6 }}
              transition={{ duration: 1.4, ease: EASE }}
              style={{ fontSize: 52, fontWeight: 900, textTransform: "uppercase", lineHeight: 0.98, margin: 0 }}
            >
              Trusted by the best<br />in the business
            </motion.h2>
          </motion.div>

          {TESTIMONIALS.map((t, i) => (
            <Card
              key={i}
              t={t}
              i={i}
              progress={scrollYProgress}
              vh={vh}
              isTop={topCard === i}
              onClick={() => setTopCard(i)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
