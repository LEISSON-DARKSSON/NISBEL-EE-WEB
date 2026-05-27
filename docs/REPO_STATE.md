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

The `assets/` folder also contains many older hashed `.js`, `.css`, and `.map` files. Treat them as historical build artifacts until usage is proven.

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

- `sitemap.xml` contains old `lastmod` values.
- Open Graph image paths in `index.html` should be checked against actual public files before SEO work.
- The server-path mirror under `www/apache/domains/www.nisbel.ee/htdocs/dist/` contains a separate small `Web Creator` build artifact and should not be assumed to be the active website.
- Source maps include `sourcesContent` for at least some bundles, which may help reconstruct source files.
