// @ts-nocheck
// Last changed 2026-09-10 · hand-written, re-paste into Framer after any edit.
// Plain JavaScript in a .tsx file, because Framer's code editor only makes
// .tsx. Nothing here is typed, and the imports resolve inside Framer rather
// than in this repo, so the checker has nothing useful to say about it.
//
// Ported from components/Vendors/ — Vendors.jsx and data.js, combined. Paste
// into Framer as a code file named Vendors.tsx.
//
// Only Vendors is exported. VendorCard and VENDOR_EVENTS are internals: a card
// on its own is meaningless, so it stays off the Insert panel.

import { injectHappenCSS } from "./GlobalStylesheet.tsx"
import {
  asset,
  Reveal,
  Section,
  Heading3,
  TextMedium,
  ButtonOutlineMedium,
} from "./Primitives.tsx"

injectHappenCSS()

// The two festivals currently taking retail-vendor applications. Both links go
// to JotForm, which is where applications are collected.
const VENDOR_EVENTS = [
  {
    name: "Good Things Festival",
    img: asset("/assets/vendor-good-things.webp"),
    logo: asset("/assets/client-good-things.svg"),
    cta: "Get your stall",
    link: "https://form.jotform.com/261311126413846",
  },
  {
    name: "Beyond The Valley",
    img: asset("/assets/vendor-beyond-the-valley.webp"),
    logo: asset("/assets/client-beyond-the-valley.svg"),
    cta: "Get your stall",
    link: "https://form.jotform.com/261448233625861",
  },
]

/**
 * Width fills whatever it is dropped into; height is measured from the rendered
 * content, so the stylesheet decides it rather than a number typed in Framer.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function Vendors() {
  return (
    <Section id="a-vendors" className="vendorsSection">
      {/* Full-bleed backdrop behind the whole band. An <img> rather than a
          background-image so it can be fetched early: it is the largest thing
          in the section and above the fold on a tall viewport.
          fetchpriority is lowercase on purpose — React only knows the camelCase
          spelling from 19 on, and on 18 it would warn and lowercase it anyway. */}
      <img
        src={asset("/assets/vendor-bg.webp")}
        alt=""
        className="vendorsSurface"
        fetchpriority="high"
        decoding="async"
      />

      <div className="vendorsContentGroup">
        <div className="vendorsCopy">
          <Heading3 as="h2" className="vendorsHeading" animateTracking={false}>
            Festival retail vendors
          </Heading3>
          <TextMedium className="vendorsBody">
            We&rsquo;re on the lookout for market stall holders to join us at
            the festival and help bring the space to life.
          </TextMedium>
        </div>

        {/* Scrolls sideways under 1024px, then becomes a two-up row. Each card
            fades in 130ms after the one before it. */}
        <div className="vendorsCardGroup">
          {VENDOR_EVENTS.map((event, i) => (
            <Reveal
              key={i}
              className="vendorsCardWrap"
              once={true}
              amount={0}
              delay={i * 130}
            >
              <VendorCard event={event} />
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  )
}

function VendorCard({ event }) {
  return (
    <div className="vendorsCard">
      <img src={event.img} alt="" className="vendorsCardImage" />

      <div className="vendorsCardBody">
        <img src={event.logo} alt={event.name} className="vendorsLogo" />

        <ButtonOutlineMedium
          href={event.link}
          rel="noopener noreferrer"
          target="_blank"
        >
          {event.cta}
        </ButtonOutlineMedium>
      </div>
    </div>
  )
}
