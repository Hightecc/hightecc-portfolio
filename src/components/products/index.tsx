import { getTranslations } from "next-intl/server";

import { Container } from "@/components/ui/grid";

import { SectionHead } from "../section-head";
import styles from "./products.module.css";

const metaKeys = ["status", "launch", "mode", "updates"] as const;

export async function Products() {
  const t = await getTranslations("products");

  // @lingual/i18n-check can't resolve the template keys below; declare them literally.
  // i18n-check t("meta.statusK")
  // i18n-check t("meta.statusV")
  // i18n-check t("meta.launchK")
  // i18n-check t("meta.launchV")
  // i18n-check t("meta.modeK")
  // i18n-check t("meta.modeV")
  // i18n-check t("meta.updatesK")
  // i18n-check t("meta.updatesV")

  return (
    <section>
      <SectionHead
        num="05"
        name={t("section.name")}
        kicker={t("section.kicker")}
        title={t.rich("section.title", {
          em: (chunks) => <em>{chunks}</em>,
        })}
      />

      <Container>
        <article className={styles.card}>
          <div className={styles.copy}>
            <h3>
              {t.rich("heading", {
                em: (chunks) => <em>{chunks}</em>,
              })}
            </h3>
            <p>{t("body")}</p>
          </div>
          <dl className={styles.meta}>
            {metaKeys.map((k) => (
              <div key={k}>
                <dt>{t(`meta.${k}K`)}</dt>
                <dd>{t(`meta.${k}V`)}</dd>
              </div>
            ))}
          </dl>
          <div className={styles.dots} aria-hidden />
        </article>
      </Container>
    </section>
  );
}
