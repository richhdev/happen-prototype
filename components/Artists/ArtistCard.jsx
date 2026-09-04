"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useTransform } from "motion/react";
import { Heading4 } from "@/components/Heading/Heading";
import { TextMedium } from "@/components/Text/Text";
import { Badge } from "@/components/Badge/Badge";
import { ARTISTS } from "./data";
import styles from "./ArtistCard.module.css";

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

export function ArtistCard({
  artist,
  index,
  progress,
  active,
  dimmed,
  onToggle,
}) {
  const settle = useSettle(progress, index);
  const reduceMotion = useReducedMotion();

  // The card animates back to its slot after `active` goes, so the lift has to
  // outlive the class. Motion tells us when it has landed; there's no duration
  // to guess at, and the spring is free to take as long as it takes.
  const [returning, setReturning] = useState(false);
  const wasActive = useRef(active);
  useEffect(() => {
    if (wasActive.current && !active) setReturning(true);
    wasActive.current = active;
  }, [active]);

  return (
    // The wrapper holds the grid slot and the scroll-settle transform; the card
    // inside it is what lifts out to the centre, so the row never collapses.
    <motion.article
      className={`${styles.wrap} ${active ? styles.wrapActive : ""} ${
        returning && !active ? styles.wrapReturning : ""
      }`}
      style={{ "--travelled": settle }}
    >
      <motion.div
        layout
        transition={
          reduceMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 260, damping: 30 }
        }
        onLayoutAnimationComplete={() => setReturning(false)}
        className={`${styles.card} ${active ? styles.cardActive : ""} ${
          dimmed ? styles.cardDimmed : ""
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={artist.img} alt="" className={styles.image} />
        <div className={styles.overlay} />

        {/* Sits under the content so the artist's links stay clickable in
            both states, and covers the rest of the card as the toggle. */}
        <button
          type="button"
          className={styles.toggle}
          aria-expanded={active}
          onClick={onToggle}
        >
          <span className={styles.toggleLabel}>
            {active ? `Close ${artist.name}` : `Read more about ${artist.name}`}
          </span>
        </button>

        <div className={styles.content}>
          <Heading4 as="h3" className={styles.name}>
            {artist.name}
          </Heading4>

          <Badge color="red" className={styles.badge}>
            {artist.genre}
          </Badge>

          {/* The box, not the text, is what opens: it collapses to nothing
              while the card is shut so the bio can grow the content upwards
              instead of appearing in one frame. */}
          <div className={styles.bioBox}>
            <TextMedium className={styles.bio}>{artist.bio}</TextMedium>
          </div>

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
      </motion.div>
    </motion.article>
  );
}

export default ArtistCard;
