import Image from "next/image";
import Link from "next/link";

import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { getTranslations } from "next-intl/server";

import thresholdMetalworks from "@/assets/imagery/threshold-metalworks.jpg";
import { Button } from "@/components/ui/button";
import { Col, Container, Row } from "@/components/ui/grid";

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

      <p className={styles.eyebrow}>
        <span className={styles.dot} aria-hidden />
        {t("eyebrow")}
      </p>

      <Container className={styles.content}>
        <Row>
          <Col span={12} md={8} mdStart={3}>
            <div className={styles.axis}>
              <h1 className={styles.display}>
                {t("headline.line1")}{" "}
                {t.rich("headline.line2", {
                  amp: (chunks) => <span className={styles.amp}>{chunks}</span>,
                })}
              </h1>
              <p className={styles.sub}>
                {t.rich("sub", {
                  strong: (chunks) => <strong>{chunks}</strong>,
                })}
              </p>
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
              <span className={styles.plumb} aria-hidden />
            </div>
          </Col>
        </Row>
        <p className={styles.credit}>
          {t("imageLabel")} · {t("imageValue")}
        </p>
      </Container>
    </header>
  );
}
