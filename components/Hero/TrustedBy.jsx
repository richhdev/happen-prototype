import { asset } from "@/components/Primitives";
import styles from "./TrustedBy.module.css";

const LOGO_SCALE = 0.3;

const CLIENTS = [
  {
    name: "Beyond The Valley",
    src: asset("/assets/client-beyond-the-valley.svg"),
    h: 65,
  },
  { name: "Live Nation", src: asset("/assets/client-live-nation.webp"), h: 85 },
  { name: "Novel", src: asset("/assets/client-novel.webp"), h: 65 },
  { name: "Happy Hour", src: asset("/assets/client-happy-hour.webp"), h: 83 },

  { name: "Dangerous Goods", src: asset("/assets/client-dg.webp"), h: 85 },
  { name: "A3", src: asset("/assets/client-a3.webp"), h: 57 },
  {
    name: "Astral People",
    src: asset("/assets/client-astral-people.svg"),
    h: 129,
  },
  {
    name: "Strawberry Fields",
    src: asset("/assets/client-strawberry-fields.webp"),
    h: 137,
  },
  { name: "Pitch", src: asset("/assets/client-pitch.webp"), h: 93 },
  {
    name: "Destroy All Lines",
    src: asset("/assets/client-destroy-all-lines.svg"),
    h: 87,
  },
  { name: "S.A.S.H", src: asset("/assets/client-sash.svg"), h: 67 },
  {
    name: "Strummingbird",
    src: asset("/assets/client-strummingbird.svg"),
    h: 65,
  },
  {
    name: "Our City Our Sound",
    src: asset("/assets/client-our-city-our-sound.svg"),
    h: 115,
  },
  { name: "Chapter", src: asset("/assets/client-chapter.webp"), h: 185 },
  { name: "Afrosoul", src: asset("/assets/client-afrosoul.svg"), h: 77 },
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
              style={{ height: c.h * LOGO_SCALE }}
              className={styles.trustedByLogo}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrustedBy;
