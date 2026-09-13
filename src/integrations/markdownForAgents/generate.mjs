import { copyFile, mkdir, readdir, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve, sep } from "node:path";

const PATH_MAP_NAME = "markdown-paths.map";
const TOKEN_MAP_NAME = "markdown-tokens.map";
const GENERATOR_SOURCE = "src/integrations/markdownForAgents/generate.mjs";

/**
 * Generates Markdown versions of every page plus the nginx/Caddy negotiation
 * maps (markdown-paths.map and markdown-tokens.map) inside the built dist dir.
 *
 * @param {object} options
 * @param {string} [options.root] Project root (defaults to process.cwd()).
 * @param {string} [options.distDir] Output directory (defaults to root/dist).
 * @param {Array<import("./content").MarkdownEntry>} options.posts Visible, sorted collection posts.
 * @param {Array<import("./content").MarkdownEntry>} options.pages Collection entries with HTML routes.
 * @param {object} [options.siteConfig] Site config used for home/listing pages.
 */
export async function generateMarkdownForAgents(options) {
  const root = options.root ?? process.cwd();
  const distDir = options.distDir ?? join(root, "dist");
  const siteConfig = options.siteConfig ?? {};

  const { posts, pages } = options;
  const entries = [];

  for (const page of pages) {
    entries.push(await writeEntry(distDir, page, page.href, `${page.href.slice(1)}/index.md`, renderPage(page), root));
  }

  for (const post of posts) {
    entries.push(await writeEntry(distDir, post, post.href, `${post.href.slice(1)}/index.md`, renderPost(post), root));
  }

  entries.push(await writeEntry(distDir, null, "/posts", "posts/index.md", renderPostsIndex(posts, siteConfig)));
  entries.push(await writeEntry(distDir, null, "/", "index.md", renderHome(posts, siteConfig)));
  entries.push(await writeEntry(distDir, null, "/404.html", "404.md", render404()));

  await writeFile(join(distDir, PATH_MAP_NAME), pathMap(entries));
  await writeFile(join(distDir, TOKEN_MAP_NAME), tokenMap(entries));

  return { files: entries.map((entry) => entry.routes[0]) };
}

async function findFiles(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }

  const files = [];
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await findFiles(path)));
    } else if (entry.isFile()) {
      files.push(path);
    }
  }
  return files;
}

async function writeEntry(distDir, sourceEntry, route, markdownRelPath, content, root) {
  const markdownUri = `/${toPosix(markdownRelPath)}`;
  const target = join(distDir, ...markdownRelPath.split("/").map(decodeURIComponent));

  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, content);

  if (sourceEntry?.filePath) {
    await copyAssets(dirname(resolve(root, sourceEntry.filePath)), dirname(target));
  }

  return {
    routes: routeVariants(route),
    markdownUri,
    tokenCount: estimateTokenCount(content),
  };
}

async function copyAssets(sourceDir, targetDir) {
  const files = await findFiles(sourceDir);

  for (const file of files) {
    if (file.toLowerCase().endsWith(".md")) continue;
    const relPath = relative(sourceDir, file);
    const target = join(targetDir, relPath);
    await mkdir(dirname(target), { recursive: true });
    await copyFile(file, target);
  }
}

function renderPost(post) {
  const frontmatter = {
    title: post.data.title,
    description: post.data.description,
    publishedAt: formatDate(post.data.publishedAt),
    category: post.data.category,
    tags: post.data.tags,
  };
  return `${renderFrontmatter(frontmatter)}\n\n${post.body}\n`;
}

function renderPage(page) {
  const frontmatter = {
    title: page.data.title,
    description: page.data.description,
  };
  return `${renderFrontmatter(frontmatter)}\n\n${page.body}\n`;
}

function renderHome(posts, siteConfig) {
  const title = String(siteConfig.title ?? "");
  const description = joinStrings(siteConfig.description);
  const lines = [`# ${title}`];

  if (siteConfig.subTitle) lines.push("", String(siteConfig.subTitle));
  if (description) lines.push("", description);

  if (posts.length > 0) {
    lines.push("", "## 最新文章", "");
    lines.push(
      ...posts
        .slice(0, 5)
        .map((post) => `- [${escapeLinkText(post.data.title)}](${post.href}) — ${formatDate(post.data.publishedAt)}`),
    );
  }

  return `${renderFrontmatter({ title, description })}\n\n${lines.join("\n")}\n`;
}

function renderPostsIndex(posts, siteConfig) {
  const siteTitle = String(siteConfig.title ?? "");
  const description = joinStrings(siteConfig.description);
  const items = posts.map((post) => {
    const meta = formatDate(post.data.publishedAt);
    const summary = post.data.description ? `\n  ${post.data.description}` : "";
    return `- [${escapeLinkText(post.data.title)}](${post.href}) — ${meta}${summary}`;
  });

  return `${renderFrontmatter({
    title: siteTitle ? `文章列表 · ${siteTitle}` : "文章列表",
    description,
  })}\n\n# 文章\n\n${items.join("\n")}\n`;
}

function render404() {
  return `${renderFrontmatter({ title: "404 Not Found" })}\n\n# 404 Not Found\n\n页面不存在。\n`;
}

function renderFrontmatter(fields) {
  const lines = ["---"];

  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined || value === null || value === "") continue;

    if (Array.isArray(value)) {
      if (value.length === 0) continue;
      lines.push(`${key}: [${value.map((item) => JSON.stringify(String(item))).join(", ")}]`);
    } else {
      lines.push(`${key}: ${JSON.stringify(String(value))}`);
    }
  }

  lines.push("---");
  return lines.join("\n");
}

function formatDate(value) {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toISOString().slice(0, 10);
}

function joinStrings(value) {
  if (Array.isArray(value)) return value.join(" ").trim();
  return String(value ?? "").trim();
}

function escapeLinkText(value) {
  return String(value).replace(/[\[\]]/g, "\\$&");
}

export function estimateTokenCount(markdown) {
  const trimmed = String(markdown ?? "").trim();
  return trimmed ? Math.ceil(trimmed.length / 4) : 0;
}

function pathMap(entries) {
  const lines = [`# Generated by ${GENERATOR_SOURCE}.`, 'default "";'];

  for (const entry of entries) {
    for (const route of entry.routes) {
      lines.push(`${route} ${entry.markdownUri};`);
    }
  }

  return `${lines.join("\n")}\n`;
}

function tokenMap(entries) {
  const lines = [`# Generated by ${GENERATOR_SOURCE}.`, 'default "";'];

  for (const entry of entries) {
    for (const route of entry.routes) {
      lines.push(`${nginxRegex(route)} ${entry.tokenCount};`);
    }
    lines.push(`${nginxRegex(entry.markdownUri)} ${entry.tokenCount};`);
  }

  return `${lines.join("\n")}\n`;
}

function routeVariants(route) {
  if (route === "/") return ["/", "/index.html"];
  if (route.endsWith(".html")) return [route, route.slice(0, -".html".length)];
  return [route, `${route}/`];
}

function nginxRegex(value) {
  return `~^${escapeNginxRegex(value)}$`;
}

function escapeNginxRegex(value) {
  return value.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&");
}

function toPosix(value) {
  return value.split(sep).join("/");
}
