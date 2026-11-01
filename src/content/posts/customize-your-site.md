---
title: "示例文章：定制你的站点"
description: "介绍开始使用主题时常见的配置入口与内容整理方式。"
publishedAt: 2999-12-29
updatedAt: 2999-12-29
category: "指南"
tags: ["配置", "Astro", "部署"]
draft: false
---

> 这是一篇随主题提供的示例文章。文中的名称和设置均为中性演示内容。

安装依赖并启动开发服务器后，可以从站点信息、导航和首页内容开始定制 Misthaven。建议先完成最小配置，确认站点能正常构建，再逐项调整视觉样式和集成功能。

## 修改站点信息

站点标题、描述、作者和基础 URL 集中放在 `src/config/siteConfig.ts` 中。修改时请同时检查公开清单、页脚和隐私页面，确保没有遗留演示信息。

| 配置入口              | 负责内容                   | 修改后建议检查         |
| --------------------- | -------------------------- | ---------------------- |
| `siteConfig.ts`       | 标题、描述、头像、站点地址 | 首页、社交元数据、页脚 |
| `navigationConfig.ts` | 主导航项目                 | 桌面端与移动端导航     |
| `footerConfig.ts`     | 页脚链接                   | RSS、Sitemap、隐私页面 |
| `fontConfig.ts`       | 字体来源与回退             | 本地构建与生产构建     |

一个最小的站点信息配置大致如下：

```ts title="src/config/siteConfig.ts"
export const siteConfig = {
  lang: "zh-CN",
  title: "我的小站",
  subTitle: "A calm place for stories and ideas",
  description: ["记录技术实践与日常生活。", "让值得回看的内容慢慢积累。"],
  siteUrl: "https://example.com",
  owner: "Your Name",
  generateOpenGraph: true,
  enableMarkdownNegotiation: false,
} as const;
```

`siteUrl` 会影响 canonical URL、sitemap、RSS 和文章分享链接。部署前应替换为真实地址，并确认地址不包含多余的路径或结尾斜杠。

字体在 `src/config/fontConfig.ts` 中配置：`font` 用于正文与界面，`codeFont` 用于行内代码和代码块。使用本地或远程自定义字体时，在对应字体项中填写 `src`。

## 添加自己的文章

在 `src/content/posts/` 中创建 Markdown 文件，并按照 `_template.md` 填写 frontmatter。文件名会成为文章 URL 的一部分，因此建议使用简短、稳定且不带空格的名称。

```yaml
title: "我的第一篇文章"
description: "这篇文章的简短摘要。"
publishedAt: 2024-06-19
category: "随笔"
tags: ["开始"]
draft: false
```

文章也可以记录最近一次更新日期：

```yaml
publishedAt: 2026-08-01
updatedAt: 2026-08-13
```

如果文章还没有准备好，可以设置 `draft: true`。开发环境会显示草稿并标记为预览，生产构建会自动排除它。

## 配置内容与功能

主题的配置按职责拆分在 `src/config/` 中。常见的调整顺序是：

1. 先修改站点信息和基础 URL。
2. 再调整导航和页脚。
3. 确认评论、搜索和 Markdown Negotiation 等可选功能是否需要启用。
4. 最后根据自己的内容风格调整字体、代码块和主题颜色。

> [!CAUTION]
> 变更站点地址后，请同时检查 RSS、Sitemap、Open Graph 图片地址和部署平台的环境变量。

## 发布前检查

- [ ] 替换示例文章和演示图片。
- [ ] 确认站点 URL 与社交链接。
- [ ] 检查浅色和深色模式下的首页与文章页。
- [ ] 用搜索框测试标题、分类和标签。
- [ ] 运行格式检查、类型检查和生产构建。

可以使用下面的命令完成本地检查：

```bash title="发布前检查"
npm run format
npm run check
npm run build
git diff --check
```

完成这些步骤后，Misthaven 就真正成为属于你的博客了。
