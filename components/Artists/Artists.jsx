"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Reveal } from "@/components/ui";
import { ARTISTS } from "./data";
import { Section } from "@/components/Section/Section";
import { Heading2, Heading4 } from "@/components/Heading/Heading";
import { TextMedium } from "@/components/Text/Text";
import { Badge } from "@/components/Badge/Badge";
import styles from "./Artists.module.css";

// Both are fractions of the pinned scroll. The cards start in turn across the
// first STAGGER of it and each takes DURATION to arrive, so the last one is
// home around 70% in and the finished grid gets a beat to itself before the
// section lets go.
const STAGGER = 0.35;
const DURATION = 0.45;

// 0 while the card is zoomed out, 1 once it is full size in its grid slot.
// Eased out cubic, so cards arrive gently rather than snapping into place.
function useSettle(progress, index) {
  return useTransform(progress, (p) => {
    const start = (index / ARTISTS.length) * STAGGER;
    const t = Math.min(1, Math.max(0, (p - start) / DURATION));
    return 1 - Math.pow(1 - t, 3);
  });
}

function ArtistCard({ artist, index, progress }) {
  // Only the eased progress comes from JS; how far the card zooms is CSS, so
  // it can be tuned per breakpoint without a second set of numbers here.
  const settle = useSettle(progress, index);

  return (
    <motion.article className={styles.card} style={{ "--t": settle }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={artist.img} alt="" className={styles.image} />
      <div className={styles.overlay} />

      <div className={styles.content}>
        <Heading4 as="h3" className={styles.name}>
          {artist.name}
        </Heading4>

        <Badge color="red" className={styles.badge}>
          {artist.genre}
        </Badge>

        <TextMedium className={styles.bio}>{artist.bio}</TextMedium>

        <div className={styles.links}>
          {artist.links.map((link) => (
            <TextMedium
              key={link.label}
              as="a"
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              <span className={styles.linkLabel}>{link.label}</span> ↗
            </TextMedium>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

export default function Artists() {
  const trackRef = useRef(null);

  // The track is taller than the viewport; the grid inside it sticks. Progress
  // runs from the moment the top of the track reaches the top of the viewport
  // to the moment its bottom comes back up — i.e. exactly the stretch the grid
  // spends pinned, with every card on screen for all of it.
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  return (
    <Section id="b-artists" className={styles.artists}>
      <div ref={trackRef} className={styles.track}>
        <div className={styles.pinned}>
          <div className={styles.grid}>
            {/* Sits dead centre of the grid, in the gap between the two rows,
                as in the design. Centred by inset + flex rather than a
                translate, so the Reveal's own transform has nothing to fight
                over. */}
            <Reveal className={styles.headingWrap}>
              <Heading2 className={styles.heading}>Our artists</Heading2>
            </Reveal>

            {ARTISTS.map((artist, i) => (
              <ArtistCard
                key={artist.name}
                artist={artist}
                index={i}
                progress={scrollYProgress}
              />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
