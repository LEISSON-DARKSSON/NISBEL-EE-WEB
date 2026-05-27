# NISBEL-EE-WEB Agent Instructions

## Repository Purpose

This repository is the operational snapshot and recovery source for the public `nisbel.ee` static website.

Treat the repo as a static live-site snapshot unless a future commit adds a verified source tree, package manager config, and reproducible build process.

## Hard Boundaries

- Do not assume a build pipeline exists.
- Do not install dependencies unless explicitly requested.
- Do not scaffold or replace the site with a framework unless explicitly requested.
- Do not rewrite git history.
- Do not deploy, upload, delete, or overwrite server files without explicit confirmation for that operation.
- Do not commit `.env`, FTPS passwords, database passwords, database URLs, hosting panel secrets, or private server snapshots.
- Do not print full credential-bearing URLs or secret values in command output or summaries.

## Current Important Files

- `index.html` is the live entrypoint.
- `assets/` is compiled output with many historical hashed bundles. Only files referenced from `index.html` are active for the current page load.
- `pictures/` and root image files are public media assets.
- `robots.txt` and `sitemap.xml` are public SEO/crawler files.
- `.env.example` documents required local connection keys.
- `.env` is local-only and ignored.
- `_server_snapshots/` is local-only and ignored.
- `www/apache/domains/www.nisbel.ee/htdocs/dist/` is a server-path mirror artifact, not the confirmed active source.

## Before Editing

1. Run `git status --short --branch`.
2. Identify whether the task is public content, SEO, assets, FTPS ops, recovery, or source reconstruction.
3. Read the matching doc under `docs/`.
4. Keep edits tightly scoped. Avoid broad recursive cleanup.
5. Preserve unrelated dirty work.

## Static Site Editing Rules

- Prefer editing `index.html`, `robots.txt`, `sitemap.xml`, or public media directly only for small, targeted fixes.
- For JavaScript or CSS behavior changes, first determine whether the change can be made safely in compiled assets. If not, recommend source reconstruction.
- Before deleting anything under `assets/`, prove it is not referenced by `index.html`, CSS, JS, source maps, sitemap, or other public files.
- Do not remove source maps without an explicit decision; they may be useful for source reconstruction.

## FTPS and Deploy Rules

- Use `.env` for connection values.
- Use FTPS explicit TLS on port `21`.
- `FTP_TLS_VERIFY=false` is expected for the test-domain certificate mismatch unless the hostname/certificate situation changes.
- Treat `/htdocs` as the FTP-visible live root.
- Prefer dry-run/listing/snapshot before upload or deletion.
- Make a server snapshot before any destructive or broad upload.
- Verify live URLs after deploy.

## Git Rules

- Commit only after the user explicitly approves.
- Push only after the user explicitly approves.
- Before committing, verify:

```powershell
git check-ignore -v .env _server_snapshots
git diff --cached --name-only
```

- If `.env` is staged, stop and unstage it.

## Verification Expectations

For documentation-only changes:

```powershell
git status --short --branch
```

For static site changes:

```powershell
python -m http.server 8080
```

Then inspect `http://localhost:8080`.

For FTPS tasks, verify with read-only remote listing before write operations.
