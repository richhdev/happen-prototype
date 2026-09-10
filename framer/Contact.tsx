// @ts-nocheck
// Last changed 2026-09-10 · hand-written, re-paste into Framer after any edit.
// Plain JavaScript in a .tsx file, because Framer's code editor only makes
// .tsx. Nothing here is typed, and the imports resolve inside Framer rather
// than in this repo, so the checker has nothing useful to say about it.
//
// Ported from components/Contact/ — Contact.jsx, ContactForm.jsx and data.js,
// combined. Paste into Framer as a code file named Contact.tsx.
//
// Only Contact is exported. ContactForm, CONTACT_EMAIL, LINK_CARDS and
// FORM_FIELDS are internals: a form that belongs to exactly one footer is not
// something anyone should drag onto a canvas.
//
// The page's last section, and it renders as the <footer>. Two columns from
// 768px up — contact card plus form on the left, four link cards on the right —
// stacking to one column below that. No pin, no portal, no scroll maths.
//
// The form posts nowhere. Its submit handler calls preventDefault and stops, so
// pressing Send message does nothing at all, which is how the Next app has it
// too. Whoever wires it up sets the action, and that is the one change here
// that is not a straight port.

import { injectHappenCSS } from "./GlobalStylesheet.tsx"
import {
  Section,
  RevealGroup,
  RevealItem,
  Heading3,
  TextMedium,
  TextSmall,
  ButtonOutlineMedium,
  SOCIALS,
} from "./Primitives.tsx"

injectHappenCSS()

const CONTACT_EMAIL = "hello@happengroup.com.au"

// Four outbound forms, all hosted elsewhere. The two festival stall links are
// separate Jotforms rather than one form with a picker, because the festivals
// are run by different clients.
const LINK_CARDS = [
  {
    title: "Retail vendors - Good Things 2026",
    description:
      "We're on the lookout for market stall holders to join us at the festival and help bring the space to life.",
    label: "Get your stall",
    href: "https://form.jotform.com/261311126413846",
  },
  {
    title: "Retail vendors - Beyond the Valley 2026",
    description:
      "We're on the lookout for market stall holders to join us at the festival and help bring the space to life.",
    label: "Get your stall",
    href: "https://form.jotform.com/261448233625861",
  },
  {
    title: "Work with us",
    description:
      "Register your interest to hear about casual work opportunities in the events industry",
    label: "Join the team",
    href: "https://docs.google.com/forms/d/e/1FAIpQLSfGExZGlBSpbc4ciG6nipO5i0NgDDcdFpXRqtsu3CWuMCBO9Q/viewform",
  },
  {
    title: "Promoter / Influencer Sign up",
    description: "If you know how to hype a party, we want you on the team",
    label: "Register",
    href: "https://docs.google.com/forms/d/e/1FAIpQLSdxwNLMLijvqMuaeHtV8M2FsPSfGB4g0ZVlATtbpdbBntmL6A/viewform",
  },
]

// Rendered as label + input pairs; `rows` marks the one multi-line field.
const FORM_FIELDS = [
  { name: "name", label: "Name", type: "text", autoComplete: "name" },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
  { name: "phone", label: "Phone number", type: "tel", autoComplete: "tel" },
  { name: "message", label: "Message", rows: 3 },
]

// The ids are what tie each label to its field, so they have to be unique in
// the document. Framer mounts a code component once and restyles it per
// breakpoint rather than rendering it again, so a phone canvas does not put a
// second #contact-name on the page.
function ContactForm() {
  return (
    <form
      className="contactForm"
      onSubmit={(event) => event.preventDefault()}
    >
      <span className="contactCardLabel">Contact form</span>

      {FORM_FIELDS.map((field) => (
        <div key={field.name} className="contactField">
          <label
            className="contactFieldLabel"
            htmlFor={`contact-${field.name}`}
          >
            {field.label}
          </label>
          {field.rows ? (
            <textarea
              id={`contact-${field.name}`}
              name={field.name}
              rows={field.rows}
              className="contactInput contactTextarea"
            />
          ) : (
            <input
              id={`contact-${field.name}`}
              name={field.name}
              type={field.type}
              autoComplete={field.autoComplete}
              className="contactInput"
            />
          )}
        </div>
      ))}

      <ButtonOutlineMedium type="submit" className="contactSubmit">
        Send message
      </ButtonOutlineMedium>
    </form>
  )
}

/**
 * Width fills whatever it is dropped into; height is measured from the rendered
 * content, so the stylesheet decides it rather than a number typed in Framer.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function Contact() {
  return (
    <Section as="footer" id="a-contact" className="contactSection">
      <div className="contactContent">
        <div className="contactHeader">
          <Heading3 as="h2" className="contactTitle">
            Let&apos;s make it Happen
          </Heading3>
          <TextMedium className="contactIntro">
            {/* Desktop breaks after "artist"; mobile lets it run on. */}
            Got a festival to run? A retail precinct to fill? An artist{" "}
            <br className="desktop-only" />
            who needs looking after? Tell us what you need.
          </TextMedium>
        </div>

        <div className="contactBody">
          <div className="contactColumn">
            <div className="contactCard">
              <span className="contactCardLabel">General enquiries</span>
              <a className="contactEmail" href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
              {/* Icon only, no labels — the Instagram section above already
                  spells the four names out. aria-label carries them here. */}
              <div className="contactSocials">
                {SOCIALS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                  >
                    <img
                      src={social.icon}
                      alt=""
                      className="contactSocialIcon"
                    />
                  </a>
                ))}
              </div>
            </div>

            <ContactForm />
          </div>

          {/* The right column is itself the reveal group, so the four cards
              stagger in by 130ms and run once. The left column does not
              animate: a form that slides in is a form you cannot click yet. */}
          <RevealGroup className="contactColumn" once={true}>
            {LINK_CARDS.map((card) => (
              <RevealItem
                key={card.title}
                as="article"
                className="contactLinkCard"
              >
                <h3 className="contactLinkTitle">{card.title}</h3>
                {/* Hidden under 768px — four descriptions would bury the
                    links on a phone. */}
                <TextSmall className="contactLinkBody">
                  {card.description}
                </TextSmall>
                <a
                  className="contactLinkCta"
                  href={card.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="contactLinkCtaText">{card.label}</span>
                </a>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </Section>
  )
}
