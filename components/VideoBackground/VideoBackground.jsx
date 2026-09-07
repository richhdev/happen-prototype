import { asset } from "@/lib/data";
import styles from "./VideoBackground.module.css";

export function VideoBackground() {
  return (
    <div className={styles.container} aria-hidden="true">
      <video
        className={styles.video}
        autoPlay
        loop
        muted
        playsInline
        poster={asset("/assets/video-background-poster.jpg")}
        preload="metadata"
      >
        <source
          src={asset("/assets/video-background.webm")}
          type="video/webm"
        />
        <source src={asset("/assets/video-background.mp4")} type="video/mp4" />
      </video>
    </div>
  );
}

export default VideoBackground;
