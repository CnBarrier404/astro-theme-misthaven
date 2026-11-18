import type { Element, ElementContent } from "hast";
import type { HastPluginDefinition, HastVisitorContext } from "satteri";

import { I18nKey } from "../../i18n/i18nKey";
import type { Translator } from "../../types/i18n";

const callouts = {
  note: {
    title: I18nKey.calloutNote,
    icon: [
      { type: "element", tagName: "circle", properties: { cx: "12", cy: "12", r: "9" }, children: [] },
      { type: "element", tagName: "path", properties: { d: "M12 10v6" }, children: [] },
      { type: "element", tagName: "path", properties: { d: "M12 7h.01" }, children: [] },
    ],
  },
  tip: {
    title: I18nKey.calloutTip,
    icon: [
      { type: "element", tagName: "path", properties: { d: "M9 18h6M10 22h4" }, children: [] },
      {
        type: "element",
        tagName: "path",
        properties: { d: "M8.5 14.5A6 6 0 1 1 15.5 14.5c-.9.7-1.5 1.5-1.5 2.5h-4c0-1-.6-1.8-1.5-2.5Z" },
        children: [],
      },
      { type: "element", tagName: "path", properties: { d: "M8 11h8M12 5v2" }, children: [] },
    ],
  },
  important: {
    title: I18nKey.calloutImportant,
    icon: [
      { type: "element", tagName: "circle", properties: { cx: "12", cy: "12", r: "9" }, children: [] },
      { type: "element", tagName: "path", properties: { d: "M12 8v5" }, children: [] },
      { type: "element", tagName: "path", properties: { d: "M12 16h.01" }, children: [] },
    ],
  },
  warning: {
    title: I18nKey.calloutWarning,
    icon: [
      { type: "element", tagName: "path", properties: { d: "m12 3 9 18H3L12 3Z" }, children: [] },
      { type: "element", tagName: "path", properties: { d: "M12 9v4" }, children: [] },
      { type: "element", tagName: "path", properties: { d: "M12 17h.01" }, children: [] },
    ],
  },
  caution: {
    title: I18nKey.calloutCaution,
    icon: [
      {
        type: "element",
        tagName: "path",
        properties: { d: "m7.86 2 8.28 0L22 7.86v8.28L16.14 22H7.86L2 16.14V7.86L7.86 2Z" },
        children: [],
      },
      { type: "element", tagName: "path", properties: { d: "M12 8v5" }, children: [] },
      { type: "element", tagName: "path", properties: { d: "M12 16h.01" }, children: [] },
    ],
  },
} satisfies Record<string, { title: I18nKey; icon: ElementContent[] }>;

type CalloutType = keyof typeof callouts;
const calloutPattern = new RegExp(`^\\[!(${Object.keys(callouts).join("|")})\\][ \\t]*`, "i");

function createCalloutIcon(type: CalloutType): Element {
  return {
    type: "element",
    tagName: "svg",
    properties: {
      className: ["prose-callout-icon"],
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.8",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      ariaHidden: "true",
      focusable: "false",
    },
    children: callouts[type].icon,
  };
}

function getFirstParagraph(node: Readonly<Element>) {
  const index = node.children.findIndex((child) => child.type === "element" && child.tagName === "p");
  const paragraph = node.children[index];

  return paragraph?.type === "element" && paragraph.tagName === "p" ? { index, paragraph } : undefined;
}

function getTextContent(children: ElementContent[], context: HastVisitorContext) {
  return children
    .map((child) => {
      if (child.type === "text") return child.value;
      if (child.type === "element") return context.textContent(child);
      return "";
    })
    .join("");
}

function splitParagraph(paragraph: Readonly<Element>, markerLength: number, context: HastVisitorContext) {
  const titleChildren: ElementContent[] = [];
  const bodyChildren: ElementContent[] = [];
  let remainingMarkerLength = markerLength;
  let bodyStarted = false;

  for (const child of paragraph.children) {
    if (child.type !== "text") {
      if (bodyStarted) {
        bodyChildren.push(child);
      } else {
        titleChildren.push(child);
      }
      continue;
    }

    let value = child.value;

    if (remainingMarkerLength > 0) {
      if (value.length <= remainingMarkerLength) {
        remainingMarkerLength -= value.length;
        continue;
      }

      value = value.slice(remainingMarkerLength);
      remainingMarkerLength = 0;
    }

    if (bodyStarted) {
      bodyChildren.push({ ...child, value });
      continue;
    }

    const lineBreakIndex = value.search(/\r?\n/);
    if (lineBreakIndex === -1) {
      if (value) titleChildren.push({ ...child, value });
      continue;
    }

    const lineBreakLength = value.startsWith("\r\n", lineBreakIndex) ? 2 : 1;
    const titleValue = value.slice(0, lineBreakIndex);
    const bodyValue = value.slice(lineBreakIndex + lineBreakLength);

    if (titleValue) titleChildren.push({ ...child, value: titleValue });
    if (bodyValue) bodyChildren.push({ ...child, value: bodyValue });
    bodyStarted = true;
  }

  const title = getTextContent(titleChildren, context).trim();
  const body = getTextContent(bodyChildren, context).trim();

  return {
    titleChildren,
    bodyParagraph: body
      ? {
          ...paragraph,
          children: bodyChildren,
        }
      : undefined,
    title,
  };
}

function getCalloutData(node: Readonly<Element>, context: HastVisitorContext) {
  const firstParagraphData = getFirstParagraph(node);
  if (!firstParagraphData) return;

  const { index, paragraph } = firstParagraphData;
  const match = context.textContent(paragraph).match(calloutPattern);

  if (!match) return;

  const type = match[1].toLowerCase() as CalloutType;
  const split = splitParagraph(paragraph, match[0].length, context);

  return {
    index,
    type,
    titleChildren: split.title ? split.titleChildren : [],
    bodyParagraph: split.bodyParagraph,
  };
}

function getClassNames(node: Readonly<Element>) {
  const className = node.properties?.className;

  if (Array.isArray(className)) {
    return className.filter((value): value is string => typeof value === "string");
  }

  return typeof className === "string" ? [className] : [];
}

export const createCalloutPlugin = (t: Translator): HastPluginDefinition => ({
  name: "callout-icons",
  element: {
    filter: ["blockquote"],
    visit(node: Readonly<Element>, context: HastVisitorContext) {
      const callout = getCalloutData(node, context);
      if (!callout) return;

      const classNames = getClassNames(node);
      const titleNode: Element = {
        type: "element",
        tagName: "p",
        properties: { className: ["prose-callout-title"] },
        children: [
          createCalloutIcon(callout.type),
          ...(callout.titleChildren.length > 0
            ? callout.titleChildren
            : [{ type: "text" as const, value: t(callouts[callout.type].title) }]),
        ],
      };

      const contentChildren = [
        ...(callout.bodyParagraph ? [callout.bodyParagraph] : []),
        ...node.children.slice(callout.index + 1),
      ];

      context.setProperty(node, "children", [titleNode, ...contentChildren]);
      context.setProperty(
        node,
        "className",
        classNames.includes("prose-callout") ? classNames : [...classNames, "prose-callout"],
      );
      context.setProperty(node, "data-callout", callout.type);
    },
  },
});
