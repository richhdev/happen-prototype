// @ts-nocheck
// Last changed 2026-09-10 · hand-written, re-paste into Framer after any edit.
// Plain JavaScript in a .tsx file, because Framer's code editor only makes
// .tsx. Nothing here is typed, and the imports resolve inside Framer rather
// than in this repo, so the checker has nothing useful to say about it.
//
// Ported from components/Artists/ — Artists.jsx, ArtistCard.jsx and data.js,
// combined. Paste into Framer as a code file named Artists.tsx.
//
// Only Artists is exported. ArtistCard, useSettle and ARTISTS are internals: a
// card on its own is meaningless, so it stays off the Insert panel.
//
// The third pinned section. Its track is 180vh, one viewport of pin plus 80vh
// of zoom, so Framer measures it at not quite two viewports rather than the
// four-and-a-half thousand pixels Work and Services come out at.
//
// The one thing here that has no equivalent in the sections ported so far is
// motion's `layout` on the card. An opening card is not moved by a transform of
// its own; it changes CSS box and lets motion measure the before and after and
// spring between them. Framer wraps every code component in motion elements of
// its own, so this is the first port whose animation shares a projection tree
// with the editor's. Watch it in Preview before trusting it.

import { useCallback, useEffect, useRef, useState } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import { injectHappenCSS } from "./GlobalStylesheet.tsx"
import {
  asset,
  Section,
  Heading2,
  Heading4,
  TextMedium,
  Badge,
} from "./Primitives.tsx"

injectHappenCSS()

// `links` is ordered as the design lists them: the artist's music platform
// first, Instagram last. Sasha Fern has no music link, so the row is just the
// one entry rather than a placeholder.
const ARTISTS = [
  {
    name: "Jämo",
    genre: "Electronic",
    img: asset("/assets/artist-jamo.webp"),
    bio: "Australian DJ, producer and founder of Critical Feeling. Recognised for a euphoric, emotionally charged sound and electrifying live sets. An official Calvin Harris remix and standout appearances at Let Them Eat Cake, Beyond The Valley and A3 Festival.",
    links: [
      {
        label: "Spotify",
        href: "https://open.spotify.com/artist/5BatmKqX0n63qHXQTcKoPr",
      },
      { label: "Instagram", href: "https://instagram.com/jamo.wav" },
    ],
  },
  {
    name: "Laura King",
    genre: "Techno/Trance",
    img: asset("/assets/artist-laura-king.webp"),
    bio: "A leading force in Australia's contemporary techno/trance scene, bridging global trends and local flavour. High-energy sets blending hard dance, groove techno, hip hop vocals and psychedelic trance.",
    links: [
      { label: "Soundcloud", href: "https://soundcloud.com/laurakingofficial" },
      { label: "Instagram", href: "https://instagram.com/laura.king.music" },
    ],
  },
  {
    name: "Sasha Fern",
    genre: "House",
    img: asset("/assets/artist-sasha-fern.webp"),
    bio: "Known for all things steezy, in style and in sound. A tasteful flow of Tech & Latino House, Jackin', Garage and bouncy rhythms. Has warmed up for Peggy Gou, Sharam Jey and Boys Noize.",
    links: [{ label: "Instagram", href: "https://instagram.com/sashafernn" }],
  },
  {
    name: "Vanna",
    genre: "Rave",
    img: asset("/assets/artist-vanna.webp"),
    bio: 'Melbourne-based, self-described "Naarm/Melbourne Rave Chic" and "bpm pusher." Has played Revolver Upstairs and venues in Paris and Dortmund.',
    links: [
      { label: "Soundcloud", href: "https://soundcloud.com/vannaspins" },
      { label: "Instagram", href: "https://instagram.com/vannaspins" },
    ],
  },
]

/* How far from the pin's rest point the viewer has to scroll before the open
   card closes, as a share of the viewport. Proportional rather than a fixed
   distance, so the buffer feels the same on a phone as on a desktop. */
const CLOSE_FRACTION = 1 / 3

