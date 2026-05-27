# Security Notes

## Secrets

Never commit:

- `.env`
- FTPS password
- MySQL password
- PostgreSQL password
- full credential-bearing database URLs
- hosting control panel credentials
- private server snapshots

The repository includes `.env.example` for structure only.

## Safe Reporting

When reporting configuration, use host categories or non-secret identifiers.

Acceptable:

- `FTP_HOST=912ffb6e2e.testlink.ee`
- `FTP_USER=vhost136241f0`
- `MYSQL_DATABASE=vhost136241s1`
- `POSTGRES_DATABASE=vhost136241p0`

Not acceptable:

- real passwords
- full `DATABASE_URL` values with credentials
- command output that includes secrets

## Git Checks

Before commit:

```powershell
git status --short --branch
git check-ignore -v .env _server_snapshots
git diff --cached --name-only
```

If `.env` is staged, stop immediately and unstage it.

## FTPS

Use explicit FTPS. Plain FTP is rejected by the server and should not be used.

Because the provided test domain has a TLS certificate name mismatch, local scripts may need `FTP_TLS_VERIFY=false`. This should be treated as a host-specific compatibility setting, not a general preference.

## Database Connections

The `.env.example` includes MySQL and PostgreSQL keys because the hosting account exposes both database types.

Do not assume the static public site currently uses a database. Confirm actual code paths before running database queries or migrations.

Do not run destructive database commands from this repo unless a future source application and migration workflow are documented.
