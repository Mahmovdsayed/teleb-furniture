# Teleb Furniture — Server

The backend API powering the Teleb Furniture storefront and administration dashboard, built with Hono and Bun, deployed on Vercel.

**Live website:** [teleb-furniture.com](https://www.teleb-furniture.com/en)

## Overview

Teleb Furniture Server is a RESTful API service that handles all application logic for the Teleb Furniture platform. It manages authentication, product catalog, collections, promotional banners, offers, customer messages, and analytics, while providing caching, rate limiting, and an AI-assisted message classification workflow.

## Features

- JWT-based authentication with secure cookie handling
- Domain-driven module architecture (auth, products, collections, banners, offers, messages, analytics)
- Arabic and English i18n with per-request language detection
- Redis caching with explicit cache invalidation
- Global and per-route rate limiting
- AI-assisted customer message classification via background queues
- Zod schema validation on all request inputs
- Secure headers, CORS, body size limiting, and request timeouts
- Request ID tracing and structured request logging
- Email notifications via Nodemailer (SMTP)

## Tech Stack

| Category | Technologies |
|---|---|
| Runtime | Bun |
| Framework | Hono |
| Language | TypeScript |
| Database | PostgreSQL, Neon |
| ORM | Drizzle ORM |
| Caching | Redis (ioredis) |
| Validation | Zod |
| AI | Vercel AI SDK |
| Queues | Vercel Queue |
| Email | Nodemailer |
| Deployment | Vercel |

## Architecture

The server is organized into domain-specific modules, each owning its routes, controller, schema, and types.

- **Auth** — Registration, login, session management, and admin access.
- **Products** — Product catalog CRUD and querying.
- **Collections** — Product collection management.
- **Banners** — Promotional banner management.
- **Offers** — Time-limited offer management.
- **Messages** — Customer contact form submissions and inbox.
- **Analytics** — Dashboard metrics and reporting.
- **Queues** — Background job for AI-based contact message classification.

All routes are mounted under `/v1` with shared middleware for security, compression, rate limiting, and i18n applied globally.

## API Base

All endpoints are prefixed with `/v1`.

| Prefix | Module |
|---|---|
| `/v1/auth` | Authentication |
| `/v1/collection` | Collections |
| `/v1/products` | Products |
| `/v1/banner` | Banners |
| `/v1/offer` | Offers |
| `/v1/message` | Customer Messages |
| `/v1/analytics` | Analytics |

## Links

- **Live website:** https://www.teleb-furniture.com/en
