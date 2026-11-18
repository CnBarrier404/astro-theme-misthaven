import { satteri } from "@astrojs/markdown-satteri";
import type { Element } from "hast";
import type { HastPluginDefinition, MdastPluginDefinition } from "satteri";

import { t } from "../../i18n/index";
import { createCalloutPlugin } from "./callout";

const spoilerPlugin: MdastPluginDefinition = {
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

const imageCaptionPlugin: HastPluginDefinition = {
  name: "image-caption",
  element: {
    filter: ["img"],
    visit(node, context) {
      const alt = node.properties.alt;
      if (typeof alt !== "string" || alt.trim() === "") return;

      const caption: Element = {
        type: "element",
        tagName: "figcaption",
        properties: {},
        children: [{ type: "text", value: alt }],
      };
      const figure: Element = { type: "element", tagName: "figure", properties: {}, children: [caption] };
      const parent = context.parent(node);

      if (parent.type === "element" && parent.tagName === "p" && parent.children.length === 1) {
        context.replaceNode(parent, { ...figure, children: [node, caption] });
      } else {
        context.wrapNode(node, figure);
      }
    },
  },
};

const tableWrapPlugin: HastPluginDefinition = {
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

export const markdownProcessor = satteri({
  features: { directive: true },
  mdastPlugins: [spoilerPlugin],
  hastPlugins: [createCalloutPlugin(t), imageCaptionPlugin, tableWrapPlugin],
});
