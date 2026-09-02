import { Heading3 } from "@/components/Heading/Heading";
import styles from "./Testimonials.module.css";
import Phone from "./Phone";
import { TESTIMONIALS } from "./data";

export default function Testimonials() {
  return (
    <div id="a-testimonials" className={styles.panel}>
      {/* Fades the thread out as it runs up behind the heading. Mobile only —
          on desktop the phone's own bezel does that job. */}
      <div className={styles.scrim} aria-hidden="true" />

      <Heading3 as="h2" className={styles.title}>
        Trusted by the best in the business
      </Heading3>

      <Phone>
        <ol className={styles.feed}>
          {TESTIMONIALS.map((item, i) => {
            // Even entries sit on the left in red, odd on the right in
            // charcoal, mirroring a two-way message thread.
            const flipped = i % 2 === 1;
            return (
              <li
                key={`${item.name}-${i}`}
                className={`${styles.row} ${flipped ? styles.rowFlipped : ""}`}
              >
                <figure className={styles.bubble}>
                  <figcaption className={styles.author}>
                    {item.name} - {item.role}
                  </figcaption>
                  <blockquote className={styles.quote}>{item.quote}</blockquote>
                  <span className={styles.tail} aria-hidden="true" />
                </figure>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.avatar}
                  alt={`${item.name}, ${item.role}`}
                  className={styles.avatar}
                  width={50}
                  height={50}
                  loading="lazy"
                />
              </li>
            );
          })}
        </ol>
      </Phone>
    </div>
  );
}
