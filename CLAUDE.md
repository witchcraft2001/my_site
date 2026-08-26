# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```sh
npm install
npm run dev       # dev server at http://localhost:4321 (Pagefind search does NOT work in dev)
npm run build     # builds to dist/, including the Pagefind search index
npm run preview   # serve the built dist/ locally — use this to verify search and final output
```

There is no lint/test/typecheck script configured. `npm run build` is the primary way to catch content-schema and template errors (Astro also generates `.astro/types.d.ts` for editor type-checking).

## Git conventions

- Never run `git commit` unless the user explicitly asks for a commit at that point in the conversation — implementing or approving a plan is not itself authorization to commit.
- Never add a `Co-Authored-By: Claude` (or any AI co-authorship) trailer to commit messages in this repo, regardless of default tooling conventions.

## Architecture

Personal bilingual site (Russian default, English under `/en/`) built with **Astro 7** + **Starlight** (`@astrojs/starlight`), deployed to GitHub Pages via `.github/workflows/deploy.yml` on push to `main`, served at the custom domain `mikhalchenkov.dev` (via `public/CNAME`, set in `site` in `astro.config.mjs`).

Four sections: home (news feed), apps catalog (Android/Sprinter with chip filtering), project documentation (Sprinter manual, library docs), and CV — see `README.md` for the content-authoring workflow (how to add an app/news item/doc page in both locales).

### i18n / locale pairing

- Russian is the **root locale** (no URL prefix, e.g. `/apps/`); English lives under `/en/` (e.g. `/en/apps/`). Configured via `defaultLocale: 'root'` / `locales` in `astro.config.mjs`.
- Starlight `docs` collection content follows its own root-locale convention directly: `src/content/docs/**` = Russian, `src/content/docs/en/**` = English. Missing English docs automatically fall back to the Russian version with Starlight's built-in "not translated" notice (via `isFallback`) — this is intentional for partially-translated content, not a bug.
- The `apps` and `news` collections are **not** Starlight docs — they're custom collections stored as `src/content/{apps,news}/{ru,en}/<id>.md`, paired by identical filename across locale folders. `src/lib/collections.ts` (`localizedEntries()`) implements the same fallback pattern manually: look up the requested locale, fall back to `DEFAULT_LOCALE` ('ru') if missing, flag `isFallback`.
- `src/lib/i18n.ts` defines `LOCALES`/`DEFAULT_LOCALE` and `localePath(locale, path)` for building locale-prefixed URLs from custom (non-docs) pages/components — needed because Starlight's automatic link localization only applies to sidebar `link:` entries, not to links inside custom components (e.g. hero actions).
- Custom UI strings (not covered by Starlight's built-in i18n) live in `src/content/i18n/{ru,en}.json`, validated via an extended `i18nSchema()` in `src/content.config.ts`, and read through `Astro.locals.t` (Starlight's per-request translation helper, available on every route including custom `src/pages` files) or the local `t()` closures built from `getEntry('i18n', locale)` in the page components.

### Route structure

Every route exists twice — once under `src/pages/` (Russian) and once under `src/pages/en/` (English) — as thin wrapper files that import a shared component from `src/components/pages/` and pass `locale="ru"` / `locale="en"`:

- `pages/index.astro` + `pages/en/index.astro` → `components/pages/HomePage.astro`
- `pages/apps/index.astro` + `pages/en/apps/index.astro` → `components/pages/AppsIndexPage.astro`
- `pages/apps/[id].astro` + `pages/en/apps/[id].astro` → `components/pages/AppDetailPage.astro` (each defines its own `getStaticPaths()` off `localizedEntries('apps', <locale>)`)

Docs pages (including `cv.md`) don't need wrapper files — Starlight generates their routes directly from the `docs` collection based on the root/`en/` file location.

All custom pages render inside the Starlight shell via `<StarlightPage>` (from `@astrojs/starlight/components/StarlightPage.astro`), so header, search, theme toggle, and language switcher are consistent across custom and docs pages alike. `template: 'splash'` (used on the home page) removes the sidebar for a landing-page layout.

### Content collections (`src/content.config.ts`)

- `docs` — Starlight's own `docsLoader()`/`docsSchema()`.
- `i18n` — Starlight's `i18nLoader()`/`i18nSchema()`, extended with this site's own `site.*` string keys (must stay in sync with the keys actually present in `src/content/i18n/{ru,en}.json`).
- `apps` — `glob({ pattern: '{ru,en}/*.md', base: './src/content/apps' })`; schema: `name`, `summary`, `platform: 'android' | 'sprinter'`, `version`, `download`/`github` (URLs), `screenshot` (image), `order`.
- `news` — same glob pattern under `src/content/news`; schema: `title`, `date`.

### Apps catalog chip filtering

`components/pages/AppsIndexPage.astro` renders platform filter chips server-side (with counts) and ships a small inline vanilla-JS `<script>` that toggles the `hidden` attribute on `[data-platform]` cards and syncs the active filter to `#hash` in the URL — no client framework involved.
