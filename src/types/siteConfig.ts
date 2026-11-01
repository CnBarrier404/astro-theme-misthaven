import type { Locale } from "@/types/i18n";

export interface FaviconConfig {
  readonly src: string;
  readonly sizes?: string;
  readonly rel: "icon" | "shortcut icon" | "apple-touch-icon" | "manifest";
  readonly type?: string;
}

export interface SiteConfig {
  readonly siteUrl: string;
  readonly generateOpenGraph: boolean;
  readonly title: string;
  readonly owner: string;
  readonly description: readonly string[];
  readonly gravatarUrl: string;
  readonly favicon: readonly FaviconConfig[];
  readonly lang: Locale;
  readonly subTitle: string;
  readonly heroImageLight: string;
  readonly heroImageDark: string;
  readonly enableMarkdownNegotiation: boolean;
}
