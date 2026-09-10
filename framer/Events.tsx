// @ts-nocheck
// Last changed 2026-09-10 · hand-written, re-paste into Framer after any edit.
// Plain JavaScript in a .tsx file, because Framer's code editor only makes
// .tsx. Nothing here is typed, and the imports resolve inside Framer rather
// than in this repo, so the checker has nothing useful to say about it.
//
// Ported from components/Events/ — Events.jsx and data.js, combined. Paste
// into Framer as a code file named Events.tsx.
//
// Only Events is exported. EventCard, EVENTS and STATUSES are internals.
//
// This one is a staging step, not the finished section. Events is the section
// the client rebuilds as a Framer CMS collection so they can add their own,
// which means the four events below are placeholders with a shelf life and
// this file gets thrown away once the CMS version replaces it. It exists so
// the section can be dropped in and reviewed at the right place in the page
// before any of that work starts.
//
// Two things to carry across when it is rebuilt natively, because they are the
// only parts that are not a plain card grid:
//
//   1. .eventsScroller breaks out of the Section inner with
//      `margin-inline: calc(50% - 50vw)` and pays the width back as padding,
//      so the row of cards scrolls edge to edge while the first card still
//      lines up with the heading. It is measured against the viewport, so it
//      only works while the component is at Fill width.
//   2. Sold-out events keep their real ticket link in the markup and are
//      dimmed and made unclickable by .eventsCtaSoldOut, rather than having
//      the link removed. The label changes to "Sold out" too.

import { injectHappenCSS } from "./GlobalStylesheet.tsx"
import {
  asset,
  Section,
  Reveal,
  Heading2,
  Heading4,
  TextSmall,
  TextMedium,
  Badge,
  ButtonOutlineMedium,
} from "./Primitives.tsx"

injectHappenCSS()

// Placeholder content. Every one of these is a real event with a real date, so
// they go stale on their own — which is the reason the client wants the CMS.
const EVENTS = [
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
  {
    title: "Danny Rants Off TheRecord",
    status: "upcoming",
    date: "October 2026",
    description:
      "This October I speak to Sport Stars, Celebs, DJs, Gangsters & Nightlife Icons OFF THE RECORD",
    cta: "Pre register",
    link: "https://happengroup.fillout.com/dannyrants",
    img: asset("/assets/event-off-the-record-tour.webp"),
  },
  {
    title: "Chapter NYE 2026",
    status: "upcoming",
    date: "31st December 2026",
    description:
      "We've got big plans for NYE 2026! Sign up to be the first to hear exclusive news about Chapter NYE 2026.",
    cta: "Pre register",
    link: "https://happengroup.fillout.com/t/fQhTFKa2Ntus",
    img: asset("/assets/event-chapter-nye-2026.webp"),
  },
]

// Three states, each a badge colour and a label. `soldout` is the only one
// that changes the button as well as the badge. In the CMS version this is the
// field that has to become an enum rather than free text, or a typo silently
// throws on the STATUSES lookup below.
const STATUSES = {
  upcoming: { label: "Upcoming", color: "charcoal" },
  onsale: { label: "On sale", color: "orange" },
  soldout: { label: "Sold out", color: "red", soldout: true },
}

function EventCard({ event }) {
  const { label, color, soldout } = STATUSES[event.status]

  return (
    <article className="eventsCard">
      {/* `event.crop` is an escape hatch for per-event object-position, unused
          by all four of these. Keep it: it is how a badly framed poster gets
          nudged without a new class. */}
      <img
        src={event.img}
        alt=""
        className="eventsImage"
        style={event.crop}
      />

      {/* Sits above the image and carries the gradient that makes the copy
          readable, clear at the top and solid charcoal at the bottom. */}
      <div className="eventsOverlay">
        {label && <Badge color={color}>{label}</Badge>}

        {/* margin-top: auto here is what pushes everything below it to the
            bottom of the card, so cards with shorter copy still line up. */}
        <div className="eventsMeta">
          <TextSmall className="eventsDate">{event.date}</TextSmall>
          <Heading4 as="h3" className="eventsTitle">
            {event.title}
          </Heading4>
        </div>

        {/* Hidden under 768px — the card is too short to carry it there. */}
        <TextMedium className="eventsDescription">
          {event.description}
        </TextMedium>

        <ButtonOutlineMedium
          href={event.link}
          rel="noopener noreferrer"
          target="_blank"
          className={soldout ? "eventsCtaSoldOut" : undefined}
          aria-disabled={soldout || undefined}
        >
          {soldout ? "Sold out" : event.cta}
        </ButtonOutlineMedium>
      </div>
    </article>
  )
}

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
            <EventCard event={event} />
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
