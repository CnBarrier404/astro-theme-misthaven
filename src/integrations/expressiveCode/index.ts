import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import astroExpressiveCode, { type AstroExpressiveCodeOptions } from "astro-expressive-code";
import { pluginLanguageLogo } from "ec-lang-logo";
import { pluginCollapsible } from "expressive-code-collapsible";

import { expressiveCodeConfig } from "../../config/expressiveCodeConfig";
import { siteConfig } from "../../config/siteConfig";
import { I18nKey, t } from "../../i18n/index";

export function expressiveCode() {
  const {
    darkTheme,
    lightTheme,
    styleOverrides,
    pluginCollapsible: collapsible,
    pluginLanguageLogo: logo,
  } = expressiveCodeConfig;
  const showLineNumbers = expressiveCodeConfig.pluginLineNumbers.enable;
  const plugins: NonNullable<AstroExpressiveCodeOptions["plugins"]> = [];

  if (collapsible.enable) {
    const { enable: _enable, ...options } = collapsible;
    plugins.push({
      ...pluginCollapsible({
        ...options,
        expandButtonText: t(I18nKey.codeBlockExpand),
        collapseButtonText: t(I18nKey.codeBlockCollapse),
        expandedAnnouncement: t(I18nKey.codeBlockExpanded),
        collapsedAnnouncement: t(I18nKey.codeBlockCollapsed),
      }),
      // CodeBlockCollapse.astro delegates to document because ClientRouter replaces the body observed by the plugin.
      jsModules: [],
    });
  }

  if (showLineNumbers) plugins.push(pluginLineNumbers());
  if (logo.enable) {
    const { enable: _enable, ...options } = logo;
    plugins.push(pluginLanguageLogo(options));
  }

  return astroExpressiveCode({
    themes: [darkTheme, lightTheme],
    themeCssSelector: (theme) => `[data-theme='${theme.type}']`,
    styleOverrides,
    defaultLocale: siteConfig.lang,
    defaultProps: { showLineNumbers },
    plugins,
  });
}
