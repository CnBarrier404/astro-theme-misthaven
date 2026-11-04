import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { getPostHref, getVisiblePosts } from "@/utils/posts";

// This build-only endpoint hands content dates to the build:generated hook.
// The hook removes the intermediate file before the sitemap is written.
export const prerender = true;

export const GET: APIRoute = async ({ site }) => {
  const posts = await getVisiblePosts();
  const pages = await getCollection("pages");
  const lastmodByUrl: Record<string, string> = {};

  for (const post of posts) {
    lastmodByUrl[new URL(getPostHref(post), site).href] = (post.data.updatedAt ?? post.data.publishedAt).toISOString();
  }

  // Standalone pages render at `/<id>`; only those with a real update date get one.
  for (const page of pages) {
    if (page.data.updatedAt) lastmodByUrl[new URL(`/${page.id}`, site).href] = page.data.updatedAt.toISOString();
  }

  return Response.json(lastmodByUrl);
};
