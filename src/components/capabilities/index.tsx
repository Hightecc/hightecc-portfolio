import Image from "next/image";

import { getTranslations } from "next-intl/server";

import automation from "@/assets/imagery/motion-automation.jpg";
import integration from "@/assets/imagery/motion-integration.jpg";
import orientierung from "@/assets/imagery/motion-orientierung.jpg";
import web from "@/assets/imagery/motion-web.jpg";
import { ImageCredit } from "@/components/image-credit";
import { Col, Container, Row } from "@/components/ui/grid";

import { SectionHead } from "../section-head";
import styles from "./capabilities.module.css";

const capabilities = [
  { key: "a", image: orientierung },
  { key: "b", image: automation },
  { key: "c", image: integration },
  { key: "d", image: web },
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
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes="(min-width: 720px) 50vw, 100vw"
                  placeholder="blur"
                  className={styles.img}
                />
                <ImageCredit />
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
