import styles from "./Section.module.css";

export function Section({
  as: Tag = "section",
  className,
  innerClassName,
  backdrop,
  children,
  ...rest
}) {
  return (
    <Tag className={`${styles.section} ${className ?? ""}`} {...rest}>
      {backdrop}
      <div className={`${styles.inner} ${innerClassName ?? ""}`}>
        {children}
      </div>
    </Tag>
  );
}

export default Section;
