import { Heading3 } from "@/components/Heading/Heading";
import { asset } from "@/lib/data";
import styles from "./Testimonials.module.css";

export default function Testimonials() {
  return (
    <div id="a-testimonials" className={styles.panel}>
      <Heading3 as="h2" className={styles.title}>
        Trusted by the best
        <br />
        in the business
      </Heading3>

      {/* The design supplies the phone and its feed as one flattened export. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset("/assets/testimonials-phone.png")}
        alt="Testimonials from Happen Group clients, shown as a phone message thread."
        className={styles.phone}
      />
    </div>
  );
}
