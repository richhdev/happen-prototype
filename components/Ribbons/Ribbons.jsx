"use client";
import { useEffect, useRef } from "react";
import { preload } from "react-dom";
import { asset } from "@/lib/data";
import styles from "./Ribbons.module.css";

export default function Ribbons() {
  const ref = useRef(null);

  // The sheet spans the first screen, so it is what Lighthouse times as the
  // page's largest paint — but as a url() behind a custom property it is only
  // found once the CSS has been applied, and then fetched at low priority.
  // These put it in the <head> at the page's own priority. The media queries
  // mirror the breakpoint in Ribbons.module.css, so only the cut that rule will
  // use is fetched.
  preload(asset("/assets/ribbons-v9-7-mobile.webp"), {
    as: "image",
    fetchPriority: "high",
    media: "(max-width: 767.98px)",
  });
  preload(asset("/assets/ribbons-v9-7-x2.webp"), {
    as: "image",
    fetchPriority: "high",
    media: "(min-width: 768px)",
  });

  // Firefox has no scroll timelines — not even the `animation-timeline` property
  // — so the CSS upgrade never applies there and the sheet would sit still while
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
        "--ribbon-art": `url(${asset("/assets/ribbons-v9-7-x2.webp")})`,
        "--ribbon-art-narrow": `url(${asset("/assets/ribbons-v9-7-mobile.webp")})`,
      }}
      aria-hidden
    />
  );
}
