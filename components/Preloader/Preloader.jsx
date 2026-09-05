import { readFileSync } from "node:fs";
import path from "node:path";
import PreloaderOverlay from "./PreloaderOverlay";

// The logo is inlined into the document rather than pointed at with an <img>.
// A preloader has to be on screen at first paint — an <img> is a second round
// trip, so the overlay would show an empty square for exactly the moment it
// exists to cover — and an SVG loaded through <img> is its own document, so
// the page could not reach in to set the pace of the draw.
const SOURCE = path.join(process.cwd(), "public/assets/logo-draw.svg");

// The artwork carries its own 4s draw. That is the pace of a signature, not of
// a splash screen holding up a site, so the duration becomes a variable the
// overlay sets (see Preloader.module.css). Read at build time — this is a
// static export, so the file never gets opened at request time.
const DURATION_DECL = "animation-duration: 4s;";

function logoMarkup() {
  const svg = readFileSync(SOURCE, "utf8");

  if (!svg.includes(DURATION_DECL)) {
    throw new Error(
      `Preloader: expected "${DURATION_DECL}" in logo-draw.svg. The artwork's ` +
        `draw animation has been re-exported and no longer takes its duration ` +
        `from the page.`,
    );
  }

  return svg.replace(
    DURATION_DECL,
    "animation-duration: var(--preloader-draw, 4s);",
  );
}

export default function Preloader() {
  return <PreloaderOverlay logoMarkup={logoMarkup()} />;
}
