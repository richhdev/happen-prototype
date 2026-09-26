"use client";
import {
  asset,
  Section,
  Heading3,
  TextMedium,
  ButtonOutlineMedium,
  Reveal,
} from "@/components/Primitives";
import { DEFAULTS, CLOSED_DEFAULTS } from "./data";
import styles from "./Vendors.module.css";

/**
 * Width fills whatever it is dropped into; height is measured from the rendered
 * content, so the stylesheet decides it rather than a number typed in Framer.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function Vendors(props) {
  const {
    heading = DEFAULTS.heading,
    body = DEFAULTS.body,
    newTab = true,
  } = props;
  const cards = [1, 2]
    .map((n) => ({
      name: props[`card${n}Name`] ?? DEFAULTS[`card${n}Name`],
      logo: props[`card${n}Logo`] ?? DEFAULTS[`card${n}Logo`],
      cta: props[`card${n}Cta`] ?? DEFAULTS[`card${n}Cta`],
      link: props[`card${n}Link`] ?? DEFAULTS[`card${n}Link`],
    }))
    .filter((card) => card.name);

  return (
    <VendorsSection heading={heading} body={body}>
      {cards.map((event, i) => (
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
              rel={newTab ? "noopener noreferrer" : undefined}
              target={newTab ? "_blank" : undefined}
            >
              {event.cta}
            </ButtonOutlineMedium>
          </div>
        </Reveal>
      ))}
    </VendorsSection>
  );
}

export function VendorsClosed({
  heading = CLOSED_DEFAULTS.heading,
  body = CLOSED_DEFAULTS.body,
  copy = CLOSED_DEFAULTS.copy,
  cta = CLOSED_DEFAULTS.cta,
  link = CLOSED_DEFAULTS.link,
  newTab = true,
}) {
  return (
    <VendorsSection heading={heading} body={body}>
      <Reveal className={styles.vendorsClosedCardOuter} once={true} amount={0}>
        <div className={styles.vendorsClosedCard}>
          <TextMedium className={styles.vendorsClosedCardCopy}>
            {copy}
          </TextMedium>
          <ButtonOutlineMedium
            href={link}
            rel={newTab ? "noopener noreferrer" : undefined}
            target={newTab ? "_blank" : undefined}
          >
            {cta}
          </ButtonOutlineMedium>
        </div>
      </Reveal>
    </VendorsSection>
  );
}

function VendorsSection({ heading, body, children }) {
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
            {heading}
          </Heading3>
          <TextMedium className={styles.vendorsBody}>{body}</TextMedium>
        </div>

        <div className={styles.vendorsCardGroup}>{children}</div>
      </div>
    </Section>
  );
}
