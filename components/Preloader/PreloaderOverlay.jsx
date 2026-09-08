"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./Preloader.module.css";

// The artwork's whole timeline: the mark draws itself over the first three
// quarters, and the last quarter is the beat it holds once finished. So this is
// the floor on its own — the overlay never leaves mid-stroke, however fast the
// page arrives.
const DRAW_MS = 1500;

// The fade out, and the CSS transition it drives.
const FADE_MS = 600;

// The load event waits on the background video and every image on the page. On
// a slow connection that stops being a preloader and starts being a wall, so
// past this the overlay leaves whether the page is ready or not.
const MAX_WAIT_MS = 8000;

export default function PreloaderOverlay({ logoMarkup }) {
  // loading -> leaving (fading out) -> gone (removed from the DOM)
  const [phase, setPhase] = useState("loading");
  // Set inside the effect so a click can trigger the same leave() the timers use.
  const leaveRef = useRef(() => {});

  useEffect(() => {
    const timers = [];
    let left = false;

    const leave = () => {
      if (left) return;
      left = true;
      // Handed back at the start of the fade rather than the end: by then the
      // site is showing through, and a page that will not scroll reads as
      // broken well before it reads as still loading.
      document.body.style.overflow = "";
      setPhase("leaving");
      timers.push(setTimeout(() => setPhase("gone"), FADE_MS));
    };
    leaveRef.current = leave;

    // Nothing to wait for the draw to finish if it was never going to run.
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const floor = reduced ? 0 : DRAW_MS;

    // performance.now() is measured from the navigation, and the draw starts
    // at first paint — so this is the time the animation has actually had,
    // give or take the paint, and not the time since hydration.
    const ready = () =>
      timers.push(setTimeout(leave, Math.max(0, floor - performance.now())));

    if (document.readyState === "complete") ready();
    else window.addEventListener("load", ready, { once: true });

    timers.push(setTimeout(leave, MAX_WAIT_MS));

    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("load", ready);
      timers.forEach(clearTimeout);
      document.body.style.overflow = "";
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <>
      {/* Without JS nothing ever takes the cover away, so the site would be a
          charcoal rectangle. Hide it outright rather than leave a preloader
          that never finishes. */}
      <noscript>
        <style>{`.${styles.overlay}{display:none}`}</style>
      </noscript>

      <div
        role="button"
        aria-label="Skip intro"
        tabIndex={0}
        className={`${styles.overlay}${phase === "leaving" ? ` ${styles.leaving}` : ""}`}
        style={{
          "--preloader-draw": `${DRAW_MS}ms`,
          "--preloader-fade": `${FADE_MS}ms`,
        }}
        onClick={() => leaveRef.current()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            leaveRef.current();
          }
        }}
      >
        <div
          className={styles.logo}
          // Build-time artwork from public/assets/logo-draw.svg, not user input.
          dangerouslySetInnerHTML={{ __html: logoMarkup }}
        />
      </div>
    </>
  );
}
