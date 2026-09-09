import { asset } from "@/lib/data";
import styles from "./TrustedBy.module.css";

const CLIENTS = [
  {
    name: "Beyond The Valley",
    src: asset("/assets/client-beyond-the-valley.svg"),
    h: 26,
  },
  { name: "Live Nation", src: asset("/assets/client-live-nation.webp"), h: 35 },
  { name: "Novel", src: asset("/assets/client-novel.webp"), h: 22 },
  { name: "Happy Hour", src: asset("/assets/client-happy-hour.webp"), h: 37 },

  { name: "Dangerous Goods", src: asset("/assets/client-dg.webp"), h: 24 },
  { name: "A3", src: asset("/assets/client-a3.webp"), h: 32 },
  {
    name: "Astral People",
    src: asset("/assets/client-astral-people.svg"),
    h: 40,
  },
  {
    name: "Strawberry Fields",
    src: asset("/assets/client-strawberry-fields.webp"),
    h: 40,
  },
  { name: "Pitch", src: asset("/assets/client-pitch.webp"), h: 31 },
  {
    name: "Destroy All Lines",
    src: asset("/assets/client-destroy-all-lines.svg"),
    h: 26,
  },
  { name: "S.A.S.H", src: asset("/assets/client-sash.svg"), h: 28 },
  {
    name: "Strummingbird",
    src: asset("/assets/client-strummingbird.svg"),
    h: 26,
  },
  {
    name: "Our City Our Sound",
    src: asset("/assets/client-our-city-our-sound.svg"),
    h: 36,
  },
  { name: "Chapter", src: asset("/assets/client-chapter.webp"), h: 30 },
  { name: "Afrosoul", src: asset("/assets/client-afrosoul.svg"), h: 30 },
];

export function TrustedBy({ className, ...rest }) {
  const loop = CLIENTS.concat(CLIENTS);

  return (
    <div className={`${styles.trustedByMask} ${className ?? ""}`} {...rest}>
      <div className={styles.trustedByTrack}>
        {loop.map((c, i) => (
          <div className={styles.trustedByItem} key={i} title={c.name}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={c.src}
              alt={c.name}
              style={{ height: c.h }}
              className={styles.trustedByLogo}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrustedBy;
