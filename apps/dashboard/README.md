# Teleb Furniture — Dashboard

A modern, bilingual administration dashboard and content management system for Teleb Furniture, built with Next.js, React 19, and Tailwind CSS.

**Live website:** [teleb-furniture.com](https://www.teleb-furniture.com/en)

## Overview

Teleb Furniture Dashboard is the central administrative interface for managing the entire Teleb Furniture platform. It allows store managers and administrators to oversee products, curate collections, publish promotional banners, configure time-limited offers, manage incoming customer messages, and view operational analytics.

## Features

- **Product Management** — Create, update, view, and organize products with multiple images, color variants, and collection associations.
- **Collections & Categories** — Group products into curated collections with localized titles and hero imagery.
- **Promotions & Offers** — Configure time-sensitive discounts, promotional banners, and campaign-specific assets.
- **Customer Messages Inbox** — Review customer inquiries with priority badges, status tracking, and search filtering.
- **Dashboard Analytics** — High-level metrics and performance overview of catalog items and customer inquiries.
- **Bilingual & RTL Support** — Seamless Arabic and English interface with automatic RTL/LTR layout adjustments.
- **Media Uploads** — Direct image processing and upload to Cloudinary with drag-and-drop, client-side validation, and previews.
- **Type-Safe Forms** — Form handling powered by React Hook Form, Zod schemas, and localized validation messages.
- **Micro-Interactions** — Smooth transitions and gestures powered by Motion and custom interaction hooks.

## Tech Stack

| Category | Technologies |
|---|---|
| Framework | Next.js 16 (App Router) |
| Runtime & Language | Bun, TypeScript |
| UI & Components | React 19, Tailwind CSS v4, shadcn/ui, Base UI |
| Animations | Motion |
| State & Data Fetching | TanStack React Query, Zustand |
| Forms & Validation | React Hook Form, Zod |
| Internationalization | next-intl |
| Media Management | Cloudinary, Sharp |
| Icons & Utilities | Lucide React, date-fns |
| Deployment | Vercel |

## Architecture

The dashboard is structured using the Next.js App Router with localized route groups:

- `app/[locale]/login` — Secure administrator login and authentication.
- `app/[locale]/(dashboard)` — Protected administrative routes:
  - `/products` — Product catalog management (listing, creation, editing, details).
  - `/collection` — Collection management.
  - `/banner` — Hero and promotional banner management.
  - `/offer` — Special deals and discount configuration.
  - `/message` — Customer inquiries inbox with search and priority categorization.
  - `/` — Analytics and overview dashboard.
- `app/api/upload` — Secure server-side route handler for Cloudinary media uploads.
- `services/` — Typed API service layer connecting to the backend API (`/v1`).
- `components/` — Modular UI components, form controls, skeletons, and animation primitives.

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

| Variable | Description |
|---|---|
| `LOGIN_SIG` | Secret key used for session signing |
| `JWT_SECRET` | Secret key for JWT verification |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

## Getting Started

**Prerequisites:** Bun or Node.js (v18+)

```bash
# Install dependencies
bun install

# Start the development server
bun dev
```

The dashboard will be available at `http://localhost:3000`.

## Scripts

| Script | Description |
|---|---|
| `bun dev` | Start development server with Turbopack |
| `bun build` | Build the application for production |
| `bun start` | Start the production server |
| `bun lint` | Run ESLint checks |
| `bun format` | Format code with Prettier |
| `bun typecheck` | Run TypeScript type checking |

## Links

- **Storefront:** https://www.teleb-furniture.com/en
