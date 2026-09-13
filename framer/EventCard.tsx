// @ts-nocheck
// Last changed 2026-09-14 · hand-written, re-paste into Framer after any edit.
// Plain JavaScript in a .tsx file, because Framer's code editor only makes
// .tsx. Nothing here is typed, and the imports resolve inside Framer rather
// than in this repo, so the checker has nothing useful to say about it.
//
// Ported from the EventCard in components/Events/Events.jsx. Paste into Framer
// as a code file named EventCard.tsx.
//
// One card, on its own, with every piece of its content on a property control
// so it can be filled in from the Framer properties panel — and, more to the
// point, bound field by field to a CMS collection. The Events section is built
// natively in Framer, and this is the card placed inside its card container:
// bind Image → image, Title → title, Date → date and so on, and the card below
// is the layout. `Events.tsx` in this repo imports the same component for its
// placeholder events, but that file is not pasted into Framer.
//
// Paste order matters: this file imports Primitives.tsx and
// GlobalStylesheet.tsx, so paste those first, then EventCard.
//
// Two things here are not a plain card and are worth knowing before editing:
//
//   1. Sizing. `.eventsCard` carries its own fluid width — clamp(211px, …,
//      360px) across a 390→1200px viewport — and an aspect-ratio of 360/457
//      for the height. Framer's own width and height win when they are set to
//      a concrete value, which is what a CMS list wants: Fill the column and
//      let the aspect-ratio take the height. Left on auto, the stylesheet's
//      clamp decides, and the card matches the Next site exactly — except
//      from 1024px up, where the stylesheet makes it width 100% for the
//      desktop grid. So in a Desktop grid set it to Fill, and in a
//      horizontal scroll stack leave it on auto. Whatever Framer asks for,
//      the stylesheet caps it at the Figma size, 381 × 483. The container
//      settings on each breakpoint are in PORTING.md under Events.
//   2. Sold out. The event keeps its real ticket link in the markup and the
//      button is dimmed and made unclickable by `.eventsCtaSoldOut`, rather
//      than the link being removed. The button label changes to "Sold out" as
//      well, so the CTA text control hides itself in that state.

import { addPropertyControls, ControlType } from "framer"
import { injectHappenCSS } from "./GlobalStylesheet.tsx"
import {
  asset,
  Heading4,
  TextSmall,
  TextMedium,
  Badge,
  ButtonOutlineMedium,
} from "./Primitives.tsx"

injectHappenCSS()

// Three states, each a badge colour and a label. `soldout` is the only one
// that changes the button as well as the badge.
//
// The lookup falls back to `upcoming` rather than indexing straight in. The
// status control below is an enum, so nothing in Framer can miss — but a CMS
// field bound to it is free text on the collection side, and a stray "Onsale"
// would otherwise throw while destructuring undefined and take the whole
// collection list down with it.
const STATUSES = {
  upcoming: { label: "Upcoming", color: "charcoal" },
  onsale: { label: "On sale", color: "orange" },
  soldout: { label: "Sold out", color: "red", soldout: true },
}

// What the canvas shows before anything is filled in or bound. A real event
// rather than lorem, so a card dragged out of the Insert panel looks like the
// site instead of like a placeholder someone forgot to replace.
//
// Written once and read twice: as `defaultValue` on the controls below, which
// is what fills the Framer properties panel, and as the default parameters in
// the signature, which is what a card rendered from code gets. Not
// `EventCard.defaultProps` — React 19 ignores that on a function component and
// warns, and this repo is on 19 even if Framer is not.
const DEFAULTS = {
  image: asset("/assets/event-chapter-nye.webp"),
  status: "upcoming",
  date: "31st December 2026",
  title: "Chapter NYE 2026",
  description:
    "We've got big plans for NYE 2026! Sign up to be the first to hear exclusive news about Chapter NYE 2026.",
  cta: "Pre register",
  link: "https://happengroup.fillout.com/t/fQhTFKa2Ntus",
}

// Framer hands its sizing down through `style`. In auto mode the values it
// sends are keywords rather than lengths, and letting one of those through
// would beat `.eventsCard`'s clamp() width and its aspect-ratio, collapsing
// the card to the width of its longest line. So a concrete width or height
// from Framer is applied and a keyword is dropped, which leaves the stylesheet
// in charge exactly when Framer has nothing specific to say.
const INTRINSIC = ["auto", "min-content", "max-content", "fit-content", ""]

function layoutStyle(style) {
  if (!style) return undefined
  const { width, height, ...rest } = style
  return {
    ...rest,
    ...(INTRINSIC.includes(width) || width == null ? null : { width }),
    ...(INTRINSIC.includes(height) || height == null ? null : { height }),
  }
}

