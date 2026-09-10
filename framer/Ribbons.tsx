// @ts-nocheck
// Last changed 2026-09-10 · hand-written, re-paste into Framer after any edit.
// Plain JavaScript in a .tsx file, because Framer's code editor only makes
// .tsx. Nothing here is typed, and the imports resolve inside Framer rather
// than in this repo, so the checker has nothing useful to say about it.
//
// Ported from components/Ribbons/Ribbons.jsx. Paste into Framer as a code file
// named Ribbons.tsx.
//
// The .ribbonsLayer rule, its @supports upgrade, its @keyframes and the four
// --ribbon-* tokens all ship in GlobalStylesheet.tsx and head.html, so nothing
// here needs its own copy of them — but the sheet in Framer has to be from the
// z-index renumbering of 2026-09-10 or later, or the ribbons paint over the
// sections instead of behind them. The head stamp on the published page says
// which build is actually live; anything dated earlier than that is too old.

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { RenderTarget } from "framer"
import { injectHappenCSS } from "./GlobalStylesheet.tsx"
import { asset } from "./Primitives.tsx"

injectHappenCSS()

// Two cuts of the same composition. Which one is fetched is decided by a media
// query in the sheet, not here — see the comment on .ribbonsLayer in
// happen.css. Only the URL the matching rule reads is ever requested.
const ART = {
    "--ribbon-art": `url(${asset("/assets/ribbons-layer-12.webp")})`,
    "--ribbon-art-narrow": `url(${asset(
        "/assets/ribbons-layer-9-mobile.webp"
    )})`,
}

// In the Next app this div is a child of <main class="pageMain">, and both of
// the things that make the sheet work come from that one fact.
//
// Its height is `100% * --ribbon-rate` and it travels by a percentage of its own
// height, so both resolve against main's box — the length of the page. Dropped
// anywhere without a positioned ancestor it would resolve against the viewport
// instead, and the sheet would be 70vh of art pinned near the top of the
// document rather than a full-page parallax.
//
// And pageMain is `position: relative; z-index: 3`, a stacking context holding
// the sheet at 2 and every section at 3, which is what puts the art behind the
// page and in front of the fixed video backdrop at 1.
//
// Framer has no pageMain. Its own content wrapper, #main, is the same block in
// the same place, so this gives it the same two properties. The rule is written
// against the attribute rather than against #main so that it still matches if
// Framer ever renames the wrapper — and so that VideoBackground.tsx, which sets
// its own #main rule, cannot outrank it on specificity by accident.
const PAGE_MAIN_FIX = `
[data-happen-page-main] { position: relative; z-index: 3; }
`

function findPageMain() {
    return (
        document.querySelector("#main") ||
        document.querySelector("main") ||
        document.body
    )
}

function usePageMainFix(el) {
    useEffect(() => {
        if (!el) return
        el.setAttribute("data-happen-page-main", "")
        const style = document.createElement("style")
        style.setAttribute("data-happen-ribbons", "")
        style.textContent = PAGE_MAIN_FIX
        document.head.appendChild(style)
        return () => {
            el.removeAttribute("data-happen-page-main")
            style.remove()
        }
    }, [el])
}

// Firefox has no scroll timelines — not even the `animation-timeline` property
// — so the CSS upgrade never applies there and the sheet would sit still while
// every other browser parallaxed it. This hands that one case the same
// progress the timeline would have produced, and the same stylesheet rule
// turns it into the same drift.
//
// Deliberately not motion's `useScroll`: it would run this listener in every
// browser, including the ones already doing the work on the compositor.
function useScrollProgressFallback(ref, active) {
    useEffect(() => {
        if (!active) return
        if (CSS.supports("animation-timeline: scroll()")) return

        const layer = ref.current
        if (!layer) return
        let frame = 0

        // Scroll fires faster than the screen repaints, so coalesce to one
        // write per frame
        const write = () => {
            frame = 0
            const max =
                document.documentElement.scrollHeight - window.innerHeight
            layer.style.setProperty(
                "--ribbon-progress",
                max > 0 ? window.scrollY / max : 0
            )
        }
        const schedule = () => {
            frame ||= requestAnimationFrame(write)
        }

        write()
        window.addEventListener("scroll", schedule, { passive: true })
        window.addEventListener("resize", schedule, { passive: true })
        return () => {
            cancelAnimationFrame(frame)
            window.removeEventListener("scroll", schedule)
            window.removeEventListener("resize", schedule)
        }
    }, [ref, active])
}

/**
 * One sheet of art behind the whole page, drifting slower than the page it sits
 * behind. On the canvas it fills whatever it is dropped into so it can be seen
 * and placed. On the published page it leaves the layout entirely and covers the
 * page content block, so give it any size you like — where it sits in the page
 * stack makes no difference to what it does.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */
export default function Ribbons() {
    const ref = useRef(null)
    const onCanvas = RenderTarget.current() === RenderTarget.canvas

    // Framer wraps every code component in a frame, and that frame is neither
    // the length of the page nor the stacking context the sheet needs, so
    // rendering in place would size the art to the wrapper. Portalling into the
    // page content block is the same escape hatch PORTING.md prescribes for the
    // nav and for VideoBackground — it is just aimed at #main here rather than
    // at body, because unlike those two this layer is measured against the page
    // rather than against the viewport.
    const [pageMain, setPageMain] = useState(null)
    useEffect(() => {
        if (onCanvas) return
        setPageMain(findPageMain())
    }, [onCanvas])

    usePageMainFix(onCanvas ? null : pageMain)
    useScrollProgressFallback(ref, !onCanvas && pageMain !== null)

    // On the canvas there is no #main — document.body is the Framer editor
    // itself, so aiming a full-page layer at it would cover the whole UI.
    // Render in place instead, inside a positioned box, since an absolute layer
    // with a percentage height has nothing to resolve against without one.
    if (onCanvas) {
        return (
            <div style={{ position: "relative", width: "100%", height: "100%" }}>
                <div
                    ref={ref}
                    className="ribbonsLayer"
                    style={ART}
                    aria-hidden
                />
            </div>
        )
    }

    // createPortal has no server to run on, and Framer server-renders the
    // markup, so nothing paints until the effect has found the host. That is
    // invisible: the page behind it is already charcoal.
    if (!pageMain) return null

    // Straight into #main rather than into a host div of its own. A host would
    // be an in-flow block at the end of the page, and any position or z-index
    // put on it to make the layer work would be a second stacking context
    // between the sheet and the sections it has to sit behind.
    return createPortal(
        <div ref={ref} className="ribbonsLayer" style={ART} aria-hidden />,
        pageMain
    )
}
