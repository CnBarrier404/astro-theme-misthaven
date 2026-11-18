import { getSiteInfoFields } from "@/components/friends/siteInfo";
import { friendsConfig } from "@/config/friendsConfig";
import { recentPostLimit } from "@/config/postConfig";
import { siteConfig } from "@/config/siteConfig";
import { I18nKey, t } from "@/i18n";
import { getPostHref } from "@/utils/paths";
import { formatPostDate, groupPostsByYear } from "@/utils/postDates";
import type { PostEntry } from "@/utils/posts";
import type { getStandalonePage } from "@/utils/standalonePages";

export interface MarkdownDocument {
  href: string;
  markdown: string;
  filePath?: string;
  uri?: string;
  aliases?: string[];
  advertiseCatalog?: boolean;
}

type StandalonePage = Awaited<ReturnType<typeof getStandalonePage>>;
type FrontmatterValue = string | readonly string[] | undefined;

export function collectMarkdownDocuments(
  posts: readonly PostEntry[],
  pages: readonly StandalonePage[],
): MarkdownDocument[] {
  return [
    ...pages.map(({ entry, href }) => {
      const body = entry.body ?? "";
      const { title, description } = entry.data;

      return {
        href,
        filePath: entry.filePath,
        markdown: renderMarkdown({ title, description }, entry.id === "friends" ? renderFriendsBody(body) : body),
      };
    }),
    ...posts.map((post) => {
      const { title, description, publishedAt, category, tags } = post.data;

      return {
        href: getPostHref(post),
        filePath: post.filePath,
        markdown: renderMarkdown(
          { title, description, publishedAt: formatPostDate(publishedAt), category, tags },
          post.body ?? "",
        ),
      };
    }),
    { href: "/posts", markdown: renderPostsIndex(posts) },
    { href: "/archive", markdown: renderArchive(posts) },
    {
      href: "/",
      aliases: ["/index.html"],
      uri: "/index.md",
      advertiseCatalog: true,
      markdown: renderHome(posts),
    },
    { href: "/404.html", aliases: ["/404"], uri: "/404.md", markdown: renderNotFound() },
  ];
}

function renderFriendsBody(body: string) {
  const links = friendsConfig.links.map(({ name, url, description }) =>
    description ? `- [${name}](${url}) — ${description}` : `- [${name}](${url})`,
  );
  const siteInfo = getSiteInfoFields().map(({ label, value }) => `- **${label}**: ${value}`);

  return [
    friendsConfig.intro,
    ...(links.length > 0 ? [links.join("\n")] : []),
    `## ${t(I18nKey.friendsApply)}`,
    body.trim(),
    `### ${t(I18nKey.friendsSiteInfo)}`,
    siteInfo.join("\n"),
  ].join("\n\n");
}

function renderHome(posts: readonly PostEntry[]) {
  const { title, subTitle } = siteConfig;
  const description = siteConfig.description.join(" ").trim();
  const sections = [`# ${title}`, subTitle, description].filter(Boolean);

  if (posts.length > 0) {
    const recentPosts = posts
      .slice(0, recentPostLimit)
      .map((post) => `- ${postLink(post)} — ${formatPostDate(post.data.publishedAt)}`);
    sections.push(`## ${t(I18nKey.latestPosts)}`, recentPosts.join("\n"));
  }

  return renderMarkdown({ title, description }, sections.join("\n\n"));
}

function renderPostsIndex(posts: readonly PostEntry[]) {
  const title = `${t(I18nKey.postsList)} · ${siteConfig.title}`;
  const description = siteConfig.description.join(" ").trim();
  const items = posts.map(
    (post) => `- ${postLink(post)} — ${formatPostDate(post.data.publishedAt)}\n  ${post.data.description}`,
  );

  return renderMarkdown({ title, description }, `# ${t(I18nKey.navigationPosts)}\n\n${items.join("\n")}`);
}

function renderArchive(posts: readonly PostEntry[]) {
  const heading = t(I18nKey.navigationArchive);
  const title = `${heading} · ${siteConfig.title}`;
  const description = siteConfig.description.join(" ").trim();
  const sections = groupPostsByYear(posts).map(({ year, posts: yearPosts }) => {
    const items = yearPosts.map((post) => `- ${formatPostDate(post.data.publishedAt).slice(5)} ${postLink(post)}`);
    return `## ${year}\n\n${items.join("\n")}`;
  });

  return renderMarkdown({ title, description }, `# ${heading}\n\n${sections.join("\n\n")}`);
}

function renderNotFound() {
  const title = t(I18nKey.notFoundTitle);
  return renderMarkdown({ title }, `# 404 · ${title}\n\n${t(I18nKey.notFoundDescription)}`);
}

function postLink(post: PostEntry) {
  return `[${post.data.title.replace(/[\[\]]/g, "\\$&")}](${getPostHref(post)})`;
}

function renderMarkdown(fields: Record<string, FrontmatterValue>, body: string) {
  const frontmatter = Object.entries(fields)
    .filter(([, value]) => value?.length)
    .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
    .join("\n");

  return `---\n${frontmatter ? `${frontmatter}\n` : ""}---\n\n${body}\n`;
}
