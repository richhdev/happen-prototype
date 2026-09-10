// @ts-nocheck
// Last changed 2026-09-10 · hand-written, re-paste into Framer after any edit.
// Plain JavaScript in a .tsx file, because Framer's code editor only makes
// .tsx. Nothing here is typed, and the imports resolve inside Framer rather
// than in this repo, so the checker has nothing useful to say about it.
//
// Ported from components/Work/ — Work.jsx, useSidewaysScroll.js and data.js,
// combined. Paste into Framer as a code file named Work.tsx.
//
// Only Work is exported. WorkCard, WORK, useCentred and useSidewaysScroll are
// internals: a card on its own is meaningless, so it stays off the Insert panel.
//
// This is the tallest component on the page by a long way. The section's own
// height is a scroll track — one viewport plus the full width of the card row —
// so Framer measures it at something like 9,000px and the canvas shows it at
// that. That is what it is in the Next app too. Judge it in Preview.

import { useCallback, useEffect, useRef, useState } from "react";
import {
  cubicBezier,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { RenderTarget } from "framer";
import { injectHappenCSS } from "./GlobalStylesheet.tsx";
import { asset, Section, Heading2, useIsoLayoutEffect } from "./Primitives.tsx";

injectHappenCSS();

// The red surface's pull-back curve: quick off the viewport edges, then easing
// down into the frame. Roughly easeOutQuad — steeper front-loads the break away
// but leaves a long crawl at the end.
const SHRINK_EASE = cubicBezier(0.5, 1, 0.89, 1);

// Nineteen clients, in the order they pan past. logoWidth/logoHeight are the
// mark's natural size at the 280px card, scaled from there in CSS, so the wide
// marks and the tall ones both sit right rather than being matched on one axis.
const WORK = [
  {
    name: "Knotfest",
    tag: ["BOH Management, Nationwide"],
    img: asset("/assets/work-knotfest.webp"),
    logo: asset("/assets/client-knotfest.webp"),
    logoWidth: 200,
    logoHeight: 28,
  },
  {
    name: "Good Things Festival",
    tag: ["BOH Management, Nationwide", "Retail Precinct Management"],
    img: asset("/assets/work-good-things.webp"),
    logo: asset("/assets/client-good-things.svg"),
    logoWidth: 180,
    logoHeight: 45,
  },
  {
    name: "Beyond The Valley",
    tag: ["Retail Precinct Management"],
    img: asset("/assets/work-beyond-the-valley.webp"),
    logo: asset("/assets/client-beyond-the-valley.svg"),
    logoWidth: 170,
    logoHeight: 21,
  },
  {
    name: "A3 Festival",
    tag: [
      "Artist Services",
      "Volunteer Management",
      "Front Gate Management",
      "Box Office Management",
      "Accreditation",
    ],
    img: asset("/assets/work-a3.webp"),
    logo: asset("/assets/client-a3.webp"),
    logoWidth: 156,
    logoHeight: 32,
  },
  {
    name: "Let Them Eat Cake",
    tag: ["Artist Services", "Industry Ticketing / Community Building"],
    img: asset("/assets/work-let-them-eat-cake.webp"),
    logo: asset("/assets/client-let-them-eat-cake.svg"),
    logoWidth: 144,
    logoHeight: 27,
  },
  {
    name: "Promiseland",
    tag: [
      "Artist Services",
      "Industry Ticketing / Community Building",
      "Retail Precinct Management",
    ],
    img: asset("/assets/work-promiseland.webp"),
    logo: asset("/assets/client-promiseland.webp"),
    logoWidth: 213,
    logoHeight: 97,
  },
  {
    name: "Eden Festival (NZ)",
    tag: ["Artist Services"],
    img: asset("/assets/work-eden-fest.webp"),
    logo: asset("/assets/client-eden-fest.webp"),
    logoWidth: 256,
    logoHeight: 89,
  },
  {
    name: "Souled Out",
    tag: ["Artist Services"],
    img: asset("/assets/work-souled-out.webp"),
    logo: asset("/assets/client-souled-out.webp"),
    logoWidth: 286,
    logoHeight: 99,
  },
  {
    name: "Happy Hour",
    tag: ["End-to-end Event Delivery, Nationwide"],
    img: asset("/assets/work-happy-hour.webp"),
    logo: asset("/assets/client-happy-hour.webp"),
    logoWidth: 245,
    logoHeight: 64,
  },
  {
    name: "Our City Our Sound",
    tag: ["Artist Services", "Box Office", "Accreditation"],
    img: asset("/assets/work-our-city-our-sound.webp"),
    logo: asset("/assets/client-our-city-our-sound.svg"),
    logoWidth: 108,
    logoHeight: 77,
  },
  {
    name: "Pitch Music and Arts",
    tag: [
      "Industry Ticketing / Community Building",
      "Retail Precinct Management",
    ],
    img: asset("/assets/work-pitch.webp"),
    logo: asset("/assets/client-pitch.webp"),
    logoWidth: 193,
    logoHeight: 68,
  },
  {
    name: "Strummingbird",
    tag: ["Artist Services, Nationwide"],
    img: asset("/assets/work-strummingbird.webp"),
    logo: asset("/assets/client-strummingbird.svg"),
    logoWidth: 168,
    logoHeight: 35,
  },
  {
    name: "Chapter",
    tag: ["End-to-end Event Delivery"],
    img: asset("/assets/work-chapter.webp"),
    logo: asset("/assets/client-chapter.webp"),
    logoWidth: 182,
    logoHeight: 85,
  },
  {
    name: "Strawberry Fields",
    tag: ["Industry Ticketing / Community Building"],
    img: asset("/assets/work-strawberry-fields.webp"),
    logo: asset("/assets/client-strawberry-fields.webp"),
    logoWidth: 241,
    logoHeight: 57,
  },
  {
    name: "Afrosoul",
    tag: ["Industry Ticketing / Community Building"],
    img: asset("/assets/work-afrosoul.webp"),
    logo: asset("/assets/client-afrosoul.svg"),
    logoWidth: 185,
    logoHeight: 55,
  },
  {
    name: "Live Nation",
    tag: ["Industry Ticketing / Community Building"],
    img: asset("/assets/work-live-nation.webp"),
    logo: asset("/assets/client-live-nation.webp"),
    logoWidth: 214,
    logoHeight: 53,
  },
  {
    name: "Astral People",
    tag: ["Industry Ticketing / Community Building"],
    img: asset("/assets/work-astral-people.webp"),
    logo: asset("/assets/client-astral-people.svg"),
    logoWidth: 98,
    logoHeight: 69,
  },
  {
    name: "S.A.S.H",
    tag: ["Artist Advancing, Nationwide"],
    img: asset("/assets/work-sash.webp"),
    logo: asset("/assets/client-sash.svg"),
    logoWidth: 180,
    logoHeight: 45,
  },
  {
    name: "Leonardo Da Vinci Immersive Exhibition",
    tag: ["End-to-end Event Delivery"],
    img: asset("/assets/work-leonardo-da-vinci.webp"),
    logo: asset("/assets/client-leonardo-da-vinci.webp"),
    logoWidth: 150,
    logoHeight: 68,
  },
];

/**
 * Width fills whatever it is dropped into; height is measured from the rendered
 * content, so the stylesheet decides it rather than a number typed in Framer.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function Work() {
  const containerRef = useRef(null);
  const cardRefs = useRef([]);
  const [maxOffset, setMaxOffset] = useState(0);
  const [active, setActive] = useState(0);

  const onCanvas = RenderTarget.current() === RenderTarget.canvas;

  // Determine how long the track needs to be to bring the last card to the centre of the viewport.
  // Remeasured if the viewport resizes.
  useIsoLayoutEffect(() => {
    const measure = () => {
      const first = cardRefs.current[0];
      const last = cardRefs.current[cardRefs.current.length - 1];
      if (!first || !last) return;
      setMaxOffset(Math.max(0, last.offsetLeft - first.offsetLeft));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // The track pans its full width across the section's whole scroll distance, so
  // the section unpins on the frame the last card reaches the centre.
  const trackX = useTransform(scrollYProgress, [0, 1], [0, -maxOffset]);

  // The surface pulls back over that same stretch, landing framed as the last
  // card does. Eased out so it breaks away from the viewport edges quickly and
  // then creeps the last of the way in — a linear run this long reads as the
  // frame barely moving at the start.
  const framed = useTransform(scrollYProgress, [0, 1], [0, 1], {
    ease: SHRINK_EASE,
  });

  // The card nearest the viewport centre is the featured one.
  const step = WORK.length > 1 ? maxOffset / (WORK.length - 1) : 0;
  const syncActive = useCallback(
    (value) => {
      if (!step) return;
      const i = Math.round(-value / step);
      const next = Math.min(WORK.length - 1, Math.max(0, i));
      setActive((prev) => (prev === next ? prev : next));
    },
    [step],
  );

  useMotionValueEvent(trackX, "change", syncActive);

  // Clicking a card scrolls it to the center
  const scrollToCard = useCallback(
    (index) => {
      const container = containerRef.current;
      if (!container || !step) return;
      const top = container.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top + index * step, behavior: "smooth" });
    },
    [step],
  );

  // A sideways gesture over the section drives the same vertical scroll, so
  // reaching for the cards directly moves them instead of doing nothing.
  //
  // Off on the canvas, which is the one addition to this port. The hook takes
  // a horizontal wheel with preventDefault, and on the canvas that gesture is
  // how you pan the editor — left unguarded, the section becomes a dead patch
  // you cannot scroll past while laying the page out.
  useSidewaysScroll(containerRef, !onCanvas);

  // "change" only fires on later updates, so the track would keep card 0
  // featured until the first scroll — wrong for a reload part-way down the page.
  useIsoLayoutEffect(() => syncActive(trackX.get()), [syncActive, trackX]);

  return (
    <Section id="b-work" className="workSection">
      <div
        ref={containerRef}
        className="workScrollContainer"
        style={{ height: `calc(100vh + ${maxOffset}px)` }}
      >
        <div className="workPinned">
          <motion.div
            className="workContentGroup"
            style={{
              "--progress": framed,
            }}
          >
            <div className="workSurface" />

            <Heading2 className="workHeading">
              The proof is <br className="desktop-only" />
              in the Happening
            </Heading2>

            <motion.div className="workTrack" style={{ x: trackX }}>
              {WORK.map((item, i) => (
                <WorkCard
                  key={item.name}
                  item={item}
                  index={i}
                  step={step}
                  x={trackX}
                  active={i === active}
                  cardRef={(el) => (cardRefs.current[i] = el)}
                  onActivate={scrollToCard}
                />
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}

function WorkCard({ item, index, step, x, active, cardRef, onActivate }) {
  // The featured-state visuals — scale, background, image dim — are derived
  // from this in CSS, so the transition tracks the scrollbar instead of firing
  // a fixed-duration transition when the active card flips.
  const centred = useCentred(x, index, step);

  return (
    <motion.article
      ref={cardRef}
      className={`workCard ${active ? "workCardActive" : ""}`}
      style={{ "--centred": centred }}
      onClick={active ? undefined : () => onActivate(index)}
    >
      {/* item.crop is the per-photo art-direction hook — object-position, a
          transform — for a shot that does not sit right under a plain cover
          crop. Nothing in WORK needs one yet, so it is undefined throughout. */}
      <img src={item.img} alt="" className="workImage" style={item.crop} />

      <div className="workOverlay" />

      <div className="workLogoWrap">
        <img
          src={item.logo}
          alt={item.name}
          className="workLogo"
          style={{
            "--logo-w": item.logoWidth,
            "--logo-h": item.logoHeight,
            "--logo-opacity": item.logoOpacity,
          }}
        />
      </div>

      <div className="workContent">
        <div className="workText">
          {item.tag.map((line) => (
            <div key={line}>{line}</div>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

// How centred a card is, 0 (a full step away or more) to 1 (dead centre), on a
// smoothstep curve so it holds its size for a beat at the centre and hands over
// quickly in between. Card i sits at the centre when x === -i * step.
function useCentred(x, index, step) {
  return useTransform(x, (value) => {
    if (!step) return 0;
    const distance = Math.abs(value + index * step) / step;
    const t = distance >= 1 ? 0 : 1 - distance;
    return t * t * (3 - 2 * t);
  });
}

/* Sideways scroll ----------------------------------------------------------
   Ported from components/Work/useSidewaysScroll.js. Only this section uses it,
   so it stays here rather than going into Primitives.tsx. */

// Velocity retained per millisecond once the finger lifts, matching the rate
// UIScrollView decelerates at — the glide has to feel like the one every other
// scroller on the phone has, or intercepting the gesture reads as a dead spot.
const FRICTION = 0.998;
// px/ms. Below this the glide is moving less than a pixel every few frames, so
// it is finished.
const MIN_VELOCITY = 0.05;
// A finger that came to rest before lifting is placing the track, not flicking
// it, so a gap this long since the last move throws the velocity away.
const PAUSE_MS = 80;

// Over a section whose cards pan sideways, a sideways gesture is the natural
// way to ask them to move — but the pan is driven by the page's vertical
// scroll, so on its own that gesture either does nothing or drags the document
// sideways. Feeding the horizontal delta back into window.scrollBy puts both
// gestures on the same track, and keeps the pan scrubbed by the scrollbar
// rather than opening a second, out-of-sync way to move the cards.
//
// Paired with `touch-action: pan-y pinch-zoom` on .workScrollContainer in the
// sheet: it stops the browser claiming a horizontal drag for itself, which
// keeps touchmove cancelable so this can take the gesture over.
function useSidewaysScroll(ref, active) {
  useEffect(() => {
    if (!active) return;
    const el = ref.current;
    if (!el) return;

    // `instant` overrides the global `scroll-behavior: smooth`: a gesture
    // arrives as a stream of small deltas, and animating each one would leave
    // every step fighting the last instead of tracking the hand.
    const scrollByInstant = (dy) =>
      window.scrollBy({ top: dy, behavior: "instant" });

    // Preventing the touch takes the browser's own momentum with it, so the
    // drag has to hand its speed to a glide of ours or the track stops dead
    // under the finger. Positive velocity is the same sense as a scroll delta:
    // the page moving down, the cards moving left.
    let velocity = 0;
    let lastMove = 0;
    let frame = 0;

    const stopGlide = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    };

    const startGlide = () => {
      let previous = performance.now();
      // window.scrollBy lands on whole pixels, so a slow glide would round its
      // way to a standstill; the fraction is carried into the next frame.
      let carry = 0;
      const step = (now) => {
        // A frame dropped mid-glide would otherwise arrive as one long jump.
        const elapsed = Math.min(now - previous, 32);
        previous = now;
        velocity *= FRICTION ** elapsed;
        if (Math.abs(velocity) < MIN_VELOCITY) return stopGlide();

        carry += velocity * elapsed;
        const whole = Math.trunc(carry);
        carry -= whole;
        const before = window.scrollY;
        scrollByInstant(whole);
        // Nothing moved, so the glide has run into the end of the document —
        // keep going and it spins until friction alone stops it.
        if (whole !== 0 && Math.abs(window.scrollY - before) < 0.5) {
          return stopGlide();
        }
        frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    };

    // Vertical-dominant wheels already do the right thing; only take over when
    // the gesture is mostly sideways (trackpad pan, shift + wheel).
    const onWheel = (e) => {
      stopGlide();
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      scrollByInstant(e.deltaX);
    };

    // Touch has no deltas, so the axis is locked once at the start of a drag
    // and held for the rest of it — re-deciding per move would let a diagonal
    // swipe flicker between scrolling the page and being intercepted.
    let originX = 0;
    let originY = 0;
    let lastX = 0;
    let axis = null;

    const onTouchStart = (e) => {
      // A finger down on a moving track catches it, as it would in any scroller.
      stopGlide();
      velocity = 0;
      const touch = e.touches[0];
      originX = lastX = touch.clientX;
      originY = touch.clientY;
      lastMove = performance.now();
      axis = null;
    };

    const onTouchMove = (e) => {
      const touch = e.touches[0];
      if (!axis) {
        const dx = touch.clientX - originX;
        const dy = touch.clientY - originY;
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
        axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      }
      if (axis !== "x") return;
      if (e.cancelable) e.preventDefault();
      // Dragging left pulls the track left, which is the same direction the
      // cards travel as the page scrolls down.
      const delta = lastX - touch.clientX;
      scrollByInstant(delta);
      lastX = touch.clientX;

      const now = performance.now();
      const elapsed = now - lastMove;
      lastMove = now;
      // Weighted towards the newest sample so a flick at the end of a slow drag
      // still launches, but not purely it — a single jittery frame would then
      // set the whole glide.
      if (elapsed > 0) velocity = 0.8 * (delta / elapsed) + 0.2 * velocity;
    };

    const onTouchEnd = () => {
      if (axis !== "x") return;
      if (performance.now() - lastMove > PAUSE_MS) velocity = 0;
      if (Math.abs(velocity) >= MIN_VELOCITY) startGlide();
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    el.addEventListener("touchcancel", onTouchEnd, { passive: true });
    return () => {
      stopGlide();
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [ref, active]);
}
