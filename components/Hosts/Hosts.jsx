import {
  asset,
  Section,
  Heading3,
  Heading4,
  TextMedium,
  ButtonOutlineMedium,
  Reveal,
} from "@/components/Primitives";
import { DEFAULTS } from "./data";
import styles from "./Hosts.module.css";

/**
 * Width fills whatever it is dropped into; height is measured from the rendered
 * content, so the stylesheet decides it rather than a number typed in Framer.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function Hosts(props) {
  const {
    heading = DEFAULTS.heading,
    body = DEFAULTS.body,
    newTab = true,
  } = props;
  const cards = [1, 2]
    .map((n) => ({
      title: props[`card${n}Title`] ?? DEFAULTS[`card${n}Title`],
      description:
        props[`card${n}Description`] ?? DEFAULTS[`card${n}Description`],
      label: props[`card${n}Cta`] ?? DEFAULTS[`card${n}Cta`],
      href: props[`card${n}Link`] ?? DEFAULTS[`card${n}Link`],
    }))
    .filter((card) => card.title);

  return (
    <Section id="a-hosts" className={styles.hostsSection}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset("/assets/hosts-bg.webp")}
        alt=""
        className={styles.hostsSurface}
        loading="lazy"
        decoding="async"
      />

      <div className={styles.hostsContentGroup}>
        <div className={styles.hostsCopy}>
          <Heading3 as="h2" className={styles.hostsHeading}>
            {heading}
          </Heading3>
          <TextMedium className={styles.hostsBody}>{body}</TextMedium>
        </div>

        <div className={styles.hostsCardGroup}>
          {cards.map((card, i) => (
            <Reveal
              key={i}
              className={styles.hostsCardWrap}
              once={true}
              amount={0}
              delay={i * 130}
            >
              <article className={styles.hostsCard}>
                <div className={styles.hostsContent}>
                  <Heading4 as="h3" className={styles.hostsCardTitle}>
                    {card.title}
                  </Heading4>
                  <TextMedium className={styles.hostsCardBody}>
                    {card.description}
                  </TextMedium>
                </div>
                <ButtonOutlineMedium
                  href={card.href}
                  rel={newTab ? "noopener noreferrer" : undefined}
                  target={newTab ? "_blank" : undefined}
                >
                  {card.label}
                </ButtonOutlineMedium>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
