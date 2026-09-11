// @ts-nocheck
// Last changed 2026-09-11 · hand-written, re-paste into Framer after any edit.
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
// The stylesheet puts the container at z-index:-2, below the ribbons sheet at
// -1 and below the content, which sits at the document's default level. A
// negative layer paints behind the root element's background but in front of
// any in-flow block's background, so anything opaque and in flow over the top
// of it hides it. Framer paints the page background on its #main wrapper, which
// is exactly that. These rules move the colour onto html, where it becomes the
// canvas and paints behind everything including the negative layers, and leave
// #main transparent and merely positioned — the same shape .pageMain has in the
// Next app. Scoped to the published page; the canvas has no #main.
//
// No z-index on #main on purpose: one would open a stacking context and trap
// the ribbons sheet, which portals into this same block, above the video rather
// than letting the two order against the root. Keep this in step with .pageMain
// in app/page.module.css and with the matching rule in Ribbons.tsx.
const STACKING_FIX = `
html { background: var(--color-charcoal); }
body { background: transparent; }
#main { background: transparent; position: relative; }
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
  // Nothing paints until the host exists, which is invisible: the canvas is
  // already charcoal, the same colour the container paints behind the video.
  //
  // The host is prepended rather than appended. Belt and braces: the container
  // is at -2, so it stays under the page wherever the host lands, but keeping
  // it before #main means it is still correct if that number ever changes.
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