// ControlType.Image gives a plain URL string and ControlType.ResponsiveImage
// gives { src, srcSet, alt }. The control below is the responsive one, so the
// srcSet is what Framer and the CMS actually serve; the string branch is for a
// URL passed in from code, which is how Events.tsx passes its four.
function imageProps(image) {
  if (!image) return { src: undefined }
  if (typeof image === "string") return { src: image }
  return { src: image.src, srcSet: image.srcSet }
}

/**
 * Width and height both accept anything Framer offers. Dropped on a canvas it
 * arrives at the 360 × 457 it is drawn at in Figma; in a collection list set
 * the width to Fill and leave the height alone, and the aspect-ratio in the
 * stylesheet keeps the proportion.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 * @framerIntrinsicWidth 360
 * @framerIntrinsicHeight 457
 */
export default function EventCard({
  image = DEFAULTS.image,
  imagePosition = "",
  status = DEFAULTS.status,
  date = DEFAULTS.date,
  title = DEFAULTS.title,
  description = DEFAULTS.description,
  cta = DEFAULTS.cta,
  link = DEFAULTS.link,
  newTab = true,
  className,
  style,
  ...rest
}) {
  const { label, color, soldout } = STATUSES[status] ?? STATUSES.upcoming
  const { src, srcSet } = imageProps(image)

  return (
    <article
      className={`eventsCard ${className ?? ""}`}
      style={layoutStyle(style)}
      {...rest}
    >
      {/* `imagePosition` is the escape hatch for a badly framed poster — the
          same job `event.crop` does in the Next app, narrowed to the one
          property anybody ever reached for it with. Empty means centred, which
          is what object-fit: cover already does. */}
      <img
        src={src}
        srcSet={srcSet}
        alt=""
        className="eventsImage"
        style={imagePosition ? { objectPosition: imagePosition } : undefined}
        loading="lazy"
      />

      {/* Sits above the image and carries the gradient that makes the copy
          readable, clear at the top and solid charcoal at the bottom. */}
      <div className="eventsOverlay">
        {label && <Badge color={color}>{label}</Badge>}

        {/* margin-top: auto here is what pushes everything below it to the
            bottom of the card, so cards with shorter copy still line up. */}
        <div className="eventsMeta">
          <TextSmall className="eventsDate">{date}</TextSmall>
          <Heading4 as="h3" className="eventsTitle">
            {title}
          </Heading4>
        </div>

        {/* Hidden under 768px — the card is too short to carry it there. */}
        <TextMedium className="eventsDescription">{description}</TextMedium>

        <ButtonOutlineMedium
          href={link}
          rel={newTab ? "noopener noreferrer" : undefined}
          target={newTab ? "_blank" : undefined}
          className={soldout ? "eventsCtaSoldOut" : undefined}
          aria-disabled={soldout || undefined}
        >
          {soldout ? "Sold out" : cta}
        </ButtonOutlineMedium>
      </div>
    </article>
  )
}

addPropertyControls(EventCard, {
  image: {
    type: ControlType.ResponsiveImage,
    title: "Image",
    // A ResponsiveImage control takes the { src } shape, not a bare URL.
    defaultValue: { src: DEFAULTS.image },
    description: "Fills the card. Cropped to 360 × 457.",
  },
  imagePosition: {
    type: ControlType.String,
    title: "Crop",
    placeholder: "center",
    description: "object-position, e.g. `50% 20%`. Blank centres it.",
  },
  status: {
    type: ControlType.Enum,
    title: "Status",
    defaultValue: DEFAULTS.status,
    options: ["upcoming", "onsale", "soldout"],
    // A dropdown rather than a segmented control: three labels this long get
    // truncated to nothing in the width the panel gives them.
    optionTitles: ["Upcoming", "On sale", "Sold out"],
  },
  date: {
    type: ControlType.String,
    title: "Date",
    defaultValue: DEFAULTS.date,
  },
  title: {
    type: ControlType.String,
    title: "Title",
    defaultValue: DEFAULTS.title,
  },
  description: {
    type: ControlType.String,
    title: "Description",
    defaultValue: DEFAULTS.description,
    displayTextArea: true,
    description: "Hidden below 768px, where the card is too short for it.",
  },
  cta: {
    type: ControlType.String,
    title: "CTA",
    defaultValue: DEFAULTS.cta,
    // Sold out overrides the label, so the field would be a lie on screen.
    hidden: (props) => props.status === "soldout",
  },
  link: {
    type: ControlType.Link,
    title: "Link",
    defaultValue: DEFAULTS.link,
    description: "Kept on sold-out events too — the button is dimmed, not cut.",
  },
  newTab: {
    type: ControlType.Boolean,
    title: "New tab",
    defaultValue: true,
  },
})
