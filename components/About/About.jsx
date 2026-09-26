import {
  Section,
  Heading2,
  Heading4,
  TextXXLarge,
} from "@/components/Primitives";
import { StatCounter } from "./StatCounter";
import styles from "./About.module.css";

// Read as the parameter defaults here and as `defaultValue` on the Framer
// controls, the same way Hosts does it. `body` is one textarea, one line per
// paragraph, so it is written the way it reads in the panel.
const DEFAULTS = {
  heading: "Who we are",
  body: `A dream team of doers and difference-makers. Sharp, reliable and here to get it done. Each member brings something different to the table: creative brains, logistical minds, artist wranglers and on-ground weapons.

We work with grit, good humour and zero ego. We're just here to make it Happen.`,
};

/**
 * Width fills whatever it is dropped into; height is measured from the rendered
 * content, so the stylesheet decides it rather than a number typed in Framer.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function About({
  heading = DEFAULTS.heading,
  body = DEFAULTS.body,
}) {
  return (
    <Section id="a-about">
      <div className={styles.aboutSurface}>
        <Heading2 className={styles.aboutTitle}>{heading}</Heading2>

        <TextXXLarge className={styles.aboutCopy}>{body}</TextXXLarge>

        <div className={styles.aboutStat}>
          <StatCounter
            value={10}
            suffix="+"
            className={styles.aboutStatNumber}
          />
          <Heading4 as="p" className={styles.aboutStatLabel}>
            Years doing the work
          </Heading4>
        </div>
      </div>
    </Section>
  );
}
