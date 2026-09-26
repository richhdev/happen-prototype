import { addPropertyControls, ControlType } from "framer";

// Appended to framer/Vendors.tsx by scripts/build-framer.mjs. Both states live
// in one file because they come from one source file; VendorsClosed.tsx is a
// re-export so the instance already in the Framer page keeps resolving.
addPropertyControls(Vendors, {
  heading: {
    type: ControlType.String,
    title: "Heading",
    defaultValue: DEFAULTS.heading,
  },
  body: {
    type: ControlType.String,
    title: "Body",
    defaultValue: DEFAULTS.body,
    displayTextArea: true,
  },
  card1Name: {
    type: ControlType.String,
    title: "Card 1 name",
    defaultValue: DEFAULTS.card1Name,
    description: "Alt text for the logo. Leave empty to hide this card.",
  },
  card1Logo: {
    type: ControlType.Image,
    title: "Card 1 logo",
    defaultValue: DEFAULTS.card1Logo,
    description: "Capped at 256 × 50, and at 188 × 44 below 1200px.",
  },
  card1Cta: {
    type: ControlType.String,
    title: "Card 1 CTA",
    defaultValue: DEFAULTS.card1Cta,
  },
  card1Link: {
    type: ControlType.String,
    title: "Card 1 link",
    defaultValue: DEFAULTS.card1Link,
  },
  card2Name: {
    type: ControlType.String,
    title: "Card 2 name",
    defaultValue: DEFAULTS.card2Name,
    description: "Alt text for the logo. Leave empty to hide this card.",
  },
  card2Logo: {
    type: ControlType.Image,
    title: "Card 2 logo",
    defaultValue: DEFAULTS.card2Logo,
    description: "Capped at 256 × 50, and at 188 × 44 below 1200px.",
  },
  card2Cta: {
    type: ControlType.String,
    title: "Card 2 CTA",
    defaultValue: DEFAULTS.card2Cta,
  },
  card2Link: {
    type: ControlType.String,
    title: "Card 2 link",
    defaultValue: DEFAULTS.card2Link,
  },
  newTab: {
    type: ControlType.Boolean,
    title: "New tab",
    defaultValue: true,
  },
});

addPropertyControls(VendorsClosed, {
  heading: {
    type: ControlType.String,
    title: "Heading",
    defaultValue: CLOSED_DEFAULTS.heading,
  },
  body: {
    type: ControlType.String,
    title: "Body",
    defaultValue: CLOSED_DEFAULTS.body,
    displayTextArea: true,
  },
  copy: {
    type: ControlType.String,
    title: "Card copy",
    defaultValue: CLOSED_DEFAULTS.copy,
    displayTextArea: true,
    description: "The message in place of the event cards.",
  },
  cta: {
    type: ControlType.String,
    title: "CTA",
    defaultValue: CLOSED_DEFAULTS.cta,
  },
  link: {
    type: ControlType.Link,
    title: "Link",
    defaultValue: CLOSED_DEFAULTS.link,
    description: "The expression-of-interest form.",
  },
  newTab: {
    type: ControlType.Boolean,
    title: "New tab",
    defaultValue: true,
  },
});
