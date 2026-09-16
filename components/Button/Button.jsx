import styles from "./Button.module.css";

const BUTTON_COLORS = {
  charcoal: "var(--color-charcoal)",
  cream: "var(--color-cream)",
  white: "var(--color-white)",
  red: "var(--color-red)",
  orange: "var(--color-orange)",
};

// Default button for general use — outline/medium is the most common variant.
export const Button = ButtonOutlineMedium;

function ButtonBase({
  as,
  type,
  color,
  variantClassName,
  className,
  style,
  children,
  ...rest
}) {
  const Tag = as ?? (rest.href ? "a" : "button");
  return (
    <Tag
      type={type ?? (Tag === "button" ? "button" : undefined)}
      className={`${styles.button} ${variantClassName} ${className ?? ""}`}
      style={color ? { color: BUTTON_COLORS[color] ?? color, ...style } : style}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function ButtonLarge(props) {
  return <ButtonBase variantClassName={styles.buttonLarge} {...props} />;
}

export function ButtonMedium(props) {
  return <ButtonBase variantClassName={styles.buttonMedium} {...props} />;
}

export function ButtonOutlineLarge(props) {
  return (
    <ButtonBase
      variantClassName={`${styles.buttonOutline} ${styles.buttonLarge}`}
      {...props}
    />
  );
}

export function ButtonOutlineMedium(props) {
  return (
    <ButtonBase
      variantClassName={`${styles.buttonOutline} ${styles.buttonMedium}`}
      {...props}
    />
  );
}
