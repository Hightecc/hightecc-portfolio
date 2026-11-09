import Image from "next/image";

import { getTranslations } from "next-intl/server";

import bridge from "@/assets/imagery/riso-bridge.jpg";
import check from "@/assets/imagery/riso-check.jpg";
import flows from "@/assets/imagery/riso-flows.jpg";
import software from "@/assets/imagery/riso-software.jpg";
import { Col, Container, Row } from "@/components/ui/grid";

import { SectionHead } from "../section-head";
import styles from "./capabilities.module.css";

const capabilities = [
  { key: "a", image: check },
  { key: "b", image: flows },
  { key: "c", image: bridge },
  { key: "d", image: software },
] as const;

export async function Capabilities() {
  const t = await getTranslations("capabilities");

  return (
    <section id="what">
      <SectionHead
        title={t.rich("section.title", {
          em: (chunks) => <em>{chunks}</em>,
        })}
        lede={t("section.lede")}
      />

      <Container>
        <Row rowGap={12} className={styles.grid}>
          {capabilities.map(({ key, image }) => (
            <Col key={key} span={12} md={6} className={styles.cell}>
              <article className={styles.cap}>
                <div className={styles.media}>
                  <Image
                    src={image}
                    alt=""
                    fill
                    sizes="(min-width: 720px) 50vw, 100vw"
                    placeholder="blur"
                    className={styles.img}
                  />
                </div>
                <div className={styles.content}>
                  <h3 className={styles.title}>{t(`${key}.title`)}</h3>
                  <p className={styles.desc}>{t(`${key}.desc`)}</p>
                </div>
              </article>
            </Col>
          ))}
        </Row>

        <p className={styles.note}>
          {t.rich("note", {
            strong: (chunks) => <strong>{chunks}</strong>,
          })}
        </p>
      </Container>
    </section>
  );
}
