// @ts-nocheck
// Last changed 2026-09-10 · hand-written, re-paste into Framer after any edit.
// Plain JavaScript in a .tsx file, because Framer's code editor only makes
// .tsx. Nothing here is typed, and the imports resolve inside Framer rather
// than in this repo, so the checker has nothing useful to say about it.
//
// Ported from components/Hero/ — Hero.jsx, RollingLogo.jsx and TrustedBy.jsx,
// combined. Paste into Framer as a code file named Hero.tsx.
//
// Only Hero is exported. RollingLogo and TrustedBy are internals: they are
// meaningless outside this section, so they stay off the Insert panel.

import { useRef } from "react"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { injectHappenCSS } from "./GlobalStylesheet.tsx"
import {
    asset,
    Section,
    Heading1,
    TextXXLarge,
    ButtonLarge,
    ButtonOutlineLarge,
} from "./Primitives.tsx"

injectHappenCSS()

/**
 * Width fills whatever it is dropped into; height is measured from the rendered
 * content, so the stylesheet decides it rather than a number typed in Framer.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function Hero() {
    const headerRef = useRef(null)

    return (
        <Section
            as="header"
            id="a-hero"
            ref={headerRef}
            className="heroSection"
            innerClassName="heroSectionInner"
        >
            <div className="heroHeadlineGroup">
                <div className="heroLogoWrap">
                    <RollingLogo trackRef={headerRef} />
                </div>
                <div>
                    <Heading1 className="heroHeading">
                        <span>Behind every</span>
                        <span>event, is a team</span>
                        <span>making it Happen</span>
                    </Heading1>
                </div>
            </div>

            <div className="heroCopyGroup">
                <TextXXLarge className="heroCopy">
                    We&apos;re a Melbourne-based events agency built on over 10
                    years of rolling up our sleeves and doing the work. We move
                    fast, think creatively and deliver with precision.
                </TextXXLarge>
                <div className="heroButtonGroup">
                    <ButtonLarge href="#a-contact">Let&apos;s talk</ButtonLarge>
                    <ButtonOutlineLarge href="#b-work">
                        See our work
                    </ButtonOutlineLarge>
                </div>
            </div>

            <TrustedBy className="heroTrusted" />
        </Section>
    )
}

/* Rolling logo -------------------------------------------------------------
   The mark travels sideways as the hero scrolls past and rotates by exactly
   the distance it covers, so it reads as rolling rather than spinning. */

function useRoll(trackRef, logoRef) {
    const { scrollYProgress } = useScroll({
        target: trackRef,
        offset: ["start start", "end start"],
        layoutEffect: false,
    })
    const rawX = useTransform(
        scrollYProgress,
        (p) => p * (trackRef.current?.offsetWidth ?? 0)
    )
    const x = useSpring(rawX, { stiffness: 55, damping: 18, mass: 1 })
    const rotate = useTransform(
        x,
        // Guarded with 1, not 0: before mount the ref is null and this divides.
        (v) => (v / (Math.PI * (logoRef.current?.offsetWidth || 1))) * 360
    )

    return { x, rotate }
}

function RollingLogo({ trackRef }) {
    const logoRef = useRef(null)
    const { x, rotate } = useRoll(trackRef, logoRef)

    return (
        <motion.img
            ref={logoRef}
            src={asset("/assets/logo.svg")}
            alt="Happen logo"
            className="rollingLogo"
            style={{ x, rotate }}
        />
    )
}

/* Trusted by ---------------------------------------------------------------
   A marquee of client marks. The list is duplicated end to end so the CSS
   animation can translate by exactly -50% and loop seamlessly. Each mark
   carries its own height, since the logos have wildly different proportions
   and matching by width alone makes the wide ones dominate the row. */

const CLIENTS = [
    {
        name: "Beyond The Valley",
        src: asset("/assets/client-beyond-the-valley.svg"),
        h: 26,
    },
    {
        name: "Live Nation",
        src: asset("/assets/client-live-nation.webp"),
        h: 35,
    },
    { name: "Novel", src: asset("/assets/client-novel.webp"), h: 22 },
    { name: "Happy Hour", src: asset("/assets/client-happy-hour.webp"), h: 37 },
    { name: "Dangerous Goods", src: asset("/assets/client-dg.webp"), h: 24 },
    { name: "A3", src: asset("/assets/client-a3.webp"), h: 32 },
    {
        name: "Astral People",
        src: asset("/assets/client-astral-people.svg"),
        h: 40,
    },
    {
        name: "Strawberry Fields",
        src: asset("/assets/client-strawberry-fields.webp"),
        h: 40,
    },
    { name: "Pitch", src: asset("/assets/client-pitch.webp"), h: 31 },
    {
        name: "Destroy All Lines",
        src: asset("/assets/client-destroy-all-lines.svg"),
        h: 26,
    },
    { name: "S.A.S.H", src: asset("/assets/client-sash.svg"), h: 28 },
    {
        name: "Strummingbird",
        src: asset("/assets/client-strummingbird.svg"),
        h: 26,
    },
    {
        name: "Our City Our Sound",
        src: asset("/assets/client-our-city-our-sound.svg"),
        h: 36,
    },
    { name: "Chapter", src: asset("/assets/client-chapter.webp"), h: 30 },
    { name: "Afrosoul", src: asset("/assets/client-afrosoul.svg"), h: 30 },
]

function TrustedBy({ className, ...rest }) {
    const loop = CLIENTS.concat(CLIENTS)

    return (
        <div className={`trustedByMask ${className ?? ""}`} {...rest}>
            <div className="trustedByTrack">
                {loop.map((c, i) => (
                    <div className="trustedByItem" key={i} title={c.name}>
                        <img
                            src={c.src}
                            alt={c.name}
                            style={{ height: c.h }}
                            className="trustedByLogo"
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}
