"use client";
import { useEffect, useRef } from "react";
import { preload } from "react-dom";
import { asset } from "@/components/Primitives";
import styles from "./Ribbons.module.css";

// How many copies of the composition are stacked down the layer. The layer
// clips whatever runs past the page, so this only has to be enough for the
// narrowest phone, where each tile is shortest and the page longest: at 320px
// the layer is ~5.3 tiles tall.
const TILE_COUNT = 6;

// The four placements in the Figma frame (871:4399) — two of each ribbon. Their
// geometry lives in the stylesheet; this only says which art each one uses.
const PLACEMENTS = [
  styles.ribbonsPlacementA,
  styles.ribbonsPlacementB,
  styles.ribbonsPlacementC,
  styles.ribbonsPlacementD,
];

/**
 * Width fills whatever it is dropped into; height is measured from the rendered
 * content, so the stylesheet decides it rather than a number typed in Framer.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function Ribbons() {
  const ref = useRef(null);

  // The layer spans the first screen, so it is what Lighthouse times as the
  // page's largest paint — but as a url() behind a custom property it is only
  // found once the CSS has been applied, and then fetched at low priority.
  // These put it in the <head> at the page's own priority. The media queries
  // mirror the breakpoint in Ribbons.module.css, so only the art that rule will
  // use is fetched.
  for (const n of [1, 2]) {
    preload(asset(`/assets/ribbon-${n}-mobile.webp`), {
      as: "image",
      fetchPriority: "high",
      media: "(max-width: 767.98px)",
    });
    preload(asset(`/assets/ribbon-${n}.webp`), {
      as: "image",
      fetchPriority: "high",
      media: "(min-width: 768px)",
    });
  }

  // Firefox has no scroll timelines — not even the `animation-timeline` property
  // — so the CSS upgrade never applies there and the layer would sit still while
  // every other browser parallaxed it. This hands that one case the same
  // progress the timeline would have produced, and the same stylesheet rule
  // turns it into the same drift.
  //
  // Deliberately not motion's `useScroll`: it would run this listener in every
  // browser, including the ones already doing the work on the compositor.
  useEffect(() => {
    if (CSS.supports("animation-timeline: scroll()")) return;

    const layer = ref.current;
    let frame = 0;

    // Scroll fires faster than the screen repaints, so coalesce to one write per frame
    const write = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      layer.style.setProperty(
        "--ribbon-progress",
        max > 0 ? window.scrollY / max : 0,
      );
    };
    const schedule = () => {
      frame ||= requestAnimationFrame(write);
    };

    write();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={styles.ribbonsLayer}
      style={{
        "--ribbon-art-1-wide": `url(${asset("/assets/ribbon-1.webp")})`,
        "--ribbon-art-2-wide": `url(${asset("/assets/ribbon-2.webp")})`,
        "--ribbon-art-1-narrow": `url(${asset("/assets/ribbon-1-mobile.webp")})`,
        "--ribbon-art-2-narrow": `url(${asset("/assets/ribbon-2-mobile.webp")})`,
      }}
      aria-hidden
    >
      {Array.from({ length: TILE_COUNT }, (_, tile) => (
        <div key={tile} className={styles.ribbonsTile}>
          {PLACEMENTS.map((placement, i) => (
            <div key={i} className={`${styles.ribbonsRibbon} ${placement}`} />
          ))}
        </div>
      ))}
    </div>
  );
}
