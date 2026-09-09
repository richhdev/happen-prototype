"use client";
import { Reveal } from "@/components/ui";
import { VENDOR_EVENTS } from "./data";
import { Section } from "@/components/Section/Section";
import { Heading3 } from "@/components/Heading/Heading";
import { TextMedium } from "@/components/Text/Text";
import { ButtonOutlineMedium } from "@/components/Button/Button";
import { asset } from "@/lib/data";
import styles from "./Vendors.module.css";

export default function Vendors() {
  return (
    <Section id="a-vendors" className={styles.vendorsSection}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset("/assets/vendor-bg.webp")}
        alt=""
        className={styles.vendorsSurface}
        fetchPriority="high"
        decoding="async"
      />

      <div className={styles.vendorsContentGroup}>
        <div className={styles.vendorsCopy}>
          <Heading3 as="h2" className={styles.vendorsHeading} animateTracking={false}>
            Festival retail vendors
          </Heading3>
          <TextMedium className={styles.vendorsBody}>
            We&rsquo;re on the lookout for market stall holders to join us at
            the festival and help bring the space to life.
          </TextMedium>
        </div>

        <div className={styles.vendorsCardGroup}>
          {VENDOR_EVENTS.map((event, i) => (
            <Reveal
              key={i}
              className={styles.vendorsCardWrap}
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

function VendorCard({ event }) {
  return (
    <div className={styles.vendorsCard}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={event.img} alt="" className={styles.vendorsCardImage} />

      <div className={styles.vendorsCardBody}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={event.logo} alt={event.name} className={styles.vendorsLogo} />

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
