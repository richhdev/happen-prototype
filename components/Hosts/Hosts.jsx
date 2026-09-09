import { Reveal } from "@/components/ui";
import { Heading3, Heading4 } from "@/components/Heading/Heading";
import { TextMedium } from "@/components/Text/Text";
import { ButtonOutlineMedium } from "@/components/Button/Button";
import { asset } from "@/lib/data";
import { HOST_CARDS } from "./data";
import styles from "./Hosts.module.css";

export default function Hosts() {
  return (
    <div id="a-hosts" className={styles.hostsSection}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset("/assets/bg-graphic.webp")}
        alt=""
        className={styles.hostsSurface}
      />

      <Heading3 as="h2" className={styles.hostsTitle}>
        Want in?
      </Heading3>

      <div className={styles.hostsCards}>
        {HOST_CARDS.map((card, i) => (
          <Reveal
            key={card.title}
            className={styles.hostsCardWrap}
            once={false}
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
  );
}
