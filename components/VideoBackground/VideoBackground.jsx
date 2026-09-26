import { asset } from "@/components/Primitives";
import styles from "./VideoBackground.module.css";

/**
 * The video, filling the section it is dropped into. It needs a positioned
 * parent that is not a stacking context — the section's own wrapper — so that
 * it can sit below the ribbons rather than only below the section.
 *
 * `name` is the base of the six files in /assets — two cuts, two formats, two
 * posters — so a section can be given a different video.
 */
export function VideoBackground({
  name = "video-background-v2",
  behindNav = false,
}) {
  const src = (suffix) => asset(`/assets/${name}${suffix}`);

  return (
    <div
      className={`${styles.videoBackground} ${behindNav ? styles.videoBackgroundBehindNav : ""}`}
      aria-hidden="true"
      style={{
        "--video-background-poster": `url(${src("-poster.jpg")})`,
        "--video-background-poster-mobile": `url(${src("-mobile-poster.jpg")})`,
      }}
    >
      <div className={styles.videoBackgroundTrack}>
        <div className={styles.videoBackgroundViewport}>
          <video
            className={styles.videoBackgroundVideo}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
          >
            <source
              src={src("-mobile.webm")}
              type="video/webm"
              media="(orientation: portrait)"
            />
            <source
              src={src("-mobile.mp4")}
              type="video/mp4"
              media="(orientation: portrait)"
            />
            <source src={src(".webm")} type="video/webm" />
            <source src={src(".mp4")} type="video/mp4" />
          </video>
        </div>
      </div>
    </div>
  );
}

export default VideoBackground;
