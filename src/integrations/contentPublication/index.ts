import sitemap from "@astrojs/sitemap";
import type { AstroIntegration } from "astro";
import { readFile, unlink } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import type { ContentPublication } from "./content";
import { generateMarkdownForAgents, writeMarkdownWorker } from "../markdownForAgents/generate";

export function contentPublication(): AstroIntegration[] {
  const manifestName = "content-publication.json";
  let root: URL;
  let lastmodByPath: ContentPublication["lastmodByPath"] = {};

  // The prerendered endpoint can access Astro collections from the build runtime.
  const collector: AstroIntegration = {
    name: "content-publication",
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
      "astro:config:done"({ config }) {
        root = config.root;
      },
      async "astro:build:generated"({ dir, logger }) {
        const manifest = new URL(manifestName, dir);
        const publication: ContentPublication = JSON.parse(await readFile(manifest, "utf8"));
        await unlink(manifest);

        lastmodByPath = publication.lastmodByPath;
        let markdownRoutes: Awaited<ReturnType<typeof generateMarkdownForAgents>> = [];
        if (publication.markdown) {
          markdownRoutes = await generateMarkdownForAgents(
            fileURLToPath(root),
            fileURLToPath(dir),
            publication.markdown,
          );
          logger.info(`Generated ${publication.markdown.length} Markdown page(s) for agents.`);
        }
        await writeMarkdownWorker(fileURLToPath(dir), markdownRoutes);
      },
    },
  };

  return [
    collector,
    sitemap({
      serialize(item) {
        const lastmod = lastmodByPath[new URL(item.url).pathname];
        return lastmod ? { ...item, lastmod } : item;
      },
    }),
  ];
}
