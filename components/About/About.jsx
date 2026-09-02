import { Section } from "@/components/Section/Section";
import { Heading2, Heading4 } from "@/components/Heading/Heading";
import { TextXXLarge } from "@/components/Text/Text";
import { StatCounter } from "./StatCounter";
import styles from "./About.module.css";

export default function About() {
  return (
    <Section id="a-about">
      <div className={styles.panel}>
        <Heading2 className={styles.title}>Who we are</Heading2>

        <div className={styles.copy}>
          <TextXXLarge>
            A dream team of doers and difference-makers. Sharp, reliable and
            here to get it done. Each of us brings something different to the
            table: creative brains, logistical minds, artist wranglers and
            on-ground weapons.
          </TextXXLarge>
          <TextXXLarge>
            {/* Desktop sets these as two lines; mobile lets them run on. */}
            We work with grit, good humour and zero ego.{" "}
            <br className="desktop-only" />
            We&apos;re just here to make it Happen.
          </TextXXLarge>
        </div>

        <div className={styles.stat}>
          <StatCounter value={10} suffix="+" className={styles.statNumber} />
          <Heading4 as="p" className={styles.statLabel}>
            Years doing the work
          </Heading4>
        </div>
      </div>
    </Section>
  );
}
