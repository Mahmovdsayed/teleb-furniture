# Teleb Furniture

Turborepo monorepo for the Teleb storefront, admin dashboard and API.

## Stack

| Concern | Choice |
| --- | --- |
| Monorepo | Turborepo 2 (`turbo.json`, tasks in `tasks`) |
| Package manager | Bun 1.4 workspaces, single root `bun.lock` |
| Frontend | Next.js 16 (App Router, Turbopack) |
| Backend | Hono 4 + Bun, deployed on Vercel |
| UI | Tailwind CSS v4 + shadcn/ui (`base-mira`, `neutral`, RTL) |
| Validation | Zod v4 |
| API communication | Hono RPC (`hono/client` `hc<AppType>`) |
| Language | TypeScript 7 |

## Structure

```text
teleb-furniture/
├── apps/
│   ├── client/          # Next.js storefront (package name: teleb)
│   ├── dashboard/       # Next.js admin dashboard (package name: dashboard)
│   └── server/          # Hono + Bun API (@teleb/server)
├── packages/
│   ├── api-client/      # @teleb/api-client – typed Hono RPC client
│   ├── config/          # @teleb/config – tsconfig / eslint / prettier presets
│   ├── types/           # @teleb/types – shared types
│   ├── ui/              # @teleb/ui – shadcn/ui foundation, tokens, global CSS
│   ├── utils/           # @teleb/utils – shared helpers
│   └── validations/     # @teleb/validations – shared Zod schemas
├── bun.lock             # the only lockfile
├── package.json         # workspaces: apps/*, packages/*
└── turbo.json
```

## Getting started

```bash
bun install
bun dev            # all apps (client :3000, dashboard falls back to :3001, server :8080)
```

Environment: `apps/server` needs its own `.env` (`DATABASE_URL`, `REDIS_URL`, `JWT_SECRET`,
`SMTP_*`, …), and each Next app reads `NEXT_PUBLIC_API_URL` for the API origin
(`http://localhost:8080` locally, `https://api.teleb-furniture.com` in production).

## Commands

```bash
bun dev            # turbo run dev          (persistent, all apps)
bun build          # turbo run build        (Next apps; @teleb/* need no build step)
bun lint           # turbo run lint         (client, dashboard, @teleb/ui)
bun typecheck      # turbo run typecheck    (every app and package)
bun check-types    # alias for bun typecheck
bun format         # prettier --write
```

Filtering with Turborepo:

```bash
bun dev --filter=teleb            # storefront only
bun dev --filter=dashboard        # dashboard only
bun dev --filter=@teleb/server    # API only
bun build --filter=teleb...
bun typecheck --filter=./packages/*
```

Convenience wrappers: `bun dev:client`, `bun dev:dashboard`, `bun dev:server`,
`bun build:client`, `bun build:dashboard`.

## Hono RPC

`apps/server` is the source of truth for the API types:

```ts
// apps/server/src/index.ts
const app = new Hono<AppEnv>().basePath("/v1").route("/products", productRoutes) /* … */;

export type AppType = typeof app;
export default app;
```

Route registration everywhere in the server is **chained** (`.get().post().patch()`), which is what
makes `typeof app` carry every path, method, request input and response body.

`@teleb/server` exposes that type through a **types-only** package export:

```jsonc
// apps/server/package.json
"exports": { ".": { "types": "./src/index.ts" } }
```

```ts
// packages/api-client/src/client.ts
import { hc } from "hono/client"
import type { AppType } from "@teleb/server"   // erased at build time

export const api = hc<AppType>(getApiOrigin())
```

Usage in either Next app:

```tsx
import { api } from "@teleb/api-client"

// routes are registered under the /v1 base path
const response = await api.v1.products.$get({ query: { limit: 12, page: 1 } })

if (response.ok) {
  const data = await response.json() // typed from the server controller
}
```

Why the runtime dependency is impossible:

* the `@teleb/server` export declares **only** a `types` condition — a runtime `import` from it does
  not resolve, so a bundler cannot accidentally include the server;
* `@teleb/api-client` uses `import type`, which TypeScript and SWC strip;
* the dependency edge is one-way (`api-client → server`); the server never imports a frontend package.

## Shared packages

| Package | Contents | Consumed by |
| --- | --- | --- |
| `@teleb/ui` | shadcn/ui foundation, `src/styles/globals.css` tokens, `cn()` | client, dashboard |
| `@teleb/api-client` | `hc<AppType>` client + origin resolution | client, dashboard |
| `@teleb/validations` | Zod schemas shared byte-for-byte between apps | client, dashboard, server |
| `@teleb/types` | types identical across apps (`Banner*`, `ApiResponse`) | client, dashboard |
| `@teleb/utils` | `formatDate`, `ConfettiFireworks` | client, dashboard |
| `@teleb/config` | tsconfig/eslint/prettier presets | all `packages/*` |

Each package's README documents exactly what was shared and what deliberately stayed app-local
(entities whose client/dashboard/server shapes disagree are **not** merged).

### UI / Tailwind / shadcn

* shadcn components are installed into `packages/ui` (`bunx shadcn@latest add <component>` run from an
  app). Both apps' `components.json` point `ui` → `@teleb/ui/components` and `utils` →
  `@teleb/ui/lib/utils`.
* Components are imported through the package export map, e.g.
  `import { Button } from "@teleb/ui/components/button"`.
* Tailwind scans the package via `@source "../**/*.{ts,tsx}"` in
  `packages/ui/src/styles/globals.css`; each app's `app/globals.css` imports
  `@teleb/ui/globals.css` and keeps only app-specific styles (font variables, client view transitions).
* Both Next apps list the `@teleb/*` packages in `transpilePackages`.

## Deployment notes (Vercel)

* The two Next apps deploy as usual; both import workspace packages that ship raw TypeScript, which
  Turbopack transpiles (they are also listed in `transpilePackages`).
* `apps/server` keeps its existing Hono + Bun setup (`vercel.json` with `bunVersion`, the
  `contact-classification` queue function, `Bun.serve` in `src/server.ts`). No build script or deploy
  behaviour was added.
* **Check on the server project:** it now imports `@teleb/validations` at runtime, so the Vercel build
  must see the workspace root. If the project's Root Directory is `apps/server` with an isolated
  install, set the Root Directory to the repository root (or add
  `"functions": { "queues/contact-classification.ts": { "includeFiles": "../../packages/**" } }`) and
  verify a preview deployment.
