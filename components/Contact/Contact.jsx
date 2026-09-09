import { Section } from "@/components/Section/Section";
import { RevealGroup, RevealItem } from "@/components/ui";
import { Heading3 } from "@/components/Heading/Heading";
import { TextMedium, TextSmall } from "@/components/Text/Text";
import { SOCIALS } from "@/lib/data";
import ContactForm from "./ContactForm";
import { CONTACT_EMAIL, LINK_CARDS } from "./data";
import styles from "./Contact.module.css";

export default function Contact() {
  return (
    <Section as="footer" id="a-contact" className={styles.contactContact}>
      <div className={styles.contactContent}>
        <div className={styles.contactHeader}>
          <Heading3 as="h2" className={styles.contactTitle}>
            Let&apos;s make it Happen
          </Heading3>
          <TextMedium className={styles.contactIntro}>
            Got a festival to run? A retail precinct to fill? An artist{" "}
            <br className="desktop-only" />
            who needs looking after? Tell us what you need.
          </TextMedium>
        </div>

        <div className={styles.contactBody}>
          <div className={styles.contactColumn}>
            <div className={styles.contactCard}>
              <span className={styles.contactCardLabel}>General enquiries</span>
              <a className={styles.contactEmail} href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
              <div className={styles.contactSocials}>
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
                      className={styles.contactSocialIcon}
                    />
                  </a>
                ))}
              </div>
            </div>

            <ContactForm />
          </div>

          <RevealGroup className={styles.contactColumn} once={true}>
            {LINK_CARDS.map((card) => (
              <RevealItem
                key={card.title}
                as="article"
                className={styles.contactLinkCard}
              >
                <h3 className={styles.contactLinkTitle}>{card.title}</h3>
                <TextSmall className={styles.contactLinkBody}>
                  {card.description}
                </TextSmall>
                <a
                  className={styles.contactLinkCta}
                  href={card.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className={styles.contactLinkCtaText}>{card.label}</span>
                </a>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </Section>
  );
}
