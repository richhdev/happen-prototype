"use client";
import { useRef } from "react";
import { motion } from "motion/react";
import { Section } from "@/components/Section/Section";
import { Heading1 } from "@/components/Heading/Heading";
import { TextXXLarge } from "@/components/Text/Text";
import { ButtonLarge, ButtonOutlineLarge } from "@/components/Button/Button";
import { TrustedBy } from "@/components/TrustedBy/TrustedBy";
import { RollingLogo } from "./RollingLogo";
import styles from "./Hero.module.css";

export default function Hero() {
  const headerRef = useRef(null);

  return (
    <header id="a-hero" ref={headerRef} className={styles.hero}>
      <Section innerClassName={styles.sectionInner}>
        <div className={styles.headlineGroup}>
          <div className={styles.logoWrap}>
            <RollingLogo trackRef={headerRef} />
          </div>
          <Heading1
            as={motion.h1}
            initial={{ letterSpacing: "0em" }}
            whileInView={{ letterSpacing: "-0.035em" }}
            viewport={{ once: false, amount: 0.9 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <span>Behind every</span>
            <span>event, is a team</span>
            <span>making it Happen</span>
          </Heading1>
        </div>

        <div className={styles.copyGroup}>
          <TextXXLarge className={styles.copy}>
            We&apos;re a Melbourne-based events agency built on over 10 years of
            rolling up our sleeves and doing the work. We move fast, think
            creatively and deliver with precision.
          </TextXXLarge>
          <div className={styles.buttonGroup}>
            <ButtonLarge href="#a-contact">Let&apos;s talk</ButtonLarge>
            <ButtonOutlineLarge href="#b-work">See our work</ButtonOutlineLarge>
          </div>
        </div>

        <TrustedBy className={styles.trusted} />
      </Section>
    </header>
  );
}
