import styles from "./Button.module.css";

// One component per Figma Button variant (filled/outline x large/medium).
// Passing `href` renders an <a> instead of a <button>; `as` overrides the tag
// explicitly when neither fits. `type` defaults to "button" on a real <button>
// so it never accidentally submits a surrounding form.

export function ButtonLarge({ as, type, className, children, ...rest }) {
  const Tag = as ?? (rest.href ? "a" : "button");
  return (
    <Tag
      type={type ?? (Tag === "button" ? "button" : undefined)}
      className={`${styles.btn} ${styles.large} ${className ?? ""}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function ButtonMedium({ as, type, className, children, ...rest }) {
  const Tag = as ?? (rest.href ? "a" : "button");
  return (
    <Tag
      type={type ?? (Tag === "button" ? "button" : undefined)}
      className={`${styles.btn} ${styles.medium} ${className ?? ""}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function ButtonOutlineLarge({ as, type, className, children, ...rest }) {
  const Tag = as ?? (rest.href ? "a" : "button");
  return (
    <Tag
      type={type ?? (Tag === "button" ? "button" : undefined)}
      className={`${styles.btn} ${styles.outline} ${styles.large} ${className ?? ""}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function ButtonOutlineMedium({ as, type, className, children, ...rest }) {
  const Tag = as ?? (rest.href ? "a" : "button");
  return (
    <Tag
      type={type ?? (Tag === "button" ? "button" : undefined)}
      className={`${styles.btn} ${styles.outline} ${styles.medium} ${className ?? ""}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}
