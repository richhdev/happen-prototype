import { Section } from "@/components/Section/Section";
import { SOCIALS } from "@/lib/data";
import { IG_PROFILE, IG_TILES } from "./data";
import styles from "./Instagram.module.css";

export default function Instagram() {
  return (
    <Section id="a-instagram" className={styles.instagram}>
      <div className={styles.content}>
        <div className={styles.grid}>
          {IG_TILES.map((src) => (
            <a
              key={src}
              className={styles.tile}
              href={IG_PROFILE}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Happen Group Instagram post"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className={styles.tileImage} />
            </a>
          ))}
        </div>

        <div className={styles.social}>
          <span className={styles.followLabel}>Follow us</span>
          <div className={styles.socialLinks}>
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                className={styles.socialLink}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={social.icon} alt="" className={styles.socialIcon} />
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
