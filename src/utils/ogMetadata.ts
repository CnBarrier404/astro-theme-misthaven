import { siteConfig } from "@/config/siteConfig";
import { encodePathSegments } from "@/utils/paths";

export const shouldGenerateOpenGraph = siteConfig.generateOpenGraph && import.meta.env.PROD;
export const ogImageSize = { width: 1200, height: 630 } as const;

export function getPostOgImage(post: { id: string; data: { title: string } }) {
  return {
    src: `/og/${encodePathSegments(post.id)}.png`,
    ...ogImageSize,
    alt: `${post.data.title} · ${siteConfig.title}`,
  };
}
