"use client";
import { Reveal } from "@/components/ui";
import { EVENTS } from "./data";
import { Section } from "@/components/Section/Section";
import { Heading2, Heading4 } from "@/components/Heading/Heading";
import { TextSmall, TextMedium } from "@/components/Text/Text";
import { Badge } from "@/components/Badge/Badge";
import { ButtonOutlineMedium } from "@/components/Button/Button";
import styles from "./Events.module.css";

const STATUSES = {
  upcoming: { label: "Upcoming", color: "charcoal" },
  onsale: { label: "On sale", color: "orange" },
  soldout: { label: "Sold out", color: "red" },
};

function EventCard({ event }) {
  const status = STATUSES[event.status];
  const soldout = event.status === "soldout";

  return (
    <article className={styles.card}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={event.img} alt="" className={styles.image} style={event.crop} />

      <div className={styles.overlay}>
        <Badge color={status.color}>{status.label}</Badge>

        <div className={styles.meta}>
          <TextSmall className={styles.date}>{event.date}</TextSmall>
          <Heading4 as="h3" className={styles.title}>
            {event.title}
          </Heading4>
        </div>

        <TextMedium className={styles.description}>
          {event.description}
        </TextMedium>

        <ButtonOutlineMedium
          href={event.link}
          rel="noopener noreferrer"
          target="_blank"
          className={soldout ? styles.ctaSoldOut : undefined}
          aria-disabled={soldout || undefined}
        >
          {soldout ? "Sold out" : event.cta}
        </ButtonOutlineMedium>
      </div>
    </article>
  );
}

export default function Events() {
  return (
    <Section
      id="a-events"
      className={styles.events}
      innerClassName={styles.inner}
    >
      <Heading2 className={styles.heading}>What&apos;s Happening</Heading2>

      <div className={styles.scroller}>
        {EVENTS.map((event, i) => (
          <Reveal
            key={i}
            className={styles.cardWrap}
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
