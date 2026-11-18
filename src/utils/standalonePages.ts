import { getEntry } from "astro:content";

export const standalonePageIds = ["about", "friends", "privacy"] as const;

type StandalonePageId = (typeof standalonePageIds)[number];

export async function getStandalonePage(id: StandalonePageId) {
  const entry = await getEntry("pages", id);
  if (!entry) throw new Error(`Missing content entry: src/content/pages/${id}.md`);

  return { entry, href: `/${id}` };
}
