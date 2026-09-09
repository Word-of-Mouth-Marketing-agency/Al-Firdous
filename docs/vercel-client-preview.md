# Vercel client preview

This deployment path is temporary and read-only. It exists so the client can review the finished frontend online; it does not replace the VPS production runtime.

## Vercel environment

Set:

```text
VERCEL_CLIENT_PREVIEW=true
```

No `DATABASE_URL`, `PAYLOAD_SECRET`, or `PAYLOAD_MEDIA_DIR` is required for this preview. Vercel provides `VERCEL_URL`; the application uses it as the HTTPS canonical and Open Graph host. The preview is `noindex, nofollow`, blocks crawling in `robots.txt`, disables the Payload admin surface, and uses the committed 57-product catalog and media.

The contact form remains visible for design review, but inquiry persistence is disabled. The preview directs visitors to WhatsApp at `01031080031`; product and floating WhatsApp links remain active.

## Vercel Project Settings

- Node.js version: `24.x`
- Framework preset: `Next.js`
- Build command: `npm run build`
- Install command: `npm ci`
- Output directory: leave the default/empty value; Vercel manages the Next.js output
- Environment variable: `VERCEL_CLIENT_PREVIEW=true` for Preview (and Production only if the project is intentionally used solely as a temporary client preview)
- Do not set `DATABASE_URL`, `PAYLOAD_SECRET`, or `PAYLOAD_MEDIA_DIR` for this preview

Do not configure `npm run build:standalone` or `node .next/standalone/server.js` in Vercel.

## VPS boundary

The real deployment remains the self-hosted VPS with PostgreSQL, Payload, persistent media, and strict production validation. Use the production variables documented in `docs/production-readiness.md`, then run `npm run build:standalone` and `npm run start` there.
