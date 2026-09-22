import { Section } from "@/components/Section/Section";
import { SOCIALS } from "@/lib/data";
import { EmbedSocialFeed } from "./EmbedSocialFeed";
import styles from "./Instagram.module.css";
import { Heading3 } from "../Heading/Heading";

const EMBED_REF = "e509db0b81e805a0eb40ae1c420701e728ec2ee0";

export default function Instagram() {
  return (
    <Section id="a-instagram" className={styles.instagramSection}>
      <div className={styles.instagramContent}>
        <Heading3 style={{ color: "var(--color-white)" }}>Instagram</Heading3>

        <EmbedSocialFeed embedRef={EMBED_REF} />

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
