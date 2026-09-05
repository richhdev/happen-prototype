"use client";
import { useEffect } from "react";

// Over a section whose cards pan sideways, a sideways gesture is the natural
// way to ask them to move — but the pan is driven by the page's vertical
// scroll, so on its own that gesture either does nothing or drags the document
// sideways. Feeding the horizontal delta back into window.scrollBy puts both
// gestures on the same track, and keeps the pan scrubbed by the scrollbar
// rather than opening a second, out-of-sync way to move the cards.
//
// Pair this with `touch-action: pan-y pinch-zoom` on the same element: it stops
// the browser claiming a horizontal drag for itself, which keeps touchmove
// cancelable so this can take the gesture over.
export function useSidewaysScroll(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // `instant` overrides the global `scroll-behavior: smooth`: a gesture
    // arrives as a stream of small deltas, and animating each one would leave
    // every step fighting the last instead of tracking the hand.
    const scrollByInstant = (dy) =>
      window.scrollBy({ top: dy, behavior: "instant" });

    // Vertical-dominant wheels already do the right thing; only take over when
    // the gesture is mostly sideways (trackpad pan, shift + wheel).
    const onWheel = (e) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      scrollByInstant(e.deltaX);
    };

    // Touch has no deltas, so the axis is locked once at the start of a drag
    // and held for the rest of it — re-deciding per move would let a diagonal
    // swipe flicker between scrolling the page and being intercepted.
    let originX = 0;
    let originY = 0;
    let lastX = 0;
    let axis = null;

    const onTouchStart = (e) => {
      const touch = e.touches[0];
      originX = lastX = touch.clientX;
      originY = touch.clientY;
      axis = null;
    };

    const onTouchMove = (e) => {
      const touch = e.touches[0];
      if (!axis) {
        const dx = touch.clientX - originX;
        const dy = touch.clientY - originY;
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
        axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      }
      if (axis !== "x") return;
      if (e.cancelable) e.preventDefault();
      // Dragging left pulls the track left, which is the same direction the
      // cards travel as the page scrolls down.
      scrollByInstant(lastX - touch.clientX);
      lastX = touch.clientX;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
    };
  }, [ref]);
}
