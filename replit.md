# Dzair-Tech Marketplace

## Overview

A full-featured phones & accessories marketplace web app for Algeria called **Dzair-Tech** (دزير-تك). Built as a pnpm workspace monorepo using TypeScript.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite, TailwindCSS, shadcn/ui, wouter routing, framer-motion, react-hook-form

## Features

- **Homepage**: Hero with search, featured listings, category grid, brand carousel
- **Listings page**: Filter by category, brand, wilaya, price range, condition (Neuf/Occasion/Reconditionné)
- **Listing detail**: Image gallery, specs table, seller contact (Appeler + WhatsApp), safety tips
- **Post ad**: 3-step form (Category → Details → Contact) with validation
- **About page**: Marketplace information
- **58 Algerian Wilayas** for location filtering
- **Currency**: Algerian Dinar (DZD / DA)
- **Language**: French (primary)

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server
│   └── marketplace/        # React + Vite frontend (previewPath: /)
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
│       └── src/schema/
│           ├── wilayas.ts      # 58 Algerian wilayas
│           ├── categories.ts   # 8 product categories
│           ├── brands.ts       # 12 phone brands (Samsung, Apple, Xiaomi...)
│           └── listings.ts     # Phone/accessory listings
├── scripts/
│   └── src/seed.ts         # Seed script with rich Algerian data
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## API Endpoints

All endpoints are under `/api`:

- `GET /api/healthz` — Health check
- `GET /api/listings` — Paginated listings with filters (category, brand, wilaya, condition, price range, search)
- `GET /api/listings/featured` — Featured listings for homepage
- `GET /api/listings/:id` — Single listing detail (increments view counter)
- `POST /api/listings` — Create a new listing
- `GET /api/categories` — All categories with listing counts
- `GET /api/brands` — All brands with listing counts
- `GET /api/wilayas` — All 58 Algerian wilayas

## Database

- `wilayas` — 58 Algerian wilayas (code, name FR, name AR)
- `categories` — 8 categories (Smartphones, Tablettes, Accessoires, Écouteurs, Montres, Chargeurs, Coques, Gaming)
- `brands` — 12 brands (Samsung, Apple, Xiaomi, Huawei, Oppo, Vivo, Realme, Honor, Tecno, Infinix, Nothing, OnePlus)
- `listings` — Marketplace listings with specs, images, seller info

## Seeding

Run seed to populate database with test data:
```bash
pnpm --filter @workspace/scripts run seed
```

## Development

- `pnpm --filter @workspace/api-server run dev` — Run API server
- `pnpm --filter @workspace/marketplace run dev` — Run frontend
- `pnpm --filter @workspace/api-spec run codegen` — Regenerate API client from OpenAPI spec
- `pnpm --filter @workspace/db run push` — Push schema changes to database
- `pnpm run typecheck` — Full TypeScript typecheck
