import type { AstroIntegration } from "astro";
import { fileURLToPath } from "node:url";
import { readFile, unlink } from "node:fs/promises";

import { siteConfig } from "../../config/siteConfig";
import { generateMarkdownForAgents } from "./generate.mjs";

/**
 * Builds Markdown versions of every page (plus the nginx/Caddy negotiation
 * maps) when `siteConfig.enableMarkdownNegotiation` is enabled.
 */
export function markdownForAgents(): AstroIntegration {
  let root = process.cwd();
  const manifestName = "markdown-for-agents-content.json";

  return {
    name: "markdown-for-agents",
    hooks: {
      "astro:config:setup"({ command, injectRoute }) {
        if (command === "build" && siteConfig.enableMarkdownNegotiation) {
          injectRoute({
            pattern: `/${manifestName}`,
            entrypoint: fileURLToPath(new URL("./content.ts", import.meta.url)),
            prerender: true,
          });
        }
      },
      "astro:config:done"({ config }) {
        root = fileURLToPath(config.root);
      },
      async "astro:build:done"({ dir, logger }) {
        if (!siteConfig.enableMarkdownNegotiation) {
          logger.info(
            "Markdown Negotiation is disabled in siteConfig; skipping .md generation. " +
              "Remember to also disable the nginx/Caddy negotiation rule on the server.",
          );
          return;
        }

        const manifestUrl = new URL(manifestName, dir);
        const content = JSON.parse(await readFile(manifestUrl, "utf8"));
        await unlink(manifestUrl);

        const { files } = await generateMarkdownForAgents({
          root,
          distDir: fileURLToPath(dir),
          siteConfig,
          posts: content.posts,
          pages: content.pages,
        });
        logger.info(`Generated ${files.length} markdown page(s) for agents.`);
      },
    },
  };
}
