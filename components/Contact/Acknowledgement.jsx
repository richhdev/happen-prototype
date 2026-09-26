import { TextSmall } from "@/components/Primitives";
import styles from "./Contact.module.css";

export default function Acknowledgement() {
  return (
    <div className={styles.acknowledgement}>
      <TextSmall className={styles.acknowledgementText}>
        Happen Group acknowledges the Wurundjeri people of the Kulin Nation, the
        Traditional Owners of the land on which we are based in Naarm. We pay
        our respects to Elders past and present and acknowledge the Traditional
        Owners of the lands on which we work and gather.
      </TextSmall>
    </div>
  );
}
