import type { ReactNode } from "react";

import { Col, Container, Row } from "@/components/ui/grid";
import type { Motif } from "@/lib/film";

import styles from "./chapter.module.css";

type Props = {
  motif: Motif;
  media: ReactNode;
  side?: "start" | "end";
  children: ReactNode;
};

export function Chapter({ motif, media, side = "start", children }: Props) {
  const textFirst = side === "start";

  return (
    <div className={styles.chapter}>
      <Container>
        <Row rowGap={32} className={styles.row}>
          <Col span={12} md={5} mdStart={textFirst ? 1 : 8} className={styles.text}>
            {children}
          </Col>
          <Col span={12} md={6} mdStart={textFirst ? 7 : 1} className={styles.slotCol}>
            <div className={styles.slot} data-film-slot={motif}>
              {media}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
