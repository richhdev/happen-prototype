import { addPropertyControls, ControlType } from "framer";

// Appended to framer/About.tsx by scripts/build-framer.mjs. The defaults are
// read from the same DEFAULTS the component destructures, so the panel and an
// unconfigured instance can never disagree.
addPropertyControls(About, {
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
    description: "One paragraph per line.",
  },
});
