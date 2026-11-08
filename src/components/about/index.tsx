import { getTranslations } from "next-intl/server";

import { Col, Container, Row } from "@/components/ui/grid";

import { SectionHead } from "../section-head";
import styles from "./about.module.css";

export async function About() {
  const t = await getTranslations("about");

  return (
    <section id="about">
      <SectionHead
        title={t.rich("section.title", {
          em: (chunks) => <em>{chunks}</em>,
        })}
      />

      <Container>
        <Row rowGap={48}>
          <Col span={12} md={7} className={styles.narrative}>
            <p className={styles.lede}>
              {t.rich("lede", {
                em: (chunks) => <em>{chunks}</em>,
                muted: (chunks) => <span className={styles.ledeMuted}>{chunks}</span>,
              })}
            </p>
          </Col>

          <Col span={12} md={4} mdStart={9}>
            <aside className={styles.credo}>
              <div className={styles.credoRow}>
                <div className={styles.credoK}>{t("credo.contactK")}</div>
                <div className={styles.credoV}>{t("credo.contactV")}</div>
              </div>
              <div className={styles.credoRow}>
                <div className={styles.credoK}>{t("credo.focusK")}</div>
                <div className={styles.credoV}>{t("credo.focusV")}</div>
              </div>
              <div className={styles.credoRow}>
                <div className={styles.credoK}>{t("credo.basedInK")}</div>
                <div className={styles.credoV}>{t("credo.basedInV")}</div>
              </div>
              <div className={styles.credoRow}>
                <div className={styles.credoK}>{t("credo.languagesK")}</div>
                <div className={styles.credoV}>{t("credo.languagesV")}</div>
              </div>
            </aside>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
