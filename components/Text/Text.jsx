import styles from "./Text.module.css";

// One component per remaining Figma text style (see happen-token-structure.md).
// `as` lets the tag differ from the default when the surrounding markup calls
// for it.

export function TextXXLarge({ as: Tag = "p", className, children, ...rest }) {
  return (
    <Tag className={`${styles.xxlarge} ${className ?? ""}`} {...rest}>
      {children}
    </Tag>
  );
}

export function TextXLarge({ as: Tag = "p", className, children, ...rest }) {
  return (
    <Tag className={`${styles.xlarge} ${className ?? ""}`} {...rest}>
      {children}
    </Tag>
  );
}

export function TextLarge({ as: Tag = "p", className, children, ...rest }) {
  return (
    <Tag className={`${styles.large} ${className ?? ""}`} {...rest}>
      {children}
    </Tag>
  );
}

export function TextMedium({ as: Tag = "p", className, children, ...rest }) {
  return (
    <Tag className={`${styles.medium} ${className ?? ""}`} {...rest}>
      {children}
    </Tag>
  );
}

export function TextSmall({ as: Tag = "p", className, children, ...rest }) {
  return (
    <Tag className={`${styles.small} ${className ?? ""}`} {...rest}>
      {children}
    </Tag>
  );
}

// Short uppercase label, not a paragraph — defaults to a span.
export function TextOverline({ as: Tag = "span", className, children, ...rest }) {
  return (
    <Tag className={`${styles.overline} ${className ?? ""}`} {...rest}>
      {children}
    </Tag>
  );
}

// Text style only — meant to sit inside an actual <button>, so it defaults to a span.
export function ButtonTextLarge({ as: Tag = "span", className, children, ...rest }) {
  return (
    <Tag className={`${styles.buttonTextLarge} ${className ?? ""}`} {...rest}>
      {children}
    </Tag>
  );
}

export function ButtonTextMedium({ as: Tag = "span", className, children, ...rest }) {
  return (
    <Tag className={`${styles.buttonTextMedium} ${className ?? ""}`} {...rest}>
      {children}
    </Tag>
  );
}

export function BadgeText({ as: Tag = "span", className, children, ...rest }) {
  return (
    <Tag className={`${styles.badgeText} ${className ?? ""}`} {...rest}>
      {children}
    </Tag>
  );
}
