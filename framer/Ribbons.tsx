// @ts-nocheck
// Last changed 2026-09-14 · hand-written, re-paste into Framer after any edit.
// Ported from components/Ribbons/Ribbons.jsx.
//
// .ribbonsLayer, .ribbonsTile, .ribbonsRibbon and the four .ribbonsPlacement*
// rules, the @supports upgrade, the @keyframes and the two --ribbon-* tokens
// all ship in the sheet. The scale is video -2, ribbons -1, content 0, mobile
// overlay 4, nav 5, nav hue guard 6, preloader 7. Paste the sheet and
// VideoBackground.tsx together — the sheet alone leaves Framer's page
// background painted over the ribbons and the video. The head stamp on the
// published page says which build is live.

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
// A namespace import, not `{ preload }`: preload is React 19 only, and a named
// import of an export 18 lacks would stop this whole file from loading.
import * as ReactDOM from "react-dom";
import { RenderTarget } from "framer";
import { injectHappenCSS } from "./GlobalStylesheet.tsx";
import { asset } from "./Primitives.tsx";

injectHappenCSS();

// Two ribbons, each in two cuts: 2000px for tablets up, 1200px for phones. A
// media query in the sheet picks which pair the placements draw, so only the
// matching URLs are ever fetched.
const ART = {
  "--ribbon-art-1-wide": `url(${asset("/assets/ribbon-1.webp")})`,
  "--ribbon-art-2-wide": `url(${asset("/assets/ribbon-2.webp")})`,
  "--ribbon-art-1-narrow": `url(${asset("/assets/ribbon-1-mobile.webp")})`,
  "--ribbon-art-2-narrow": `url(${asset("/assets/ribbon-2-mobile.webp")})`,
};

// How many copies of the composition are stacked down the layer. The layer
// clips whatever runs past the page, so this only has to be enough for the
// narrowest phone, where each tile is shortest and the page longest: at 320px
// the layer is ~5.3 tiles tall.
const TILE_COUNT = 6;

// The four placements in the Figma frame (871:4399) — two of each ribbon. Their
// geometry lives in the sheet; this only says which rule each one uses.
const PLACEMENTS = [
  "ribbonsPlacementA",
  "ribbonsPlacementB",
  "ribbonsPlacementC",
  "ribbonsPlacementD",
];

// The layer's height and travel are percentages, so they need a positioned
// ancestor that is the length of the page — in the Next app that is
// <main class="pageMain">, here it is Framer's #main. Positioned only: a
// z-index would open a stacking context and trap the layer above the video.
// Written against the attribute so it survives a rename of #main, and so
// VideoBackground.tsx's own #main rule cannot outrank it.
const PAGE_MAIN_FIX = `
[data-happen-page-main] { position: relative; }
`;

function findPageMain() {
  return (
    document.querySelector("#main") ||
    document.querySelector("main") ||
    document.body
  );
}

function usePageMainFix(el) {
  useEffect(() => {
    if (!el) return;
    el.setAttribute("data-happen-page-main", "");
    const style = document.createElement("style");
    style.setAttribute("data-happen-ribbons", "");
    style.textContent = PAGE_MAIN_FIX;
    document.head.appendChild(style);
    return () => {
      el.removeAttribute("data-happen-page-main");
      style.remove();
    };
  }, [el]);
}

// Firefox has no scroll timelines, so the CSS upgrade never applies there and
// the layer would sit still. This feeds the same progress value the timeline
// would have produced. Not motion's useScroll, which would run the listener in
// every browser, including the ones already doing this on the compositor.
function useScrollProgressFallback(ref, active) {
  useEffect(() => {
    if (!active) return;
    if (CSS.supports("animation-timeline: scroll()")) return;

    const layer = ref.current;
    if (!layer) return;
    let frame = 0;

    // Scroll fires faster than the screen repaints, so coalesce to one
    // write per frame
    const write = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      layer.style.setProperty(
        "--ribbon-progress",
        max > 0 ? window.scrollY / max : 0,
      );
    };
    const schedule = () => {
      frame ||= requestAnimationFrame(write);
    };

    write();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [ref, active]);
}

function Layer({ layerRef }) {
  return (
    <div ref={layerRef} className="ribbonsLayer" style={ART} aria-hidden>
      {Array.from({ length: TILE_COUNT }, (_, tile) => (
        <div key={tile} className="ribbonsTile">
          {PLACEMENTS.map((placement) => (
            <div key={placement} className={`ribbonsRibbon ${placement}`} />
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * The ribbon composition behind the whole page, drifting slower than the page
 * it sits behind. On the canvas it fills whatever it is dropped into so it can
 * be seen and placed. On the published page it leaves the layout entirely and
 * covers the page content block, so give it any size you like — where it sits
 * in the page stack makes no difference to what it does.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */
export default function Ribbons() {
  const ref = useRef(null);
  const onCanvas = RenderTarget.current() === RenderTarget.canvas;

  // The ribbons span the first screen, so they can be what Lighthouse times as
  // the page's largest paint — but as url()s behind custom properties they are
  // only found once the CSS has been applied, and then fetched at low priority.
  // These put them in the <head> at the page's own priority. The media queries
  // mirror the breakpoint in the sheet, so only the cuts that rule will use are
  // fetched. On React 18 there is no preload and this does nothing.
  for (const n of [1, 2]) {
    ReactDOM.preload?.(asset(`/assets/ribbon-${n}-mobile.webp`), {
      as: "image",
      fetchPriority: "high",
      media: "(max-width: 767.98px)",
    });
    ReactDOM.preload?.(asset(`/assets/ribbon-${n}.webp`), {
      as: "image",
      fetchPriority: "high",
      media: "(min-width: 768px)",
    });
  }

  // Framer's component wrapper is neither the length of the page nor the
  // stacking context the layer needs, so rendering in place would size the art
  // to the wrapper. Portal out, as PORTING.md prescribes — into #main rather
  // than body, since this layer is measured against the page, not the viewport.
  const [pageMain, setPageMain] = useState(null);
  useEffect(() => {
    if (onCanvas) return;
    setPageMain(findPageMain());
  }, [onCanvas]);

  usePageMainFix(onCanvas ? null : pageMain);
  useScrollProgressFallback(ref, !onCanvas && pageMain !== null);

  // On the canvas body is the Framer editor itself, so a full-page layer would
  // cover the whole UI. Render in place, inside a positioned box the percentage
  // height can resolve against.
  if (onCanvas) {
    return (
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <Layer layerRef={ref} />
      </div>
    );
  }

  // createPortal has no server to run on, so nothing paints until the effect
  // finds the host. Invisible: the page behind it is already charcoal.
  if (!pageMain) return null;

  // Straight into #main, not a host div — a host would need a position or
  // z-index that opens a stacking context between the layer and the sections.
  return createPortal(<Layer layerRef={ref} />, pageMain);
}
