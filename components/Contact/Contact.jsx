import { Section } from "@/components/Section/Section";
import { Heading3 } from "@/components/Heading/Heading";
import { TextMedium, TextSmall } from "@/components/Text/Text";
import { SOCIALS } from "@/lib/data";
import ContactForm from "./ContactForm";
import { CONTACT_EMAIL, LINK_CARDS } from "./data";
import styles from "./Contact.module.css";

export default function Contact() {
  return (
    <Section id="a-contact" className={styles.contact}>
      <div className={styles.content}>
        <div className={styles.header}>
          <Heading3 as="h2" className={styles.title}>
            Let&apos;s make it Happen
          </Heading3>
          <TextMedium className={styles.intro}>
            Got a festival to run? A retail precinct to fill? An artist{" "}
            <br className="desktop-only" />
            who needs looking after? Tell us what you need.
          </TextMedium>
        </div>

        <div className={styles.body}>
          <div className={styles.column}>
            <div className={styles.card}>
              <span className={styles.cardLabel}>General enquiries</span>
              <a className={styles.email} href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
              <div className={styles.socials}>
                {SOCIALS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={social.icon}
                      alt=""
                      className={styles.socialIcon}
                    />
                  </a>
                ))}
              </div>
            </div>

            <ContactForm />
          </div>

          <div className={styles.column}>
            {LINK_CARDS.map((card) => (
              <article key={card.title} className={styles.linkCard}>
                <h3 className={styles.linkTitle}>{card.title}</h3>
                <TextSmall className={styles.linkBody}>
                  {card.description}
                </TextSmall>
                <a
                  className={styles.linkCta}
                  href={card.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className={styles.linkCtaText}>{card.label}</span>
                  <span aria-hidden="true"> ↗</span>
                </a>
              </article>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
