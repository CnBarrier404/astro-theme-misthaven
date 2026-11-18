import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { dirname, extname, join } from "node:path";

import { Resvg } from "@resvg/resvg-js";
import satori from "satori";
import { createElement, type CSSProperties } from "satori/jsx";

import { fontConfig } from "@/config/fontConfig";
import { siteConfig } from "@/config/siteConfig";
import type { FontDefinition } from "@/types/fontConfig";
import { getSiteAssetPath } from "@/utils/assetPaths";
import { ogImageSize } from "@/utils/ogMetadata";
import { formatPostDate } from "@/utils/postDates";
import type { PostEntry } from "@/utils/posts";

const { width: CARD_WIDTH, height: CARD_HEIGHT } = ogImageSize;

const PROJECT_ROOT = process.cwd();
const PUBLIC_DIRECTORY = join(PROJECT_ROOT, "public");

const CARD_COLORS = {
  page: "#fdfdfc",
  text: "#3a3a3a",
  textSoft: "#626765",
  muted: "#6e7371",
  mutedLight: "#717674",
  accent: "#397c82",
  accentStrong: "#2f6970",
  accentSoft: "#e9f2f1",
  coral: "#e98989",
} as const;

type OgFont = {
  name: string;
  data: ArrayBuffer;
  weight: 400 | 700;
  style: "normal";
};

let fontCache: Promise<OgFont[]> | undefined;

function loadFonts(): Promise<OgFont[]> {
  if (!fontCache) {
    fontCache = (async () => {
      let lastError: unknown;
      const fonts = fontConfig.font as readonly FontDefinition[];

      for (const font of fonts) {
        if (!font.src?.trim()) continue;

        try {
          const fontData = await loadFontData(font.src);

          return [
            { name: font.family, data: fontData, weight: 400, style: "normal" },
            { name: font.family, data: fontData, weight: 700, style: "normal" },
          ];
        } catch (error) {
          lastError = error;
        }
      }

      const detail = lastError instanceof Error ? ` Last error: ${lastError.message}` : "";
      throw new Error(`OpenGraph image generation requires a readable font source in fontConfig.font.${detail}`);
    })();
  }
  return fontCache;
}

async function loadFontData(src: string): Promise<ArrayBuffer> {
  if (/^https?:\/\//.test(src)) {
    const response = await fetch(src);
    if (!response.ok) {
      throw new Error(`Failed to load OpenGraph font from ${src}: ${response.status} ${response.statusText}`);
    }
    return response.arrayBuffer();
  }

  const normalized = src.replaceAll("\\", "/").replace(/^\/+/, "");
  const filePath = join(PUBLIC_DIRECTORY, ...normalized.split("/").filter(Boolean));
  return toArrayBuffer(await readFile(filePath));
}

function toArrayBuffer(buffer: Buffer): ArrayBuffer {
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer;
}

function resolveHeroBackground(): string {
  const configuredPaths = [siteConfig.heroImageLight, siteConfig.heroImageDark];

  for (const configuredPath of configuredPaths) {
    const assetPath = getSiteAssetPath(configuredPath);
    if (!assetPath) continue;

    const filePath = join(PROJECT_ROOT, assetPath);
    if (existsSync(filePath)) return filePath;
  }

  throw new Error(
    `OG card background requires a hero image; none of these configured paths exist: ${configuredPaths.join(", ")}`,
  );
}

/**
 * Uses the post cover when defined (resolved relative to the post directory),
 * otherwise falls back to the configured hero image (light, then dark).
 */
function resolvePostBackground(post: PostEntry): string {
  const cover = post.data.cover;

  if (cover?.trim()) {
    const postDirectory = post.filePath ? dirname(post.filePath) : dirname(post.id);
    const coverSegments = cover.trim().replaceAll("\\", "/").split("/").filter(Boolean);
    const coverPath = join(PROJECT_ROOT, postDirectory, ...coverSegments);

    if (existsSync(coverPath)) return coverPath;
    console.warn(`[og-image] Cover not found for "${post.id}": ${cover}; falling back to the hero image.`);
  }

  return resolveHeroBackground();
}

function mimeTypeForPath(filePath: string): string {
  switch (extname(filePath).toLowerCase()) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    case ".avif":
      return "image/avif";
    default:
      return "image/png";
  }
}

async function toDataUri(filePath: string): Promise<string> {
  const data = await readFile(filePath);
  return `data:${mimeTypeForPath(filePath)};base64,${data.toString("base64")}`;
}

function truncateText(value: string, maxCharacters: number): string {
  const characters = Array.from(value.trim());
  if (characters.length <= maxCharacters) return characters.join("");
  return `${characters
    .slice(0, maxCharacters - 1)
    .join("")
    .trimEnd()}…`;
}

