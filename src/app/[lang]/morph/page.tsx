import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";

import { Capabilities } from "@/components/capabilities";
import { Film } from "@/components/film";
import { Hero } from "@/components/hero";
import { SiteHeader } from "@/components/site-header";
import { routing } from "@/i18n/routing";

export const metadata: Metadata = {
  title: "Morph preview · Hightecc",
  robots: { index: false, follow: false },
};

export default async function MorphPreviewPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(routing.locales, lang)) notFound();
  setRequestLocale(lang);

  return (
    <>
      <Film variant="morph" />
      <SiteHeader />
      <Hero />
      <main id="main">
        <Capabilities />
      </main>
    </>
  );
}
