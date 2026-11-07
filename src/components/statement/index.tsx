import { getTranslations } from "next-intl/server";

import { ScrollRevealText } from "@/components/scroll-reveal-text";
import { Col, Container, Row } from "@/components/ui/grid";

import styles from "./statement.module.css";

export async function Statement() {
  const t = await getTranslations("statement");

  return (
    <section className={styles.section}>
      <Container>
        <Row>
          <Col span={12} md={10} mdStart={2}>
            <ScrollRevealText text={t("text")} className={styles.text} />
          </Col>
        </Row>
      </Container>
    </section>
  );
}
