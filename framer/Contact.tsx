// @ts-nocheck
// Last changed 2026-09-16 · hand-written, re-paste into Framer after any edit.
// Plain JavaScript in a .tsx file, because Framer's code editor only makes
// .tsx. Nothing here is typed, and the imports resolve inside Framer rather
// than in this repo, so the checker has nothing useful to say about it.
//
// Ported from components/Contact/ — Contact.jsx, ContactForm.jsx and data.js,
// combined. Paste into Framer as a code file named Contact.tsx.
//
// Only Contact is exported. ContactForm, CONTACT_EMAILS and FORM_FIELDS are
// internals: a form that belongs to exactly one footer is not something anyone
// should drag onto a canvas.
//
// The page's last section, and it renders as the <footer>. One centred column
// at every width — contact card, then form. No pin, no portal, no scroll maths.
//
// The form posts nowhere. Its submit handler calls preventDefault and stops, so
// pressing Send message does nothing at all, which is how the Next app has it
// too. Whoever wires it up sets the action, and that is the one change here
// that is not a straight port.

import { injectHappenCSS } from "./GlobalStylesheet.tsx"
import {
  Section,
  Heading3,
  TextMedium,
  ButtonOutlineMedium,
  SOCIALS,
} from "./Primitives.tsx"

injectHappenCSS()

const CONTACT_EMAILS = [
  "hello@happengroup.com.au",
  "paris@happengroup.com.au",
  "macca@happengroup.com.au",
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
          <div className="contactCard">
            <span className="contactCardLabel">General enquiries</span>
            {CONTACT_EMAILS.map((email) => (
              <a
                key={email}
                className="contactEmail"
                href={`mailto:${email}`}
              >
                {email}
              </a>
            ))}
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
                  <img src={social.icon} alt="" className="contactSocialIcon" />
                </a>
              ))}
            </div>
          </div>

          <ContactForm />
        </div>
      </div>
    </Section>
  )
}
