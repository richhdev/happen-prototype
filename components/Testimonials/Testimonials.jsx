import { asset, Section, Heading3 } from "@/components/Primitives";
import styles from "./Testimonials.module.css";
import Phone from "./Phone";
import Thread from "./Thread";

/**
 * Width fills whatever it is dropped into; height is measured from the rendered
 * content, so the stylesheet decides it rather than a number typed in Framer.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function Testimonials() {
  return (
    <Section id="a-testimonials">
      <div className={styles.testimonialsSurface}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset("/assets/bg-graphic-2.webp")}
          alt=""
          className={styles.testimonialsBg}
          loading="lazy"
          decoding="async"
        />

        {/* Fades the thread out as it runs up behind the heading. Mobile only —
            on desktop the phone's own bezel does that job. */}
        <div className={styles.testimonialsScrim} aria-hidden="true" />

        <Heading3 as="h2" className={styles.testimonialsTitle}>
          Trusted by the best <br /> in the business
        </Heading3>

        <Phone>
          <Thread />
        </Phone>
      </div>
    </Section>
  );
}
