---
name: nisbel-static-site
description: Use when working on the NISBEL nisbel.ee static website snapshot, including index.html, SEO metadata, robots.txt, sitemap.xml, public images, compiled assets, or small visual/content changes. Treat the repo as a static live-site snapshot unless a verified source tree and build pipeline exist.
---

# NISBEL Static Site

## First Checks

1. Read `AGENTS.md`.
2. Run `git status --short --branch`.
3. Identify whether the change touches content, SEO, images, compiled CSS/JS, or crawler files.

## Current Model

This repo is a static live-site snapshot. Do not assume `npm install`, `npm run build`, or a framework source tree exists.

`index.html` is the active entrypoint. Only the assets referenced by `index.html` are confirmed active for the current page load.

## Safe Edit Pattern

- Make the smallest direct edit that solves the task.
- Prefer `index.html`, `robots.txt`, `sitemap.xml`, or image replacement for small site work.
- For JavaScript behavior changes, recommend source reconstruction unless the compiled edit is tiny and easy to verify.
- Do not delete old hashed assets without a reference audit.

## Verification

For static preview:

```powershell
python -m http.server 8080
```

Open `http://localhost:8080`, inspect the page, and check console/network errors.

Before commit, confirm `.env` remains ignored:

```powershell
git check-ignore -v .env _server_snapshots
```
