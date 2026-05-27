# Recovery Guide

Use this when the live site is broken, files were overwritten, or the hosting account must be repopulated from GitHub.

## Recovery Sources

Preferred order:

1. Latest known-good GitHub commit.
2. Local `_server_snapshots/` if available.
3. Hosting provider backups if available.
4. Fresh FTPS download from current server if the server is still partially usable.

## Restore From GitHub To Hosting

Do not upload until explicitly approved.

1. Confirm the commit to restore:

```powershell
git log --oneline -5
```

2. Confirm secrets are ignored:

```powershell
git check-ignore -v .env _server_snapshots
```

3. Create a server snapshot before overwriting anything.
4. Prepare a dry-run upload list excluding:

- `.git/`
- `.env`
- `_server_snapshots/`
- local temp files
- docs or repo-only files if the live server does not need them

5. Upload public site files to `/htdocs`.
6. Verify `https://nisbel.ee/`, active assets, `robots.txt`, and `sitemap.xml`.

## Refresh Local Snapshot From Server

1. Ensure local dirty work is understood:

```powershell
git status --short --branch
```

2. Download from `/htdocs` with resume and retry.
3. Review diffs.
4. Commit only confirmed server changes.

## Rollback Strategy

For small changes, prefer a normal revert commit rather than history rewrite:

```powershell
git revert <commit>
```

For emergency file restore, checkout specific files from a known-good commit:

```powershell
git restore --source <commit> -- path/to/file
```

Review and commit the restore before deploying.
