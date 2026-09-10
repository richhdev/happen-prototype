// @ts-nocheck
// Last changed 2026-09-10 · hand-written, re-paste into Framer after any edit.
// Plain JavaScript in a .tsx file, because Framer's code editor only makes
// .tsx. Nothing here is typed, and the imports resolve inside Framer rather
// than in this repo, so the checker has nothing useful to say about it.
//
// Ported from components/Services/ — Services.jsx and data.js, combined. Paste
// into Framer as a code file named Services.tsx.
//
// Only Services is exported. SERVICES and focusLine are internals, and the
// focus line is meaningless outside this section.
//
// The second pinned section, after Work, and tall for the same reason: the list
// runs on 320px gaps with half a viewport of runway under it, so Framer will
// measure the component at something like 4,500px. That is what it is in the
// Next app. Nothing here reads right on the canvas, where there is no page
// scroll to drive the surface and no viewport for `vh` to mean anything.

import { useCallback, useEffect, useRef, useState } from "react"
import { cubicBezier, motion, useScroll, useTransform } from "framer-motion"
import { injectHappenCSS } from "./GlobalStylesheet.tsx"
import {
  asset,
  Section,
  Heading2,
  Heading3,
  TextMedium,
  TextOverline,
  TextXXLarge,
  useIsoLayoutEffect,
} from "./Primitives.tsx"

injectHappenCSS()

// Ten capabilities, in the order they scroll past. `meta` is the four or five
// verbs under each title; `desc` is the paragraph that sits over the photo.
const SERVICES = [
  {
    title: "Artist Services",
    meta: "Plan · Deliver · Manage · Operate",
    desc: "We work alongside promoters and venues, delivering artist liaison and touring support at the highest level. We’re there to make sure every artist is taken care of, so promoters can focus on delivering a great event.",
    img: asset("/assets/svc-artist-services.webp"),
  },
  {
    title: "Artist Hospitality",
    meta: "Plan · Stock · Host · Deliver",
    desc: "We plan, manage and deliver artist compounds, dressing rooms and communal spaces. Designed around the needs of your artists and crew so they can focus on the event.",
    img: asset("/assets/svc-artist-hospitality.webp"),
  },
  {
    title: "Artist Management",
    meta: "Book · Negotiate · Contract · Confirm",
    desc: "The paperwork is just as important as the performance. We handle offers, routing, contracts, deposits and lock-ins so our artists can focus on making dance floors hum.",
    img: asset("/assets/svc-artist-management.webp"),
  },
  {
    title: "Artist Tour Logistics",
    meta: "Advance · Book · Move · Track",
    desc: "Getting people where they need to be, when they need to be there. Flights, accommodation, transfers, visas and per diems. All in. All sorted.",
    img: asset("/assets/svc-artist-tour-logistics.webp"),
  },
  {
    title: "Comedy & Podcast Tours",
    meta: "Program · Advance · Tour · Deliver",
    desc: "Whether you’ve got a fully planned tour or just an idea, we’ll help bring it to life. With a trusted network across Australia and New Zealand, we connect the right people, venues and logistics to get your tour on the road.",
    img: asset("/assets/svc-comedy-podcast-tours.webp"),
  },
  {
    title: "Event Staffing",
    meta: "Source · Brief · Deploy · Deliver",
    desc: "Great events start with great staff. Tap into our trusted network of experienced professionals, built over years of working in events across Australia & New Zealand.",
    img: asset("/assets/svc-event-staffing.webp"),
  },
  {
    title: "Retail Precinct",
    meta: "Source · Curate · Build · Operate · Remit",
    desc: "Drawing on our wide network of vendors, we handle the whole process. We source the right mix of traders, vet every application, design the retail offering, manage operations on event day and settle the accounts once it’s all wrapped up.",
    img: asset("/assets/svc-retail-precinct.webp"),
  },
  {
    title: "Venue Bookings",
    meta: "Connect · Pair · Program · Deliver",
    desc: "We’ll take your idea to a dancefloor. Matching the right space to the right crowd via deep industry relationships across the Australian music scene.",
    img: asset("/assets/svc-venue-bookings.webp"),
  },
  {
    title: "Wellness & Activations",
    meta: "Design · Curate · Build · Staff · Operate",
    desc: "We curate purpose-built spaces within festivals. Our team design and deliver wellness, connection and entertainment experiences tailored to your audience.",
    img: asset("/assets/svc-wellness-activations.webp"),
  },
  {
    title: "Industry Ticketing / Community Building",
    meta: "Recruit · Activate · Track · Amplify",
    desc: "Real people sell the most tickets. We build and manage teams of hosts and promoters who spread the word through their personal networks. It’s the old-school street team, reimagined for today.",
    img: asset("/assets/svc-industry-ticketing.webp"),
  },
]

