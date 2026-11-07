import { getTranslations } from "next-intl/server";

import styles from "./image-credit.module.css";

type Props = {
  position?: "top" | "bottom";
};

export async function ImageCredit({ position = "bottom" }: Props) {
  const t = await getTranslations("imageCredit");

  return <span className={`${styles.credit} ${styles[position]}`}>{t("label")}</span>;
}
