import { postConfig } from "@/config/postConfig";
import { i18n, I18nKey } from "@/i18n";
import { getCollection, type CollectionEntry } from "astro:content";

export type PostEntry = CollectionEntry<"posts">;

export async function getVisiblePosts() {
  const posts = await getCollection("posts", ({ data }) => (import.meta.env.PROD ? !data.draft : true));

  return posts.sort(
    (left, right) =>
      right.data.publishedAt.getTime() - left.data.publishedAt.getTime() || left.id.localeCompare(right.id),
  );
}

export function getPostHref(post: PostEntry) {
  const encodedId = post.id.split("/").map(encodeURIComponent).join("/");
  return `/posts/${encodedId}`;
}

export function getAdjacentPosts(posts: readonly PostEntry[], post: PostEntry) {
  const currentIndex = posts.findIndex((candidate) => candidate.id === post.id);

  return {
    previousPost: currentIndex > 0 ? posts[currentIndex - 1] : undefined,
    nextPost: currentIndex >= 0 && currentIndex < posts.length - 1 ? posts[currentIndex + 1] : undefined,
  };
}

export function getPostOgImageHref(post: PostEntry) {
  const encodedId = post.id.split("/").map(encodeURIComponent).join("/");
  return `/og/${encodedId}.png`;
}

export function formatPostDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

/** Groups posts that are already sorted newest first by their UTC publish year. */
export function groupPostsByYear(posts: readonly PostEntry[]) {
  const groups: { year: string; posts: PostEntry[] }[] = [];

  for (const post of posts) {
    const year = formatPostDate(post.data.publishedAt).slice(0, 4);
    const lastGroup = groups.at(-1);

    if (lastGroup?.year === year) {
      lastGroup.posts.push(post);
    } else {
      groups.push({ year, posts: [post] });
    }
  }

  return groups;
}

export function getPostMetrics(post: PostEntry) {
  const body = post.body ?? "";
  const hanCharacterCount = body.match(/\p{Script=Han}/gu)?.length ?? 0;
  const latinWordCount = body.match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g)?.length ?? 0;
  const wordCount = hanCharacterCount + latinWordCount;
  const minutes = Math.max(1, Math.ceil(wordCount / postConfig.readingUnitsPerMinute));

  return {
    wordCount: i18n(I18nKey.postWordCount, { count: wordCount }),
    readingTime: i18n(I18nKey.postReadingTime, { minutes }),
  };
}
