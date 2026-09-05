import { asset } from "@/lib/data";

// Every ribbon on the page is one of two pieces of art, placed at a different
// size, rotation and flip. Exported unrotated from the two Figma nodes that
// carry no rotation of their own (691:4747 and 691:4746), so the rest are
// reachable with a CSS transform rather than five separate exports.
const LOOP = asset("/assets/ribbon-loop.webp");
const OVAL = asset("/assets/ribbon-oval.webp");

// Each ribbon is placed twice, because the design draws the set twice: the wide
// desktop frame (node 691:4739, deliberately 4709px wide around the same 1200px
// content column the site uses — it exists to show how far past the viewport the
// ribbons run) and the mobile frame (node 653:3771, 440px wide). Same two pieces
// of art both times, but turned further and hung further off the left edge on
// mobile, so it is its own composition rather than this one reflowed.
//
//   x        centre of the unrotated art, offset from the page's centre line,
//            so `left: calc(50% + x)` reproduces the design at any width and
//            the art bleeds off the edges the way the frame shows.
//   y        centre of the art below the top edge of the section it is keyed
//            to. Keyed to a section rather than an absolute page offset
//            because our sections are not the heights the frames assume —
//            Services alone is several times taller once it is scrolling. Runs
//            negative where the design hangs the art above its own section.
//   width /  the art's size before rotation. The rotated bounding box the
//   height   frames report falls out of these, so it isn't stored.
//
// Both sets are the frame's own px applied 1:1, so a ribbon lands exactly as
// drawn at that frame's width and creeps a little either way off it.
//
// The loop the design centres on Work is not here, in either composition: Work
// pins for its whole length, so a marker on a section edge would scroll away
// while the section stood still. It is anchored inside the section instead —
// see Work.module.css.
export const RIBBONS = {
  events: {
    src: LOOP,
    mobile: {
      width: 2258,
      height: 2420,
      x: 1094.204,
      y: 612.086,
      rotate: -76.07,
      flip: true,
    },
    desktop: {
      width: 1885,
      height: 2020,
      x: 819.5,
      y: 526.5,
      rotate: -90,
      flip: true,
    },
  },
  artists: {
    src: OVAL,
    mobile: {
      width: 1339,
      height: 967,
      x: -562.276,
      y: -244.5,
      rotate: 0,
    },
    desktop: {
      width: 1874,
      height: 1353,
      x: -1165.5,
      y: 509.5,
      rotate: 0,
    },
  },
  about: {
    src: LOOP,
    mobile: {
      width: 1978.599,
      height: 2120.441,
      x: 940.42,
      y: -95.026,
      rotate: 42.27,
    },
    desktop: {
      width: 2116,
      height: 2267,
      x: 700.5,
      y: 394.5,
      rotate: 0,
    },
  },
  instagram: {
    src: OVAL,
    mobile: {
      width: 1856.099,
      height: 1339.981,
      x: -629.747,
      y: -641.114,
      rotate: 89.2,
    },
    desktop: {
      width: 2052.808,
      height: 1481.992,
      x: -640.333,
      y: 227.6,
      rotate: 89.2,
    },
  },
};
