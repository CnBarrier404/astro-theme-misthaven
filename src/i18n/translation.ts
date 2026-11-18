import { siteConfig } from "@/config/siteConfig";
import { enUS } from "@/i18n/languages/en-US";
import { zhCN } from "@/i18n/languages/zh-CN";
import type { Locale, Translation, Translator } from "@/types/i18n";

const translations = {
  "en-US": enUS,
  "zh-CN": zhCN,
} as const satisfies Record<Locale, Translation>;

const translation: Translation = translations[siteConfig.lang];

export const t: Translator = (key, params) => {
  const message = translation[key];
  if (!params) {
    return message;
  }

  return message.replace(/\{(\w+)\}/g, (placeholder, key: string) => {
    const value = params[key];
    return value === undefined ? placeholder : String(value);
  });
};
