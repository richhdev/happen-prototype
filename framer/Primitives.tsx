// @ts-nocheck
// Last changed 2026-09-10 · hand-written, re-paste into Framer after any edit.
// Plain JavaScript in a .tsx file, because Framer's code editor only makes
// .tsx. Nothing here is typed, and the imports resolve inside Framer rather
// than in this repo, so the checker has nothing useful to say about it.
// Ported from components/Text/Text.jsx and components/Heading/Heading.jsx.
// Paste into Framer as a code file named Primitives.tsx.
//
// Shared by every section, so it cannot live inside any one of them. Nothing
// here is exported as a Framer component on purpose: these are text styles, not
// things anyone should drag onto a canvas.

import { forwardRef, useEffect, useLayoutEffect } from "react"
import { motion } from "framer-motion"

// Where every image is fetched from. All 93 assets go through asset(), so this
// one line is the whole asset story — the Framer equivalent of
// NEXT_PUBLIC_BASE_PATH in lib/data.js. No trailing slash.
//
// The prototype's own Vercel deployment serves public/ at the site root, so it
// is already an asset host and always matches whatever is deployed. Cache
// headers for /assets are set in next.config.mjs.
export const ASSET_BASE = "https://happen-prototype.vercel.app"

export const asset = (p) => `${ASSET_BASE}${p}`

// Shared cubic-bezier easing used across every animation.
export const EASE = [0.16, 1, 0.3, 1]

/* Reveal -------------------------------------------------------------------
   Ported from components/ui.jsx. The fade-and-rise that brings almost every
   section in as it scrolls into view. Eight sections use these, so they live
   here rather than inside whichever one happened to be ported first.

   `as` picks which element motion renders, so a Reveal can be the <li> or the
   <a> itself instead of adding a wrapper around it. Everything else is passed
   straight through, which is how callers set className. */

// useLayoutEffect on the client, useEffect on the server, so server rendering
// does not warn. Framer renders code components on the server too.
export const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect

export function Reveal({
  children,
  delay = 0,
  y = 32,
  once = false,
  amount = 0.12,
  style,
  as = "div",
  ...rest
}) {
  const M = motion[as] || motion.div

  return (
    <M
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount, margin: "0px 0px -60px 0px" }}
      transition={{ duration: 0.64, ease: EASE, delay: delay / 1000 }}
      style={style}
      {...rest}
    >
      {children}
    </M>
  )
}

// Parent half of the staggered variant: children arrive one after another
// rather than each timing itself off its own delay.
export function RevealGroup({
  children,
  stagger = 130,
  once = false,
  amount = 0,
  as = "div",
  ...rest
}) {
  const M = motion[as] || motion.div

  return (
    <M
      initial="hidden"
      whileInView="shown"
      viewport={{ once, amount, margin: "0px 0px -60px 0px" }}
      variants={{
        hidden: {},
        shown: { transition: { staggerChildren: stagger / 1000 } },
      }}
      {...rest}
    >
      {children}
    </M>
  )
}

// Child of RevealGroup. Only meaningful inside one, since it has no whileInView
// of its own and waits for the parent's variant to reach it.
export function RevealItem({ children, y = 30, as = "div", ...rest }) {
  const M = motion[as] || motion.div

  return (
    <M
      variants={{
        hidden: { opacity: 0, y },
        shown: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.64, ease: EASE },
        },
      }}
      {...rest}
    >
      {children}
    </M>
  )
}

/* Text ---------------------------------------------------------------------
   One component per Figma text style. `as` lets the tag differ from the default
   when the surrounding markup calls for it.

   Every one takes a ref. In the Next app these were plain function components
   and LinkList handed `ref` straight to TextOverline, which only works because
   React 19 treats ref as an ordinary prop. Framer is not guaranteed to be on 19,
   and on 18 the ref is silently dropped and the nav underline never measures.
   forwardRef behaves the same on both. */

function textStyle(cls, defaultTag) {
  return forwardRef(function Text(
    { as: Tag = defaultTag, className, children, ...rest },
    ref
  ) {
    return (
      <Tag ref={ref} className={`${cls} ${className ?? ""}`} {...rest}>
        {children}
      </Tag>
    )
  })
}

export const TextXXLarge = textStyle("textXxlarge", "p")
export const TextXLarge = textStyle("textXlarge", "p")
export const TextLarge = textStyle("textLarge", "p")
export const TextMedium = textStyle("textMedium", "p")
export const TextSmall = textStyle("textSmall", "p")

// Short uppercase label, not a paragraph — defaults to a span.
export const TextOverline = textStyle("textOverline", "span")

// Text styles only, meant to sit inside an actual <button>.
export const ButtonTextLarge = textStyle("textButtonTextLarge", "span")
export const ButtonTextMedium = textStyle("textButtonTextMedium", "span")
export const BadgeText = textStyle("textBadgeText", "span")

