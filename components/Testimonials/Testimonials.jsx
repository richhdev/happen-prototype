import { Heading3 } from "@/components/Heading/Heading";
import styles from "./Testimonials.module.css";
import Phone from "./Phone";
import Thread from "./Thread";

export default function Testimonials() {
  return (
    <div id="a-testimonials" className={styles.testimonialsPanel}>
      {/* Fades the thread out as it runs up behind the heading. Mobile only —
          on desktop the phone's own bezel does that job. */}
      <div className={styles.testimonialsScrim} aria-hidden="true" />

      <Heading3 as="h2" className={styles.testimonialsTitle}>
        Trusted by the best in the business
      </Heading3>

      <Phone>
        <Thread />
      </Phone>
    </div>
  );
}
