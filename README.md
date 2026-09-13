# Misthaven

> A calm place for stories and ideas.

Misthaven 是一个简洁、安静的 Astro 博客主题。

它以舒展的留白、克制的色彩和舒适的排版，让内容自然成为焦点。这里适合记录想法、故事与日常生活，也适合那些愿意让文字慢慢沉淀的人。

[在线预览](https://misthaven.cnbarrier.com) · [Astro](https://astro.build)

## 特点

- 清晰而从容的阅读布局
- 明暗主题与响应式设计
- Markdown 写作与文章搜索
- RSS、Sitemap 和友好的 SEO 基础
- 文章目录、预计阅读时长与过时提示
- 可选的 Open Graph 图片、Artalk 评论和 Markdown Negotiation

## 开始使用

需要 Node.js `22.12.0` 或更高版本。

```bash
git clone https://github.com/CnBarrier404/astro-theme-misthaven.git
cd astro-theme-misthaven
npm install
npm run dev
```

开发服务器启动后，访问 `http://localhost:4321`。

## 定制站点

大多数设置都集中在 `src/config/` 中：

- `siteConfig.ts`：站点名称、描述、域名、作者与分享设置
- `aboutConfig.ts`：关于页面与联系方式
- `navigationConfig.ts`：顶部导航
- `footerConfig.ts`：页脚链接
- `commentConfig.ts`：评论功能
- `fontConfig.ts`：字体

站点地址应设置为最终使用的域名，例如：

```ts
siteUrl: "https://your-domain.com",
```

## 写作

文章位于 `src/content/posts/`。可以复制 `_template.md` 开始写作；文件名会成为文章地址的一部分。

将文章的 `draft` 设置为 `true`，它就不会出现在生产构建中。

## 发布

Misthaven 使用静态输出，适合部署到 GitHub Pages 等静态托管服务。

```bash
npm run build
```

构建结果位于 `dist/`。部署前，请确认站点地址、社交链接、文章内容和自定义域名均已完成配置。

仓库中的文章和隐私政策是用于展示主题效果的示例内容。开始使用前，请替换文章，并根据实际站点的服务与数据处理情况完善隐私政策。

## License

[MIT](LICENSE) © CnBarrier
