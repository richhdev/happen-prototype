import { Section } from "@/components/Section/Section";
import { RevealGroup, RevealItem } from "@/components/ui";
import { SOCIALS } from "@/lib/data";
import { IG_PROFILE, IG_TILES } from "./data";
import styles from "./Instagram.module.css";
import { Heading3 } from "../Heading/Heading";

export default function Instagram() {
  return (
    <Section id="a-instagram" className={styles.instagramSection}>
      <div className={styles.instagramContent}>
        <Heading3 style={{ color: "var(--color-white)" }}>Instagram</Heading3>
        <RevealGroup className={styles.instagramGrid} once={true}>
          {IG_TILES.map((src) => (
            <RevealItem
              key={src}
              as="a"
              className={styles.instagramTile}
              href={IG_PROFILE}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Happen Group Instagram post"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className={styles.instagramTileImage} />
            </RevealItem>
          ))}
        </RevealGroup>

        <div className={styles.instagramSocial}>
          <span className={styles.instagramFollowLabel}>Follow us</span>
          <div className={styles.instagramSocialLinks}>
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                className={styles.instagramSocialLink}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={social.icon}
                  alt=""
                  className={styles.instagramSocialIcon}
                />
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
