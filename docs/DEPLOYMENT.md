# Deployment And FTPS Operations

## Connection Model

Use `.env` for local connection configuration. Do not paste secrets into commands, logs, commits, issues, or pull requests.

Expected FTPS values:

```env
FTP_HOST=912ffb6e2e.testlink.ee
FTP_PORT=21
FTP_USER=vhost136241f0
FTP_TLS=explicit
FTP_TLS_VERIFY=false
FTP_PASSIVE=true
FTP_REMOTE_ROOT=/htdocs
```

The server requires FTPS. Plain FTP fails because TLS is required on the control channel.

`FTP_TLS_VERIFY=false` is currently used because the test-domain certificate name does not match the FTPS hostname. If using a hostname with a matching certificate later, prefer verification.

## Server Paths

- FTP-visible live root: `/htdocs`
- Hosting panel document root: `/www/apache/domains/www.nisbel.ee/htdocs`
- Public domain: `https://nisbel.ee`

The FTP account starts effectively in the live site area. Confirm the remote path with a read-only listing before upload.

## Download Workflow

1. Confirm local repo:

```powershell
git status --short --branch
```

2. Confirm ignored secrets:

```powershell
git check-ignore -v .env _server_snapshots
```

3. Download with a resumable FTPS script or tool that:

- reads `.env`,
- uses explicit TLS,
- retries interrupted transfers,
- skips files whose size already matches,
- does not print passwords.

4. Review changed files before commit.

## Upload Workflow

Uploads are deployment-sensitive. Do not upload without explicit approval for that operation.

Before upload:

1. Ensure working tree contains only intended changes.
2. Create or refresh a server snapshot.
3. List the target remote path.
4. Prepare a dry-run file list.
5. Upload only the confirmed files.
6. Verify live pages and assets.

## Do Not Upload

- `.git/`
- `.env`
- `_server_snapshots/`
- local notes or temporary files
- incomplete `.download` files

## Post-Deploy Verification

Check at minimum:

- `https://nisbel.ee/`
- `https://nisbel.ee/robots.txt`
- `https://nisbel.ee/sitemap.xml`
- browser console for missing active assets
- key images used by the landing page
