// @ts-nocheck
// Last changed 2026-09-10 · hand-written, re-paste into Framer after any edit.
// Plain JavaScript in a .tsx file, because Framer's code editor only makes
// .tsx. Nothing here is typed, and the imports resolve inside Framer rather
// than in this repo, so the checker has nothing useful to say about it.
//
// Ported from components/Testimonials/ — Testimonials.jsx, Phone.jsx,
// Thread.jsx and data.js — plus components/Hosts/ — Hosts.jsx and data.js.
// Six source files, combined. Paste into Framer as a code file named
// TestimonialsHosts.tsx.
//
// Only TestimonialsHosts is exported. Testimonials, Hosts, Phone, Thread,
// TESTIMONIALS and HOST_CARDS are internals.
//
// The two are one component because the layout gives no choice. From 1024px up
// they are flex siblings at `flex: 1 1 0` inside .pageTestimonialsHostsGroup,
// and Framer's page frame is a vertical stack, so shipping them separately
// would mean the client building a Framer row and setting that breakpoint on
// the canvas — the one thing the compiled stylesheet exists to avoid.
//
// This is also the first port whose <Section> lives in app/page.js rather than
// in the component, so the group owns it. Both inner ids come with it:
// a-hosts is a live nav target and a-testimonials is commented out in the nav
// data, waiting to be switched back on.
//
// Two things to watch in Preview rather than on the canvas:
//   · Thread puts motion's `layout` on the bubble, the tail and the avatar, so
//     it shares a projection tree with Framer's own wrappers. Same caveat as
//     Artists, and the tail is the piece most likely to show it.
//   · The feed is its own scroller with overscroll-behavior: contain. It
//     drives itself with scrollTo until the visitor scrolls it, then stops.

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { injectHappenCSS } from "./GlobalStylesheet.tsx"
import {
  asset,
  EASE,
  Section,
  Reveal,
  Heading3,
  Heading4,
  TextMedium,
  ButtonOutlineMedium,
} from "./Primitives.tsx"

injectHappenCSS()

// Each entry is one message in the phone's thread. They alternate sides
// automatically — index order is the only thing that decides which way a
// bubble faces, so adding or removing one re-flows the whole thread.
//
// Avatars fall back to the generic placeholder until a real headshot comes
// through — swap each one out per person as they land.
const TESTIMONIALS = [
  {
    name: "Jeff Moss",
    role: "Sound Event Group",
    quote:
      "Collaborating with the guys from Happen Group is a pleasure. Their understanding of what is required at a festival and knowledge of site infrastructure ensures a seamless exercise. They are prepared to roll up their sleeves to get the job done and have the finesse to design exciting and dynamic spaces.",
    avatar: asset("/assets/testimonial-avatar-jeff-moss.jpg"),
  },
  {
    name: "Jacob Malmo",
    role: "Thick as Thieves",
    quote:
      "We've worked with the Happen team for years and it's been smooth sailing from day one. The care they put into their shows from sound, creative, artist experience and care is unmatched. Highly recommend.",
    avatar: asset("/assets/testimonial-avatar-placeholder.svg"),
  },
  {
    name: "Daniel Hildebrand",
    role: "Astral People",
    quote:
      "Working with Happen Group has been a seamless experience from day one. Their team has helped us build meaningful community engagement through a highly effective micro-influencer campaign, while their street team has played an important role in increasing awareness and driving ticket sales for our events. They're proactive, easy to work with, and consistently deliver with professionalism and care.",
    avatar: asset("/assets/testimonial-avatar-placeholder.svg"),
  },
  {
    name: "Miranda Nicol",
    role: "Untitled Group",
    quote:
      "We've loved working with Paris and Dana at Happen Group on the retail precinct at Beyond the Valley and Pitch Music & Arts. They come to every conversation prepared, stay on top of timelines, and make the whole process feel collaborative, which is exactly what you need in the lead-up to a major festival. We always feel like our vendor relationships are in good hands.",
    avatar: asset("/assets/testimonial-avatar-placeholder.svg"),
  },
  {
    name: "Mike Toner",
    role: "Thick as Thieves",
    quote:
      "I have been working with Happen Group for a number of years now, and everything from their communication, professionalism and attention to detail is top notch. They really know how to wear the hats of everyone from promoters, to punters, to site operators and everyone else, which results in a win-win for all working with them. Could not recommend highly enough.",
    avatar: asset("/assets/testimonial-avatar-placeholder.svg"),
  },
  {
    name: "Annie Tetzlaff",
    role: "Good Things Festival / Destroy All Lines",
    quote:
      "We absolutely love working with Happen Group. Macca, Paris and the team are incredibly easy to work with, communicate well and are super organised. No matter what gets thrown at them onsite, they're calm, adaptable and just get on with it with a smile and a laugh.",
    avatar: asset("/assets/testimonial-avatar-placeholder.svg"),
  },
  {
    name: "Jerry Poon",
    role: "Director, LTEC",
    quote:
      "Working with The Happen Group for artist liaison, logistics, and artist services at the LTEC Festival was an absolute pleasure from start to finish. Their team consistently went above and beyond, anticipating needs before we even had to ask and thinking outside the box to solve challenges quickly and creatively. Every aspect of artist care and logistics was handled with efficiency and professionalism, and they maintained an exceptionally high standard throughout the entire event. Their dedication and attention to detail made a real difference to our artists' experience, and we wouldn't hesitate to work with The Happen Group again.",
    avatar: asset("/assets/testimonial-avatar-jerry-poon.jpg"),
  },
  {
    name: "Fil Palermo",
    role: "Director, Untitled Group",
    quote:
      "We have worked with the team at Happen Group for over 10 years now in a number of different roles. Whether we are contracting them to deliver an area of one of our festivals or working together on an event it is always a great experience.",
    avatar: asset("/assets/testimonial-avatar-placeholder.svg"),
  },
]

