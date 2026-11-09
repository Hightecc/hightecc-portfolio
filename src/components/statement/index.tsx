import { getTranslations } from "next-intl/server";

import { Col, Container, Row } from "@/components/ui/grid";

import styles from "./statement.module.css";

export async function Statement() {
  const t = await getTranslations("statement");

  return (
    <section className={styles.section}>
      <Container>
        <Row>
          <Col span={12} md={8} mdStart={3}>
            <p className={styles.before}>{t("before")}</p>
            <p className={styles.after}>{t("after")}</p>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
