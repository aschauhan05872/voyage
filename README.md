# VOYAGE — Premium Birthstone Jewelry

Production-oriented ecommerce foundation for **VOYAGE**, a premium US-focused jewelry brand.

**Meaningful Gifts. Greater Journeys.**

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS 4
- PostgreSQL + Prisma ORM
- Zod validation
- Provider abstractions for payments, email, and analytics

## Architecture

Modular monolith:

```text
src/
  app/(storefront)/     Public pages
  components/           UI + layout + homepage sections
  lib/
    config/             Site configuration
    data/               Birthstone reference data
    db/                 Prisma client
    integrations/       Payment, email, analytics providers
    attribution/        UTM capture helpers
prisma/
  schema.prisma         Full ecommerce data model
  seed.ts               Birthstone product seed
```

## Phased roadmap

| Phase | Scope |
|-------|--------|
| 1 ✅ | Design system, header/footer, homepage, static pages |
| 2 | Homepage polish + featured products (data-driven) |
| 3 | Birthstone collection grid + filters |
| 4 | Product pages + gallery |
| 5 | Cart |
| 6–7 | Checkout + NOWPayments |
| 8 | Orders + webhooks |
| 9 | Analytics + UTM attribution |
| 10+ | Email, SEO, security, tests, deploy |

## Local setup

```bash
npm install
cp .env.example .env
# Edit DATABASE_URL and secrets

npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run typecheck
npm run db:generate
npm run db:migrate
npm run db:seed
```

## Environment

See `.env.example` for all variables. Never commit `.env`.

## License

Private — VOYAGE
