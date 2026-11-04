import { friendsConfig } from "@/config/friendsConfig";
import { siteConfig } from "@/config/siteConfig";
import type { FriendLink } from "@/types/friends";

/** This site described as a friend link, for visitors who want to add it to their own pages. */
export const siteFriendLink = {
  name: siteConfig.title,
  url: siteConfig.siteUrl,
  avatar: siteConfig.gravatarUrl,
  description: friendsConfig.siteDescription,
} satisfies FriendLink;

export function getFriendHost(url: string) {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
}
