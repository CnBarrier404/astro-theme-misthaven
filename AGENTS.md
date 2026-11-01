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

| Directory  | Purpose                                                        |
| :--------- | :------------------------------------------------------------- |
| `content/` | Content presentation components such as cards, lists, and tags |
| `layout/`  | Page-wide structure and site shell components                  |
| `search/`  | Search interfaces and interactions                             |
| `ui/`      | Reusable UI primitives and small composed display components   |
| `widget/`  | Standalone page widgets, such as the table of contents         |

## Rules

- When replacing an implementation, remove the old implementation. Do not retain backward-compatibility code or legacy entry points unless the user explicitly requests them.
- Do not add tests unless the user explicitly requests them.scripts unless requested.

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
