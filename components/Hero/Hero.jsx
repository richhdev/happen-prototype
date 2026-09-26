"use client";
import { useRef } from "react";
import {
  Section,
  Heading1,
  TextXXLarge,
  ButtonLarge,
  ButtonOutlineLarge,
} from "@/components/Primitives";
import VideoBackground from "@/components/VideoBackground/VideoBackground";
import { TrustedBy } from "@/components/Hero/TrustedBy";
import { RollingLogo } from "./RollingLogo";
import styles from "./Hero.module.css";

/**
 * Width fills whatever it is dropped into; height is measured from the rendered
 * content, so the stylesheet decides it rather than a number typed in Framer.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function Hero() {
  const headerRef = useRef(null);

  return (
    <div className={styles.heroScene}>
      <VideoBackground behindNav />

      <Section
        as="header"
        id="a-hero"
        ref={headerRef}
        className={styles.heroSection}
        innerClassName={styles.heroSectionInner}
      >
        <div className={styles.heroHeadlineGroup}>
          <div className={styles.heroLogoWrap}>
            <RollingLogo trackRef={headerRef} />
          </div>
          <div>
            <Heading1 className={styles.heroHeading}>
              <span>Behind every</span>
              <span>event, is a team</span>
              <span>making it Happen</span>
            </Heading1>
          </div>
        </div>

        <div className={styles.heroCopyGroup}>
          <TextXXLarge className={styles.heroCopy}>
            We&apos;re a Melbourne-based events agency built on over 10 years of
            rolling up our sleeves and doing the work. We move fast, think
            creatively and deliver with precision.
          </TextXXLarge>
          <div className={styles.heroButtonGroup}>
            <ButtonLarge href="#a-contact">Let&apos;s talk</ButtonLarge>
            <ButtonOutlineLarge href="#b-work">See our work</ButtonOutlineLarge>
          </div>
        </div>

        <TrustedBy className={styles.heroTrusted} />
      </Section>
    </div>
  );
}
