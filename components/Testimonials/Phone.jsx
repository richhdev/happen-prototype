import { asset } from "@/lib/data";
import styles from "./Phone.module.css";

export default function Phone({ children }) {
  return (
    <div className={styles.phone}>
      <div className={styles.screen}>{children}</div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset("/assets/testimonials-phone-frame.png")}
        alt=""
        className={styles.phoneFrame}
      />
    </div>
  );
}
