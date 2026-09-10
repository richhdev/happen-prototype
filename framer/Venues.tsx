// @ts-nocheck
// Last changed 2026-09-10 · hand-written, re-paste into Framer after any edit.
// Plain JavaScript in a .tsx file, because Framer's code editor only makes
// .tsx. Nothing here is typed, and the imports resolve inside Framer rather
// than in this repo, so the checker has nothing useful to say about it.
//
// Ported from components/Venues/ — Venues.jsx and data.js, combined. Paste
// into Framer as a code file named Venues.tsx.
//
// Only Venues is exported. VENUES is an internal: two hard-coded rooms are not
// something anyone should drag onto a canvas.
//
// The simplest section ported so far. No scroll maths, no pin, no portal — a
// cream panel holding a staggered pair of cards, so the only moving parts are
// RevealGroup and RevealItem, which Vendors already put into Primitives.tsx.

import { injectHappenCSS } from "./GlobalStylesheet.tsx"
import {
  asset,
  Section,
  RevealGroup,
  RevealItem,
  Heading3,
  Heading4,
  TextSmall,
  TextMedium,
  Badge,
} from "./Primitives.tsx"

injectHappenCSS()

// The two rooms Happen runs. Both are the client's own venues rather than
// hire spaces, which is why the copy talks about capacity rather than booking.
const VENUES = [
  {
    name: "Bourke Street Courtyard",
    address: "629 Bourke St, CBD",
    description:
      "A heritage bluestone courtyard in the heart of the CBD. A combination of industrial and garden paradise, built for all-day and all-night events.",
    capacity: "Capacity 1000",
    img: asset("/assets/venue-bourke-st-courtyard.webp"),
  },
  {
    name: "Brown Alley",
    address: "Corner of King & Lonsdale St, CBD",
    description:
      "Melbourne's most iconic underground club with four rooms, world-class sound, and a 24-hour licence inside a heritage building on King Street.",
    capacity: "Capacity 1000",
    img: asset("/assets/venue-brown-alley.webp"),
  },
]

/**
 * Width fills whatever it is dropped into; height is measured from the rendered
 * content, so the stylesheet decides it rather than a number typed in Framer.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function Venues() {
  return (
    <Section id="a-venues" className="venuesVenues">
      <div className="venuesSurface">
        <Heading3 as="h2" className="venuesTitle">
          The rooms we fill
        </Heading3>

        {/* Scrolls sideways under 768px, then the two cards share the row.
            The group staggers its children by 130ms and runs once. */}
        <RevealGroup className="venuesCardGroup" once={true}>
          {VENUES.map((venue) => (
            <RevealItem key={venue.name} className="venuesCardReveal">
              {/* Photo is a background-image rather than an <img>: the card is
                  a cover crop with the overlay and copy stacked on it, and the
                  section sits well below the fold. */}
              <article
                className="venuesCard"
                style={{ backgroundImage: `url("${venue.img}")` }}
              >
                <div className="venuesOverlay" />
                <Badge className="venuesBadge">{venue.capacity}</Badge>
                <div className="venuesContent">
                  <Heading4 as="h3" className="venuesName">
                    {venue.name}
                  </Heading4>
                  <TextSmall className="venuesAddress">
                    {venue.address}
                  </TextSmall>
                  {/* Desktop only — the mobile card is too short to carry it. */}
                  <TextMedium className="venuesDescription">
                    {venue.description}
                  </TextMedium>
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </Section>
  )
}