/* Headings -----------------------------------------------------------------
   Each pairs a semantic heading tag with its text-style class. The uppercase
   levels tighten their tracking as they scroll into view: the letters open up to
   their natural spacing and settle back into the tight display setting.

   `tracking` has to match the letter-spacing the level's class rests at in the
   stylesheet, so the static and animated states agree. That CSS is also what
   pins the tracking under prefers-reduced-motion, and what a heading opted out
   with animateTracking={false} sits at. */

function TrackingHeading({
  as: Tag,
  tracking,
  animate = true,
  className,
  children,
  ...rest
}) {
  if (!animate) {
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    )
  }

  const MotionTag = typeof Tag === "string" ? motion[Tag] : Tag

  return (
    <MotionTag
      className={className}
      initial={{ letterSpacing: "0em" }}
      whileInView={{ letterSpacing: tracking }}
      viewport={{ once: false, amount: 0.9 }}
      transition={{ duration: 1.5, ease: EASE }}
      {...rest}
    >
      {children}
    </MotionTag>
  )
}

export function Heading1({
  as: Tag = "h1",
  animateTracking = false,
  className,
  children,
  ...rest
}) {
  return (
    <TrackingHeading
      as={Tag}
      tracking="-0.035em"
      animate={animateTracking}
      className={`heading1 ${className ?? ""}`}
      {...rest}
    >
      {children}
    </TrackingHeading>
  )
}

export function Heading2({
  as: Tag = "h2",
  animateTracking = false,
  className,
  children,
  ...rest
}) {
  return (
    <TrackingHeading
      as={Tag}
      tracking="-0.05em"
      animate={animateTracking}
      className={`heading2 ${className ?? ""}`}
      {...rest}
    >
      {children}
    </TrackingHeading>
  )
}

// `sentence` swaps in the heading3-sentence variant (Sentence case instead of
// UPPERCASE). Only the uppercase variant animates its tracking — the
// sentence-case one reads as body copy, so it stays put.
export function Heading3({
  as: Tag = "h3",
  sentence = false,
  animateTracking = false,
  className,
  children,
  ...rest
}) {
  return (
    <TrackingHeading
      as={Tag}
      tracking="-0.05em"
      animate={animateTracking && !sentence}
      className={`${sentence ? "heading3Sentence" : "heading3"} ${className ?? ""}`}
      {...rest}
    >
      {children}
    </TrackingHeading>
  )
}

export function Heading4({ as: Tag = "h4", className, children, ...rest }) {
  return (
    <Tag className={`heading4 ${className ?? ""}`} {...rest}>
      {children}
    </Tag>
  )
}

/* Section ------------------------------------------------------------------
   The page's one layout primitive: full-bleed outer, centred inner capped at
   the layout max width. Takes a ref, which Hero uses as the scroll track for
   its rolling logo. */

export const Section = forwardRef(function Section(
  { as: Tag = "section", className, innerClassName, children, ...rest },
  ref
) {
  return (
    <Tag ref={ref} className={`section ${className ?? ""}`} {...rest}>
      <div className={`sectionInner ${innerClassName ?? ""}`}>{children}</div>
    </Tag>
  )
})

/* Buttons ------------------------------------------------------------------
   Four variants rather than props, matching the Figma component set. Each
   renders an <a> when given an href and a <button> otherwise. */

function buttonVariant(cls) {
  return function Button({ as, type, className, children, ...rest }) {
    const Tag = as ?? (rest.href ? "a" : "button")
    return (
      <Tag
        type={type ?? (Tag === "button" ? "button" : undefined)}
        className={`button ${cls} ${className ?? ""}`}
        {...rest}
      >
        {children}
      </Tag>
    )
  }
}

export const ButtonLarge = buttonVariant("buttonLarge")
export const ButtonMedium = buttonVariant("buttonMedium")
export const ButtonOutlineLarge = buttonVariant("buttonOutline buttonLarge")
export const ButtonOutlineMedium = buttonVariant("buttonOutline buttonMedium")

// Default button for general use — outline/medium is the most common variant.
export const Button = ButtonOutlineMedium

/* Badge --------------------------------------------------------------------
   Background is a colour prop rather than a component per colour: unlike the
   buttons, the three Figma examples differ only by fill. */

const BADGE_COLORS = {
  charcoal: "var(--color-charcoal)",
  red: "var(--color-red)",
  orange: "var(--color-orange)",
}

export function Badge({
  as: Tag = "span",
  color = "charcoal",
  className,
  style,
  children,
  ...rest
}) {
  return (
    <Tag
      className={`badge ${className ?? ""}`}
      style={{ background: BADGE_COLORS[color] ?? color, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
