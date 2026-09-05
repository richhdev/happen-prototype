"use client";
import { useEffect, useRef } from "react";
import { asset } from "@/lib/data";
import styles from "./Ribbons.module.css";

// The whole ribbon composition is one piece of art, laid out in Figma against
// the full scroll length of the page (node 711:6959) rather than assembled here
// out of ribbons keyed to sections. So there is nothing to place — only the
// drift to drive, and the stylesheet does that off a scroll timeline wherever
// there is one to use.
export default function Ribbons() {
  const ref = useRef(null);

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

    // Scroll fires faster than the screen repaints, so coalesce to one write per
    // frame — the drift can only show up on a frame boundary anyway.
    const write = () => {
      frame = 0;
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
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
    <div ref={ref} className={styles.layer} aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset("/assets/ribbons-layer.webp")}
        alt=""
        className={styles.art}
      />
    </div>
  );
}
