import styles from "./InstagramCard.module.css";

// One square tile in the Instagram grid: a still from the feed, linked to the
// post it came from.
export function InstagramCard({ src, href, className }) {
  return (
    <a
      className={`${styles.instagramCard} ${className ?? ""}`}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Happen Group Instagram post"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className={styles.instagramCardImage} />
    </a>
  );
}

export default InstagramCard;
