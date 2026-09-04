"use client";
import { Reveal } from "@/components/ui";
import { VENDOR_EVENTS } from "./data";
import { Section } from "@/components/Section/Section";
import { Heading3 } from "@/components/Heading/Heading";
import { TextMedium } from "@/components/Text/Text";
import { ButtonOutlineMedium } from "@/components/Button/Button";
import { asset } from "@/lib/data";
import styles from "./Vendors.module.css";

function VendorCard({ event }) {
  return (
    <div className={styles.card}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={event.img} alt="" className={styles.cardImage} />

      <div className={styles.cardBody}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={event.logo} alt={event.name} className={styles.logo} />

        <ButtonOutlineMedium
          href={event.link}
          rel="noopener noreferrer"
          target="_blank"
        >
          {event.cta}
        </ButtonOutlineMedium>
      </div>
    </div>
  );
}

export default function Vendors() {
  return (
    <Section id="a-vendors" className={styles.section}>
      <div className={styles.surface}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset("/assets/bg-graphic.png")}
          alt=""
          className={styles.surfaceImage}
        />

        <div className={styles.copy}>
          <Heading3 as="h2" className={styles.heading}>
            Festival retail vendors
          </Heading3>
          <TextMedium className={styles.body}>
            We&rsquo;re on the lookout for market stall holders to join us at
            the festival and help bring the space to life.
          </TextMedium>
        </div>

        <div className={styles.cards}>
          {VENDOR_EVENTS.map((event, i) => (
            <Reveal
              key={i}
              className={styles.cardWrap}
              once={true}
              amount={0}
              delay={i * 130}
            >
              <VendorCard event={event} />
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
