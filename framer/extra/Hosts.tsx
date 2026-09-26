import { addPropertyControls, ControlType } from "framer";

// Appended to framer/Hosts.tsx by scripts/build-framer.mjs. Every field is a
// plain string control, two card slots flattened rather than an Array, because
// Framer's on-page editor only lists simple controls.
addPropertyControls(Hosts, {
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
  card1Title: {
    type: ControlType.String,
    title: "Card 1 title",
    defaultValue: DEFAULTS.card1Title,
  },
  card1Description: {
    type: ControlType.String,
    title: "Card 1 body",
    defaultValue: DEFAULTS.card1Description,
    displayTextArea: true,
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
  card2Title: {
    type: ControlType.String,
    title: "Card 2 title",
    defaultValue: DEFAULTS.card2Title,
  },
  card2Description: {
    type: ControlType.String,
    title: "Card 2 body",
    defaultValue: DEFAULTS.card2Description,
    displayTextArea: true,
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
