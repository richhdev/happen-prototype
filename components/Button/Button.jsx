import styles from "./Button.module.css";

// Default button for general use — outline/medium is the most common variant.
export const Button = ButtonOutlineMedium;

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

export function ButtonOutlineMedium({
  as,
  type,
  className,
  children,
  ...rest
}) {
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
