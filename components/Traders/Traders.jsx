import { Heading3, Heading4 } from "@/components/Heading/Heading";
import { TextMedium } from "@/components/Text/Text";
import { ButtonOutlineMedium } from "@/components/Button/Button";
import { asset } from "@/lib/data";
import { TRADER_CARDS } from "./data";
import styles from "./Traders.module.css";

export default function Traders() {
  return (
    <div id="a-traders" className={styles.panel}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset("/assets/vendor-bg-graphic.jpg")}
        alt=""
        className={styles.background}
      />

      <Heading3 as="h2" className={styles.title}>
        Want in?
      </Heading3>

      <div className={styles.cards}>
        {TRADER_CARDS.map((card) => (
          <article key={card.title} className={styles.card}>
            <div className={styles.content}>
              <Heading4 as="h3" className={styles.cardTitle}>
                {card.title}
              </Heading4>
              <TextMedium className={styles.cardBody}>
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
        ))}
      </div>
    </div>
  );
}
