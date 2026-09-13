// @ts-nocheck
// Last changed 2026-09-13 · hand-written, re-paste into Framer after any edit.
// Plain JavaScript in a .tsx file, because Framer's code editor only makes
// .tsx. Nothing here is typed, and the imports resolve inside Framer rather
// than in this repo, so the checker has nothing useful to say about it.
//
// Ported from components/Events/ — Events.jsx and data.js, combined. Paste
// into Framer as a code file named Events.tsx.
//
// Only Events is exported here. The card is its own file, EventCard.tsx, so
// the same one card can be dropped on a canvas and bound to a CMS collection;
// this file is the section around it and the placeholder events. Paste
// EventCard.tsx before this, or Events does not appear in the Insert panel.
//
// This one is a staging step, not the finished section. Events is the section
// the client rebuilds as a Framer CMS collection so they can add their own,
// which means the events below are placeholders with a shelf life and this
// file gets thrown away once the CMS version replaces it. It exists so the
// section can be dropped in and reviewed at the right place in the page before
// any of that work starts. EventCard.tsx outlives it — the CMS collection list
// renders that component with its fields bound.
//
// The layout to carry across when this is rebuilt natively, because it changes
// shape at 1024px:
//
//   Below 1024px, .eventsScroller is a horizontal scroller that breaks out of
//   the Section inner with `margin-inline: calc(50% - 50vw)` and pays the width
//   back as padding, so the row scrolls edge to edge while the first card still
//   lines up with the heading. It is measured against the viewport, so it only
//   works while the component is at Fill width.
//
//   From 1024px up it is a three-column grid inside the content width, 32px gap
//   both ways, and a fourth card wraps to a second row. Each card is width 100%
//   of its column there, with the height from its 360/457 aspect-ratio.
//
//   This file is not used in Framer. The section is built natively there, with
//   EventCard.tsx instances in a card container whose settings change per
//   breakpoint — those settings are recorded in PORTING.md under Events.

import { injectHappenCSS } from "./GlobalStylesheet.tsx"
import { asset, Section, Reveal, Heading2 } from "./Primitives.tsx"
import EventCard from "./EventCard.tsx"

injectHappenCSS()

// Placeholder content. Every one of these is a real event with a real date, so
// they go stale on their own — which is the reason the client wants the CMS.
const EVENTS = [
  {
    title: "Vanna Headline Show - Howler",
    status: "onsale",
    date: "12th September 2026",
    description: "Howler Melbourne 3pm - 11pm",
    cta: "Get tickets",
    link: "https://m.moshtix.com.au/v2/event/vanna-headline-show-howler/198866?skin=hwlr",
    img: asset("/assets/event-vanna-howler.webp"),
  },
  {
    title: "Danny Rants Off TheRecord",
    status: "upcoming",
    date: "October 2026",
    description:
      "This October I speak to Sport Stars, Celebs, DJs, Gangsters & Nightlife Icons OFF THE RECORD",
    cta: "Pre register",
    link: "https://happengroup.fillout.com/dannyrants",
    img: asset("/assets/event-off-the-record.webp"),
  },
  {
    title: "Chapter NYE 2026",
    status: "upcoming",
    date: "31st December 2026",
    description:
      "We've got big plans for NYE 2026! Sign up to be the first to hear exclusive news about Chapter NYE 2026.",
    cta: "Pre register",
    link: "https://happengroup.fillout.com/t/fQhTFKa2Ntus",
    img: asset("/assets/event-chapter-nye.webp"),
  },
  // Example cards for testing the wrap to a second row - remove before shipping
  {
    title: "P★rty Girl Tour Forgotten Cities",
    status: "onsale",
    date: "5th September 2026",
    description:
      "Lucy & Nikki's 'P★rty Girl Tour' hits Adelaide and Auckland this September. Their only live shows of the year.",
    cta: "Get tickets",
    link: "https://www.ticketmaster.com.au/party-girl-tour-forgotten-cities-presented-torrensville-05-09-2026/event/130064E68D62206C",
    img: asset("/assets/event-party-girl-adelaide.webp"),
  },
  {
    title: "P★rty Girl Tour Forgotten Cities",
    status: "soldout",
    date: "9th September 2026",
    description:
      "Lucy & Nikki's 'P★rty Girl Tour' hits Adelaide and Auckland this September. Their only live shows of the year.",
    cta: "Get tickets",
    link: "https://www.ticketmaster.co.nz/party-girl-tour-forgotten-cities-presented-auckland-09-09-2026/event/240064DDB8FD1EF4?currency-locale=en-au",
    img: asset("/assets/event-party-girl-auckland.webp"),
  },
]

/**
 * Width fills whatever it is dropped into; height is measured from the rendered
 * content, so the stylesheet decides it rather than a number typed in Framer.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function Events() {
  return (
    <Section
      id="a-events"
      className="eventsSection"
      innerClassName="eventsInner"
    >
      <Heading2 className="eventsHeading">What&apos;s Happening</Heading2>
      <div className="eventsScroller">
        {EVENTS.map((event, i) => (
          // Keyed by index, not title: the two P★rty Girl dates share a title
          // and React would treat them as one card.
          //
          // Reveal rather than RevealGroup, because these are in a horizontal
          // scroller. A stagger driven by the parent would fire for cards that
          // are still off to the right, so each card times off its own delay.
          <Reveal
            key={i}
            className="eventsCardWrap"
            once={true}
            amount={0}
            delay={i * 130}
          >
            {/* No style prop, so EventCard falls through to the stylesheet:
                the clamp() width and the 360/457 aspect-ratio, same as the
                Next app. Framer's sizing only applies to a card placed on a
                canvas. */}
            <EventCard
              image={event.img}
              status={event.status}
              date={event.date}
              title={event.title}
              description={event.description}
              cta={event.cta}
              link={event.link}
              newTab
            />
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
