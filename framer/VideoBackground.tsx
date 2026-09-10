// @ts-nocheck
// Last changed 2026-09-10 · hand-written, re-paste into Framer after any edit.
// Plain JavaScript in a .tsx file, because Framer's code editor only makes
// .tsx. Nothing here is typed, and the imports resolve inside Framer rather
// than in this repo, so the checker has nothing useful to say about it.
//
// Ported from components/VideoBackground/VideoBackground.jsx. Paste into Framer
// as a code file named VideoBackground.tsx.
//
// The .videoBackgroundContainer and .videoBackgroundVideo rules already ship in
// GlobalStylesheet.tsx and head.html, so nothing here needs the sheet recompiled.

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { RenderTarget } from "framer"
import { injectHappenCSS } from "./GlobalStylesheet.tsx"
import { asset } from "./Primitives.tsx"

injectHappenCSS()

const POSTER = asset("/assets/video-background-poster.jpg")
const WEBM = asset("/assets/video-background.webm")
const MP4 = asset("/assets/video-background.mp4")

// Framer wraps every code component in a frame, and a transformed ancestor
// turns position:fixed into position:absolute against that frame. The video
// would then scroll away with the section it was dropped into. Portalling to
// document.body is the same escape hatch PORTING.md prescribes for the nav.
//
// The stylesheet puts the container at z-index:0, so what sits above it is
// decided by document order and by whether the page content is positioned.
// Framer gives neither guarantee: it paints the page background on its own
// #main wrapper, which is opaque and in flow, so it covers the video whatever
// the video's z-index is. These rules move the colour onto body, where it
// propagates to the canvas and paints behind everything, and lift #main into
// the positioned layer above the video. Scoped to the published page — the
// canvas has no #main.
const STACKING_FIX = `
body { background: var(--color-charcoal); }
#main { background: transparent; position: relative; z-index: 1; }
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
      poster={POSTER}
      // autoPlay makes browsers fetch enough to start regardless, so this only
      // does anything on the canvas, where the video is left paused.
      preload="metadata"
    >
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

  // createPortal has no server to run on, and Framer server-renders the markup.
  // Nothing paints until the host exists, which is invisible: body is already
  // charcoal, the same colour the container paints behind the video.
  //
  // The host is prepended rather than appended. At z-index 0 the video would
  // otherwise be a later sibling of #main and paint straight over the page.
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

  // On the canvas document.body is the Framer editor, so a fixed full-screen
  // portal would cover the whole UI. Render in place instead, and leave the
  // video paused so the editor is not looping it behind your work.
  if (onCanvas) {
    return (
      <div
        className="videoBackgroundContainer"
        aria-hidden="true"
        style={{ position: "absolute" }}
      >
        <Video playing={false} />
      </div>
    )
  }

  if (!host) return null

  return createPortal(
    <div className="videoBackgroundContainer" aria-hidden="true">
      <Video playing={true} />
    </div>,
    host,
  )
}
