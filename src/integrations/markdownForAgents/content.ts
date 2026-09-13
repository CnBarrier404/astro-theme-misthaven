import type { APIRoute } from "astro";
import { getEntry, type CollectionEntry } from "astro:content";
import { getPostHref, getVisiblePosts } from "@/utils/posts";

// This build-only endpoint hands collection data to the build:done hook.
// The hook removes the intermediate file before generating the public exports.
export const prerender = true;

function serializeEntry(entry: CollectionEntry<"posts" | "pages">, href: string) {
  return { id: entry.id, data: entry.data, body: entry.body ?? "", filePath: entry.filePath, href };
}

export type MarkdownEntry = ReturnType<typeof serializeEntry>;

export const GET: APIRoute = async () => {
  const posts = await getVisiblePosts();
  // These are the collection entries rendered by the standalone HTML routes.
  const pages = await Promise.all(
    ["about", "privacy"].map(async (id) => {
      const page = await getEntry("pages", id);
      if (!page) throw new Error(`Missing content entry: pages/${id}`);
      return serializeEntry(page, `/${id}`);
    }),
  );

  return Response.json({ posts: posts.map((post) => serializeEntry(post, getPostHref(post))), pages });
};
