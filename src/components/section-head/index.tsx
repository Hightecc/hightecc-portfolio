import type { ReactNode } from "react";

import { Col, Container, Row } from "@/components/ui/grid";

import styles from "./section-head.module.css";

type Props = {
  num: string;
  name: string;
  kicker: string;
  title: ReactNode;
  lede?: ReactNode;
  align?: "start" | "center";
};

export function SectionHead({ num, name, kicker, title, lede, align = "start" }: Props) {
  const centered = align === "center";

  return (
    <Container className={styles.head}>
      <Row>
        <Col span={12} md={centered ? 10 : 9} mdStart={centered ? 2 : undefined}>
          <div className={centered ? `${styles.inner} ${styles.center}` : styles.inner}>
            <div className={styles.eyebrow}>
              <span className={styles.dot} aria-hidden />
              <span className={styles.num}>{num}</span>
              <span className={styles.name}>{name}</span>
              <span className={styles.kicker}>{kicker}</span>
            </div>
            <h2 className={styles.title}>{title}</h2>
            {lede ? <p className={styles.lede}>{lede}</p> : null}
          </div>
        </Col>
      </Row>
    </Container>
  );
}
