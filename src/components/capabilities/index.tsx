import Image from "next/image";

import { getTranslations } from "next-intl/server";

import bridge from "@/assets/imagery/glass-bridge.jpg";
import check from "@/assets/imagery/glass-check.jpg";
import flows from "@/assets/imagery/glass-flows.jpg";
import software from "@/assets/imagery/glass-software.jpg";
import { Chapter } from "@/components/chapter";
import { Container } from "@/components/ui/grid";

import { SectionHead } from "../section-head";
import styles from "./capabilities.module.css";

const capabilities = [
  { key: "a", image: check, motif: "lens", side: "start" },
  { key: "b", image: flows, motif: "flows", side: "end" },
  { key: "c", image: bridge, motif: "bridge", side: "start" },
  { key: "d", image: software, motif: "software", side: "end" },
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

      {capabilities.map(({ key, image, motif, side }) => (
        <Chapter
          key={key}
          motif={motif}
          side={side}
          media={
            <Image
              src={image}
              alt=""
              fill
              sizes="(min-width: 720px) 50vw, 80vw"
              placeholder="blur"
            />
          }
        >
          <h3 className={styles.title}>{t(`${key}.title`)}</h3>
          <p className={styles.desc}>{t(`${key}.desc`)}</p>
        </Chapter>
      ))}

      <Container>
        <p className={styles.note}>
          {t.rich("note", {
            strong: (chunks) => <strong>{chunks}</strong>,
          })}
        </p>
      </Container>
    </section>
  );
}
