# @teleb/types

Single source of truth for the shared data contracts of the Teleb monorepo. Consumed by
`apps/client`, `apps/dashboard` and `apps/server`, plus `@teleb/api-client`.

Type-only package: it contains no runtime code and no dependency on Zod, Drizzle, Hono or React.

```ts
import type { Product, ProductListResponse } from "@teleb/types/product"
import type { Locale, MessagePriority } from "@teleb/types/common"
import type { ApiResponse, ListResponse } from "@teleb/types/api"
```

## Modules

| Subpath | Contents |
| --- | --- |
| `@teleb/types/common` | `Locale`, `MessagePriority`, `ProductStatus`, `SortOrder`, `ProductSortField`, `MessageSortField`, `OfferSortField`, `PaginatedResult<T>` |
| `@teleb/types/api` | `ApiResponse<T>`, `ListResponse<T>`, `ActionResponse`, `ValidationIssue`, `ValidationErrorResponse` |
| `@teleb/types/banner` | `BannerImage`, `Banner`, `BannerResponse`, `SingleBannerResponse`, `CreateBanner`, `UpdateBanner`, `AddBannerImage`, `UpdateBannerImage` |
| `@teleb/types/collection` | `Collection`, `CollectionResponse`, `SingleCollectionResponse` |
| `@teleb/types/product` | `ProductTranslation`, `ProductImage`, `ProductVariant`, `Product`, `ProductResponse`, `ProductListResponse`, `SingleProductResponse`, `GetProductsResponse`, `SearchProductsResponse`, `GetProductByIdResponse`, `ProductsResult`, `SearchProductsParams`, `GetProductsParams`, `ProductQueryInput`, `GetProductsOptions`, `SearchProductOptions`, `CreateProduct`, `UpdateProduct`, `CreateProductPayload`, `UpdateProductPayload`, `CreateProductTranslation`, `UpdateProductTranslation`, `CreateProductVariant`, `UpdateProductVariant`, `CreateProductImage`, `UpdateProductImage`, `CreateProductImagePayload` |
| `@teleb/types/offer` | `Offer`, `OfferResponse`, `SingleOfferResponse`, `OffersResult`, `OfferPayload`, `OfferQueryInput`, `GetOffersOptions`, `CreateOffer`, `UpdateOffer`, `CreateOfferPayload`, `UpdateOfferPayload`, `UpdateOfferStatusPayload`, `UpdateOfferShowBannerPayload` |
| `@teleb/types/message` | `Message`, `MessageListItem`, `MessageResponse`, `MessageSingleResponse`, `MessageCreateResponse`, `MessagesResult`, `MessageQueryInput`, `GetMessagesOptions`, `CreateMessage` |
| `@teleb/types/analytics` | `AnalyticsOverview`, `AnalyticsData`, `AnalyticsResponse` |
| `@teleb/types/auth` | `User`, `AuthUser`, `LoginData`, `LoginResponse`, `LogoutResponse` |

## Naming rules (important)

The three apps named the same shapes differently. The package keeps **one shape per concept** and
exposes compatibility names where an app already used a different word:

* **List envelopes** use the frontends' names: `BannerResponse`, `CollectionResponse`,
  `OfferResponse`, `MessageResponse`, `ProductListResponse` = `ListResponse<T>`
  (`{ success, data?: T[], total?, message?, code?, error? }`).
* **Entities** use the singular name (`Banner`, `Collection`, `Offer`, `Message`, `Product`).
  The server historically named its entities `XResponse`, so it aliases locally:
  `export type BannerResponse = Banner` in `apps/server/src/modules/banner/banner.types.ts`, and the
  same pattern for `OfferResponse` (`Offer`) and `MessageResponse` (`Message`).
* `data`/`total` are optional in envelopes because the same route can answer with
  `{ success: false, message }`.
* Zod-inferred **request** types (`CreateBannerInput`, `CreateMessageInput`, `CreateCollectionInput`,
  `ProductQueryInput` for the server schema, …) stay next to their schemas in `@teleb/validations`:
  a schema and its inferred type belong together. `@teleb/types` re-declares only the hand-written
  payloads that had no schema.

## Contract facts encoded here

* Ids are `number` everywhere (the API uses integer identity columns). The dashboard used `string`
  for `Collection`/`Offer`/`Message` ids and `Product.price` — both were wrong.
* Product translations/images/variants mirror the database row types exactly, including nullability
  (`materials`, `features`, `metaKeywords` are nullable; `tags` is not).
* `Product.createdAt`/`updatedAt` are required: the columns are `NOT NULL` and every response path
  returns them (`apps/server/src/modules/product/product.service.ts` create path was fixed to include
  them — previously only the create response omitted them).
* `AnalyticsOverview.generatedAt` and `Offer.createdBy` are in the shared shapes (the dashboard's
  copies were missing them).
* `Message.priority` is `string` on the entity (the database column is `text`) while
  `MessagePriority` is the union enforced by the message query schema.
* The API exposes **no product price**; the storefront's JSON-LD code no longer reads one
  (see `apps/client/lib/seo/schema.ts`).

## Consuming apps

Each app keeps its historical import path as a thin re-export, so no call site changed:

```ts
// apps/client/types/Product.types.ts
export type { Product, ProductListResponse /* … */ } from "@teleb/types/product"
```

## Deliberately app-local (not data contracts)

* React component prop interfaces, hook option types (`useFormHandler`, `useAppQuery`, tooltip
  internals), Next.js page `Props`, zustand slice internals — UI/implementation detail that would
  force React/DOM dependencies into this package.
* `apps/server`: `AppEnv`, `AppContext`, controller context aliases, `I*Service` interfaces,
  middleware option types, `Environment`, `TokenPayload`, email options — server implementation
  detail that depends on Hono, Drizzle, ioredis, nodemailer or Bun.
* Drizzle row types derived from the table objects (`InferSelectModel`/`InferInsertModel`) stay in
  `apps/server/src/modules/*/*.types.ts`; the shared translation/image/variant/entity types are
  structurally identical to them, so rows satisfy the shared contracts directly.
* Zod schemas and their inferred types live in `@teleb/validations` (see above).
