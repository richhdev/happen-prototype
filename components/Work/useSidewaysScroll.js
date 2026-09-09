"use client";
import { useEffect } from "react";

// Velocity retained per millisecond once the finger lifts, matching the rate
// UIScrollView decelerates at — the glide has to feel like the one every other
// scroller on the phone has, or intercepting the gesture reads as a dead spot.
const FRICTION = 0.998;
// px/ms. Below this the glide is moving less than a pixel every few frames, so
// it is finished.
const MIN_VELOCITY = 0.05;
// A finger that came to rest before lifting is placing the track, not flicking
// it, so a gap this long since the last move throws the velocity away.
const PAUSE_MS = 80;

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

    // Preventing the touch takes the browser's own momentum with it, so the
    // drag has to hand its speed to a glide of ours or the track stops dead
    // under the finger. Positive velocity is the same sense as a scroll delta:
    // the page moving down, the cards moving left.
    let velocity = 0;
    let lastMove = 0;
    let frame = 0;

    const stopGlide = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    };

    const startGlide = () => {
      let previous = performance.now();
      // window.scrollBy lands on whole pixels, so a slow glide would round its
      // way to a standstill; the fraction is carried into the next frame.
      let carry = 0;
      const step = (now) => {
        // A frame dropped mid-glide would otherwise arrive as one long jump.
        const elapsed = Math.min(now - previous, 32);
        previous = now;
        velocity *= FRICTION ** elapsed;
        if (Math.abs(velocity) < MIN_VELOCITY) return stopGlide();

        carry += velocity * elapsed;
        const whole = Math.trunc(carry);
        carry -= whole;
        const before = window.scrollY;
        scrollByInstant(whole);
        // Nothing moved, so the glide has run into the end of the document —
        // keep going and it spins until friction alone stops it.
        if (whole !== 0 && Math.abs(window.scrollY - before) < 0.5) {
          return stopGlide();
        }
        frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    };

    // Vertical-dominant wheels already do the right thing; only take over when
    // the gesture is mostly sideways (trackpad pan, shift + wheel).
    const onWheel = (e) => {
      stopGlide();
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
      // A finger down on a moving track catches it, as it would in any scroller.
      stopGlide();
      velocity = 0;
      const touch = e.touches[0];
      originX = lastX = touch.clientX;
      originY = touch.clientY;
      lastMove = performance.now();
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
      const delta = lastX - touch.clientX;
      scrollByInstant(delta);
      lastX = touch.clientX;

      const now = performance.now();
      const elapsed = now - lastMove;
      lastMove = now;
      // Weighted towards the newest sample so a flick at the end of a slow drag
      // still launches, but not purely it — a single jittery frame would then
      // set the whole glide.
      if (elapsed > 0) velocity = 0.8 * (delta / elapsed) + 0.2 * velocity;
    };

    const onTouchEnd = () => {
      if (axis !== "x") return;
      if (performance.now() - lastMove > PAUSE_MS) velocity = 0;
      if (Math.abs(velocity) >= MIN_VELOCITY) startGlide();
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    el.addEventListener("touchcancel", onTouchEnd, { passive: true });
    return () => {
      stopGlide();
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [ref]);
}
