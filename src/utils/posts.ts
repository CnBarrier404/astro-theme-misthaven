import { siteConfig } from "@/config/siteConfig";
import { I18nKey, t } from "@/i18n";
import { getCollection, type CollectionEntry } from "astro:content";

export type PostEntry = CollectionEntry<"posts">;

export async function getVisiblePosts() {
  const posts = await getCollection("posts", ({ data }) => (import.meta.env.PROD ? !data.draft : true));

  return posts.sort(
    (left, right) =>
      right.data.publishedAt.getTime() - left.data.publishedAt.getTime() || left.id.localeCompare(right.id),
  );
}

export function groupPostsBy<T extends PostEntry>(posts: readonly T[], getNames: (post: T) => Iterable<string>) {
  const groups = new Map<string, T[]>();

  for (const post of posts) {
    for (const name of getNames(post)) {
      const group = groups.get(name);
      if (group) group.push(post);
      else groups.set(name, [post]);
    }
  }

  return [...groups]
    .map(([name, entries]) => ({ name, posts: entries }))
    .sort(
      (left, right) => right.posts.length - left.posts.length || left.name.localeCompare(right.name, siteConfig.lang),
    );
}

export function groupPostsByTag(posts: readonly PostEntry[]) {
  return groupPostsBy(posts, ({ data }) => new Set(data.tags));
}

/** Counts each Han character and each Latin word as one unit, matching how readers estimate length. */
export function countPostWords(post: PostEntry) {
  const body = post.body ?? "";
  const hanCharacterCount = body.match(/\p{Script=Han}/gu)?.length ?? 0;
  const latinWordCount = body.match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g)?.length ?? 0;
  return hanCharacterCount + latinWordCount;
}

/**
 * The most recent publish or update date that is not in the future. Sample posts pin themselves
 * to the top with far-future dates, which would otherwise read as the latest update.
 */
export function getLatestUpdate(posts: readonly PostEntry[], now = new Date()) {
  const dates = posts
    .flatMap(({ data }) => [data.publishedAt, data.updatedAt])
    .filter((date): date is Date => date !== undefined && date.getTime() <= now.getTime());

  return dates.length > 0 ? new Date(Math.max(...dates.map((date) => date.getTime()))) : undefined;
}

export function formatPostCount(count: number) {
  return t(count === 1 ? I18nKey.postCountOne : I18nKey.postCount, { count });
}
