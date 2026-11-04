import { I18nKey } from "@/i18n/i18nKey";

export const navigationConfig = [
  { labelKey: I18nKey.navigationHome, href: "/", icon: "home" },
  { labelKey: I18nKey.navigationPosts, href: "/posts", icon: "article" },
  { labelKey: I18nKey.navigationTags, href: "/tags", icon: "tag" },
  { labelKey: I18nKey.navigationArchive, href: "/archive", icon: "history" },
  { labelKey: I18nKey.navigationFriends, href: "/friends", icon: "link" },
  { labelKey: I18nKey.navigationAbout, href: "/about", icon: "user" },
] as const;
