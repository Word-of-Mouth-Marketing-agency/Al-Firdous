# Local Payload CMS workflow

This project uses an isolated native PostgreSQL 17 cluster for local CMS development. The existing PostgreSQL service on port `5432` is not used or modified by this project.

## Local services

- PostgreSQL data directory: `A:\Projects\al-firdous\.local\postgres`
- PostgreSQL port: `55432`
- Database: `al_firdous_local`
- App: <http://localhost:3000>
- Payload admin: <http://localhost:3000/admin>

The `.local` directory is ignored by Git. Do not commit its data or logs.

### Start and stop PostgreSQL

From PowerShell in the repository:

```powershell
npm run db:start
npm run db:status
npm run db:stop
```

The cluster was initialized once with `initdb` and a dedicated local role/database. Do not run a reset or fresh migration against another PostgreSQL instance.

The scripts operate only on this project's `.local\postgres` data directory and port `55432`. They identify the expected database and PostgreSQL data directory before stopping anything, so they do not stop a system PostgreSQL service or another project's database.

## Environment

Create or maintain the ignored `.env` file with these variables:

```text
DATABASE_URL=postgres://<local-role>:<local-password>@127.0.0.1:55432/al_firdous_local
PAYLOAD_SECRET=<long-random-local-secret>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Never commit `.env`, passwords, Payload secrets, database files, logs, or administrator credentials. `npm run import:catalog`, `npm run seed:local-cms`, and `npm run verify:local-cms` load `.env` directly.

## Schema and first administrator

The repository contains checked-in Payload migrations under `src/migrations`. Local development may continue using the existing schema and database; do not reset the local database to replay migrations. Use `npm run payload -- migrate:status` for inspection and reserve `npm run payload -- migrate` for an isolated migration verification database or a controlled production release.

Start the normal CMS-backed app with:

```text
npm run dev
```

For the convenient daily workflow, use:

```text
npm run dev:cms
```

`dev:cms` checks the isolated local PostgreSQL cluster, starts it when needed, and then runs the normal CMS-backed Next.js development server. It does not stop the database when the dev server exits.

Open `/admin`. On a new database Payload shows its first-user form. Create the administrator manually with credentials chosen by the operator; this repository does not contain or generate admin credentials. After that, `/admin` shows the authenticated dashboard.

## Catalog workflow

The canonical source folder is `A:\Downloads\firdous-media`. It contains exactly 57 source files. The preparation step creates optimized local WebP derivatives, the committed manifest, and the inventory report:

```text
npm run prepare:catalog -- A:/Downloads/firdous-media
```

Import the exact taxonomy, media, and product records with:

```text
npm run import:catalog
```

The import is idempotent by category/brand slug, product slug, and media filename. Re-running it updates the existing 57 products rather than creating duplicates. Every imported product is assigned to `concrete-pump-parts` and the `Schwing` brand, with `active: true`, `availability: on-request`, a real local media record, and the six deterministic featured records from the prepared manifest.

Seed the confirmed SiteSettings values and the provided logo with:

```text
npm run seed:local-cms
```

To use a different local logo path without changing the script:

```powershell
$env:LOCAL_SITE_LOGO_PATH='A:\Downloads\logo.png'
npm run seed:local-cms
```

The seed contains only the five confirmed contacts, the confirmed primary WhatsApp number, the three confirmed social URLs, the known company name/description metadata, and the supplied logo. It does not create fake email, address, hours, statistics, inquiries, or claims.

Verify the actual Payload database directly (not fallback JSON) with:

```text
npm run verify:local-cms
```

The verification checks 57 unique products, four categories, three brands, product images, pump-part/Schwing assignments, six featured products, five contacts, the primary WhatsApp value, logo/social settings, and that no inquiries were seeded.

## Preview versus normal mode

- `npm run dev` uses real Payload/PostgreSQL content and is the mode for CMS/admin testing.
- `npm run dev:cms` starts the isolated local PostgreSQL cluster if needed, then runs the same real CMS/PostgreSQL development mode.
- `npm run dev:preview` sets `HOMEPAGE_PREVIEW_CONTENT=true` and intentionally uses the committed fallback catalog/media so public pages remain reviewable when CMS content is unavailable.

Do not treat preview output as proof that the local CMS is connected. Use the normal server and `npm run verify:local-cms` for CMS verification.
