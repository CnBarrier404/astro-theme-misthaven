import type { FriendLink } from "@/types/friends";

export const friendsConfig = {
  // 页面标题与描述；src/content/pages/friends.md 的 frontmatter 优先
  pageTitle: "友链",
  pageDescription: "Misthaven 的朋友们，以及交换友链的方式。",

  // 显示在页面标题下方的一句话介绍
  intro: "散落在各处的好朋友，欢迎去他们那里坐坐。",

  // “本站信息”中的站点描述；站点名称、链接与头像来自 siteConfig 的 title、siteUrl 与 gravatarUrl
  siteDescription: "一个简洁、安静的 Astro 博客主题。",

  // 友链列表，按填写顺序展示
  // `avatar` 填写图片的完整链接，留空时显示名称的首字
  // `description` 为一句话简介，可以省略
  links: [
    {
      name: "Astro",
      url: "https://astro.build",
      avatar: "https://github.com/withastro.png",
      description: "面向内容驱动网站的 Web 框架。",
    },
    {
      name: "Tailwind CSS",
      url: "https://tailwindcss.com",
      avatar: "https://github.com/tailwindlabs.png",
      description: "直接在标记中构建现代网站的实用优先 CSS 框架。",
    },
    {
      name: "Misthaven",
      url: "https://github.com/CnBarrier404/astro-theme-misthaven",
      avatar: "",
      description: "一个简洁、安静的 Astro 博客主题。",
    },
  ],
} as const satisfies {
  pageTitle: string;
  pageDescription: string;
  intro: string;
  siteDescription: string;
  links: readonly FriendLink[];
};
