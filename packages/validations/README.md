# @teleb/validations

Shared Zod v4 schemas for the Teleb apps.

```ts
import { createMessageSchema, type CreateMessageInput } from "@teleb/validations/message"
import { createBannerSchema } from "@teleb/validations/banner"
import { collectionSchema, createCollectionSchema } from "@teleb/validations/collection"
```

## What lives here

Exactly the schemas that were **byte-for-byte equivalent** (ignoring semicolons/formatting) in the
apps they are shared between. `apps/client/validations/*` and `apps/dashboard/validations/*` and
`apps/server/src/modules/*/*.schema*.ts` keep their files as thin re-exports, so every existing
import path and every validation message/behaviour is unchanged.

| Schema | Identical between | App-local remainder |
| --- | --- | --- |
| `EGYPTIAN_PHONE_REGEX`, `createMessageSchema` | client ↔ server | server keeps `messageQuerySchema`, `messageParamSchema` |
| `createBannerSchema`, `updateBannerSchema`, `addBannerImageSchema`, `updateBannerImageSchema`, `reorderBannerImagesSchema` | dashboard ↔ server | server keeps `bannerParamSchema`, `bannerImageParamSchema` |
| `collectionSchema`, `createCollectionSchema` | dashboard ↔ server | each app keeps its own `updateCollectionSchema` |

## What deliberately stays app-local

* `updateCollectionSchema` — dashboard runs `z.compile(schema.partial().refine(...))`, the server runs
  `z.compile(schema.partial()).refine(...)`. The compiled output differs, so neither variant is "the
  shared one"; each app keeps its current behaviour.
* Offer schemas — `createOfferSchema` differs (dashboard trims empty strings to `undefined` through a
  transform, the server does not) and `offerQuerySchema` differs (`limit` capped at 10 vs 100).
* Product schemas — the dashboard validates a flat `FormData` form (with `z.coerce`, `.catch`, defaults)
  while the server validates a nested entity payload. Same export names, incompatible shapes.
* Auth schemas — dashboard `loginSchema` (`password.min(6)`) vs server `signInSchema`
  (`trim().toLowerCase().email()`, `password.min(1)`).
* Dashboard `image.ts` / `image-messages.ts` — `z.instanceof(File)` plus app constants and i18n, not
  usable by the server (which validates image URLs).
* Server-only schemas: query/param/header globals, analytics, and everything the server validates but no
  frontend sends.

## Full validation surface (all apps)

| Module | Contents |
| --- | --- |
| `@teleb/validations/banner`, `/collection`, `/message` | entity payload schemas shared by dashboard + server (and the storefront for messages) |
| `@teleb/validations/offer` | `createOfferSchema`, `updateOfferSchema`, `updateOfferStatusSchema`, `updateOfferShowBannerSchema`, `offerQuerySchema` + inferred types (canonical: the server's versions) |
| `@teleb/validations/product` | the API request schemas (nested `translations: { ar, en }`, params, query, images, variants) |
| `@teleb/validations/product-form` | the dashboard's flat FormData form schema (`productFormSchema`, `createProductFormSchema`, `updateProductFormSchema`) + `toObjectArray` helpers |
| `@teleb/validations/auth` | `signInSchema` / `signUpSchema` (API contract, `trim().toLowerCase()`, `password.min(1)`) **and** `loginSchema` (dashboard form contract, `password.min(6)`) |
| `@teleb/validations/image`, `/image-messages`, `/image-constants` | `File`-based upload schema with per-locale messages, MIME/extension constants, `MAX_IMAGE_SIZE` |
| `@teleb/validations/storefront` | the storefront's response/query-filter schemas (`getProductsFilterSchema`, row/response schemas). Renamed (`…RowSchema`) so they cannot collide with the API request schemas |
| `@teleb/validations/errors` | the locale-aware Zod error map (`localizedZodError(lang)`, `Lang`), `ar` + `en` |

### Two languages (`ar` / `en`)

* `localizedZodError("ar" | "en")` is the single error map for both Next apps; each app's
  `lib/getValidationErrorMap.ts` is a thin re-export, and `useFormHandler` (in `@teleb/ui`) receives the
  current locale from the app (`useLocale()`), so the shared hook never bundles its own next-intl context.
* The map is the previous **client** version, which is a strict superset of the dashboard's: the dashboard
  now shows the specific Egyptian-phone messages (`010/011/012/015`) in both languages instead of the
  generic "invalid format"/"must be at most N characters" text.
* `imageMessages` carries both languages and is selected by the `lang` argument of `ImageSchema(lang)`.
* The **server keeps its own map** (`apps/server/src/i18n/zodMessages.ts`): it uses MSA Arabic, chains to
  `zod/locales` as a fallback and resolves the language from `?lang=` → `x-lang` → `Accept-Language`.

### Known i18n gaps (unchanged behaviour, flagged)

* Hardcoded English `.refine(...)` messages are emitted verbatim in Arabic too:
  `banner.ts` ("At least one field (url or publicId) must be provided", "Duplicate image indexes are not allowed"),
  `offer.ts` ("Invalid hex color", "startDate must be before endDate", …),
  `product-form.ts` ("Collection is required", "Slug is required", …),
  `collection.ts` ("At least one field must be provided").
  Zod's error map cannot localise refine messages, so fixing these needs either schema factories that take
  `lang` (like `ImageSchema`) or moving the text into the error-map templates.
* The apps' `useFormHandler` fallback strings ("Request failed", "Something went wrong",
  "Operation completed successfully") are still English-only.

### Deliberate canonical choices

* `createOfferSchema` — the server's version (no empty-string transform) is shared, so the dashboard form
  now submits `""` for untouched description fields; the API and the DB (`default ""`) treat both the same.
* `updateCollectionSchema` — one shared schema using the server's chain order
  (`z.compile(schema.partial()).refine(...)`), which is behaviourally equivalent to the dashboard's.
* `offerQuerySchema` — the server's `limit: max(100)`; the dashboard's unused `max(10)` copy is gone.
* `loginSchema` and `signInSchema` stay separate: the form enforces a 6-character password, the API accepts 1.
