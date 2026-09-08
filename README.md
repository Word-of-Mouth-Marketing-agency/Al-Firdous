# Al Firdous / الفردوس

Arabic-first product catalog and inquiry website for Al Firdous, a company that supplies spare parts for concrete pumps, mixers, and batching plants.

## Stack

- Next.js 16.3.3 with the App Router and TypeScript
- React 19.2.6
- Payload CMS 3.88.0 in the same application
- PostgreSQL through `@payloadcms/db-postgres` 3.88.0
- Tailwind CSS 4.3.3 through `@tailwindcss/postcss` 4.3.3
- Node.js 20.9+ required by the framework; Node.js 24 LTS is the current local runtime
- npm lockfile and scripts; no Docker or production deployment is required for local development

The Payload blank template supplied the current Next.js/Payload route integration. Package versions remain aligned across Payload packages; update them together when upgrading.
The production script uses `next build --webpack` because the Payload integration includes a custom resolver configuration; development remains on the current Next.js Turbopack path.

## Local development

1. Copy `.env.example` to `.env`.
2. Set a real local PostgreSQL connection string and a long random `PAYLOAD_SECRET`.
3. Install dependencies with `npm install`.
4. Start the development server with `npm run dev`.
5. Open the public site at `http://localhost:3000` and the CMS at `http://localhost:3000/admin`.

Useful commands:

```text
npm run dev
npm run typecheck
npm run lint
npm run test:int
npm run test:e2e
npm run build
npm run start
npm run generate:types
npm run generate:importmap
npm run import:catalog
```

`npm run test:e2e` starts the local preview server through Playwright. It validates the public homepage, route navigation, catalog search/filter behavior, product detail inquiry flow, contact information, Arabic RTL attributes, and mobile menu behavior.

The supplied product media is processed deterministically with:

```text
npm run prepare:catalog -- A:/Downloads/firdous-media
```

This writes optimized WebP files to `public/images/products/catalog`, a committed manifest at `src/data/product-catalog.json`, and the audit table at `docs/product-media-inventory.md`. Once a valid local PostgreSQL database and authenticated Payload environment are available, `npm run import:catalog` creates/updates the four approved categories, the three supported-brand records, media records, and idempotent product records.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string for Payload |
| `PAYLOAD_SECRET` | Yes | Long random secret for Payload authentication and encryption |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Public site origin used for canonical URLs, Open Graph URLs, robots, sitemap, CORS, and CSRF origins |

`.env` and local database credentials are ignored by Git. Never commit them.

## Project structure

```text
src/
├── app/
│   ├── (frontend)/             # Public RTL route shells and metadata routes
│   └── (payload)/              # Payload admin panel and API routes
├── collections/                # Users, media, products, categories, brands
├── components/site/            # Small reusable public route primitives
├── globals/                    # Site-wide CMS settings
├── lib/                        # Shared SEO and URL helpers
└── payload.config.ts           # Single CMS/database configuration
```

## CMS architecture

Payload includes these collections:

- `users`: authenticated CMS administrators
- `media`: development-local image uploads under `media/`; the collection is ready to move to an object-storage adapter later
- `products`: catalog records with no price field, category/brand relationships, specifications, compatibility, images, availability, and SEO fields
- `inquiries`: public contact-form submissions with name, phone, subject, message, source, optional related product, and workflow status
- `product-categories`: the four approved category records can be created by an administrator without seeded fake content
- `brands`: supports Zoomlion, Schwing, and Putzmeister records without claiming authorized-dealer status

The `site-settings` global centralizes company name, logo, the five confirmed contact records, optional primary WhatsApp, the three confirmed social URLs, and default SEO values. Contact and social values are stored in CMS configuration defaults so they do not need to be repeated in public components.

There is intentionally no price, cart, checkout, payment, or public ecommerce flow.

## Routes and SEO

Public routes are available at `/`, `/about`, `/products`, `/products/[slug]`, and `/contact`. The products page supports server-rendered `q`, `category`, `brand`, and `page` query parameters. Product records remain inquiry-only: there is no price, cart, checkout, or payment flow.

The foundation also includes:

- Arabic `lang="ar"` and RTL `dir="rtl"` on the public root layout
- optimized Arabic typography through `next/font/google` using Noto Sans Arabic
- reusable metadata helpers with canonical and Open Graph support
- `robots.txt` and `sitemap.xml` metadata routes for the known public pages
- product and category metadata helper functions ready for dynamic routes in a later pass
- basic neutral and brand design tokens only

## Security and production constraints

- Payload admin and write operations require authenticated CMS users where configured.
- CORS and CSRF origins are limited to `NEXT_PUBLIC_SITE_URL` when it is set.
- Server-only values stay in server configuration and are not prefixed with `NEXT_PUBLIC_`.
- Basic secure response headers are configured in `next.config.ts`.
- Next.js standalone output is enabled for a lightweight single-process Node deployment behind OpenLiteSpeed.
- No production database, VPS, DNS, SSL, reverse proxy, port, or other application was changed in this pass.
- Local media is development-only; use an approved external/object-storage adapter before a large production media library is introduced.
- The application is designed as one lightweight Next.js/Payload runtime without Redis, worker processes, or microservices.

## Content and fallback boundary

Payload remains the production content source. When the local database is unavailable or does not yet contain catalog products, the public frontend falls back to the committed, client-supplied media manifest so the site remains reviewable without inventing prices, technical specifications, compatibility, certifications, addresses, or partnership claims. The fallback never replaces the Payload architecture.

The 57 supplied media files are published as 57 distinct catalog records. Seven exact visual-duplicate pairs are documented as a diagnostic, but are intentionally not merged because each source file represents a separate supplied product record. All records map to the `concrete-pump-parts` category and the confirmed `Schwing` brand filter.
