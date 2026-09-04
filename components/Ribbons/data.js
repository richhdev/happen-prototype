import { asset } from "@/lib/data";

// Every ribbon on the page is one of two pieces of art, placed at a different
// size, rotation and flip. Exported unrotated from the two Figma nodes that
// carry no rotation of their own (691:4747 and 691:4746), so the rest are
// reachable with a CSS transform rather than five separate exports.
const LOOP = asset("/assets/ribbon-loop.webp");
const OVAL = asset("/assets/ribbon-oval.webp");

// Lifted from the wide Figma frame (node 691:4739), which is deliberately
// 4709px wide around the same 1200px content column the site uses — it exists
// to show how far past the viewport the ribbons run.
//
//   x        centre of the unrotated art, offset from the page's centre line,
//            so `left: calc(50% + x)` reproduces the design at any width and
//            the art bleeds off the edges the way the frame shows.
//   y        centre of the art below the top edge of the section it is keyed
//            to. Keyed to a section rather than an absolute page offset
//            because our sections are not the heights the frame assumes —
//            Services alone is several times taller once it is scrolling.
//   width /  the art's size before rotation. The rotated bounding box the
//   height   frame reports falls out of these, so it isn't stored.
export const RIBBONS = {
  events: {
    src: LOOP,
    width: 1885,
    height: 2020,
    x: 819.5,
    y: 526.5,
    rotate: -90,
    flip: true,
  },
  // Keyed to the top of Services rather than into Work, where the design puts
  // its centre: Work's red panel is full-bleed here, so anything behind it is
  // simply gone. This is the same boundary, read from the other side.
  services: {
    src: LOOP,
    width: 1321.973,
    height: 1416.742,
    x: -957.278,
    y: -195,
    rotate: -52.35,
  },
  artists: {
    src: OVAL,
    width: 1874,
    height: 1353,
    x: -1165.5,
    y: 509.5,
    rotate: 0,
  },
  about: {
    src: LOOP,
    width: 2116,
    height: 2267,
    x: 700.5,
    y: 394.5,
    rotate: 0,
  },
  instagram: {
    src: OVAL,
    width: 2052.808,
    height: 1481.992,
    x: -640.333,
    y: 227.6,
    rotate: 89.2,
  },
};
