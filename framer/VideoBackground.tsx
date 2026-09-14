// @ts-nocheck
// Last changed 2026-09-14 · hand-written, re-paste into Framer after any edit.
// Ported from components/VideoBackground/VideoBackground.jsx.
//
// The portrait poster swap lives in the sheet (.videoBackgroundContainer), so
// re-paste GlobalStylesheet.tsx alongside this file.

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { RenderTarget } from "framer"
import { injectHappenCSS } from "./GlobalStylesheet.tsx"
import { asset } from "./Primitives.tsx"

injectHappenCSS()

const WEBM = asset("/assets/video-background-v2.webm")
const MP4 = asset("/assets/video-background-v2.mp4")
const MOBILE_WEBM = asset("/assets/video-background-v2-mobile.webm")
const MOBILE_MP4 = asset("/assets/video-background-v2-mobile.mp4")
const PORTRAIT = "(orientation: portrait)"

// Posters are painted by the container (poster="" can't take a media query);
// url() in the sheet can't be rewritten by asset().
const POSTER_VARS = {
  "--video-background-poster": `url(${asset("/assets/video-background-v2-poster.jpg")})`,
  "--video-background-poster-mobile": `url(${asset("/assets/video-background-v2-mobile-poster.jpg")})`,
}

// The video sits at -2 and the ribbons at -1, below zero because Framer wraps
// every section in its own divs and gives them whatever z-index it likes — on
// the published page the wrapper holding the whole site is `z-index: auto`
// while one of its children is `z-index: 3`. Nothing positive orders against
// that reliably; a negative level sits under every in-flow block regardless.
//
// The price is that a negative level paints behind the root element's
// background but in front of any in-flow block's, so anything opaque and in
// flow hides it. Framer's page background colour is exactly that, and it lands
// in two places: on `body`, via a rule written `html body`, and on the one
// wrapper div inside `#main`. These rules move the colour to `html`, where it
// becomes the canvas, and clear it from both. `html body` and `!important` are
// deliberate — a bare `body` rule loses on specificity and silently does
// nothing. `.ribbonsLayer` is excluded because it portals into `#main` too and
// its art is a background image.
//
// Only the published page gets this, so the Framer editor keeps showing the
// page background colour you set. Set it and design against it.
//
// #main is positioned so the ribbons sheet can size itself against the page,
// but never given a z-index: that would open a stacking context and trap the
// sheet above the video. Keep in step with .pageMain in app/page.module.css
// and the matching rule in Ribbons.tsx.
const STACKING_FIX = `
html { background: var(--color-charcoal) !important; }
html body { background: transparent !important; }
#main { background: transparent !important; position: relative; }
#main > div:not(.ribbonsLayer) { background: transparent !important; }
`

function useStackingFix(active) {
  useEffect(() => {
    if (!active) return
    const el = document.createElement("style")
    el.setAttribute("data-happen-video-bg", "")
    el.textContent = STACKING_FIX
    document.head.appendChild(el)
    return () => el.remove()
  }, [active])
}

function Video({ playing }) {
  return (
    <video
      className="videoBackgroundVideo"
      autoPlay={playing}
      loop
      muted
      playsInline
      // autoPlay makes browsers fetch enough to start regardless, so this only
      // does anything on the canvas, where the video is left paused.
      preload="metadata"
    >
      {/* First matching source wins, and only at load: rotating won't swap. */}
      <source src={MOBILE_WEBM} type="video/webm" media={PORTRAIT} />
      <source src={MOBILE_MP4} type="video/mp4" media={PORTRAIT} />
      <source src={WEBM} type="video/webm" />
      <source src={MP4} type="video/mp4" />
    </video>
  )
}

/**
 * Fills whatever it is dropped into on the canvas so it can be seen and placed.
 * On the published page it leaves the layout entirely and covers the viewport,
 * so give it any size you like and put it first in the page stack.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */
export default function VideoBackground() {
  const onCanvas = RenderTarget.current() === RenderTarget.canvas

  // A transformed Framer wrapper turns position:fixed into absolute, so the
  // video would scroll away with the section it was dropped into. Portal to
  // body, as PORTING.md prescribes for the nav.
  //
  // The sheet puts the container at z-index -2, under the ribbons at -1 and the
  // content at 0 — see STACKING_FIX above for why the backdrop sits below zero.
  // Prepending the host is belt and braces: at -2 it stays under the content
  // wherever it lands, but before #main it is still correct if that number
  // ever changes.
  const [host, setHost] = useState(null)
  useEffect(() => {
    if (onCanvas) return
    const el = document.createElement("div")
    el.setAttribute("data-happen-video-bg-host", "")
    document.body.prepend(el)
    setHost(el)
    return () => el.remove()
  }, [onCanvas])

  useStackingFix(!onCanvas && host !== null)

  // On the canvas body is the Framer editor, so a fixed full-screen portal
  // would cover the whole UI. Render in place, paused, so the editor is not
  // looping it behind your work.
  if (onCanvas) {
    return (
      <div
        className="videoBackgroundContainer"
        aria-hidden="true"
        style={{ ...POSTER_VARS, position: "absolute" }}
      >
        <Video playing={false} />
      </div>
    )
  }

  // createPortal has no server to run on, so nothing paints until the host
  // exists. Invisible: the page is already charcoal.
  if (!host) return null

  return createPortal(
    <div
      className="videoBackgroundContainer"
      aria-hidden="true"
      style={POSTER_VARS}
    >
      <Video playing={true} />
    </div>,
    host,
  )
}
