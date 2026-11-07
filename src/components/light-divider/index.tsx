import styles from "./light-divider.module.css";

export function LightDivider() {
  return (
    <div className={styles.wrap} aria-hidden>
      <span className={styles.seam} />
    </div>
  );
}
