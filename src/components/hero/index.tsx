import Image from "next/image";
import Link from "next/link";

import { ArrowDown, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { getTranslations } from "next-intl/server";

import thresholdMetalworks from "@/assets/imagery/threshold-metalworks.jpg";
import { Button } from "@/components/ui/button";

import styles from "./hero.module.css";

export async function Hero() {
  const t = await getTranslations("hero");

  return (
    <header className={styles.hero}>
      <div className={styles.photo} aria-hidden>
        <Image
          src={thresholdMetalworks}
          alt=""
          fill
          sizes="100vw"
          placeholder="blur"
          fetchPriority="high"
          className={styles.photoImg}
        />
      </div>

      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.metaBlock}>
            <span className="meta meta-label">{t("meta.indexLabel")}</span>
            <span className="meta meta-val">{t("meta.indexValue")}</span>
          </div>
          <div className={styles.metaBlock}>
            <span className="meta meta-label">{t("meta.disciplineLabel")}</span>
            <span className="meta meta-val">{t("meta.disciplineValue")}</span>
          </div>
          <div className={styles.metaBlock}>
            <span className="meta meta-label">{t("meta.locationLabel")}</span>
            <span className="meta meta-val">{t("meta.locationValue")}</span>
          </div>
        </div>

        <div className={styles.center}>
          <h1 className={styles.display}>
            <span className={styles.line1}>{t("headline.line1")}</span>{" "}
            <span className={styles.line2}>
              {t.rich("headline.line2", {
                amp: (chunks) => <span className={styles.amp}>{chunks}</span>,
              })}
            </span>
          </h1>

          <p className={styles.sub}>
            {t.rich("sub", {
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </p>
        </div>

        <div className={styles.bottom}>
          <div className={styles.metaBlock}>
            <span className="meta meta-label">{t("meta.imageLabel")}</span>
            <span className="meta meta-val">{t("meta.imageValue")}</span>
          </div>
          <div className={styles.ctaRow}>
            <Button asChild size="lg">
              <Link href="#contact">
                {t("cta.primary")}
                <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#work">{t("cta.secondary")}</Link>
            </Button>
          </div>
          <div className={styles.metaBlock}>
            <span className="meta meta-label">{t("meta.scrollLabel")}</span>
            <span className="meta meta-val">
              <ArrowDown aria-hidden /> {t("meta.scrollValue")}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
