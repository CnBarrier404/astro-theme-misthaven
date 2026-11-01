# AGENTS.md

Misthaven is a clean and minimalist Astro blog theme with calm colors, spacious layouts, and a comfortable reading experience. It is designed for sharing, ideas, and everyday life.

## Commands

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |
| `npm run format`          | Format code                                      |
| `npm run check`           | Check types                                      |

After completing work, run `npm run format` and `npm run check`.

## Repository Structure

| Path                | Purpose                                                                          |
| :------------------ | :------------------------------------------------------------------------------- |
| `.astro/`           | Astro-generated development metadata; should not be edited manually              |
| `dist/`             | Generated production build output for deployment; should not be edited manually  |
| `public/`           | Static assets copied directly to the final build without processing              |
| `src/`              | Main source code for pages, components, layouts, styles, content, and site logic |
| `astro.config.mjs`  | Astro configuration, integrations, Markdown processing, and build settings       |
| `package.json`      | Project metadata, scripts, dependencies, and supported Node.js version           |
| `package-lock.json` | Locked npm dependency graph; update it together with dependency changes          |
| `tsconfig.json`     | TypeScript and Astro compiler configuration                                      |

## Source Layout

`src/` contains the main source code, content, styles, and configuration for the Astro site.

| Path            | Purpose                                                                     |
| :-------------- | :-------------------------------------------------------------------------- |
| `assets/`       | Images, fonts, and other assets processed and optimized by Astro            |
| `components/`   | Reusable UI components grouped by responsibility                            |
| `config/`       | Site metadata, navigation, home page, footer, and integration settings      |
| `content/`      | Markdown content collections for posts and standalone pages                 |
| `i18n/`         | Translation keys, locale strings, language settings, and helpers            |
| `integrations/` | Theme-level Astro integrations, such as the Markdown Negotiation build hook |
| `layouts/`      | Shared document shells and article layout                                   |
| `pages/`        | File-based routes, dynamic routes, and server endpoints                     |
| `styles/`       | Global styles, design tokens, typography, and prose rules                   |
| `types/`        | Shared TypeScript types and interfaces                                      |
| `utils/`        | General-purpose helpers, including post querying and sorting                |

### Component Source Layout

`src/components/`:

Components are grouped by feature. Shared building blocks live in `ui/`; everything else lives with the page or
feature that owns it.

| Directory   | Purpose                                                                           |
| :---------- | :-------------------------------------------------------------------------------- |
| `ui/`       | Reusable primitives shared across features, such as `Card`, `Icon`, and `TagList` |
| `layout/`   | Site shell: navigation bar, mobile navigation, theme toggle, and footer           |
| `search/`   | Site search field, results, and the mobile search dialog                          |
| `home/`     | Home page view and its sections                                                   |
| `post/`     | Post list, post page sections, table of contents, and reading widgets             |
| `archive/`  | Archive page view with posts grouped by year                                      |
| `about/`    | About page view and its cards                                                     |
| `comments/` | Comment integration and view counts                                               |

### Style Source Layout

`src/styles/`:

| File              | Purpose                                                                           |
| :---------------- | :-------------------------------------------------------------------------------- |
| `global.css`      | Stylesheet entry point; imports Tailwind and the files below, holds no rules      |
| `theme.css`       | Design tokens in `@theme`, dark theme overrides, and the `dark` custom variant    |
| `base.css`        | Element defaults, the shared `:focus-visible` ring, and reduced-motion defaults   |
| `transitions.css` | View Transitions for navigation and theme changes; unlayered on purpose           |
| `prose.css`       | Typography for rendered Markdown (`.prose-content`) and Expressive Code overrides |
| `integrations/`   | Third-party widget styles, imported by the component that loads the widget        |

## Rules

- When replacing an implementation, remove the old implementation. Do not retain backward-compatibility code or legacy entry points unless the user explicitly requests them.
- Do not add tests unless the user explicitly requests them.

## UI and Styling

- Style components with Tailwind utilities in their markup. Keep global CSS to tokens, element defaults, prose, View
  Transitions, and third-party integrations. Do not add component classes or `@apply`.
- Use only the semantic tokens in `src/styles/theme.css`; Tailwind's default palette is disabled. Add a token with a
  dark value instead of a raw color, and add a token instead of repeating the same arbitrary value.
- Use the `dark:` variant for theme-specific styles. It follows `data-theme`, not the OS preference.
- Build layouts mobile first with only the `tablet` and `wide` variants. Every multi-column layout needs a single-column
  base layout, and every feature hidden at one size needs an equivalent at the other sizes, such as the mobile menu,
  mobile search dialog, and inline table of contents.
- Standalone controls are at least `size-10` so they stay comfortable to tap.
- Build new overlays on platform primitives: `<dialog>` with `showModal()` for modal surfaces and the Popover API for
  light-dismiss menus.
- Keep spacing on the 4px grid with integer utilities, and keep letter spacing at `0`.
- Every interactive element needs a hover state and a visible keyboard focus state. Rely on the shared `:focus-visible`
  ring; only items inside menus or listboxes and controls with an equivalent visible state may replace it, using
  `focus-visible:outline-hidden` (never `outline-none`). Inside `overflow-hidden` containers, inset the ring with
  `focus-visible:-outline-offset-2`.
- Respect `prefers-reduced-motion` for every transition and animation.
- Reuse the primitives in `src/components/ui/` (`Card`, `Icon`, `IconText`, `PageHeader`, `DraftBadge`, `TextLink`, `TagList`)
  before writing new markup. When the same utility list appears twice, extract a component or render it from a data
  array.
- Class names built in scripts or data arrays must be complete static strings so Tailwind can detect them.
- User-facing text, including `aria-label` values, comes from `src/i18n`.
- In CSS files, use native nesting and logical properties such as `padding-inline-start` and `text-align: start`.

## URL Conventions

- The site enforces trailing-slash-free URLs (`trailingSlash: "never"` in `astro.config.mjs`). Every page URL must end
  without a trailing `/`, except the site root `/`.
- When generating or writing links (navigation, footer, cards, RSS, sitemap, redirects, or any `href`), never append a
  trailing `/` to non-root paths. Prefer the project's existing path helpers (e.g. `getPostHref`) over hand-building
  URLs so this convention stays consistent.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
