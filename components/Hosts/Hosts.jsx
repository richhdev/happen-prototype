import { Reveal } from "@/components/ui";
import { Section } from "@/components/Section/Section";
import { Heading3, Heading4 } from "@/components/Heading/Heading";
import { TextMedium } from "@/components/Text/Text";
import { ButtonOutlineMedium } from "@/components/Button/Button";
import { asset } from "@/lib/data";
import { HOST_CARDS } from "./data";
import styles from "./Hosts.module.css";

export default function Hosts() {
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
            Want in?
          </Heading3>
          <TextMedium className={styles.hostsBody}>
            We&rsquo;re always looking for well-connected individuals and
            magnetic group leaders &ndash; social, influential, and the life of
            the party.
          </TextMedium>
        </div>

        <div className={styles.hostsCardGroup}>
          {HOST_CARDS.map((card, i) => (
            <Reveal
              key={card.title}
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
                  target="_blank"
                  rel="noreferrer"
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
