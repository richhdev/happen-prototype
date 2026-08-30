import styles from "./Heading.module.css";

// Each component pairs a semantic heading tag with its text-style class. `as`
// lets the tag differ from the visual style (e.g. render an h1 that's styled
// like a heading2) when the document outline and the visual hierarchy need to
// diverge.

export function Heading1({ as: Tag = "h1", className, children, ...rest }) {
  return (
    <Tag className={`${styles.heading1} ${className ?? ""}`} {...rest}>
      {children}
    </Tag>
  );
}

export function Heading2({ as: Tag = "h2", className, children, ...rest }) {
  return (
    <Tag className={`${styles.heading2} ${className ?? ""}`} {...rest}>
      {children}
    </Tag>
  );
}

// `sentence` swaps in the heading3-sentence variant (Sentence case instead of
// UPPERCASE) — the one heading level the token doc gives a case alternative for.
export function Heading3({
  as: Tag = "h3",
  sentence = false,
  className,
  children,
  ...rest
}) {
  const styleClass = sentence ? styles.heading3Sentence : styles.heading3;
  return (
    <Tag className={`${styleClass} ${className ?? ""}`} {...rest}>
      {children}
    </Tag>
  );
}

export function Heading4({ as: Tag = "h4", className, children, ...rest }) {
  return (
    <Tag className={`${styles.heading4} ${className ?? ""}`} {...rest}>
      {children}
    </Tag>
  );
}
