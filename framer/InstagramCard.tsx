// @ts-nocheck
// Last changed 2026-09-14 · hand-written, re-paste into Framer after any edit.
// Plain JavaScript in a .tsx file, because Framer's code editor only makes
// .tsx. Nothing here is typed, and the imports resolve inside Framer rather
// than in this repo, so the checker has nothing useful to say about it.
//
// Ported from components/Instagram/InstagramCard.jsx. Paste into Framer as a
// code file named InstagramCard.tsx.
//
// One square tile from the Instagram grid, with its image and its post link on
// property controls so a tile can be swapped from the properties panel when the
// feed moves on. `Instagram.tsx` imports the same component for its six tiles.
//
// Paste order matters: this file imports Primitives.tsx and
// GlobalStylesheet.tsx, so paste those first, then InstagramCard, then
// Instagram.
//
// Sizing: `.instagramCard` has an aspect-ratio of 1 and no width of its own, so
// it takes its width from whatever holds it. In a Framer grid or stack set the
// width to Fill and leave the height alone; the aspect-ratio keeps it square.

import { addPropertyControls, ControlType } from "framer"
import { asset } from "./Primitives.tsx"


// Written once and read twice: as `defaultValue` on the controls below, and as
// the default parameters in the signature. Not `defaultProps` — React 19
// ignores that on a function component.
const DEFAULTS = {
  // A neutral tile rather than a real post, so a fresh card never passes for
  // live content before its image is set.
  image: asset("/assets/insta-placeholder.svg"),
  link: "https://www.instagram.com/chapternye/p/DdNi8nPEuDA/",
}

// Framer hands its sizing down through `style`. A keyword value in auto mode
// would beat the stylesheet's aspect-ratio, so a concrete width or height is
// applied and a keyword is dropped. Same as EventCard.tsx.
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

// ControlType.ResponsiveImage gives { src, srcSet, alt }; a URL passed in from
// code, which is how Instagram.tsx passes its six, arrives as a plain string.
function imageProps(image) {
  if (!image) return { src: undefined }
  if (typeof image === "string") return { src: image }
  return { src: image.src, srcSet: image.srcSet }
}

/**
 * Dropped on a canvas it arrives at the 277 × 277 it is drawn at in Figma; in a
 * grid set the width to Fill and the aspect-ratio keeps it square.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 * @framerIntrinsicWidth 277
 * @framerIntrinsicHeight 277
 */
export default function InstagramCard({
  image = DEFAULTS.image,
  link = DEFAULTS.link,
  className,
  style,
  ...rest
}) {
  const { src, srcSet } = imageProps(image)

  return (
    <a
      className={`instagramCard ${className ?? ""}`}
      style={layoutStyle(style)}
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Happen Group Instagram post"
      {...rest}
    >
      {/* alt is empty on purpose: the link already carries the label, so
          naming the image again would read it out twice. */}
      <img
        src={src}
        srcSet={srcSet}
        alt=""
        className="instagramCardImage"
        loading="lazy"
      />
    </a>
  )
}

addPropertyControls(InstagramCard, {
  image: {
    type: ControlType.ResponsiveImage,
    title: "Image",
    // A ResponsiveImage control takes the { src } shape, not a bare URL.
    defaultValue: { src: DEFAULTS.image },
    description: "Cropped to a square.",
  },
  link: {
    type: ControlType.Link,
    title: "Link",
    defaultValue: DEFAULTS.link,
    description: "The Instagram post. Opens in a new tab.",
  },
})