/**
 * Width fills whatever it is dropped into; height is measured from the rendered
 * content, so the stylesheet decides it rather than a number typed in Framer.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function Artists() {
  const trackRef = useRef(null)
  // Where the pin comes to rest, and so where an open card sits.
  const restTopRef = useRef(0)
  const [activeIndex, setActiveIndex] = useState(null)
  const isOpen = activeIndex !== null
  const reduceMotion = useReducedMotion()

  // Track the scroll progress of the sticky section
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  })

  // The far end of the pin, where the cards have finished settling. Opening a
  // card scrolls here so the grid behind it is at rest rather than caught
  // mid-zoom.
  const scrollToRest = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const { top, height } = track.getBoundingClientRect()
    restTopRef.current = top + window.scrollY + height - window.innerHeight
    window.scrollTo({
      top: restTopRef.current,
      behavior: reduceMotion ? "auto" : "smooth",
    })
  }, [reduceMotion])

  const toggle = (index) => {
    if (index === activeIndex) {
      setActiveIndex(null)
      return
    }
    setActiveIndex(index)
    scrollToRest()
  }

  // Scrolling away in either direction closes the open card: the card is only
  // legible with the grid parked at the end of the pin, and it can't follow the
  // section out of the viewport.
  useEffect(() => {
    if (!isOpen) return
    // Opening scrolls to the rest point itself, and that scroll can still be in
    // flight here. Distance to the rest point tells the two apart without a
    // timer to guess at: ours only ever closes it, the viewer's opens it up.
    let lastDrift = Infinity
    const closeDistance = window.innerHeight * CLOSE_FRACTION
    const onScroll = () => {
      const drift = Math.abs(window.scrollY - restTopRef.current)
      const movingAway = drift > lastDrift
      lastDrift = drift
      if (movingAway && drift > closeDistance) setActiveIndex(null)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [activeIndex, isOpen])

  // Escape closes the open card, alongside the dim layer's click-away.
  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e) => e.key === "Escape" && setActiveIndex(null)
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [isOpen])

  return (
    <Section id="b-artists" className="artistsSection">
      <div ref={trackRef} className="artistsScrollContainer">
        <div className="artistsPinned">
          <div
            className={`artistsDim ${isOpen ? "artistsDimVisible" : ""}`}
            onClick={() => setActiveIndex(null)}
            aria-hidden="true"
          />

          <div className="artistsGrid">
            <div className="artistsHeadingWrap">
              <Heading2 className="artistsHeading">Our artists</Heading2>
            </div>

            {ARTISTS.map((artist, i) => (
              <ArtistCard
                key={artist.name}
                artist={artist}
                index={i}
                progress={scrollYProgress}
                active={i === activeIndex}
                dimmed={isOpen && i !== activeIndex}
                onToggle={() => toggle(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}

/**
 * How far a card has travelled, 0 (small, gathered at the centre) to 1 (full
 * size in its slot). Cards start in turn across STAGGER, each takes DURATION.
 */
function useSettle(progress, index) {
  const STAGGER = 0.35
  const DURATION = 0.45
  const start = (index / ARTISTS.length) * STAGGER
  return useTransform(progress, [start, start + DURATION], [0, 1], {
    clamp: true,
  })
}

// Stays an <article>. The stylesheet decides which corner each card gathers
// towards with :nth-of-type on the container, counting articles so the heading
// div between them doesn't shift the quadrants — change the tag and the four
// cards zoom out of the wrong corners.
function ArtistCard({ artist, index, progress, active, dimmed, onToggle }) {
  const settle = useSettle(progress, index)
  const reduceMotion = useReducedMotion()

  // The card animates back to its slot after `active` goes, so the lift has to
  // outlive the class. Motion tells us when it has landed; there's no duration
  // to guess at, and the spring is free to take as long as it takes.
  const [returning, setReturning] = useState(false)
  const wasActive = useRef(active)
  useEffect(() => {
    if (wasActive.current && !active) setReturning(true)
    wasActive.current = active
  }, [active])

  return (
    // The wrapper holds the grid slot and the scroll-settle transform; the card
    // inside it is what lifts out to the centre, so the row never collapses.
    <motion.article
      className={`artistCardContainer ${active ? "artistCardContainerActive" : ""} ${
        returning && !active ? "artistCardContainerReturning" : ""
      }`}
      style={{ "--travelled": settle }}
    >
      <motion.div
        layout
        transition={
          reduceMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 260, damping: 30 }
        }
        onLayoutAnimationComplete={() => setReturning(false)}
        className={`artistCard ${active ? "artistCardActive" : ""} ${
          dimmed ? "artistCardDimmed" : ""
        }`}
      >
        <img src={artist.img} alt="" className="artistCardImage" />
        <div className="artistCardOverlay" />

        {/* Sits under the content so the artist's links stay clickable in
            both states, and covers the rest of the card as the toggle. */}
        <button
          type="button"
          className="artistCardToggle"
          aria-expanded={active}
          onClick={onToggle}
        >
          <span className="artistCardToggleLabel">
            {active ? `Close ${artist.name}` : `Read more about ${artist.name}`}
          </span>
        </button>

        <div className="artistCardContent">
          <Heading4 as="h3" className="artistCardName">
            {artist.name}
          </Heading4>

          <Badge color="red" className="artistCardBadge">
            {artist.genre}
          </Badge>

          {/* The box, not the text, is what opens: it collapses to nothing
              while the card is shut so the bio can grow the content upwards
              instead of appearing in one frame. */}
          <div className="artistCardBioContainer">
            <TextMedium className="artistCardBio">{artist.bio}</TextMedium>
          </div>

          <div className="artistCardLinks">
            {artist.links.map((link) => (
              <TextMedium
                key={link.label}
                as="a"
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="artistCardLink"
              >
                <span className="artistCardLinkLabel">{link.label}</span>
              </TextMedium>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.article>
  )
}
