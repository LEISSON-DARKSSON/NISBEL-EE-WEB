# NISBEL-EE-WEB

Repository for the current `nisbel.ee` website snapshot and operational recovery files.

This is not currently a normal source-code application repo. It contains the static files downloaded from the hosting account document root, including the live `index.html`, compiled assets, images, sitemap, robots file, and a small local operations configuration template.

## Live Site

- Public URL: https://nisbel.ee
- Domain: `nisbel.ee`
- Hosting hostname: `misam.elkdata.ee`
- FTPS test domain: `912ffb6e2e.testlink.ee`
- Server document root: `/www/apache/domains/www.nisbel.ee/htdocs`
- FTP-visible live root: `/htdocs`
- GitHub repo: https://github.com/LEISSON-DARKSSON/NISBEL-EE-WEB

## Repository Shape

- `index.html` is the current public entrypoint.
- `assets/` contains compiled JavaScript, CSS, and source maps. Only the files referenced by `index.html` are active for the current page load.
- `pictures/` contains blog and content imagery.
- Root image files are used by the landing page and metadata.
- `robots.txt` and `sitemap.xml` control crawler guidance.
- `www/apache/domains/www.nisbel.ee/htdocs/dist/` is a server-path mirror from the hosting account. Treat it as a snapshot artifact unless confirmed otherwise.
- `.env.example` documents local connection settings. Real `.env` is ignored and must never be committed.

## Common Tasks

For content, SEO, image, deploy, or recovery work, read `AGENTS.md` first.

Useful docs:

- `docs/REPO_STATE.md` - current technical state and caveats.
- `docs/DEPLOYMENT.md` - FTPS download/upload workflow.
- `docs/OPERATIONS.md` - routine editing and verification guidance.
- `docs/RECOVERY.md` - restoring the site from GitHub or refreshing from server.
- `docs/SECURITY.md` - secrets and sensitive operational rules.
- `docs/SOURCE_RECONSTRUCTION.md` - source-map based reconstruction notes.

## Local Preview

This is a static site snapshot. A simple static file server is enough for inspection:

```powershell
python -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

Do not assume that changing compiled files is equivalent to changing the original source application. If a change becomes larger than a small static edit, reconstruct or restore the real source project first.