// Flip to true to draw the focus line the list is measured against. Left in
// because that line is the fiddliest thing in the section and the only way to
// see it is to draw it. Note it is drawn `position: fixed` from inside the
// component, so under a transformed Framer wrapper it lands somewhere other
// than where it claims — the measurements themselves are viewport-relative and
// stay correct either way.
const debugFocusLine = false

// Which edge of the card counts as "current", and which edge of a title has
// to cross it. Desktop reads titles beside the card, so a title takes over at
// the card's bottom edge; mobile reads them over the card, so it's the card's
// top edge and the title's bottom.
const focusLine = (cardEl) => {
  const card = cardEl?.getBoundingClientRect()
  const fallback = window.innerHeight / 2
  if (window.matchMedia("(min-width: 1024px)").matches) {
    return {
      at: card ? card.bottom : fallback,
      edgeOf: (r) => r.top + r.height / 2,
    }
  }
  return { at: card ? card.top : fallback, edgeOf: (r) => r.bottom }
}

/**
 * Width fills whatever it is dropped into; height is measured from the rendered
 * content, so the stylesheet decides it rather than a number typed in Framer.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function Services() {
  const sectionRef = useRef(null)
  const itemRefs = useRef([])
  const cardRef = useRef(null)
  const debugLineRef = useRef(null)
  const [active, setActive] = useState(0)

  // Track the section's scroll progress while the section is sticky
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  })

  // Ease the growth of the cream surface, so it doesn't slam into the viewport edges
  const easedProgress = useTransform(scrollYProgress, [0, 1], [0, 1], {
    ease: cubicBezier(0.45, 0, 0.55, 1),
  })

  const sync = useCallback(() => {
    const { at, edgeOf } = focusLine(cardRef.current)

    if (debugFocusLine && debugLineRef.current)
      debugLineRef.current.style.top = `${at}px`

    // Last item to have crossed the line, not the nearest one — nearest flips
    // at the midpoint between titles, well before the line.
    let next = 0
    itemRefs.current.forEach((node, i) => {
      if (node && edgeOf(node.getBoundingClientRect()) <= at) next = i
    })
    setActive((prev) => (prev === next ? prev : next))
  }, [])

  useEffect(() => {
    window.addEventListener("scroll", sync, { passive: true })
    window.addEventListener("resize", sync, { passive: true })
    return () => {
      window.removeEventListener("scroll", sync)
      window.removeEventListener("resize", sync)
    }
  }, [sync])

  useIsoLayoutEffect(sync, [sync])

  // Scroll a service up to the same line, so clicking it makes it the current one
  const scrollToItem = (e) => {
    const { at, edgeOf } = focusLine(cardRef.current)
    window.scrollBy({
      top: edgeOf(e.currentTarget.getBoundingClientRect()) - at,
      behavior: "smooth",
    })
  }

  return (
    <Section
      as={motion.section}
      id="a-services"
      ref={sectionRef}
      className="servicesSection"
      innerClassName="servicesInner"
      style={{
        "--progress": easedProgress,
      }}
    >
      <div className="servicesSurfaceLayer" aria-hidden>
        <div className="servicesSurface" />
      </div>

      <div className="servicesContentGroup">
        <div className="servicesHead">
          <Heading2 className="servicesHeading">How we make it Happen</Heading2>
          <TextMedium className="servicesCopy">
            We&rsquo;ve built a broad operational capability and a national
            network to match.
          </TextMedium>
        </div>

        <div className="servicesList">
          {SERVICES.map((service, i) => (
            <button
              key={service.title}
              type="button"
              ref={(el) => (itemRefs.current[i] = el)}
              onClick={scrollToItem}
              className="servicesListItem"
              data-active={i === active ? "" : undefined}
            >
              <Heading3 as="span" sentence>
                {service.title}
              </Heading3>
              <TextOverline>{service.meta}</TextOverline>
            </button>
          ))}
        </div>
      </div>

      <div className="servicesCardLayer" aria-hidden>
        <div className="servicesCardSticky">
          <div className="servicesCard" ref={cardRef}>
            {SERVICES.map((service, i) => (
              <div
                key={service.title}
                className="servicesSlide"
                data-active={i === active ? "" : undefined}
              >
                <img
                  src={service.img}
                  alt=""
                  className="servicesSlideImage"
                  loading={i === 0 ? undefined : "lazy"}
                />
                <div className="servicesSlideGradient" />
                <TextXXLarge className="servicesSlideText">
                  {service.desc}
                </TextXXLarge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DEBUG: focus line */}
      {debugFocusLine && (
        <div
          ref={debugLineRef}
          aria-hidden
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            height: "2px",
            background: "limegreen",
            zIndex: 9999,
            pointerEvents: "none",
          }}
        />
      )}
    </Section>
  )
}
