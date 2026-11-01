// @ts-check
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import astroExpressiveCode from "astro-expressive-code";
import icon from "astro-icon";
import { satteri } from "@astrojs/markdown-satteri";
import { pluginLanguageLogo } from "ec-lang-logo";
import { pluginCollapsible } from "expressive-code-collapsible";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import { defineConfig } from "astro/config";
import { expressiveCodeConfig } from "./src/config/expressiveCodeConfig.ts";
import { siteConfig } from "./src/config/siteConfig.ts";
import { getTranslation, I18nKey } from "./src/i18n/index.ts";
import { createCalloutPlugin } from "./src/integrations/markdownCallout/index.ts";
import { markdownForAgents } from "./src/integrations/markdownForAgents/index.ts";

const expressiveCodePlugins = [];
const siteTranslation = getTranslation(siteConfig.lang);
const calloutPlugin = createCalloutPlugin({
  note: siteTranslation[I18nKey.calloutNote],
  tip: siteTranslation[I18nKey.calloutTip],
  important: siteTranslation[I18nKey.calloutImportant],
  warning: siteTranslation[I18nKey.calloutWarning],
  caution: siteTranslation[I18nKey.calloutCaution],
});

/** @type {import("satteri").MdastPluginDefinition} */
const spoilerPlugin = {
  name: "spoiler",
  textDirective(node, context) {
    if (node.name !== "spoiler") return;

    context.setProperty(node, "data", {
      ...(node.data ?? {}),
      hName: "spoiler",
      hProperties: {
        role: "button",
        tabIndex: 0,
        "aria-expanded": "false",
      },
    });
  },
};

/** @type {import("satteri").HastPluginDefinition} */
const imageCaptionPlugin = {
  name: "image-caption",
  element: {
    filter: ["img"],
    visit(node, context) {
      const alt = node.properties?.alt;
      if (typeof alt !== "string" || alt.trim() === "") return;

      /** @type {import("hast").Element} */
      const caption = {
        type: "element",
        tagName: "figcaption",
        properties: {},
        children: [{ type: "text", value: alt }],
      };

      const parent = context.parent(node);
      if (parent?.type === "element" && parent.tagName === "p" && parent.children.length === 1) {
        context.replaceNode(parent, {
          type: "element",
          tagName: "figure",
          properties: {},
          children: [node, caption],
        });
        return;
      }

      context.wrapNode(node, {
        type: "element",
        tagName: "figure",
        properties: {},
        children: [caption],
      });
    },
  },
};

/** @type {import("satteri").HastPluginDefinition} */
const tableWrapPlugin = {
  name: "table-wrap",
  element: {
    filter: ["table"],
    visit(node, context) {
      context.wrapNode(node, {
        type: "element",
        tagName: "div",
        properties: { className: ["prose-table-wrap"] },
        children: [],
      });
    },
  },
};

if (expressiveCodeConfig.pluginCollapsible.enable) {
  const { enable: _enable, ...options } = expressiveCodeConfig.pluginCollapsible;
  expressiveCodePlugins.push({
    ...pluginCollapsible({
      ...options,
      expandButtonText: siteTranslation[I18nKey.codeBlockExpand],
      collapseButtonText: siteTranslation[I18nKey.codeBlockCollapse],
      expandedAnnouncement: siteTranslation[I18nKey.codeBlockExpanded],
      collapsedAnnouncement: siteTranslation[I18nKey.codeBlockCollapsed],
    }),
    // CodeBlockCollapse.astro handles navigation; the upstream runtime observes a replaced body.
    jsModules: [],
  });
}

if (expressiveCodeConfig.pluginLineNumbers.enable) {
  expressiveCodePlugins.push(pluginLineNumbers());
}

if (expressiveCodeConfig.pluginLanguageLogo.enable) {
  const { enable: _enable, ...options } = expressiveCodeConfig.pluginLanguageLogo;
  expressiveCodePlugins.push(pluginLanguageLogo(options));
}

// https://astro.build/config
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
    processor: satteri({
      features: { directive: true },
      mdastPlugins: [spoilerPlugin],
      hastPlugins: [calloutPlugin, imageCaptionPlugin, tableWrapPlugin],
    }),
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    icon(),
    astroExpressiveCode({
      themes: [expressiveCodeConfig.darkTheme, expressiveCodeConfig.lightTheme],
      themeCssSelector: (theme) => `[data-theme='${theme.type}']`,
      styleOverrides: expressiveCodeConfig.styleOverrides,
      defaultLocale: siteConfig.lang,
      defaultProps: {
        showLineNumbers: true,
      },
      plugins: expressiveCodePlugins,
    }),
    sitemap(),
    markdownForAgents(),
  ],
});
