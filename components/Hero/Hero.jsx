"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { asset } from "@/lib/data";
import { Section } from "@/components/Section/Section";
import { Heading1 } from "@/components/Heading/Heading";
import { TextXXLarge } from "@/components/Text/Text";
import { ButtonLarge, ButtonOutlineLarge } from "@/components/Button/Button";
import { TrustedBy } from "@/components/TrustedBy/TrustedBy";
import styles from "./Hero.module.css";

const LOGO_H_MOBILE = 160;
const LOGO_H_DESKTOP = 250;

// Tracks viewport width so layout math (logo size, roll distance) can react to it.
function useWindowWidth(initial) {
  const [winW, setWinW] = useState(initial);
  useEffect(() => {
    const update = () => setWinW(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return winW;
}

// Logo rolls off to the right as the hero scrolls away; rotation follows distance
// travelled, scaled to the circumference of the logo at its current display size.
function useLogoRoll(headerRef, winW) {
  const LOGO_H = winW >= 768 ? LOGO_H_DESKTOP : LOGO_H_MOBILE;
  const CIRCUMFERENCE = Math.PI * LOGO_H;

  const { scrollYProgress } = useScroll({
    target: headerRef,
    offset: ["start start", "end start"],
  });
  const rawX = useTransform(scrollYProgress, [0, 1], [0, winW + 400]);
  const x = useSpring(rawX, { stiffness: 55, damping: 18, mass: 1 });
  const rotate = useTransform(x, (v) => (v / CIRCUMFERENCE) * 360);

  return { LOGO_H, x, rotate };
}

export default function Hero() {
  const headerRef = useRef(null);

  const winW = useWindowWidth(1440);
  const { LOGO_H, x, rotate } = useLogoRoll(headerRef, winW);

  return (
    <header id="a-hero" ref={headerRef} className={styles.hero}>
      <Section innerClassName={styles.sectionInner}>
        <div className={styles.headlineGroup}>
          <div className={styles.logoWrap}>
            <motion.img
              src={asset("/assets/logo.svg")}
              alt="Happen logo"
              className={styles.logo}
              style={{ height: LOGO_H, x, rotate }}
            />
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
