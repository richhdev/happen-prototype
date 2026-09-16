// @ts-nocheck
// Last changed 2026-09-17 · hand-written, re-paste into Framer after any edit.
// Plain JavaScript in a .tsx file, because Framer's code editor only makes
// .tsx. Nothing here is typed, and the imports resolve inside Framer rather
// than in this repo, so the checker has nothing useful to say about it.
//
// Ported from components/Vendors/ — Vendors.jsx and data.js, combined. Paste
// into Framer as a code file named Vendors.tsx.
//
// The open state of the vendors band: one card per festival currently taking
// retail-vendor applications. VendorsClosed.tsx is the same band with the card
// row replaced by an expression-of-interest card; swap one for the other in
// the page stack as applications open and close.
//
// The cards are edited from this component's own properties panel — an Array
// control, so a festival can be added or dropped without a layer being inserted.

import { addPropertyControls, ControlType } from "framer"
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

// Written once and read twice: as `defaultValue` on the controls at the foot of
// the file, which is what fills the Framer properties panel, and as the default
// parameters in the signature, which is what the component gets when it is
// rendered from code. Not `Vendors.defaultProps` — React 19 ignores that on a
// function component and warns.
//
// The two festivals taking applications as this was written. Both links go to
// JotForm, which is where applications are collected.
const DEFAULTS = {
  heading: "Festival retail vendors",
  body: "We’re on the lookout for market stall holders to join us at the festival and help bring the space to life.",
  events: [
    {
      name: "Good Things Festival",
      logo: asset("/assets/client-good-things.svg"),
      cta: "Get your stall",
      link: "https://form.jotform.com/261311126413846",
    },
    {
      name: "Beyond The Valley",
      logo: asset("/assets/client-beyond-the-valley.svg"),
      cta: "Get your stall",
      link: "https://form.jotform.com/261448233625861",
    },
  ],
}

/**
 * Width fills whatever it is dropped into; height is measured from the rendered
 * content, so the stylesheet decides it rather than a number typed in Framer.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function Vendors({
  heading = DEFAULTS.heading,
  body = DEFAULTS.body,
  events = DEFAULTS.events,
  newTab = true,
}) {
  return (
    <Section id="a-vendors" className="vendorsSection">
      {/* Full-bleed backdrop behind the whole band. Lazy, like every image
          below the first screen, so it no longer competes with the ribbons
          sheet for the page's largest paint. */}
      <img
        src={asset("/assets/vendor-bg.webp")}
        alt=""
        className="vendorsSurface"
        loading="lazy"
        decoding="async"
      />

      <div className="vendorsContentGroup">
        <div className="vendorsCopy">
          <Heading3 as="h2" className="vendorsHeading" animateTracking={false}>
            {heading}
          </Heading3>
          <TextMedium className="vendorsBody">{body}</TextMedium>
        </div>

        {/* Scrolls sideways under 1024px, then becomes a two-up row. Each card
            fades in 130ms after the one before it. */}
        <div className="vendorsCardGroup">
          {events.map((event, i) => (
            <Reveal
              key={i}
              className="vendorsCardOuter"
              once={true}
              amount={0}
              delay={i * 130}
            >
              <div className="vendorsCard">
                <img
                  src={event.logo}
                  alt={event.name}
                  className="vendorsLogo"
                  loading="lazy"
                />

                <ButtonOutlineMedium
                  href={event.link}
                  rel={newTab ? "noopener noreferrer" : undefined}
                  target={newTab ? "_blank" : undefined}
                >
                  {event.cta}
                </ButtonOutlineMedium>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  )
}

addPropertyControls(Vendors, {
  heading: {
    type: ControlType.String,
    title: "Heading",
    defaultValue: DEFAULTS.heading,
  },
  body: {
    type: ControlType.String,
    title: "Body",
    defaultValue: DEFAULTS.body,
    displayTextArea: true,
  },
  events: {
    type: ControlType.Array,
    title: "Events",
    // Three fits the row at 1200px+; past that the cards scroll sideways on
    // desktop too, which the layout was never drawn for.
    maxCount: 3,
    defaultValue: DEFAULTS.events,
    control: {
      type: ControlType.Object,
      controls: {
        name: {
          type: ControlType.String,
          title: "Name",
          description: "Alt text for the logo. Not shown on the card.",
        },
        logo: {
          type: ControlType.Image,
          title: "Logo",
          description: "Capped at 256 × 50, and at 188 × 44 below 1200px.",
        },
        cta: { type: ControlType.String, title: "CTA" },
        link: { type: ControlType.Link, title: "Link" },
      },
    },
  },
  newTab: {
    type: ControlType.Boolean,
    title: "New tab",
    defaultValue: true,
  },
})
