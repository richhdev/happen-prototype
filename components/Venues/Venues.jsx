import { Section } from "@/components/Section/Section";
import { RevealGroup, RevealItem } from "@/components/ui";
import { Heading3, Heading4 } from "@/components/Heading/Heading";
import { TextSmall, TextMedium } from "@/components/Text/Text";
import { Badge } from "@/components/Badge/Badge";
import { ButtonOutlineMedium } from "@/components/Button/Button";
import { VENUES } from "./data";
import styles from "./Venues.module.css";

export default function Venues() {
  return (
    <Section id="a-venues" className={styles.venuesVenues}>
      <div className={styles.venuesSurface}>
        <div className={styles.venuesHead}>
          <Heading3 as="h2" className={styles.venuesTitle}>
            The rooms we fill
          </Heading3>
          <TextMedium className={styles.venuesIntro}>
            We hold the keys to some of Melbourne&rsquo;s best rooms. Tell us
            what you&rsquo;re planning and we&rsquo;ll find the right space.
          </TextMedium>
          <ButtonOutlineMedium
            href="#a-contact"
            color="charcoal"
            className={styles.venuesCta}
          >
            Book a venue
          </ButtonOutlineMedium>
        </div>

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
