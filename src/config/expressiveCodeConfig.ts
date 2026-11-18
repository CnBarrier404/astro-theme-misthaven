import type { ExpressiveCodeConfig } from "../types/expressiveCodeConfig";

// 注意：更改后，需要重启开发服务器才能看到效果
export const expressiveCodeConfig: ExpressiveCodeConfig = {
  darkTheme: "one-dark-pro",

  lightTheme: "one-light",

  styleOverrides: {
    codeFontFamily: "var(--code-font-family)",
    borderRadius: "calc(var(--radius-lg) - var(--ec-brdWd))",
    frames: {
      frameBoxShadowCssValue: "none",
      editorTabBorderRadius: "calc(var(--radius-lg) - var(--ec-brdWd))",
    },
  },

  pluginCollapsible: {
    enable: true,

    // 代码块的最大行数，超过会自动折叠
    lineThreshold: 15,

    // 被自动折叠后，可见的预览行数
    previewLines: 8,

    defaultCollapsed: true,
  },

  pluginLanguageLogo: {
    enable: false,
    color: "mono",
    excludedLangs: [],
  },

  pluginLineNumbers: {
    enable: true,
  },
};
