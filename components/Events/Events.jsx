"use client";
import { Reveal } from "@/components/ui";
import { EVENTS } from "./data";
import { Section } from "@/components/Section/Section";
import { Heading2, Heading4 } from "@/components/Heading/Heading";
import { TextSmall, TextMedium } from "@/components/Text/Text";
import { Badge } from "@/components/Badge/Badge";
import { ButtonOutlineMedium } from "@/components/Button/Button";
import styles from "./Events.module.css";

export default function Events() {
  return (
    <Section
      id="a-events"
      className={styles.eventsSection}
      innerClassName={styles.eventsInner}
    >
      <Heading2 className={styles.eventsHeading}>What&apos;s Happening</Heading2>
      <div className={styles.eventsScroller}>
        {EVENTS.map((event, i) => (
          <Reveal
            key={i}
            className={styles.eventsCardWrap}
            once={true}
            amount={0}
            delay={i * 130}
          >
            <EventCard event={event} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

const STATUSES = {
  upcoming: { label: "Upcoming", color: "charcoal" },
  onsale: { label: "On sale", color: "orange" },
  soldout: { label: "Sold out", color: "red", soldout: true },
};

function EventCard({ event }) {
  const { label, color, soldout } = STATUSES[event.status];

  return (
    <article className={styles.eventsCard}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={event.img} alt="" className={styles.eventsImage} style={event.crop} />

      <div className={styles.eventsOverlay}>
        {label && <Badge color={color}>{label}</Badge>}

        <div className={styles.eventsMeta}>
          <TextSmall className={styles.eventsDate}>{event.date}</TextSmall>
          <Heading4 as="h3" className={styles.eventsTitle}>
            {event.title}
          </Heading4>
        </div>

        <TextMedium className={styles.eventsDescription}>
          {event.description}
        </TextMedium>

        <ButtonOutlineMedium
          href={event.link}
          rel="noopener noreferrer"
          target="_blank"
          className={soldout ? styles.eventsCtaSoldOut : undefined}
          aria-disabled={soldout || undefined}
        >
          {soldout ? "Sold out" : event.cta}
        </ButtonOutlineMedium>
      </div>
    </article>
  );
}
