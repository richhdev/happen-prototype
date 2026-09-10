// @ts-nocheck
// Last changed 2026-09-10 · hand-written, re-paste into Framer after any edit.
// Plain JavaScript in a .tsx file, because Framer's code editor only makes
// .tsx. Nothing here is typed, and the imports resolve inside Framer rather
// than in this repo, so the checker has nothing useful to say about it.
//
// Ported from components/About/ — About.jsx and StatCounter.jsx, combined.
// Paste into Framer as a code file named About.tsx.
//
// Only About is exported. StatCounter is an internal: a number that counts to
// ten is not something anyone should drag onto a canvas.
//
// A translucent red panel holding a heading, two paragraphs and one animated
// number. No pin, no portal, no scroll maths — the only moving part is the
// count-up, so this is a short port. It does not use Reveal at all; the section
// arrives without a fade, which is how the Next app has it.

import { useEffect, useRef } from "react"
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion"
import { injectHappenCSS } from "./GlobalStylesheet.tsx"
import {
  EASE,
  Section,
  Heading2,
  Heading4,
  TextXXLarge,
} from "./Primitives.tsx"

injectHappenCSS()

// Counts up from 0 to `value` each time it scrolls into view, re-triggering the
// way the other reveals in the site do rather than running once.
//
// The span is a motion.span because `text` is handed to it as a live
// MotionValue: framer-motion subscribes to it and writes the digits straight
// into the DOM, so eighteen hundred milliseconds of counting cost zero React
// renders. .aboutStatNumber sets tabular-nums so the width does not jitter as
// the digits change.
function StatCounter({ value, suffix = "", duration = 1.8, className }) {
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.6, margin: "0px 0px -60px 0px" })
  const reduceMotion = useReducedMotion()

  const count = useMotionValue(reduceMotion ? value : 0)
  const text = useTransform(count, (n) => Math.round(n) + suffix)

  useEffect(() => {
    if (reduceMotion) {
      count.set(value)
      return
    }
    if (!inView) {
      count.set(0)
      return
    }
    const controls = animate(count, value, { duration, ease: EASE })
    return () => controls.stop()
  }, [inView, reduceMotion, value, duration, count])

  return (
    <motion.span ref={ref} className={className}>
      {text}
    </motion.span>
  )
}

/**
 * Width fills whatever it is dropped into; height is measured from the rendered
 * content, so the stylesheet decides it rather than a number typed in Framer.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function About() {
  return (
    <Section id="a-about">
      <div className="aboutSurface">
        <Heading2 className="aboutTitle">Who we are</Heading2>

        <div className="aboutCopy">
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
            We're just here to make it Happen.
          </TextXXLarge>
        </div>

        <div className="aboutStat">
          <StatCounter value={10} suffix="+" className="aboutStatNumber" />
          <Heading4 as="p" className="aboutStatLabel">
            Years doing the work
          </Heading4>
        </div>
      </div>
    </Section>
  )
}