// Both links are Google Forms the client owns, which is why they open in a new
// tab rather than routing anywhere on the site.
const HOST_CARDS = [
  {
    title: "Hosts & Promoters",
    description: "Turn your network into a side hustle.",
    label: "Join the team",
    href: "https://docs.google.com/forms/d/e/1FAIpQLSdxwNLMLijvqMuaeHtV8M2FsPSfGB4g0ZVlATtbpdbBntmL6A/viewform",
  },
  {
    title: "Casual Event Workers",
    description: "Pick up casual work at Australia's biggest events.",
    label: "Register",
    href: "https://docs.google.com/forms/d/e/1FAIpQLSfGExZGlBSpbc4ciG6nipO5i0NgDDcdFpXRqtsu3CWuMCBO9Q/viewform",
  },
]

/* Thread -------------------------------------------------------------------
   Each message pops in as a typing pill, expands into the bubble, and the feed
   scrolls to keep the live one at the bottom of the screen. */

// Milliseconds: pause before the first message, dots before it expands, and the
// gap between messages.
const LEAD_IN = 500
const TYPING = 900
const STEP = 2400

// Breathing room under a message once scrolled into place.
const BOTTOM_INSET = 24

const bubble = {
  hidden: { opacity: 0, scale: 0.4 },
  shown: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: EASE } },
}

// A layout animation rather than a height transition, so the row is at its
// final size in the DOM and the scroll below can measure it while it opens.
const expand = { duration: 0.45, ease: EASE }

function Thread() {
  const feedRef = useRef(null)
  const rowRefs = useRef([])
  // Last message to have expanded, and the one showing its dots; -1 is not yet.
  const [landed, setLanded] = useState(-1)
  const [typing, setTyping] = useState(-1)
  const inView = useInView(feedRef, { amount: 0.2 })
  // Once the visitor scrolls the thread themselves the messages keep arriving,
  // but the feed stops dragging itself to the newest one.
  const takenOver = useRef(false)
  const active = Math.max(landed, typing)

  // Rewinds out of view so it replays on the way back.
  useEffect(() => {
    if (!inView) {
      setLanded(-1)
      setTyping(-1)
      takenOver.current = false
      feedRef.current?.scrollTo({ top: 0 })
      return
    }
    // A flat timeline of two timers per message keeps the beats from drifting.
    const timers = TESTIMONIALS.flatMap((_, i) => {
      const at = LEAD_IN + i * STEP
      return [
        setTimeout(() => setTyping(i), at),
        setTimeout(() => {
          setTyping(-1)
          setLanded(i)
        }, at + TYPING),
      ]
    })
    return () => timers.forEach(clearTimeout)
  }, [inView])

  // Input events only, never scroll itself, which the smooth scroll below fires.
  useEffect(() => {
    const feed = feedRef.current
    if (!feed) return
    const takeOver = () => {
      takenOver.current = true
    }
    feed.addEventListener("wheel", takeOver, { passive: true })
    feed.addEventListener("touchmove", takeOver, { passive: true })
    feed.addEventListener("keydown", takeOver)
    return () => {
      feed.removeEventListener("wheel", takeOver)
      feed.removeEventListener("touchmove", takeOver)
      feed.removeEventListener("keydown", takeOver)
    }
  }, [])

  // Runs on both beats: the dots arriving, then the message pushing the thread
  // down as it expands.
  useEffect(() => {
    const feed = feedRef.current
    const row = rowRefs.current[active]
    if (active < 0 || !feed || !row || takenOver.current) return

    // offsetTop, not a client rect: the row is still scaled down, and offsets
    // ignore transforms. It shares an offsetParent with the feed.
    const top = row.offsetTop - feed.offsetTop
    // A message taller than the screen aligns to the top padding instead, so
    // what gets cut off is its tail rather than its opening line.
    const topInset =
      parseFloat(getComputedStyle(feed).paddingTop) || BOTTOM_INSET
    const overflows =
      row.offsetHeight > feed.clientHeight - topInset - BOTTOM_INSET
    const target = overflows
      ? top - topInset
      : top + row.offsetHeight - feed.clientHeight + BOTTOM_INSET

    feed.scrollTo({ top: Math.max(0, target), behavior: "smooth" })
  }, [active, landed])

  return (
    <ol className="testimonialsFeed" ref={feedRef}>
      {TESTIMONIALS.map((item, i) => {
        // Odd entries mirror to the other side of the thread.
        const flipped = i % 2 === 1
        return (
          <motion.li
            key={`${item.name}-${i}`}
            ref={(el) => {
              rowRefs.current[i] = el
            }}
            className={`testimonialsRow ${flipped ? "testimonialsRowFlipped" : ""}`}
            variants={bubble}
            initial="hidden"
            animate={i <= active ? "shown" : "hidden"}
          >
            <motion.figure
              layout
              transition={expand}
              className={`testimonialsBubble ${
                i > landed ? "testimonialsBubbleTyping" : ""
              }`}
            >
              {i > landed ? (
                <span className="testimonialsDots" aria-hidden="true">
                  <span className="testimonialsDot" />
                  <span className="testimonialsDot" />
                  <span className="testimonialsDot" />
                </span>
              ) : (
                <div className="testimonialsMessage">
                  <figcaption className="testimonialsAuthor">
                    {item.name} - {item.role}
                  </figcaption>
                  <blockquote className="testimonialsQuote">
                    {item.quote}
                  </blockquote>
                </div>
              )}
              {/* Own layout, so the growth doesn't stretch the tail. */}
              <motion.span
                layout
                transition={expand}
                className="testimonialsTail"
                aria-hidden="true"
              />
            </motion.figure>
            <motion.img
              layout
              transition={expand}
              src={item.avatar}
              alt={`${item.name}, ${item.role}`}
              className="testimonialsAvatar"
              width={50}
              height={50}
              loading="lazy"
            />
          </motion.li>
        )
      })}
    </ol>
  )
}

