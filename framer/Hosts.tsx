// @ts-nocheck
// Last changed 2026-09-17 · hand-written, re-paste into Framer after any edit.
// Plain JavaScript in a .tsx file, because Framer's code editor only makes
// .tsx. Nothing here is typed, and the imports resolve inside Framer rather
// than in this repo, so the checker has nothing useful to say about it.
//
// Ported from components/Hosts/ — Hosts.jsx and data.js, combined. Paste into
// Framer as a code file named Hosts.tsx.
//
// Heading, body and the cards are on property controls — an Array control, so a
// card can be added or dropped without a layer being inserted.
//
// Paste order: Primitives.tsx and GlobalStylesheet.tsx first, then this.

import { addPropertyControls, ControlType } from "framer"
import { injectHappenCSS } from "./GlobalStylesheet.tsx"
import {
  asset,
  Reveal,
  Section,
  Heading3,
  Heading4,
  TextMedium,
  ButtonOutlineMedium,
} from "./Primitives.tsx"

injectHappenCSS()

// Read as `defaultValue` on the controls and as the parameter defaults, the same
// way Vendors.tsx does it.
const DEFAULTS = {
  heading: "Want in?",
  body: "We’re always looking for well-connected individuals and magnetic group leaders – social, influential, and the life of the party.",
  cards: [
    {
      title: "Hosts & Promoters",
      description: "Turn your network into a side hustle.",
      label: "Join the team",
      href: "https://happengroup.fillout.com/t/hMmqKzd35Gus",
    },
    {
      title: "Casual Event Workers",
      description: "Pick up casual work at Australia's biggest events.",
      label: "Register",
      href: "https://happengroup.fillout.com/casual_staff_eoi_summer_26_27",
    },
  ],
}

/**
 * Width fills whatever it is dropped into; height is measured from the rendered
 * content, so the stylesheet decides it rather than a number typed in Framer.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function Hosts({
  heading = DEFAULTS.heading,
  body = DEFAULTS.body,
  cards = DEFAULTS.cards,
  newTab = true,
}) {
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
  )
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
  cards: {
    type: ControlType.Array,
    title: "Cards",
    maxCount: 3,
    defaultValue: DEFAULTS.cards,
    control: {
      type: ControlType.Object,
      controls: {
        title: { type: ControlType.String, title: "Title" },
        description: {
          type: ControlType.String,
          title: "Description",
          displayTextArea: true,
        },
        label: { type: ControlType.String, title: "CTA" },
        href: { type: ControlType.Link, title: "Link" },
      },
    },
  },
  newTab: {
    type: ControlType.Boolean,
    title: "New tab",
    defaultValue: true,
  },
})
