import { getTranslations } from "next-intl/server";

import { Col, Container, Row } from "@/components/ui/grid";

import styles from "./statement.module.css";

export async function Statement() {
  const t = await getTranslations("statement");

  return (
    <section className={styles.section}>
      <Container>
        <Row rowGap={40} className={styles.row}>
          <Col span={12} md={5}>
            <p className={styles.before}>{t("before")}</p>
          </Col>
          <Col span={12} md={2} className={styles.seamCol}>
            <span className={styles.seam} aria-hidden />
          </Col>
          <Col span={12} md={5}>
            <p className={styles.after}>{t("after")}</p>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
