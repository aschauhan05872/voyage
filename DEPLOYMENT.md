# VOYAGE — Deployment

This document describes how to deploy VOYAGE with **automatic, safe Prisma migrations**.

No hosting platform has been committed yet (no Dockerfile, CI/CD, or Vercel config). Use the workflow below on whichever platform you choose.

## Current architecture

| Item | Status |
|------|--------|
| Application | Next.js 16 (App Router) |
| Database | PostgreSQL via Prisma |
| Migration history | `prisma/migrations/` (version-controlled) |
| Platform config | **Not selected** — add platform-specific hooks using the commands below |

## Production migration command

```bash
npm run deploy:migrate
```

This runs `prisma migrate deploy` and **exits non-zero** if:

- `DATABASE_URL` is missing
- A migration fails
- The database schema is incompatible

Equivalent direct command:

```bash
npm run db:migrate:deploy
# or: npm run db:deploy
```

### Do not use in production

- `prisma migrate dev` — development only; can reset local state
- `prisma db push` — bypasses migration history
- `prisma migrate reset` — destructive

## Deployment order

Run steps in this order on every production release:

1. **Install dependencies** — `npm ci`
2. **Generate Prisma Client** — `npm run db:generate` (also runs on `postinstall`)
3. **Apply pending migrations** — `npm run deploy:migrate`
4. **Build application** — `npm run build`
5. **Start application** — `npm run start`

Or combine steps 2–3:

```bash
npm run deploy:prepare
npm run build
npm run start
```

Migrations are a **deployment step**, not part of `next build`. Do not run migrations inside the build script unless your platform only supports a single build phase—in that case use `deploy:prepare && next build` as one build command.

## Platform placement (when you choose one)

| Platform | Suggested hook |
|----------|----------------|
| **Vercel** | Not ideal for long-running Postgres migrations on serverless; use a release job or external migrate step before promote |
| **Railway / Render / Fly.io** | **Release command:** `npm run deploy:migrate` · **Build command:** `npm ci && npm run deploy:prepare && npm run build` · **Start:** `npm run start` |
| **VPS / Docker** | Run `npm run deploy:prepare` before `npm run build` in your deploy script; abort on non-zero exit |
| **GitHub Actions** | Separate job step: `npm run deploy:migrate` with `DATABASE_URL` secret, before or in parallel with build |

## DATABASE_URL

- Set **`DATABASE_URL`** in the deployment environment (server-side only).
- Never use `NEXT_PUBLIC_DATABASE_URL` — credentials must not reach the browser.
- Each environment (development, staging, production) must have its **own** database URL.
- `scripts/deploy-migrate.mjs` fails immediately if `DATABASE_URL` is unset.

## Migration failure behavior

If `prisma migrate deploy` fails:

1. The script exits with code `1`
2. The deployment must **stop**
3. Do **not** start the new app version against an old schema
4. Do **not** auto-reset or drop the database

Fix the migration or database state manually, then redeploy.

## Development vs production

| Task | Command |
|------|---------|
| Create migration after schema change | `npm run db:migrate` |
| Apply migrations locally | `npm run db:migrate` |
| Apply migrations in production | `npm run deploy:migrate` |
| Generate client | `npm run db:generate` |

After changing `prisma/schema.prisma`, always create a migration in development, commit it under `prisma/migrations/`, then deploy.

## Seeding

```bash
npm run db:seed
```

**Do not run seed automatically in production deploys.**

The seed script (`prisma/seed.ts`) is **development-oriented**:

- Creates/updates a default admin user
- Upserts birthstone catalog products with `update: {}` (does not overwrite existing product fields on update)

It is **not idempotent for admin passwords** on re-run (upsert with empty update leaves existing hash). Treat seed as **local/staging bootstrap only**, not a production catalog loader.

## Rollback

- Application rollback (redeploy previous git SHA) does **not** reverse database migrations.
- Prisma migrations are **forward-only** in production.
- If you roll back app code, ensure the old version remains compatible with the current schema, or plan a forward migration.

## Concurrent deployments

Prisma uses advisory locking during `migrate deploy`. If two deploys run migrations simultaneously, one will wait or fail. Prefer:

- Single deploy pipeline per environment
- Platform-native “one release at a time” behavior

## Health checks

After deploy, the app should only receive traffic when:

1. Migrations succeeded
2. `next start` is running
3. Database connectivity works for routes that require it

Use your platform’s health check against `/` or a dedicated route after the release command completes.

## First-time production database

If the database is empty, `prisma migrate deploy` applies all migrations in order:

1. `20250821120000_init` — core ecommerce schema
2. `20250821120001_add_order_assistance_request` — order assistance requests

If you previously used `prisma db push` against a database, reconcile manually before running `migrate deploy` (baseline or align drift).

## Example CI step

```yaml
- name: Install
  run: npm ci
- name: Migrate database
  run: npm run deploy:migrate
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
- name: Build
  run: npm run build
```

## Example VPS deploy script

```bash
#!/usr/bin/env bash
set -euo pipefail

npm ci
npm run deploy:prepare   # generate + migrate deploy (fails if DATABASE_URL missing)
npm run build
npm run start
```
