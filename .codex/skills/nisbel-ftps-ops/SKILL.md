---
name: nisbel-ftps-ops
description: Use for NISBEL nisbel.ee FTPS operations, including downloading the live site, uploading/deploying files, listing hosting paths, refreshing snapshots, or using FTP_HOST, FTP_USER, FTP_PASSWORD, FTP_REMOTE_ROOT, and hosting document root values.
---

# NISBEL FTPS Ops

## Rules

- Read `.env`; never print secret values.
- Use explicit FTPS on port `21`.
- Use passive mode unless the host configuration changes.
- Treat `/htdocs` as the FTP-visible live root.
- Do not upload, delete, or overwrite remote files without explicit approval.
- Prefer read-only listing and dry-run file lists before writes.

## Expected Environment Keys

```env
FTP_HOST=912ffb6e2e.testlink.ee
FTP_PORT=21
FTP_USER=vhost136241f0
FTP_PASSWORD=
FTP_TLS=explicit
FTP_TLS_VERIFY=false
FTP_PASSIVE=true
FTP_REMOTE_ROOT=/htdocs
FTP_TIMEOUT_SECONDS=90
FTP_RETRIES=5
```

`FTP_TLS_VERIFY=false` is expected for the test-domain certificate mismatch unless a matching TLS hostname is used.

## Download Pattern

- Use retries.
- Skip files with matching local size.
- Remove partial `.download` files after success.
- Keep `.env`, `.env.example`, `.gitignore`, `.git/`, and `_server_snapshots/` protected.

## Upload Pattern

Before upload:

1. `git status --short --branch`
2. Confirm intended changed files.
3. Create a remote snapshot.
4. List remote target.
5. Upload only approved files.
6. Verify live URLs.
