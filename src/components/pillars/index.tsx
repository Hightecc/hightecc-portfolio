import Image from "next/image";

import { getMessages, getTranslations } from "next-intl/server";

import grow from "@/assets/imagery/riso-grow.jpg";
import listen from "@/assets/imagery/riso-listen.jpg";
import small from "@/assets/imagery/riso-small.jpg";
import { Col, Container, Row } from "@/components/ui/grid";

import { SectionHead } from "../section-head";
import styles from "./pillars.module.css";

const pillars = [
  { key: "one", image: listen },
  { key: "two", image: small },
  { key: "three", image: grow },
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
                <div className={styles.media}>
                  <Image
                    src={image}
                    alt=""
                    fill
                    sizes="(min-width: 720px) 33vw, 100vw"
                    placeholder="blur"
                    className={styles.img}
                  />
                </div>
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
