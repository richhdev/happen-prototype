const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const asset = (p) => `${BASE}${p}`;

// Shared cubic-bezier easing used across every animation.
export const EASE = [0.16, 1, 0.3, 1];

// The four social accounts, shared by the Instagram section (icon + label) and
// the Contact section (icon only). Spotify has no destination yet.
export const SOCIALS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/happengroupau/",
    icon: asset("/assets/icon-instagram.svg"),
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/happengroupau",
    icon: asset("/assets/icon-facebook.svg"),
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@HappenGroup",
    icon: asset("/assets/icon-youtube.svg"),
  },
  { label: "Spotify", href: "#", icon: asset("/assets/icon-spotify.svg") },
];
