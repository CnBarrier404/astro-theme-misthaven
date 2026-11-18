import { friendsConfig, type FriendLink } from "@/config/friendsConfig";
import { siteConfig } from "@/config/siteConfig";
import { I18nKey, t } from "@/i18n";

export const siteFriendLink = {
  name: siteConfig.title,
  url: siteConfig.siteUrl,
  avatar: siteConfig.gravatarUrl,
  description: friendsConfig.siteDescription,
} satisfies FriendLink;

export function getSiteInfoFields() {
  return [
    { label: t(I18nKey.friendsSiteName), value: siteFriendLink.name },
    { label: t(I18nKey.friendsSiteDescription), value: siteFriendLink.description },
    { label: t(I18nKey.friendsSiteUrl), value: siteFriendLink.url },
    { label: t(I18nKey.friendsAvatarUrl), value: siteFriendLink.avatar },
  ];
}
