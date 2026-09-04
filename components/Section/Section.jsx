import styles from "./Section.module.css";

export function Section({
  as: Tag = "section",
  className,
  innerClassName,
  children,
  ref,
  ...rest
}) {
  return (
    <Tag ref={ref} className={`${styles.section} ${className ?? ""}`} {...rest}>
      <div className={`${styles.inner} ${innerClassName ?? ""}`}>
        {children}
      </div>
    </Tag>
  );
}

export default Section;
