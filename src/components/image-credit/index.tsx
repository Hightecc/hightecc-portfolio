import { getTranslations } from "next-intl/server";

import styles from "./image-credit.module.css";

export async function ImageCredit() {
  const t = await getTranslations("imageCredit");

  return <span className={styles.credit}>{t("label")}</span>;
}
