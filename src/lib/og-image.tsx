import { readFile } from "node:fs/promises";
import path from "node:path";

import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";

import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";

import { routing } from "@/i18n/routing";

export { generateLocaleStaticParams } from "@/i18n/routing";

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png";

const PALETTE = {
  bg: "#f6f4ef",
  ink: "#171614",
  mute: "#6b6a64",
  threshold: "#cc8a2e",
  thresholdInk: "#a8681e",
} as const;

const FONT = {
  sans: "Inter",
  display: "Inter Tight",
} as const;

const ASSETS_DIR = path.join(process.cwd(), "src/assets");

type Assets = {
  sans: Buffer;
  display: Buffer;
  photoSrc: string;
};

let assetsPromise: Promise<Assets> | null = null;

function getAssets(): Promise<Assets> {
  assetsPromise ??= (async () => {
    const [sans, display, photo] = await Promise.all([
      readFile(path.join(ASSETS_DIR, "fonts/inter-400.woff")),
      readFile(path.join(ASSETS_DIR, "fonts/inter-tight-300.woff")),
      readFile(path.join(ASSETS_DIR, "imagery/threshold-metalworks.jpg")),
    ]);
    return {
      sans,
      display,
      photoSrc: `data:image/jpeg;base64,${photo.toString("base64")}`,
    };
  })();
  return assetsPromise;
}

type Segment = { text: string; accent: boolean };

function parseAccent(raw: string): Segment[] {
  return raw
    .split(/(<amp>.*?<\/amp>)/)
    .filter(Boolean)
    .map((part) => {
      const match = part.match(/^<amp>(.*)<\/amp>$/);
      return match ? { text: match[1] ?? "", accent: true } : { text: part, accent: false };
    });
}

function renderOgImage(headline: Segment[], description: string, assets: Assets) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: `radial-gradient(ellipse 700px 420px at 0% 100%, rgba(217,164,65,0.14) 0%, transparent 70%), ${PALETTE.bg}`,
        color: PALETTE.ink,
        fontFamily: FONT.sans,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: 640,
          height: "100%",
          padding: "64px 56px 64px 72px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 24 }}>
          <span style={{ color: PALETTE.ink }}>Hightecc</span>
          <span style={{ color: PALETTE.mute }}>· Basile Bong</span>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            fontFamily: FONT.display,
            fontWeight: 300,
            fontSize: 64,
            lineHeight: 1.05,
            letterSpacing: "-0.04em",
          }}
        >
          {headline
            .flatMap((segment) =>
              segment.text
                .split(" ")
                .filter(Boolean)
                .map((word) => ({ word, accent: segment.accent })),
            )
            .map(({ word, accent }, i) => (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: words never reorder
                key={i}
                style={{
                  color: accent ? PALETTE.thresholdInk : PALETTE.ink,
                  marginLeft: /^[.,!?]$/.test(word) ? "-0.25em" : 0,
                  marginRight: "0.25em",
                }}
              >
                {word}
              </span>
            ))}
        </div>

        <span style={{ fontSize: 22, lineHeight: 1.5, color: PALETTE.mute, maxWidth: 500 }}>
          {description}
        </span>
      </div>

      <div
        style={{
          position: "absolute",
          top: 72,
          bottom: 72,
          left: 640,
          width: 1,
          display: "flex",
          background: `linear-gradient(to bottom, transparent, ${PALETTE.threshold}, transparent)`,
          boxShadow: "0 0 18px 1px rgba(204,138,46,0.4)",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 48,
          right: 48,
          bottom: 48,
          width: 464,
          display: "flex",
          borderRadius: 18,
          overflow: "hidden",
        }}
      >
        {/* biome-ignore lint/performance/noImgElement: rendered by Satori, not a browser */}
        <img
          src={assets.photoSrc}
          alt=""
          width={464}
          height={534}
          style={{ objectFit: "cover", objectPosition: "45% center" }}
        />
      </div>
    </div>,
    {
      ...OG_SIZE,
      fonts: [
        { name: FONT.display, data: assets.display, weight: 300, style: "normal" },
        { name: FONT.sans, data: assets.sans, weight: 400, style: "normal" },
      ],
    },
  );
}

type MetadataNamespace = "metadata.home" | "metadata.impressum" | "metadata.datenschutz";

export function createOgImageHandler({
  namespace,
  useHeroHeadline = false,
}: {
  namespace: MetadataNamespace;
  useHeroHeadline?: boolean;
}) {
  return async function OgImage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    if (!hasLocale(routing.locales, lang)) notFound();
    const [meta, hero, assets] = await Promise.all([
      getTranslations({ locale: lang, namespace }),
      getTranslations({ locale: lang, namespace: "hero" }),
      getAssets(),
    ]);
    const headline = useHeroHeadline
      ? parseAccent(`${hero.raw("headline.line1")} ${hero.raw("headline.line2")}`)
      : [{ text: meta("title"), accent: false }];
    return renderOgImage(headline, meta("description"), assets);
  };
}
