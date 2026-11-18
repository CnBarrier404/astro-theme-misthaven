// @ts-check
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import icon from "astro-icon";

import { siteConfig } from "./src/config/siteConfig.ts";
import { contentPublication } from "./src/integrations/contentPublication/index.ts";
import { expressiveCode } from "./src/integrations/expressiveCode/index.ts";
import { markdownProcessor } from "./src/integrations/markdownRendering/index.ts";

export default defineConfig({
  site: siteConfig.siteUrl,
  trailingSlash: "never",
  build: {
    format: "file",
    concurrency: 4,
  },
  image: {
    remotePatterns: [{ protocol: "https", hostname: "gravatar.com" }],
  },
  markdown: {
    processor: markdownProcessor,
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [icon(), expressiveCode(), contentPublication()],
});
