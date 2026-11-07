import { getTranslations } from "next-intl/server";

import { Badge } from "@/components/ui/badge";
import { Col, Container, Row } from "@/components/ui/grid";
import { capabilityIndex, capabilityTags } from "@/lib/tech";

import { SectionHead } from "../section-head";
import styles from "./capabilities.module.css";

const keys = ["a", "b", "c", "d"] as const;

export async function Capabilities() {
  const t = await getTranslations("capabilities");

  return (
    <section id="what">
      <SectionHead
        num="03"
        name={t("section.name")}
        kicker={t("section.kicker")}
        title={t.rich("section.title", {
          em: (chunks) => <em>{chunks}</em>,
        })}
        lede={t("section.lede")}
      />

      <Container>
        <Row rowGap={12} className={styles.grid}>
          {keys.map((k) => (
            <Col key={k} span={12} md={6} className={styles.cell}>
              <article className={styles.cap}>
                <span className={styles.index}>{capabilityIndex[k]}</span>
                <h3 className={styles.title}>{t(`${k}.title`)}</h3>
                <p className={styles.desc}>{t(`${k}.desc`)}</p>
                <div className={styles.tags}>
                  {capabilityTags[k].map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </article>
            </Col>
          ))}
        </Row>

        <div className={styles.note}>
          <span className={styles.noteTag}>{t("noteTag")}</span>
          {t.rich("note", {
            strong: (chunks) => <strong>{chunks}</strong>,
          })}
        </div>
      </Container>
    </section>
  );
}
