import { asset } from "@/lib/data";
import styles from "./VideoBackground.module.css";

export function VideoBackground() {
  return (
    <div
      className={styles.videoBackgroundContainer}
      aria-hidden="true"
      // Posters are painted by the container (poster="" can't take a media
      // query); url() in the CSS module can't be rewritten by asset().
      style={{
        "--video-background-poster": `url(${asset("/assets/video-background-poster.jpg")})`,
        "--video-background-poster-mobile": `url(${asset("/assets/video-background-mobile-poster.jpg")})`,
      }}
    >
      <video
        className={styles.videoBackgroundVideo}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
      >
        {/* First matching source wins, and only at load: rotating won't swap. */}
        <source
          src={asset("/assets/video-background-mobile.webm")}
          type="video/webm"
          media="(orientation: portrait)"
        />
        <source
          src={asset("/assets/video-background-mobile.mp4")}
          type="video/mp4"
          media="(orientation: portrait)"
        />
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
