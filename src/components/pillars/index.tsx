import Image from "next/image";

import { getMessages, getTranslations } from "next-intl/server";

import grow from "@/assets/imagery/grow.jpg";
import listen from "@/assets/imagery/listen.jpg";
import small from "@/assets/imagery/small.jpg";
import { Chapter } from "@/components/chapter";

import { SectionHead } from "../section-head";
import styles from "./pillars.module.css";

const pillars = [
  { key: "one", image: listen, motif: "listen", side: "start" },
  { key: "two", image: small, motif: "small", side: "end" },
  { key: "three", image: grow, motif: "grow", side: "start" },
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

      {pillars.map(({ key, image, motif, side }) => (
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
        </Chapter>
      ))}
    </section>
  );
}
