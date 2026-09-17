// @ts-nocheck
// Last changed 2026-09-17 · hand-written, re-paste into Framer after any edit.
// Plain JavaScript in a .tsx file, because Framer's code editor only makes
// .tsx. Nothing here is typed, and the imports resolve inside Framer rather
// than in this repo, so the checker has nothing useful to say about it.
//
// Ported from components/Hosts/ — Hosts.jsx and data.js, combined. Paste into
// Framer as a code file named Hosts.tsx.
//
// Every field is a plain string control, two card slots flattened rather than
// an Array: Framer's on-page editor only lists simple controls, so an Array
// never shows up there. A slot with an empty title is not rendered.
//
// Paste order: Primitives.tsx and GlobalStylesheet.tsx first, then this.

import { addPropertyControls, ControlType } from "framer";
import { injectHappenCSS } from "./GlobalStylesheet.tsx";
import {
  asset,
  Reveal,
  Section,
  Heading3,
  Heading4,
  TextMedium,
  ButtonOutlineMedium,
} from "./Primitives.tsx";

injectHappenCSS();

// Read as `defaultValue` on the controls and as the parameter defaults, the same
// way Vendors.tsx does it.
const DEFAULTS = {
  heading: "Want in?",
  body: "We’re always looking for well-connected individuals and magnetic group leaders – social, influential, and the life of the party.",
  card1Title: "Hosts & Promoters",
  card1Description: "Turn your network into a side hustle.",
  card1Cta: "Join the team",
  card1Link: "https://happengroup.fillout.com/t/hMmqKzd35Gus",
  card2Title: "Casual Event Workers",
  card2Description: "Pick up casual work at Australia's biggest events.",
  card2Cta: "Register",
  card2Link: "https://happengroup.fillout.com/casual_staff_eoi_summer_26_27",
};

/**
 * Width fills whatever it is dropped into; height is measured from the rendered
 * content, so the stylesheet decides it rather than a number typed in Framer.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function Hosts(props) {
  const {
    heading = DEFAULTS.heading,
    body = DEFAULTS.body,
    newTab = true,
  } = props;
  const cards = [1, 2]
    .map((n) => ({
      title: props[`card${n}Title`] ?? DEFAULTS[`card${n}Title`],
      description:
        props[`card${n}Description`] ?? DEFAULTS[`card${n}Description`],
      label: props[`card${n}Cta`] ?? DEFAULTS[`card${n}Cta`],
      href: props[`card${n}Link`] ?? DEFAULTS[`card${n}Link`],
    }))
    .filter((card) => card.title);

  return (
    <Section id="a-hosts" className="hostsSection">
      <img
        src={asset("/assets/hosts-bg.webp")}
        alt=""
        className="hostsSurface"
        loading="lazy"
        decoding="async"
      />

      <div className="hostsContentGroup">
        <div className="hostsCopy">
          <Heading3 as="h2" className="hostsHeading">
            {heading}
          </Heading3>
          <TextMedium className="hostsBody">{body}</TextMedium>
        </div>

        <div className="hostsCardGroup">
          {cards.map((card, i) => (
            <Reveal
              key={i}
              className="hostsCardWrap"
              once={true}
              amount={0}
              delay={i * 130}
            >
              <article className="hostsCard">
                <div className="hostsContent">
                  <Heading4 as="h3" className="hostsCardTitle">
                    {card.title}
                  </Heading4>
                  <TextMedium className="hostsCardBody">
                    {card.description}
                  </TextMedium>
                </div>
                <ButtonOutlineMedium
                  href={card.href}
                  rel={newTab ? "noopener noreferrer" : undefined}
                  target={newTab ? "_blank" : undefined}
                >
                  {card.label}
                </ButtonOutlineMedium>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

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
