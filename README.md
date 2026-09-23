# andersongacfilho.github.io

Personal site: gameplay programming, backend engineering and Game AI research —
one hub, three tracks, in English and Portuguese.

Live at **https://andersongacfilho.github.io**

## Stack

[Astro](https://astro.build) with content collections, no UI framework, no CSS framework.
Every page is static HTML, deployed to GitHub Pages by `.github/workflows/deploy.yml` on
every push to `main`.

```bash
npm install
npm run dev          # http://localhost:4321
npm run build        # static output in dist/
npm run preview      # serve the built output
npm run refresh:github   # update the offline fallback of repo metadata
```

## Layout

```
src/content/projects/   one .md per project  (curated, bilingual summary)
src/content/games/      one .md per playable build
src/content/articles/{en,pt}/  one .md per article, per language
src/i18n/ui.ts          every UI string, in both languages
src/lib/github.ts       live repo stats at build time, cached fallback
src/components/pages/   the real page bodies; src/pages/* are thin routes
```

English lives at `/`, Portuguese at `/pt/`. Adding a page means adding it in both
`src/pages/` and `src/pages/pt/` — both call the same component from
`src/components/pages/`.

## Adding things

**A project** — create `src/content/projects/<slug>.md` with frontmatter only; the body is
unused. `tracks` drives the colour and the filters. If `repo` matches a GitHub repository,
stars, language and last-push date are filled in at build time.

**An article** — create `src/content/articles/en/<slug>.md` (and/or `pt/`). Copy
`template.md`. `draft: true` keeps it out of the build — but **not** out of this public
repository, so keep unpublished writing elsewhere until it is ready.

**A game** — create `src/content/games/<slug>.md`, commit the WebGL build to the
[`webgl-builds`](https://github.com/AndersonGACFilho/webgl-builds) repository under the
folder named in `buildPath`, then flip `live: true`. Builds are only downloaded when the
visitor clicks play, which keeps the Pages bandwidth budget intact.

## Deploy

Settings → Pages → Source: **GitHub Actions**. Nothing else to configure; the workflow
publishes `dist/`.
