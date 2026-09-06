import { asset } from "@/lib/data";
import styles from "./TrustedBy.module.css";

const CLIENTS = [
  { name: "Beyond The Valley", src: asset("/assets/client-btv.svg"), h: 26 },
  {
    name: "Good Things Festival",
    src: asset("/assets/client-good-things-v1.svg"),
    h: 28,
  },
  { name: "Live Nation", src: asset("/assets/client-live-nation.png"), h: 26 },
  { name: "Novel", src: asset("/assets/client-novel.png"), h: 22 },
  { name: "Happy Hour", src: asset("/assets/client-happy-hour.png"), h: 30 },
  { name: "Dangerous Goods", src: asset("/assets/client-dg.png"), h: 24 },
  { name: "A3", src: asset("/assets/client-a3.png"), h: 22 },
  {
    name: "Astral People",
    src: asset("/assets/client-astral-people.svg"),
    h: 40,
  },
  {
    name: "Strawberry Fields",
    src: asset("/assets/client-strawberry-fields.png"),
    h: 40,
  },
  { name: "Pitch", src: asset("/assets/client-pitch.png"), h: 22 },
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
];

// Infinite client-logo marquee. The list is rendered twice and the track is
// animated by -50%, so the second copy lands exactly where the first started.
export function TrustedBy({ className, ...rest }) {
  const loop = CLIENTS.concat(CLIENTS);

  return (
    <div className={`${styles.mask} ${className ?? ""}`} {...rest}>
      <div className={styles.track}>
        {loop.map((c, i) => (
          <div className={styles.item} key={i} title={c.name}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={c.src}
              alt={c.name}
              style={{ height: c.h }}
              className={styles.logo}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrustedBy;
