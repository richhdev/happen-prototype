"use client";
import { useRef } from "react";
import { motion, useScroll } from "motion/react";
import { RIBBONS } from "./data";
import styles from "./Ribbons.module.css";

// One placement of one ribbon, as the custom properties the stylesheet draws
// from. Both placements are written out on every ribbon under their own names,
// and the stylesheet picks which set to read at the breakpoint — a media query
// cannot reach an inline style, but it can point the properties the art is
// drawn from at the other half of what is written here.
function placement(design, suffix) {
  return {
    [`--x${suffix}`]: `${design.x}px`,
    [`--y${suffix}`]: `${design.y}px`,
    [`--w${suffix}`]: `${design.width}px`,
    [`--h${suffix}`]: `${design.height}px`,
    [`--rotate${suffix}`]: `${design.rotate}deg`,
    [`--flip${suffix}`]: design.flip ? -1 : 1,
  };
}

// A ribbon is placed by a zero-height marker dropped on a section's top edge,
// so it travels with the section it belongs to. The marker sits behind the
// sections rather than between them: negative z-index in the page's root
// stacking context, which is also where the video backdrop sits, one step
// earlier in the document.
export function Ribbon({ name }) {
  const ribbon = RIBBONS[name];
  const boxRef = useRef(null);

  // 0 as the ribbon's box meets the bottom of the viewport, 1 as it leaves the
  // top — so the scroll it runs over is the viewport plus the box's own height,
  // which is what the stylesheet multiplies the rate by to get pixels. Handed
  // over raw rather than turned into a distance here: a fixed distance divided
  // by that pass is a different speed for every ribbon, which is what made the
  // layer look like four unrelated things.
  const { scrollYProgress } = useScroll({
    target: boxRef,
    offset: ["start end", "end start"],
  });

  return (
    <div
      className={styles.anchor}
      aria-hidden
      style={{
        ...placement(ribbon.mobile, ""),
        ...placement(ribbon.desktop, "-md"),
      }}
    >
      {/* Carries the progress but no transform of its own beyond centring, so
          the scroll it is measured on can't be moved by the drift that comes
          out of it — and so the image can still refuse that drift outright
          under reduced motion, which an inline value on the image could not. */}
      <motion.div
        ref={boxRef}
        className={styles.box}
        style={{ "--ribbon-progress": scrollYProgress }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={ribbon.src} alt="" className={styles.ribbon} loading="lazy" />
      </motion.div>
    </div>
  );
}

export default Ribbon;
