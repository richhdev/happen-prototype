import styles from "./Badge.module.css";

// Badge background is a color prop rather than separate components per color —
// unlike Button's variants, the three examples in Figma (charcoal/red/orange)
// only differ by fill, everything else (padding, radius, text style) is fixed.
const BADGE_COLORS = {
  charcoal: "var(--color-charcoal)",
  red: "var(--color-red)",
  orange: "var(--color-orange)",
};

export function Badge({
  as: Tag = "span",
  color = "charcoal",
  className,
  style,
  children,
  ...rest
}) {
  return (
    <Tag
      className={`${styles.badge} ${className ?? ""}`}
      style={{ background: BADGE_COLORS[color] ?? color, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
