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

## Documentation-Only Closeout Verification

For a documentation-only closeout claim, run the verifier with an explicit range or file list:

```powershell
npm run verify:doc-only-closeout -- --base origin/main --head HEAD
npm run verify:doc-only-closeout -- --files docs/OPERATIONS.md
```

The script allows only `docs/**/*.md` by default and writes `output/doc-only-closeout.json`. It fails if public served files, compiled bundles, deploy workflow logic, or package/dependency files are included in the checked change set.

The PR that introduced this verifier was a governance tooling change, not a documentation-only PR, because it added the verifier script, `package.json`, `.gitignore`, and this operations note. Future documentation-only closeout checks should continue to fail package or dependency file changes by default.

## JavaScript Or CSS Change

The current repo contains compiled bundles, not source.

For small CSS tweaks, consider whether they can be isolated in `index.html` or the active CSS bundle.

For behavior changes:

1. Identify active bundles from `index.html`.
2. Check whether source maps provide recoverable source.
3. Prefer reconstructing source before changing minified code.
4. Do not edit many hashed bundles blindly.

## Conversion Hero / Services / Trust Band

`assets/nisbel-conversion-hero-services.js` renders the hero, problem-shaped services grid, and photo-backed trust band above the React `#root`. Verifier enforces:

- exactly 6 source occurrences of the service article tag
- presence of the literal `tel:+37256846555` and the human-readable phone label
- absence of the unverifiable warranty claim, the unverifiable average-time claim, brand-specialization claims, and the rating-related JSON-LD properties already forbidden by the existing verifier groups
- absence of the warranty and average-time claims anywhere inside the FAQ JSON-LD block

If a verifier-listed trust claim is later confirmed true by the owner, add it back to a JSON-LD block in `index.html` AND update the verifier's forbidden list in `scripts/verify-static-snapshot.mjs` to remove the corresponding string.

## SEO Landing Pages

Five directory-style pages live under their slugs at the repo root. Each is self-contained: own `<title>`, meta description, canonical URL pointing to itself, LocalBusiness + Service JSON-LD, and a link to the shared `assets/landing.css`.

When editing a landing page:

- keep the H1 stable; the verifier enforces an exact-match assertion per page
- keep `tel:+37256846555`, the literal address, and the canonical URL intact
- avoid the same forbidden tokens as the rest of the served files (warranty, average-time, brand-specialty, rating-related JSON-LD properties)
- update the sitemap `lastmod` for the affected URL and the verifier's `lastmod` assertion together when content materially changes

Adding a new landing page requires:

1. New `<slug>/index.html` with the standard head/header/hero/sections/contact/footer pattern.
2. New entry in `sitemap.xml`.
3. New entry in `requiredFiles` and `publicFiles` in `scripts/verify-static-snapshot.mjs`.
4. New row in the verifier's `landingPages` array (file, H1, canonical).
5. New `<loc>` sitemap assertion.

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
