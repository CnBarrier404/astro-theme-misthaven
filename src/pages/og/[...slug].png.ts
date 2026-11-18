import type { APIRoute } from "astro";

import { renderOgCard } from "@/utils/ogImage";
import { shouldGenerateOpenGraph } from "@/utils/ogMetadata";
import { getVisiblePosts, type PostEntry } from "@/utils/posts";

export async function getStaticPaths() {
  if (!shouldGenerateOpenGraph) return [];

  const posts = await getVisiblePosts();
  return posts.map((post) => ({ params: { slug: post.id }, props: { post } }));
}

export const GET: APIRoute<{ post: PostEntry }> = async ({ props: { post } }) => {
  const png = await renderOgCard(post);
  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