/* Phone --------------------------------------------------------------------
   Nothing under 768px: the frame is display: none and the thread sits straight
   on the cream panel. From 768px up this becomes the device, and the screen is
   the hole the thread scrolls inside. */

function Phone({ children }) {
  return (
    <div className="phone">
      <div className="phoneScreen">{children}</div>
      <img
        src={asset("/assets/testimonials-phone-frame.png")}
        alt=""
        className="phoneFrame"
      />
    </div>
  )
}

/* Testimonials — left half of the group from 1024px up. --------------------- */

function Testimonials() {
  return (
    <div id="a-testimonials" className="testimonialsSurface">
      {/* Fades the thread out as it runs up behind the heading. Mobile only —
          on desktop the phone's own bezel does that job. */}
      <div className="testimonialsScrim" aria-hidden="true" />

      <Heading3 as="h2" className="testimonialsTitle">
        Trusted by the best in the business
      </Heading3>

      <Phone>
        <Thread />
      </Phone>
    </div>
  )
}

/* Hosts — right half of the group from 1024px up. --------------------------- */

function Hosts() {
  return (
    <div id="a-hosts" className="hostsSection">
      {/* The panel itself, as an <img> rather than a background so it can crop
          with object-fit while the copy stacks on top of it. */}
      <img
        src={asset("/assets/bg-graphic.webp")}
        alt=""
        className="hostsSurface"
      />

      <Heading3 as="h2" className="hostsTitle">
        Want in?
      </Heading3>

      {/* Two cards: a swipeable row under 1024px, a stack above it. Each
          re-reveals every time it comes back into view, staggered by 130ms. */}
      <div className="hostsCards">
        {HOST_CARDS.map((card, i) => (
          <Reveal
            key={card.title}
            className="hostsCardWrap"
            once={false}
            amount={0}
            delay={i * 130}
          >
            <article className="hostsCard">
              <div className="hostsContent">
                <Heading4 as="h3" className="hostsCardTitle">
                  {card.title}
                </Heading4>
                <TextMedium className="hostsCardBody">
                  {card.description}
                </TextMedium>
              </div>
              <ButtonOutlineMedium
                href={card.href}
                target="_blank"
                rel="noreferrer"
              >
                {card.label}
              </ButtonOutlineMedium>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  )
}

/**
 * Width fills whatever it is dropped into; height is measured from the rendered
 * content, so the stylesheet decides it rather than a number typed in Framer.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function TestimonialsHosts() {
  return (
    <Section innerClassName="pageTestimonialsHostsGroup">
      <Testimonials />
      <Hosts />
    </Section>
  )
}
