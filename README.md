# Misthaven

> A calm place for stories and ideas.

**English** · [简体中文](README_ZH-CN.md)

Misthaven is a clean, minimalist blog theme for [Astro](https://astro.build). It is made for people who want a quiet
corner of the web to share ideas, stories, and everyday life — a place where the words come first and everything else
steps back.

[Live demo](https://misthaven.cnbarrier.com)

## Design

**Calm colors.** A warm off-white page, soft gray text, and a single misty teal accent. Color is used to show where you
are and what you can do, never just for decoration. The dark theme keeps the same mood at night.

**Room to breathe.** Generous whitespace and a steady spacing rhythm separate one idea from the next, so pages feel
open without feeling empty.

**Reading first.** Posts sit in a comfortable column with a table of contents beside them, an estimated reading time,
and a gentle notice when a post has not been updated for a while. Callouts, captions, and code blocks are styled to
support the text rather than compete with it.

**Quiet motion.** Pages and themes fade into each other, and menus open softly. Every animation has a purpose, and all
of them step aside for readers who prefer reduced motion.

**At home on every screen.** Each layout starts on the phone and grows from there. Whatever the desktop offers — the
navigation, search, and table of contents — the phone has its own version too.

**Easy for everyone.** Clear keyboard focus, comfortable tap targets, and readable contrast in both themes.

## What's Inside

- **Home** — a hero image, site stats, categories, popular tags, and the latest posts
- **Posts, tags, and archive** — browse by date, by topic, or year by year
- **Search** — find posts by title, tag, category, or description, right from the navigation bar
- **About and friends** — a profile card with your contact links, and a page for the sites you love
- **Light, dark, or system** — readers choose, and the site remembers
- **Ready to share** — RSS, a sitemap, and optional share images for every post
- **Comments** — optional, powered by [Artalk](https://artalk.js.org)
- **Two languages** — the interface is available in Simplified Chinese and English

## Getting Started

You need [Node.js](https://nodejs.org) `^22.23.4`, `^24.22.1`, or `>=26.12.1`.

```bash
git clone https://github.com/CnBarrier404/astro-theme-misthaven.git
cd astro-theme-misthaven
npm install
npm run dev
```

Then open `http://localhost:4321`. Changes you make appear in the browser as you save.

## Make It Yours

All the settings live in `src/config/`. Start with `siteConfig.ts`: give the site your name and description, and set
`siteUrl` to the address you will publish at.

## Writing

Posts live in `src/content/posts/`. Copy `_template.md`, fill in the title and date at the top, and write the rest in
Markdown. Set `draft: true` to keep a post to yourself — you can still preview it locally, but it will not be
published.

## Publishing

```bash
npm run build
```

Upload the `dist/` folder to any static host, or push to GitHub and let the included workflow publish the site to
GitHub Pages.

Before you go live, replace the sample posts with your own, and rewrite the privacy policy in
`src/content/pages/privacy.md` to describe your site.

## License

[MIT](LICENSE) © CnBarrier
