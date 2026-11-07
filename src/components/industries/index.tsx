import Image, { type StaticImageData } from "next/image";

import { getTranslations } from "next-intl/server";

import handwerk from "@/assets/imagery/threshold-handwerk.jpg";
import kanzlei from "@/assets/imagery/threshold-kanzlei.jpg";
import landwirtschaft from "@/assets/imagery/threshold-landwirtschaft.jpg";
import logistik from "@/assets/imagery/threshold-logistik.jpg";
import praxis from "@/assets/imagery/threshold-praxis.jpg";
import produktion from "@/assets/imagery/threshold-produktion.jpg";
import { Container } from "@/components/ui/grid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { SectionHead } from "../section-head";
import styles from "./industries.module.css";

const industries = [
  { key: "produktion", image: produktion },
  { key: "logistik", image: logistik },
  { key: "praxis", image: praxis },
  { key: "landwirtschaft", image: landwirtschaft },
  { key: "handwerk", image: handwerk },
  { key: "kanzlei", image: kanzlei },
] as const satisfies ReadonlyArray<{ key: string; image: StaticImageData }>;

export async function Industries() {
  const t = await getTranslations("industries");

  return (
    <section id="industries">
      <SectionHead
        num="01"
        name={t("section.name")}
        kicker={t("section.kicker")}
        title={t.rich("section.title", {
          em: (chunks) => <em>{chunks}</em>,
        })}
        lede={t("section.lede")}
        align="center"
      />

      <Container>
        <Tabs defaultValue={industries[0].key}>
          <div className={styles.tabBar}>
            <TabsList aria-label={t("section.name")}>
              {industries.map(({ key }) => (
                <TabsTrigger key={key} value={key}>
                  {t(`${key}.label`)}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {industries.map(({ key, image }) => (
            <TabsContent key={key} value={key}>
              <figure className={styles.card}>
                <Image
                  src={image}
                  alt={t(`${key}.alt`)}
                  fill
                  sizes="(min-width: 1336px) 1280px, 100vw"
                  placeholder="blur"
                  className={styles.img}
                />
                <figcaption className={styles.caption}>
                  <h3 className={styles.title}>{t(`${key}.label`)}</h3>
                  <p className={styles.body}>{t(`${key}.body`)}</p>
                </figcaption>
              </figure>
            </TabsContent>
          ))}
        </Tabs>
      </Container>
    </section>
  );
}
