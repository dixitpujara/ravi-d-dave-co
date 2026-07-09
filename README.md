# Ravi D Dave & Co. — Chartered Accountants

Official website for **Ravi D Dave & Co.**, a Chartered Accountant firm based in
Surendranagar, Gujarat, India — built with **Next.js (App Router)**.

Services: Income Tax Return (ITR) filing, GST registration & compliance, tax planning,
accounting & bookkeeping, audit & assurance, company & LLP registration, ROC compliance,
TDS, payroll and financial consulting.

## Tech

- **Next.js 14 (App Router)** + React 18, TypeScript.
- Fonts self-hosted via `next/font` (Plus Jakarta Sans + Fraunces) — no external requests.
- Static assets in `public/`; global styles in `app/globals.css`.
- Fully server-rendered marketing markup for SEO.

## SEO

- Rich metadata via the Next.js Metadata API — title/description, canonical, Open Graph
  and Twitter cards (1200×630 share image), robots directives, icons and theme colour.
- JSON-LD structured data (`AccountingService` / `LocalBusiness`) with address, opening
  hours, service catalog and founder.
- Auto-generated `sitemap.xml`, `robots.txt` and web app manifest.

Set the production URL so absolute SEO URLs resolve correctly:

```
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
```

## Build & run

```bash
npm run build
npm start
```

## Deploy

Deploys on **Vercel** with zero configuration (Next.js is auto-detected). Import this
repository in the Vercel dashboard, or run `vercel`.

---

Contact: +91 91739 56571 · caravidave33@gmail.com · Ami Complex, Milan Cinema Road,
Ambedkarnagar, Surendranagar – 363002, Gujarat
