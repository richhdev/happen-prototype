import { asset } from "@/lib/data";
import styles from "./SiteBackground.module.css";

// The video is a page-level fill, not a hero element: it sits fixed behind the
// whole site and every section scrolls over it. Sections with their own opaque
// background hide it; transparent ones (the hero) let it through.
export function SiteBackground() {
  return (
    <div className={styles.backdrop} aria-hidden="true">
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        src={asset("/assets/hero-bg.mp4")}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className={styles.video}
      />
    </div>
  );
}

export default SiteBackground;