function titleFontSize(title: string): number {
  const length = Array.from(title).length;
  if (length > 36) return 44;
  if (length > 26) return 52;
  return 60;
}

function element(type: string, props: { style?: CSSProperties }, ...children: unknown[]) {
  return createElement(type, props as never, ...(children as never[]));
}

function renderCard(post: PostEntry, backgroundUri: string, siteHostname: string, fontFamily: string) {
  const { title, description, category, tags, publishedAt } = post.data;
  const truncatedTitle = truncateText(title, 44);
  const truncatedDescription = truncateText(description, 72);
  const fontSize = titleFontSize(truncatedTitle);
  const tagText = tags
    .slice(0, 3)
    .map((tag) => `#${tag}`)
    .join("  ");

  return element(
    "div",
    {
      style: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        display: "flex",
        position: "relative",
        backgroundColor: CARD_COLORS.page,
        backgroundImage: `url("${backgroundUri}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontFamily,
      },
    },
    element("div", {
      style: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background:
          "linear-gradient(105deg, rgba(253,253,252,0.97) 0%, rgba(253,253,252,0.92) 36%, rgba(253,253,252,0.66) 66%, rgba(253,253,252,0.34) 100%)",
      },
    }),
    element("div", {
      style: {
        position: "absolute",
        width: 300,
        height: 300,
        borderRadius: 9999,
        backgroundColor: "rgba(57,124,130,0.10)",
        top: -110,
        right: -70,
      },
    }),
    element("div", {
      style: {
        position: "absolute",
        width: 420,
        height: 420,
        borderRadius: 9999,
        backgroundColor: "rgba(233,137,137,0.09)",
        bottom: -170,
        right: -120,
      },
    }),
    element("div", {
      style: {
        position: "absolute",
        width: 180,
        height: 180,
        borderRadius: 9999,
        backgroundColor: "rgba(255,255,255,0.5)",
        bottom: 40,
        right: 160,
      },
    }),
    element(
      "div",
      {
        style: {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "58px 72px",
        },
      },
      element(
        "div",
        { style: { display: "flex", alignItems: "center", gap: 14 } },
        element("div", { style: { width: 14, height: 14, borderRadius: 7, backgroundColor: CARD_COLORS.accent } }),
        element(
          "div",
          { style: { display: "flex", fontSize: 26, fontWeight: 700, color: CARD_COLORS.accentStrong } },
          siteConfig.title,
        ),
      ),
      element(
        "div",
        { style: { display: "flex", alignItems: "flex-start", gap: 22 } },
        element("div", {
          style: {
            width: 6,
            height: 88,
            borderRadius: 3,
            backgroundColor: CARD_COLORS.accent,
            marginTop: 8,
          },
        }),
        element(
          "div",
          { style: { display: "flex", flexDirection: "column", maxWidth: 860 } },
          element(
            "div",
            {
              style: {
                display: "flex",
                fontSize,
                fontWeight: 700,
                lineHeight: 1.3,
                color: CARD_COLORS.text,
              },
            },
            truncatedTitle,
          ),
          element(
            "div",
            {
              style: {
                display: "flex",
                marginTop: 26,
                fontSize: 27,
                lineHeight: 1.55,
                color: CARD_COLORS.textSoft,
                maxWidth: 820,
              },
            },
            truncatedDescription,
          ),
        ),
      ),
      element(
        "div",
        { style: { display: "flex", alignItems: "center", gap: 22 } },
        element(
          "div",
          { style: { display: "flex", fontSize: 22, color: CARD_COLORS.muted } },
          formatPostDate(publishedAt),
        ),
        element(
          "div",
          {
            style: {
              display: "flex",
              padding: "7px 18px",
              borderRadius: 9999,
              backgroundColor: CARD_COLORS.accentSoft,
              fontSize: 21,
              fontWeight: 700,
              color: CARD_COLORS.accentStrong,
            },
          },
          category,
        ),
        tagText && element("div", { style: { display: "flex", fontSize: 20, color: CARD_COLORS.mutedLight } }, tagText),
        element(
          "div",
          {
            style: {
              display: "flex",
              marginLeft: "auto",
              fontSize: 20,
              color: CARD_COLORS.mutedLight,
            },
          },
          siteHostname,
        ),
      ),
    ),
  );
}

export async function renderOgCard(post: PostEntry): Promise<Buffer> {
  const [backgroundUri, fonts] = await Promise.all([toDataUri(resolvePostBackground(post)), loadFonts()]);
  const siteHostname = new URL(siteConfig.siteUrl).hostname;
  const fontFamily = fonts[0]?.name ?? "system-ui";
  const svg = await satori(renderCard(post, backgroundUri, siteHostname, fontFamily), {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    fonts: fonts as never,
  });
  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: CARD_WIDTH } });
  return resvg.render().asPng();
}
