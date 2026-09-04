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

/**
 * How far a card has travelled, 0 (small, gathered at the centre) to 1 (full
 * size in its slot). Cards start in turn across STAGGER, each takes DURATION.
 */
function useSettle(progress, index) {
  const STAGGER = 0.35;
  const DURATION = 0.45;
  const start = (index / ARTISTS.length) * STAGGER;
  return useTransform(progress, [start, start + DURATION], [0, 1], {
    clamp: true,
  });
}

function ArtistCard({ artist, index, progress }) {
  const settle = useSettle(progress, index);

  return (
    <motion.article className={styles.card} style={{ "--travelled": settle }}>
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

  // Track the scroll progress of the sticky section
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  return (
    <Section id="b-artists" className={styles.artists}>
      <div ref={trackRef} className={styles.track}>
        <div className={styles.pinned}>
          <div className={styles.grid}>
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
