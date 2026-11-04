import sitemap from "@astrojs/sitemap";
import type { AstroIntegration } from "astro";
import { readFile, unlink } from "node:fs/promises";
import { fileURLToPath } from "node:url";

/**
 * Generates the sitemap with `<lastmod>` taken from each entry's content dates
 * (`updatedAt`, falling back to `publishedAt` for posts), so the value only
 * changes when the content does, never on every build.
 */
export function sitemapWithLastmod(): AstroIntegration[] {
  const manifestName = "sitemap-lastmod.json";
  let lastmodByUrl: Record<string, string> = {};

  // Collect dates after prerendering, before the sitemap's build:done hook runs.
  const collector: AstroIntegration = {
    name: "sitemap-lastmod",
    hooks: {
      "astro:config:setup"({ command, injectRoute }) {
        if (command === "build") {
          injectRoute({
            pattern: `/${manifestName}`,
            entrypoint: fileURLToPath(new URL("./content.ts", import.meta.url)),
            prerender: true,
          });
        }
      },
      async "astro:build:generated"({ dir }) {
        const manifestUrl = new URL(manifestName, dir);
        lastmodByUrl = JSON.parse(await readFile(manifestUrl, "utf8"));
        await unlink(manifestUrl);
      },
    },
  };

  return [
    collector,
    sitemap({
      serialize(item) {
        const lastmod = lastmodByUrl[item.url];
        return lastmod ? { ...item, lastmod } : item;
      },
    }),
  ];
}
