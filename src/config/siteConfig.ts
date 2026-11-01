import type { SiteConfig } from "@/types/siteConfig";

export const siteConfig = {
  // 站点语言
  // 可用： zh-CN, en-US
  lang: "zh-CN",

  // 站点名称
  title: "Misthaven",

  // 站点副标题
  subTitle: "A calm place for stories and ideas",

  // 站点描述
  description: ["一个简洁、安静的 Astro 博客主题。", "在这里记录想法、故事与日常生活。"],

  // 站点 URL（决定 sitemap 和链接的生成；部署前请替换为你的站点地址）
  siteUrl: "https://misthaven.cnbarrier.com",

  // OpenGraph/Twitter 社交元数据总开关，仅生产构建时生效，开启后会在构建时生成分享链接解析后的图片，推荐开启
  generateOpenGraph: false,

  // 站点维护者
  owner: "CnBarrier",

  // 头像链接
  gravatarUrl:
    "https://gravatar.com/avatar/b2aecd98f763fccfa425a4fb9329ff4294e4bf4257a166986ed75a02ced26010?v=1778975002000&size=256",

  // Favicon 配置，文件位置处于 ./public/ 中
  // rel 支持：icon、shortcut icon、apple-touch-icon、manifest
  // sizes 和 type 可以省略；未填写的项目不会生成对应 HTML，空 src 会被忽略
  favicon: [
    {
      src: "/favicon-96x96.png",
      sizes: "96x96",
      rel: "icon",
      type: "image/png",
    },
    {
      src: "/apple-touch-icon.png",
      sizes: "180x180",
      rel: "apple-touch-icon",
      type: "image/png",
    },
    {
      src: "/web-app-manifest-192x192.png",
      sizes: "192x192",
      rel: "icon",
      type: "image/png",
    },
    {
      src: "/web-app-manifest-512x512.png",
      sizes: "512x512",
      rel: "icon",
      type: "image/png",
    },
  ],

  // 首页主视觉图片；任意一项不填时，两种主题共用另一张图片
  // 图片位置处于 ./src/assets/ 中
  heroImageLight: "images/hero_light.png",
  heroImageDark: "images/hero_dark.png",

  // Markdown Negotiation（Accept: text/markdown）
  // 开启后，构建会自动生成每页的 Markdown 版本，
  // 以及 nginx/Caddy 内容协商所需的 markdown-paths.map / markdown-tokens.map。
  // 注意：启用前请先在服务器上配置对应的 nginx/Caddy 规则（把 text/markdown
  // 请求改写/转发到生成的 .md 文件），否则 markdown 请求会 404；
  // 部署后还需要 reload 一次代理配置才能加载新的 map 文件。
  enableMarkdownNegotiation: false,
} as const satisfies SiteConfig;
