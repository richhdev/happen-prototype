import { asset } from "@/components/Primitives";

// Two fixed card slots rather than an array, for the same reason as Hosts:
// Framer's on-page editor only lists simple controls, so an Array control never
// appears there. Three is the cap anyway — a fourth scrolls the row sideways on
// desktop, which the layout was never drawn for. A slot with an empty name is
// not rendered.
export const DEFAULTS = {
  heading: "Festival retail vendors",
  body: "We’re on the lookout for market stall holders to join us at the festival and help bring the space to life.",
  card1Name: "Good Things Festival",
  card1Logo: asset("/assets/client-good-things.svg"),
  card1Cta: "Get your stall",
  card1Link: "https://form.jotform.com/261311126413846",
  card2Name: "Beyond The Valley",
  card2Logo: asset("/assets/client-beyond-the-valley.svg"),
  card2Cta: "Get your stall",
  card2Link: "https://form.jotform.com/261448233625861",
};

// Between intakes. Same shell, same id, same backdrop; the card row becomes one
// card with a generic message and a CTA to an expression-of-interest form.
export const CLOSED_DEFAULTS = {
  heading: DEFAULTS.heading,
  body: DEFAULTS.body,
  copy: "Register your interest and we’ll be in touch.",
  cta: "Register",
  link: "https://happengroup.fillout.com/t/kCuR3PBPduus",
};
