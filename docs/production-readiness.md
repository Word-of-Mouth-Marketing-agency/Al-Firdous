# Production readiness and release runbook

This runbook covers the Al Firdous Next.js/Payload application only. It does not authorize or perform VPS, DNS, SSL, OpenLiteSpeed, or production-database changes.

## Required production environment

Set these values in the release environment, without committing them:

```text
NODE_ENV=production
DATABASE_URL=postgres://<dedicated-user>:<password>@<database-host>:5432/al_firdous
PAYLOAD_SECRET=<long-random-secret>
NEXT_PUBLIC_SITE_URL=https://<real-public-hostname>
PORT=3000
HOSTNAME=127.0.0.1
PAYLOAD_MEDIA_DIR=/var/www/al-firdous/shared/media
TRUST_PROXY=true
```

`NEXT_PUBLIC_SITE_URL` must be HTTPS and must not be localhost. The application fails fast when required production values are missing or when preview content is enabled. `TRUST_PROXY=true` is appropriate only when the reverse proxy overwrites and protects `X-Forwarded-For`; otherwise leave it false and configure a trusted direct source before relying on IP-specific inquiry limits.

## Build and start

From the release directory:

```text
npm ci
npm run build:standalone
npm run start
```

`build:standalone` runs the production build and verifies that `.next/standalone/server.js`, `.next/standalone/.next/static/`, and `.next/standalone/public/` are present. `npm run start` launches the standalone server; `next start` is not used with this output mode.

Keep `/var/www/al-firdous/shared/media` outside release directories, preserve its ownership and permissions for the application user, and mount or copy it into every new release before startup. Do not rely on `.next/standalone/media` for production uploads.

Back up the persistent media directory separately from the database and keep an off-server copy. A media restore is required alongside a database restore when the selected catalog records reference uploaded files.

## Database backup and migration sequence

Use a dedicated Al Firdous database and a secret-managed `PGPASSWORD` or equivalent credential mechanism. Keep backups outside the application release directory and verify that the backup file is readable before migration.

```text
pg_dump --format=custom --file=<backup-dir>/al_firdous-<timestamp>.dump <dedicated-database>
npm run payload -- migrate:status
npm run payload -- migrate
npm run payload -- migrate:status
```

Run migrations only after the backup succeeds. Never use `migrate:fresh`, `DROP DATABASE`, or a reset command against production. Test new migrations against a disposable database first. Migrations are forward changes; a rollback plan must be a tested application rollback plus a reviewed forward database correction or a verified database restore. Do not claim that an application rollback alone reverses schema changes.

## Restore and rollback

To restore, stop only the Al Firdous application process, preserve the current release and media directory, and restore the selected Al Firdous database backup using the database operator's approved PostgreSQL procedure. Do not target another database or application. Verify the restored database before starting the application.

For an application-only rollback, keep the previous standalone release, point the service at that release, retain the persistent media directory, and run health and route checks. If the newer release applied a non-backward-compatible migration, use the reviewed database recovery plan rather than starting the old application against an incompatible schema.

## Health and security checks

After startup, verify:

```text
GET /api/health             -> {"status":"ok"}
GET /                      -> 200
GET /about                 -> 200
GET /products              -> 200
GET /contact               -> 200
GET /robots.txt            -> 200
GET /sitemap.xml            -> 200
```

The application sets a production Content Security Policy and baseline security headers. Configure HSTS at the HTTPS reverse proxy only after the certificate, redirect, and proxy behavior have been verified. Do not preload HSTS from the application without an intentional domain-wide policy review.

## Release order

1. Build and test the candidate release.
2. Verify the persistent media directory and permissions.
3. Take and verify a database backup.
4. Run Payload migrations and confirm migration status.
5. Start the candidate standalone release.
6. Check `/api/health`, the public routes, media URLs, `/admin`, robots, and sitemap.
7. Keep the previous release and backup until the acceptance window closes.
