"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion, useScroll } from "motion/react";
import { ARTISTS } from "./data";
import { ArtistCard } from "./ArtistCard";
import { Section } from "@/components/Section/Section";
import { Heading2 } from "@/components/Heading/Heading";
import styles from "./Artists.module.css";

/* How far from the pin's rest point the viewer has to scroll before the open
   card closes, as a share of the viewport. Proportional rather than a fixed
   distance, so the buffer feels the same on a phone as on a desktop. */
const CLOSE_FRACTION = 1 / 3;

export default function Artists() {
  const trackRef = useRef(null);
  // Where the pin comes to rest, and so where an open card sits.
  const restTopRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(null);
  const isOpen = activeIndex !== null;
  const reduceMotion = useReducedMotion();

  // Track the scroll progress of the sticky section
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  // The far end of the pin, where the cards have finished settling. Opening a
  // card scrolls here so the grid behind it is at rest rather than caught
  // mid-zoom.
  const scrollToRest = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const { top, height } = track.getBoundingClientRect();
    restTopRef.current = top + window.scrollY + height - window.innerHeight;
    window.scrollTo({
      top: restTopRef.current,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [reduceMotion]);

  const toggle = (index) => {
    if (index === activeIndex) {
      setActiveIndex(null);
      return;
    }
    setActiveIndex(index);
    scrollToRest();
  };

  // Scrolling away in either direction closes the open card: the card is only
  // legible with the grid parked at the end of the pin, and it can't follow the
  // section out of the viewport.
  useEffect(() => {
    if (!isOpen) return;
    // Opening scrolls to the rest point itself, and that scroll can still be in
    // flight here. Distance to the rest point tells the two apart without a
    // timer to guess at: ours only ever closes it, the viewer's opens it up.
    let lastDrift = Infinity;
    const closeDistance = window.innerHeight * CLOSE_FRACTION;
    const onScroll = () => {
      const drift = Math.abs(window.scrollY - restTopRef.current);
      const movingAway = drift > lastDrift;
      lastDrift = drift;
      if (movingAway && drift > closeDistance) setActiveIndex(null);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [activeIndex, isOpen]);

  // Escape closes the open card, alongside the dim layer's click-away.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => e.key === "Escape" && setActiveIndex(null);
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  return (
    <Section id="b-artists" className={styles.artists}>
      <div ref={trackRef} className={styles.track}>
        <div className={styles.pinned}>
          <div
            className={`${styles.dim} ${isOpen ? styles.dimVisible : ""}`}
            onClick={() => setActiveIndex(null)}
            aria-hidden="true"
          />

          <div className={styles.grid}>
            <div className={styles.headingWrap}>
              <Heading2 className={styles.heading}>Our artists</Heading2>
            </div>

            {ARTISTS.map((artist, i) => (
              <ArtistCard
                key={artist.name}
                artist={artist}
                index={i}
                progress={scrollYProgress}
                active={i === activeIndex}
                dimmed={isOpen && i !== activeIndex}
                onToggle={() => toggle(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
