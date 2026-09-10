// @ts-nocheck
// Last changed 2026-09-10 · hand-written, re-paste into Framer after any edit.
// Plain JavaScript in a .tsx file, because Framer's code editor only makes
// .tsx. Nothing here is typed, and the imports resolve inside Framer rather
// than in this repo, so the checker has nothing useful to say about it.
//
// Ported from components/Instagram/ — Instagram.jsx and data.js, combined.
// Paste into Framer as a code file named Instagram.tsx.
//
// Only Instagram is exported. IG_PROFILE and IG_TILES are internals: six
// hard-coded image URLs are not something anyone should drag onto a canvas.
//
// A short port, and the last easy one. No pin, no portal, no scroll maths — a
// radial vignette behind a heading, a 3x3-column grid of six square tiles and a
// row of social links. The only moving parts are RevealGroup and RevealItem.
//
// Worth knowing before it looks broken: the grid is capped at 894px by
// .instagramContent rather than by the Section inner, and under 768px three of
// the four social links are hidden by CSS, so mobile shows Instagram alone.
// Both are the design, not a fallback.

import { injectHappenCSS } from "./GlobalStylesheet.tsx"
import {
  asset,
  Section,
  RevealGroup,
  RevealItem,
  Heading3,
  SOCIALS,
} from "./Primitives.tsx"

injectHappenCSS()

// Every tile links to the profile rather than to its own post: these are
// stills lifted from the feed, not live embeds, so there is no per-post URL
// to send anyone to.
const IG_PROFILE = "https://www.instagram.com/happengroupau/"

const IG_TILES = [
  asset("/assets/insta-1.webp"),
  asset("/assets/insta-2.webp"),
  asset("/assets/insta-3.webp"),
  asset("/assets/insta-4.webp"),
  asset("/assets/insta-5.webp"),
  asset("/assets/insta-6.webp"),
]

/**
 * Width fills whatever it is dropped into; height is measured from the rendered
 * content, so the stylesheet decides it rather than a number typed in Framer.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function Instagram() {
  return (
    <Section id="a-instagram" className="instagramSection">
      <div className="instagramContent">
        <Heading3 style={{ color: "var(--color-white)" }}>Instagram</Heading3>

        {/* The group staggers its six tiles by 130ms and runs once. */}
        <RevealGroup className="instagramGrid" once={true}>
          {IG_TILES.map((src) => (
            <RevealItem
              key={src}
              as="a"
              className="instagramTile"
              href={IG_PROFILE}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Happen Group Instagram post"
            >
              {/* alt is empty on purpose: the link already carries the label,
                  so naming the image again would read it out twice. */}
              <img src={src} alt="" className="instagramTileImage" />
            </RevealItem>
          ))}
        </RevealGroup>

        <div className="instagramSocial">
          {/* A span with its weight set in CSS rather than a TextMedium — see
              the note on .instagramFollowLabel in happen.css. */}
          <span className="instagramFollowLabel">Follow us</span>
          <div className="instagramSocialLinks">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                className="instagramSocialLink"
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={social.icon}
                  alt=""
                  className="instagramSocialIcon"
                />
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}
