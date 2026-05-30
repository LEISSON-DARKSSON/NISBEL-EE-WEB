# Repository State

Last assessed: 2026-05-28.

## Summary

This repository is a downloaded live snapshot of `nisbel.ee`, not a full source project.

The repo currently contains:

- `index.html` as the active public entrypoint.
- Compiled bundles and source maps in `assets/`.
- Public images in root and `pictures/`.
- `robots.txt` and `sitemap.xml`.
- A server-path mirror under `www/apache/domains/www.nisbel.ee/htdocs/dist/`.
- Local-only `.env`, ignored by git.
- Public `.env.example`, safe for git.

## Active Asset References

At the time of assessment, `index.html` references this active compiled set:

- `assets/index-8f1a9bbc.js`
- `assets/vendor-fe05aed2.js`
- `assets/router-f3b8204e.js`
- `assets/ui-de6032b5.js`
- `assets/email-8e28982d.js`
- `assets/index-d1f664ce.css`

`index.html` also references these active standalone runtime scripts:

- `assets/nisbel-map-address-override.js`
- `assets/nisbel-seo-trust-override.js`
- `assets/nisbel-mobile-conversion.js`
- `assets/nisbel-trust-content-blocks.js`
- `assets/nisbel-conversion-hero-services.js` — inserts the hero, problem-shaped services grid (6 cards), and photo-backed trust band into `document.body` before `#root`. Idempotent with a `MutationObserver` guard for React rehydration.
- `assets/landing.css` — shared stylesheet for the SP2 SEO landing pages.

The `assets/` folder also contains many older hashed `.js`, `.css`, and `.map` files. Treat them as historical build artifacts until usage is proven.

## SEO Landing Pages (SP2)

Five standalone directory-style pages, each with its own `index.html`, no React, no override scripts:

- `autodiagnostika-tallinn/index.html`
- `autoelekter-tallinn/index.html`
- `mootorituli-poleb/index.html`
- `auto-ei-kaivitu/index.html`
- `ulevaatuseelne-kontroll/index.html`

Each is canonical to itself, loads `assets/landing.css`, and ships LocalBusiness + Service JSON-LD. Sitemap registers all five with `lastmod 2026-05-30`.

## Post-Deploy Notes

- PR 1 SEO/trust hygiene is deployed and live checked.
- PR 2 mobile conversion actions are deployed and live checked.
- PR 3 trust content blocks are deployed and live checked.
- `sitemap.xml` is canonical-only for `https://nisbel.ee/` and uses `2026-05-28` as the current `lastmod`.
- The repo remains a static live-site snapshot; compiled bundles remain off-limits for routine edits.

## Technology Signals

The compiled bundles and source maps indicate a front-end app built with React-era tooling and libraries such as:

- React
- Framer Motion
- Lucide React
- Router-related chunks
- Email-related chunk

There is no committed `package.json`, lockfile, source tree, or reproducible build command.

## Operational Implication

Small static changes are acceptable when carefully verified.

Larger UI, behavior, routing, dependency, or component changes should start with source reconstruction or obtaining the original source project. Editing minified compiled bundles is fragile and should not become the default development method.

## Known Caveats

- `sitemap.xml` should stay minimal and only use `lastmod` when the date reflects a significant verified page update.
- Open Graph image paths in `index.html` should be checked against actual public files before SEO work.
- The server-path mirror under `www/apache/domains/www.nisbel.ee/htdocs/dist/` contains a separate small `Web Creator` build artifact and should not be assumed to be the active website.
- Source maps include `sourcesContent` for at least some bundles, which may help reconstruct source files.
