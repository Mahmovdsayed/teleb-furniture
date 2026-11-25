# Teleb Furniture

A freelance project I designed and built end to end: a bilingual furniture storefront, the administration
dashboard behind it, and the API that powers both, kept together in one Turborepo monorepo with the packages
they share.

- Storefront: https://www.teleb-furniture.com/en
- Case study: [apps/client/CASE_STUDY.md](apps/client/CASE_STUDY.md)

## The brief

Teleb Furniture sells furniture online and needed more than a template storefront. The products had to read as
premium rather than as a catalog listing. The catalog keeps growing, so browsing had to stay organised. The
business works in Arabic and English, so both languages had to feel native instead of translated. And the
people running the shop needed to manage products, offers, banners and customer messages themselves.

## What I built

### The storefront

The customer-facing side: product and collection browsing, product pages with galleries, promotional banners,
time-limited offers, a contact flow, and SEO work that includes structured data, metadata, sitemap and robots.

It is bilingual with Arabic and English routing, and fully RTL-aware. Reads are cached on the server so pages
stay fast without going stale in the wrong places.

### The administration dashboard

The workspace the business uses day to day: managing the product catalog with images and variants, curating
collections, publishing banners, configuring offers and campaigns, and working through the customer inbox with
search, priority and viewed state, next to an analytics overview.

The forms are typed end to end, validate with the same rules the API enforces, and report errors in whichever
language the admin is using.

### The API

A Hono service on Bun, organised by domain (auth, products, collections, banners, offers, messages,
analytics). It owns authentication, validation, data access through Drizzle on Neon, Redis caching with
explicit invalidation, rate limiting, secure headers, request timeouts, email notifications, and a background
queue that classifies incoming customer messages with AI so urgent ones surface first.

### The shared foundation

The three applications used to be three separate repositories. I merged them into one monorepo and moved
everything they had in common into shared packages, so the contract between them lives in one place:

| Package | What it holds |
|---|---|
| `@teleb/types` | Entities, query inputs and response envelopes used by all three applications |
| `@teleb/validations` | Zod schemas, inferred payload types and the Arabic/English error map |
| `@teleb/ui` | Shared components, hooks, design tokens and the Tailwind entry stylesheet |
| `@teleb/utils` | Framework-agnostic helpers |
| `@teleb/config` | TypeScript, ESLint and Prettier presets |
| `@teleb/api-client` | The typed Hono RPC client both frontends call |

## The decisions I would point to

**The API owns the contract.** Instead of hand-written request types that drift, the server exports its
inferred type and the client consumes it as a type only:

```
apps/server       export type AppType = typeof app
@teleb/api-client import type { AppType } from "@teleb/server" (erased at build time)
frontends         const body = await readResponse(api.v1.products.$get({ query }))
```

The server package exposes a types-only condition, so server code can never end up in a browser bundle.

**One set of rules, two languages.** Forms on both sides validate with the same Zod schemas the API enforces,
and Arabic and English draw their messages from one error map, including the specific Egyptian phone-number
messages. I aligned identifiers, timestamps and nullability with what the API actually returns, so the shared
types describe the wire format rather than an approximation of it.

**One copy of everything shared.** Components, hooks and tokens live in one package; React, the class merger,
the query client, the form library and the validation library resolve to a single instance across the
workspace, which is what keeps contexts and caches coherent.

**Caching where it matters.** The API caches in Redis and invalidates explicitly when content changes, and the
storefront caches reads with its own cache lifetime, so a promotion appears when it should and not before.

**Media handled properly.** Images are uploaded and processed through Cloudinary from the dashboard, with the
storefront serving optimised, correctly sized assets.

**Operational care.** Request IDs, structured logging, rate limits per route, secure headers, CORS rules, body
limits and timeouts were part of the work, not an afterthought.

## Stack

| Layer | What I used |
|---|---|
| Repository | Turborepo monorepo, Bun workspaces, one lockfile |
| Storefront and dashboard | Next.js 16, React 19, TypeScript |
| Styling and UI | Tailwind CSS 4, shadcn/ui on Base UI |
| Internationalisation | next-intl with Arabic and English |
| Forms and validation | React Hook Form, Zod |
| Data fetching | TanStack Query, Hono RPC |
| API | Bun, Hono |
| Database | PostgreSQL on Neon, Drizzle ORM |
| Caching | Redis |
| Media | Cloudinary, Sharp |
| AI | Vercel AI SDK and gateway |
| Background work | Vercel Queue |
| Email | Nodemailer |
| Hosting | Vercel |

## What this project demonstrates

- Taking a business requirement from design through frontend, backend, database and deployment.
- Building bilingual, RTL-correct interfaces rather than bolting translation on at the end.
- Designing a type boundary between frontend and backend that cannot silently drift.
- Consolidating separate applications into a maintainable monorepo without breaking their behaviour.
- Handling caching, media, background jobs and the operational details that keep a storefront reliable.

## Where to read more

- Full case study: [apps/client/CASE_STUDY.md](apps/client/CASE_STUDY.md)
- Storefront: [apps/client/README.md](apps/client/README.md)
- Dashboard: [apps/dashboard/README.md](apps/dashboard/README.md)
- API: [apps/server/README.md](apps/server/README.md)
