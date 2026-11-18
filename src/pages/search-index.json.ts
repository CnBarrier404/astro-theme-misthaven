import type { SearchEntry } from "@/components/search/searchIndex";
import { getPostHref } from "@/utils/paths";
import { formatPostDate } from "@/utils/postDates";
import { getVisiblePosts } from "@/utils/posts";
import type { APIRoute } from "astro";

export const prerender = true;

export const GET: APIRoute = async () => {
  const posts = await getVisiblePosts();
  const searchIndex = posts.map((post): SearchEntry => ({
    title: post.data.title,
    description: post.data.description,
    category: post.data.category,
    tags: post.data.tags,
    publishedAt: post.data.publishedAt.toISOString(),
    publishedLabel: formatPostDate(post.data.publishedAt),
    href: getPostHref(post),
  }));

  return new Response(JSON.stringify(searchIndex), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};
