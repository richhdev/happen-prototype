// @ts-nocheck
// Last changed 2026-09-13 · hand-written, re-paste into Framer after any edit.
// Plain JavaScript in a .tsx file, because Framer's code editor only makes
// .tsx. Nothing here is typed, and the imports resolve inside Framer rather
// than in this repo, so the checker has nothing useful to say about it.
//
// Ported from components/Instagram/ — Instagram.jsx and data.js, combined.
// Paste into Framer as a code file named Instagram.tsx.
//
// Only Instagram is exported here. The tile is its own file, InstagramCard.tsx,
// with its image and link on property controls; this file is the section
// around six of them. Paste InstagramCard.tsx before this, or Instagram does
// not appear in the Insert panel.
//
// A short port, and the last easy one. No pin, no portal, no scroll maths — a
// radial vignette behind a heading, a 3x3-column grid of six square tiles and a
// row of social links. The only moving parts are RevealGroup and RevealItem.
//
// Worth knowing before it looks broken: the grid is capped at 894px by
// .instagramContent rather than by the Section inner, and under 768px three of
// the four social links are hidden by CSS, so mobile shows Instagram alone.
// Both are the design, not a fallback.

import { injectHappenCSS } from "./GlobalStylesheet.tsx";
import {
  asset,
  Section,
  RevealGroup,
  RevealItem,
  Heading3,
  SOCIALS,
} from "./Primitives.tsx";
import InstagramCard from "./InstagramCard.tsx";

injectHappenCSS();

// The tiles are stills lifted from the feed, not live embeds, so each post's
// URL is kept by hand next to its image. Several are collaborator posts, which
// is why the handles differ.
const IG_TILES = [
  {
    src: asset("/assets/insta-sc-splash.webp"),
    href: "https://www.instagram.com/soundcollectivefest/reel/DdH2LYizVCg/",
  },
  {
    src: asset("/assets/insta-sc-lineup.webp"),
    href: "https://www.instagram.com/destroyalllines/p/DdFZlpTTtvb/",
  },
  {
    src: asset("/assets/insta-vanna-howler.webp"),
    href: "https://www.instagram.com/untitledgroupau/p/DdDzH7PsVeE/",
  },
  {
    src: asset("/assets/insta-sc-crowd.webp"),
    href: "https://www.instagram.com/soundcollectivefest/reel/DdBTLy4TLfo/",
  },
  {
    src: asset("/assets/insta-party-girl.webp"),
    href: "https://www.instagram.com/lucy_and_nikki_/reel/DdBB3sdSNxx/",
  },
  {
    src: asset("/assets/insta-chapter-nye.webp"),
    href: "https://www.instagram.com/chapternye/p/DdNi8nPEuDA/",
  },
];

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
          {IG_TILES.map(({ src, href }) => (
            // No style prop, so the card falls through to the stylesheet and
            // fills its grid column. Framer's sizing only applies to a card
            // placed on a canvas.
            <RevealItem key={src}>
              <InstagramCard image={src} link={href} />
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
                <img src={social.icon} alt="" className="instagramSocialIcon" />
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
