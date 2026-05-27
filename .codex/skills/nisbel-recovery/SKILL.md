---
name: nisbel-recovery
description: Use when recovering or rolling back nisbel.ee, restoring files from GitHub to hosting, creating or using server snapshots, repairing a broken live site, or deciding how to return to a known-good NISBEL website state.
---

# NISBEL Recovery

## Recovery Priority

1. Latest known-good GitHub commit.
2. Local `_server_snapshots/`.
3. Hosting provider backup.
4. Fresh FTPS download from current server if still useful.

## Workflow

1. Read `AGENTS.md` and `docs/RECOVERY.md`.
2. Confirm target commit or snapshot.
3. Check `.env` and `_server_snapshots/` are ignored.
4. Before overwriting remote files, create a new server snapshot.
5. Restore only the approved public files.
6. Verify `https://nisbel.ee/`, active assets, `robots.txt`, and `sitemap.xml`.

## Git Safety

Prefer normal revert or restore commits. Do not rewrite history.

Examples:

```powershell
git revert <commit>
git restore --source <commit> -- path/to/file
```

Commit and push only with explicit approval.
