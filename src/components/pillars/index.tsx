import Image from "next/image";

import { getMessages, getTranslations } from "next-intl/server";

import business from "@/assets/imagery/motion-business.jpg";
import essenz from "@/assets/imagery/motion-essenz.jpg";
import kommunikation from "@/assets/imagery/motion-kommunikation.jpg";
import { ImageCredit } from "@/components/image-credit";
import { Col, Container, Row } from "@/components/ui/grid";

import { SectionHead } from "../section-head";
import styles from "./pillars.module.css";

const pillars = [
  { key: "one", image: kommunikation },
  { key: "two", image: essenz },
  { key: "three", image: business },
] as const;

export async function Pillars() {
  const t = await getTranslations("pillars");
  const messages = await getMessages();

  return (
    <section id="work">
      <SectionHead
        title={t.rich("section.title", {
          em: (chunks) => <em>{chunks}</em>,
        })}
        lede={t("section.lede")}
      />

      <Container>
        <Row rowGap={12} className={styles.grid}>
          {pillars.map(({ key, image }) => (
            <Col key={key} span={12} md={4} className={styles.cell}>
              <article className={styles.pillar}>
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes="(min-width: 720px) 33vw, 100vw"
                  placeholder="blur"
                  className={styles.img}
                />
                <ImageCredit position="top" />
                <div className={styles.content}>
                  <h3 className={styles.title}>
                    {t.rich(`${key}.title`, {
                      em: (chunks) => <em>{chunks}</em>,
                    })}
                  </h3>
                  <p className={styles.body}>{t(`${key}.body`)}</p>
                  <ul className={styles.list}>
                    {messages.pillars[key].items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </article>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}
