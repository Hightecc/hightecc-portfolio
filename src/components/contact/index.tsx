import Image from "next/image";

import { ArrowRight, LinkedinLogo } from "@phosphor-icons/react/dist/ssr";
import { getTranslations } from "next-intl/server";

import kontakt from "@/assets/imagery/riso-kontakt.jpg";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/grid";
import { site } from "@/lib/site";

import styles from "./contact.module.css";

export async function Contact() {
  const t = await getTranslations("contact");

  return (
    <section id="contact" className={styles.section}>
      <Container>
        <div className={styles.card}>
          <div className={styles.content}>
            <h2 className={styles.heading}>
              {t.rich("heading", {
                em: (chunks) => <em>{chunks}</em>,
              })}
            </h2>
            <p className={styles.lede}>{t("lede")}</p>
            <div className={styles.actions}>
              <Button asChild size="lg">
                <a href={`mailto:${site.owner.email}`}>
                  {site.owner.email}
                  <ArrowRight aria-hidden />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={site.owner.linkedin} target="_blank" rel="noopener noreferrer">
                  <LinkedinLogo aria-hidden />
                  {t("linkedinLabel")}
                </a>
              </Button>
            </div>
            <p className={styles.note}>{t("mailNote")}</p>
          </div>
          <div className={styles.window}>
            <Image
              src={kontakt}
              alt={t("alt")}
              fill
              sizes="(min-width: 720px) 60vw, 100vw"
              placeholder="blur"
              className={styles.img}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
