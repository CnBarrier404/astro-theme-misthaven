import type { APIRoute } from "astro";

import { getPostHref } from "@/utils/paths";
import { getPostModifiedAt } from "@/utils/postDates";
import { getVisiblePosts } from "@/utils/posts";
import { getStandalonePage, standalonePageIds } from "@/utils/standalonePages";

export interface ContentPublication {
  lastmodByPath: Record<string, string>;
}

export const prerender = true;

export const GET: APIRoute = async () => {
  const [posts, pages] = await Promise.all([getVisiblePosts(), Promise.all(standalonePageIds.map(getStandalonePage))]);
  const lastmodByPath: Record<string, string> = {};

  for (const post of posts) {
    lastmodByPath[getPostHref(post)] = getPostModifiedAt(post.data).toISOString();
  }

  for (const { entry, href } of pages) {
    if (entry.data.updatedAt) lastmodByPath[href] = entry.data.updatedAt.toISOString();
  }

  const publication: ContentPublication = { lastmodByPath };
  return Response.json(publication);
};
