// All site content + the asset() helper.
// asset() prefixes NEXT_PUBLIC_BASE_PATH so the same paths work at the domain
// root (Vercel) or under a /repo sub-path (GitHub Pages).
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const asset = (p) => `${BASE}${p}`;

// Shared cubic-bezier easing used across every animation.
export const EASE = [0.16, 1, 0.3, 1];
