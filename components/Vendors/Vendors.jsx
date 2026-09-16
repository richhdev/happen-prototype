"use client";
import { Reveal } from "@/components/ui";
import { VENDORS_COPY, VENDOR_EVENTS, VENDORS_CLOSED } from "./data";
import { Section } from "@/components/Section/Section";
import { Heading3 } from "@/components/Heading/Heading";
import { TextMedium } from "@/components/Text/Text";
import { ButtonOutlineMedium } from "@/components/Button/Button";
import { asset } from "@/lib/data";
import styles from "./Vendors.module.css";

export default function Vendors() {
  return (
    <VendorsSection>
      {VENDOR_EVENTS.map((event, i) => (
        <Reveal
          key={i}
          className={styles.vendorsCardOuter}
          once={true}
          amount={0}
          delay={i * 130}
        >
          <div className={styles.vendorsCard}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={event.logo}
              alt={event.name}
              className={styles.vendorsLogo}
              loading="lazy"
            />

            <ButtonOutlineMedium
              href={event.link}
              rel="noopener noreferrer"
              target="_blank"
            >
              {event.cta}
            </ButtonOutlineMedium>
          </div>
        </Reveal>
      ))}
    </VendorsSection>
  );
}

export function VendorsClosed() {
  const { copy, cta, link } = VENDORS_CLOSED;

  return (
    <VendorsSection>
      <Reveal className={styles.vendorsClosedCardOuter} once={true} amount={0}>
        <div className={styles.vendorsClosedCard}>
          <TextMedium className={styles.vendorsClosedCardCopy}>
            {copy}
          </TextMedium>
          <ButtonOutlineMedium
            href={link}
            rel="noopener noreferrer"
            target="_blank"
          >
            {cta}
          </ButtonOutlineMedium>
        </div>
      </Reveal>
    </VendorsSection>
  );
}

function VendorsSection({ children }) {
  return (
    <Section id="a-vendors" className={styles.vendorsSection}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset("/assets/vendor-bg.webp")}
        alt=""
        className={styles.vendorsSurface}
        loading="lazy"
        decoding="async"
      />

      <div className={styles.vendorsContentGroup}>
        <div className={styles.vendorsCopy}>
          <Heading3
            as="h2"
            className={styles.vendorsHeading}
            animateTracking={false}
          >
            {VENDORS_COPY.heading}
          </Heading3>
          <TextMedium className={styles.vendorsBody}>
            {VENDORS_COPY.body}
          </TextMedium>
        </div>

        <div className={styles.vendorsCardGroup}>{children}</div>
      </div>
    </Section>
  );
}
