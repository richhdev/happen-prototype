// @ts-nocheck
// Last changed 2026-09-17 · hand-written, re-paste into Framer after any edit.
// Plain JavaScript in a .tsx file, because Framer's code editor only makes
// .tsx. Nothing here is typed, and the imports resolve inside Framer rather
// than in this repo, so the checker has nothing useful to say about it.
//
// Ported from components/VideoBackground/VideoBackground.jsx. Paste into Framer
// as a code file named VideoBackground.tsx.
//
// Not a section: Hero and Artists each render one inside their own scene, so
// there is no default export and nothing to put in the page stack.

import { useEffect } from "react"
import { RenderTarget } from "framer"
import { injectHappenCSS } from "./GlobalStylesheet.tsx"
import { asset } from "./Primitives.tsx"

injectHappenCSS()

// The video sits at -2 and the ribbons at -1, which only works while nothing
// between the scene and the root opens a stacking context. Measured on the
// published page on 2026-09-17: Hero's Framer container and the page wrapper
// are both `position: relative; z-index: auto`, so it holds.
//
// A negative level paints behind the root element's background but in front of
// any in-flow block's, so Framer's page background colour hides it. That colour
// lands on `body`, via a rule written `html body`, and on the one wrapper div
// inside `#main`. These rules move it to `html`, where it becomes the canvas,
// and clear it from both. `html body` and `!important` are deliberate — a bare
// `body` rule loses on specificity and silently does nothing. `.ribbonsLayer`
// is excluded because its art is a background image.
//
// #main is positioned for the ribbons sheet, but never given a z-index: that
// would open a stacking context and trap the sheet above the video. Keep in
// step with .pageMain in app/page.module.css and the matching rule in
// Ribbons.tsx.
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

/**
 * The video, filling the scene it is dropped into. It needs a positioned
 * parent that is not a stacking context — the section's own wrapper — so that
 * it can sit below the ribbons rather than only below the section.
 *
 * `name` is the base of the six files in /assets — two cuts, two formats, two
 * posters — so a section can be given a different video.
 */
export function VideoBackground({
    name = "video-background-v2",
    behindNav = false,
}) {
    const onCanvas = RenderTarget.current() === RenderTarget.canvas
    const src = (suffix) => asset(`/assets/${name}${suffix}`)

    useStackingFix(!onCanvas)

    return (
        <div
            className={`videoBackground${behindNav ? " videoBackgroundBehindNav" : ""}`}
            aria-hidden="true"
            style={{
                "--video-background-poster": `url(${src("-poster.jpg")})`,
                "--video-background-poster-mobile": `url(${src("-mobile-poster.jpg")})`,
                // The stacking fix does not run on the canvas, so at -2 the
                // page background would hide it. Under the section is enough.
                ...(onCanvas && { zIndex: "auto" }),
            }}
        >
            <div className="videoBackgroundTrack">
                <div className="videoBackgroundViewport">
                    <video
                        className="videoBackgroundVideo"
                        autoPlay={!onCanvas}
                        loop
                        muted
                        playsInline
                        preload="metadata"
                    >
                        <source
                            src={src("-mobile.webm")}
                            type="video/webm"
                            media="(orientation: portrait)"
                        />
                        <source
                            src={src("-mobile.mp4")}
                            type="video/mp4"
                            media="(orientation: portrait)"
                        />
                        <source src={src(".webm")} type="video/webm" />
                        <source src={src(".mp4")} type="video/mp4" />
                    </video>
                </div>
            </div>
        </div>
    )
}
