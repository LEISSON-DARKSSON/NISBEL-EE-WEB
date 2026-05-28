# Operations Guide

## Routine Content Change

Use this path for small text, meta, phone, address, opening-hours, SEO, or schema changes.

1. Read `AGENTS.md`.
2. Edit only the relevant public file, usually `index.html`.
3. Run a local static preview.
4. Check the page visually and inspect browser console.
5. Commit only after approval.
6. Deploy only after explicit approval.

## Image Change

1. Keep filenames stable if `index.html` or CSS already references them.
2. Prefer `.webp` for public page images when existing patterns support it.
3. Keep root images and `pictures/` separate by current usage.
4. Verify image dimensions and load paths locally.
5. Avoid replacing original images without retaining a rollback path in git.

## SEO Change

SEO-visible files:

- `index.html`
- `robots.txt`
- `sitemap.xml`
- public images referenced by Open Graph/Twitter tags

After edits, verify:

- `<title>`
- meta description
- canonical/public URLs if added
- Open Graph and Twitter image paths
- JSON-LD validity
- sitemap URLs and `lastmod`

## Static Snapshot Verification

Run before committing static or runtime changes:

```powershell
node scripts/verify-static-snapshot.mjs
```

For syntax-only validation of the verifier:

```powershell
node --check scripts/verify-static-snapshot.mjs
```

The same verifier runs in GitHub Actions through `.github/workflows/verify-static-snapshot.yml` on `push` and `pull_request`. The workflow is CI-only: it does not deploy, does not use secrets, does not install dependencies, and only requires repository read access.

The check protects the current static snapshot invariants for PR 1 SEO/trust hygiene, PR 2 mobile conversion actions, and PR 3 trust content blocks. It checks for required runtime script references, canonical sitemap shape, stale title/address regressions, unsupported rating markup, and review schema objects.

This does not replace rendered-browser verification, FTPS post-deploy checks, manual review of new claims or copy, or the approval gates for commit, push, and deploy.

## JavaScript Or CSS Change

The current repo contains compiled bundles, not source.

For small CSS tweaks, consider whether they can be isolated in `index.html` or the active CSS bundle.

For behavior changes:

1. Identify active bundles from `index.html`.
2. Check whether source maps provide recoverable source.
3. Prefer reconstructing source before changing minified code.
4. Do not edit many hashed bundles blindly.

## Asset Cleanup

Do not remove old hashed bundles just because they are not referenced directly in `index.html`.

Before cleanup:

1. Search references from HTML, CSS, JS, maps, sitemap, and docs.
2. Produce a keep/delete list.
3. Commit cleanup separately from content changes.
4. Verify local preview and live deploy package.

## Recommended Local Preview

```powershell
python -m http.server 8080
```

Open:

```text
http://localhost:8080
```

This verifies static file paths, but it does not prove production host headers, cache, analytics, or server rewrite behavior.
