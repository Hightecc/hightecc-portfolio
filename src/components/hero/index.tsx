import Image from "next/image";
import Link from "next/link";

import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { getTranslations } from "next-intl/server";

import glassHero from "@/assets/imagery/glass-hero.jpg";
import { Button } from "@/components/ui/button";
import { Col, Container, Row } from "@/components/ui/grid";

import styles from "./hero.module.css";

export async function Hero() {
  const t = await getTranslations("hero");

  return (
    <header className={styles.hero}>
      <Container>
        <Row>
          <Col span={12} md={10} mdStart={2}>
            <div className={styles.axis}>
              <h1 className={styles.display}>
                <span className={styles.line}>{t("headline.line1")}</span>{" "}
                <span className={styles.line}>
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
              <div className={styles.ctaRow}>
                <Button asChild size="lg">
                  <Link href="#contact">
                    {t("cta.primary")}
                    <ArrowRight aria-hidden />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="#what">{t("cta.secondary")}</Link>
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      <div className={styles.stage} data-film-slot="ring">
        <Image
          src={glassHero}
          alt=""
          fill
          sizes="(min-width: 1440px) 1440px, 100vw"
          placeholder="blur"
          fetchPriority="high"
          className={styles.img}
        />
        <span className={styles.grain} aria-hidden />
      </div>
    </header>
  );
}
