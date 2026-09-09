"use client";
import { ButtonOutlineMedium } from "@/components/Button/Button";
import { FORM_FIELDS } from "./data";
import styles from "./Contact.module.css";

// TODO: not wired to anything yet — there is no endpoint for it to post to, so
// submitting is swallowed rather than reloading the page with the answers in
// the query string. Point this at a form service or a route handler.
export default function ContactForm() {
  return (
    <form className={styles.contactForm} onSubmit={(event) => event.preventDefault()}>
      <span className={styles.contactCardLabel}>Contact form</span>

      {FORM_FIELDS.map((field) => (
        <div key={field.name} className={styles.contactField}>
          <label
            className={styles.contactFieldLabel}
            htmlFor={`contact-${field.name}`}
          >
            {field.label}
          </label>
          {field.rows ? (
            <textarea
              id={`contact-${field.name}`}
              name={field.name}
              rows={field.rows}
              className={`${styles.contactInput} ${styles.contactTextarea}`}
            />
          ) : (
            <input
              id={`contact-${field.name}`}
              name={field.name}
              type={field.type}
              autoComplete={field.autoComplete}
              className={styles.contactInput}
            />
          )}
        </div>
      ))}

      <ButtonOutlineMedium type="submit" className={styles.contactSubmit}>
        Send message
      </ButtonOutlineMedium>
    </form>
  );
}
