"use client";
import { ButtonOutlineMedium } from "@/components/Button/Button";
import { FORM_FIELDS } from "./data";
import styles from "./Contact.module.css";

// TODO: not wired to anything yet — there is no endpoint for it to post to, so
// submitting is swallowed rather than reloading the page with the answers in
// the query string. Point this at a form service or a route handler.
export default function ContactForm() {
  return (
    <form className={styles.form} onSubmit={(event) => event.preventDefault()}>
      <span className={styles.cardLabel}>Contact form</span>

      {FORM_FIELDS.map((field) => (
        <div key={field.name} className={styles.field}>
          <label
            className={styles.fieldLabel}
            htmlFor={`contact-${field.name}`}
          >
            {field.label}
          </label>
          {field.rows ? (
            <textarea
              id={`contact-${field.name}`}
              name={field.name}
              rows={field.rows}
              className={`${styles.input} ${styles.textarea}`}
            />
          ) : (
            <input
              id={`contact-${field.name}`}
              name={field.name}
              type={field.type}
              autoComplete={field.autoComplete}
              className={styles.input}
            />
          )}
        </div>
      ))}

      <ButtonOutlineMedium type="submit" className={styles.submit}>
        Send message
      </ButtonOutlineMedium>
    </form>
  );
}
