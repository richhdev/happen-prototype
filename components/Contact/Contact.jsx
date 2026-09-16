import { Section } from "@/components/Section/Section";
import { Heading3 } from "@/components/Heading/Heading";
import { TextMedium } from "@/components/Text/Text";
import { SOCIALS } from "@/lib/data";
import ContactForm from "./ContactForm";
import { CONTACT_EMAILS } from "./data";
import styles from "./Contact.module.css";

export default function Contact() {
  return (
    <Section as="footer" id="a-contact" className={styles.contactSection}>
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
          <div className={styles.contactCard}>
            <span className={styles.contactCardLabel}>General enquiries</span>
            {CONTACT_EMAILS.map((email) => (
              <a
                key={email}
                className={styles.contactEmail}
                href={`mailto:${email}`}
              >
                {email}
              </a>
            ))}
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
      </div>
    </Section>
  );
}
