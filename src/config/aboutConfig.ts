export const aboutConfig = {
  // 页面标题与描述；src/content/pages/about.md 的 frontmatter 优先
  pageTitle: "关于",
  pageDescription: "了解 Misthaven 主题，以及如何把这一页换成你自己的介绍。",

  // 显示在名字下方的一句话简介；名字与头像来自 siteConfig 的 owner 与 gravatarUrl
  tagline: "Misthaven 主题作者。这里是主题的演示站点，页面上的内容都可以换成你自己的。",

  // 联系方式图标来自 Iconify：https://icon-sets.iconify.design/。
  // `icon` 使用“图标集前缀:图标名称”；使用新的图标集前缀时，需要安装对应的 @iconify-json/<prefix> 包。
  // `url` 可以是外部链接、站内路径或 mailto: 链接。
  links: [
    {
      name: "GitHub",
      icon: "fa7-brands:github",
      url: "https://github.com/CnBarrier404/astro-theme-misthaven",
    },
    {
      name: "RSS",
      icon: "fa7-solid:rss",
      url: "/rss.xml",
    },
  ],
} as const;
