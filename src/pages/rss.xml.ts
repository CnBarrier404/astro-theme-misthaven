import { siteConfig } from "@/config/siteConfig";
import { getPostHref } from "@/utils/paths";
import { getVisiblePosts } from "@/utils/posts";
import rss from "@astrojs/rss";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ site }) => {
  if (!site) {
    throw new Error("The site URL must be configured to generate rss.xml");
  }

  const posts = await getVisiblePosts();

  return rss({
    title: siteConfig.title,
    description: siteConfig.description.join(" "),
    site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishedAt,
      link: new URL(getPostHref(post), site).href,
      categories: [post.data.category, ...post.data.tags],
    })),
    customData: `<language>${siteConfig.lang}</language>`,
  });
};
