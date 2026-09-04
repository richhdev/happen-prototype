"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { RIBBONS } from "./data";
import styles from "./Ribbons.module.css";

// How far a ribbon travels either side of its designed position across one full
// pass of the viewport. Runs positive as the ribbon leaves, so it lags the page
// instead of outrunning it — these sit behind every section and should read as
// further away. A pass covers the viewport plus the ribbon's own height, well
// over 2000px, so this is around a tenth of the page's own speed: enough to
// notice, not enough to pull the art off its mark. Turn it up here to taste.
const DRIFT = 360;

// A ribbon is placed by a zero-height marker dropped on a section's top edge,
// so it travels with the section it belongs to. The marker sits behind the
// sections rather than between them: negative z-index in the page's root
// stacking context, which is also where the video backdrop sits, one step
// earlier in the document.
export function Ribbon({ name }) {
  const ribbon = RIBBONS[name];
  const boxRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: boxRef,
    offset: ["start end", "end start"],
  });
  const drift = useTransform(
    scrollYProgress,
    [0, 1],
    [`${-DRIFT}px`, `${DRIFT}px`],
  );

  return (
    <div
      className={styles.anchor}
      aria-hidden
      style={{
        "--x": `${ribbon.x}px`,
        "--y": `${ribbon.y}px`,
        "--w": `${ribbon.width}px`,
        "--h": `${ribbon.height}px`,
        "--rotate": `${ribbon.rotate}deg`,
        "--flip": ribbon.flip ? -1 : 1,
      }}
    >
      {/* Carries the drift but no transform of its own beyond centring, so the
          scroll progress it is measured on can't be moved by the drift it
          produces — and so the image can still refuse it outright under
          reduced motion, which an inline value on the image could not. */}
      <motion.div
        ref={boxRef}
        className={styles.box}
        style={{ "--drift": drift }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={ribbon.src} alt="" className={styles.ribbon} loading="lazy" />
      </motion.div>
    </div>
  );
}

export default Ribbon;
