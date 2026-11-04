import type { APIRoute } from "astro";
import { getEntry, type CollectionEntry } from "astro:content";
import { friendsConfig } from "@/config/friendsConfig";
import { getTranslator, I18nKey } from "@/i18n";
import { siteFriendLink } from "@/utils/friends";
import { getPostHref, getVisiblePosts } from "@/utils/posts";

// This build-only endpoint hands collection data to the build:done hook.
// The hook removes the intermediate file before generating the public exports.
export const prerender = true;

function serializeEntry(entry: CollectionEntry<"posts" | "pages">, href: string, body = entry.body ?? "") {
  return { id: entry.id, data: entry.data, body, filePath: entry.filePath, href };
}

/** The friends page renders its links and site info from config around the Markdown body. */
function renderFriendsBody(body: string) {
  const t = getTranslator();
  const links = friendsConfig.links.map(({ name, url, description }) =>
    description ? `- [${name}](${url}) — ${description}` : `- [${name}](${url})`,
  );
  const siteInfo = [
    [I18nKey.friendsSiteName, siteFriendLink.name],
    [I18nKey.friendsSiteDescription, siteFriendLink.description],
    [I18nKey.friendsSiteUrl, siteFriendLink.url],
    [I18nKey.friendsAvatarUrl, siteFriendLink.avatar],
  ] as const;

  return [
    friendsConfig.intro,
    ...(links.length > 0 ? [links.join("\n")] : []),
    `## ${t(I18nKey.friendsApply)}`,
    body.trim(),
    `### ${t(I18nKey.friendsSiteInfo)}`,
    siteInfo.map(([key, value]) => `- **${t(key)}**: ${value}`).join("\n"),
  ].join("\n\n");
}

export type MarkdownEntry = ReturnType<typeof serializeEntry>;

export const GET: APIRoute = async () => {
  const posts = await getVisiblePosts();
  // These are the collection entries rendered by the standalone HTML routes.
  const pages = await Promise.all(
    ["about", "friends", "privacy"].map(async (id) => {
      const page = await getEntry("pages", id);
      if (!page) throw new Error(`Missing content entry: pages/${id}`);
      const body = id === "friends" ? renderFriendsBody(page.body ?? "") : page.body;
      return serializeEntry(page, `/${id}`, body);
    }),
  );

  return Response.json({ posts: posts.map((post) => serializeEntry(post, getPostHref(post))), pages });
};
