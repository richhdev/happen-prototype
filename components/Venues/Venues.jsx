import { Section } from "@/components/Section/Section";
import { Heading3, Heading4 } from "@/components/Heading/Heading";
import { TextSmall, TextMedium } from "@/components/Text/Text";
import { Badge } from "@/components/Badge/Badge";
import { VENUES } from "./data";
import styles from "./Venues.module.css";

export default function Venues() {
  return (
    <Section id="a-venues" className={styles.venues}>
      <div className={styles.panel}>
        <Heading3 as="h2" className={styles.title}>
          The rooms we fill
        </Heading3>

        <div className={styles.cards}>
          {VENUES.map((venue) => (
            <article
              key={venue.name}
              className={styles.card}
              style={{ backgroundImage: `url("${venue.img}")` }}
            >
              <div className={styles.overlay} />
              <Badge className={styles.badge}>{venue.capacity}</Badge>
              <div className={styles.content}>
                <Heading4 as="h3" className={styles.name}>
                  {venue.name}
                </Heading4>
                <TextSmall className={styles.address}>
                  {venue.address}
                </TextSmall>
                {/* Desktop only — the mobile card is too short to carry it. */}
                <TextMedium className={styles.description}>
                  {venue.description}
                </TextMedium>
              </div>
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}
