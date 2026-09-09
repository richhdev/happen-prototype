import { Section } from "@/components/Section/Section";
import { RevealGroup, RevealItem } from "@/components/ui";
import { Heading3, Heading4 } from "@/components/Heading/Heading";
import { TextSmall, TextMedium } from "@/components/Text/Text";
import { Badge } from "@/components/Badge/Badge";
import { VENUES } from "./data";
import styles from "./Venues.module.css";

export default function Venues() {
  return (
    <Section id="a-venues" className={styles.venuesVenues}>
      <div className={styles.venuesSurface}>
        <Heading3 as="h2" className={styles.venuesTitle}>
          The rooms we fill
        </Heading3>

        <RevealGroup className={styles.venuesCardGroup} once={true}>
          {VENUES.map((venue) => (
            <RevealItem key={venue.name} className={styles.venuesCardReveal}>
              <article
                className={styles.venuesCard}
                style={{ backgroundImage: `url("${venue.img}")` }}
              >
                <div className={styles.venuesOverlay} />
                <Badge className={styles.venuesBadge}>{venue.capacity}</Badge>
                <div className={styles.venuesContent}>
                  <Heading4 as="h3" className={styles.venuesName}>
                    {venue.name}
                  </Heading4>
                  <TextSmall className={styles.venuesAddress}>
                    {venue.address}
                  </TextSmall>
                  {/* Desktop only — the mobile card is too short to carry it. */}
                  <TextMedium className={styles.venuesDescription}>
                    {venue.description}
                  </TextMedium>
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </Section>
  );
}
