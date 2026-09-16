// @ts-nocheck
// Last changed 2026-09-17 · hand-written, re-paste into Framer after any edit.
// Plain JavaScript in a .tsx file, because Framer's code editor only makes
// .tsx. Nothing here is typed, and the imports resolve inside Framer rather
// than in this repo, so the checker has nothing useful to say about it.
//
// Ported from components/Vendors/ — VendorsClosed in Vendors.jsx and data.js,
// combined. Paste into Framer as a code file named VendorsClosed.tsx.
//
// The vendors band between intakes: the same shell as Vendors.tsx — same
// section id, same backdrop, same copy column — with the row of event cards
// replaced by one card pointing at an expression-of-interest form. Both
// components exist in the Insert panel at once; swap one for the other in the
// page stack as applications open and close. Nothing else on the page moves,
// because the card takes the footprint the card row takes.
//
// Every string and the CTA link are on property controls, so the whole state
// can be rewritten from the properties panel without touching this file.
//
// Paste order: Primitives.tsx and GlobalStylesheet.tsx first, then this.

import { addPropertyControls, ControlType } from "framer";
import { injectHappenCSS } from "./GlobalStylesheet.tsx";
import {
  asset,
  Reveal,
  Section,
  Heading3,
  TextMedium,
  ButtonOutlineMedium,
} from "./Primitives.tsx";

injectHappenCSS();

// Written once and read twice: as `defaultValue` on the controls at the foot of
// the file, which is what fills the Framer properties panel, and as the default
// parameters in the signature, which is what the component gets when it is
// rendered from code. Not `VendorsClosed.defaultProps` — React 19 ignores that
// on a function component and warns.
const DEFAULTS = {
  heading: "Festival retail vendors",
  body: "We’re on the lookout for market stall holders to join us at the festival and help bring the space to life.",
  copy: "Register your interest and we’ll be in touch.",
  cta: "Register",
  link: "#",
};

/**
 * Width fills whatever it is dropped into; height is measured from the rendered
 * content, so the stylesheet decides it rather than a number typed in Framer.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function VendorsClosed({
  heading = DEFAULTS.heading,
  body = DEFAULTS.body,
  copy = DEFAULTS.copy,
  cta = DEFAULTS.cta,
  link = DEFAULTS.link,
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

        <div className="vendorsCardGroup">
          <Reveal className="vendorsClosedCardOuter" once={true} amount={0}>
            <div className="vendorsClosedCard">
              <TextMedium className="vendorsClosedCardCopy">{copy}</TextMedium>

              <ButtonOutlineMedium
                href={link}
                rel={newTab ? "noopener noreferrer" : undefined}
                target={newTab ? "_blank" : undefined}
              >
                {cta}
              </ButtonOutlineMedium>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

addPropertyControls(VendorsClosed, {
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
  copy: {
    type: ControlType.String,
    title: "Card copy",
    defaultValue: DEFAULTS.copy,
    displayTextArea: true,
    description: "The message in place of the event cards.",
  },
  cta: {
    type: ControlType.String,
    title: "CTA",
    defaultValue: DEFAULTS.cta,
  },
  link: {
    type: ControlType.Link,
    title: "Link",
    defaultValue: DEFAULTS.link,
    description: "The expression-of-interest form.",
  },
  newTab: {
    type: ControlType.Boolean,
    title: "New tab",
    defaultValue: true,
  },
});
