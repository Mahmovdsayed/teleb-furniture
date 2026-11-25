# @teleb/api-client

Typed Hono RPC client shared by `apps/client` and `apps/dashboard`.

```tsx
import { api } from "@teleb/api-client"

// Every route is registered under the server's `/v1` base path.
const response = await api.v1.products.$get({ query: { limit: 12 } })

if (response.ok) {
  const data = await response.json()
}
```

## How the types flow

```
apps/server/src/index.ts        const app = new Hono<AppEnv>().basePath("/v1").route(...)
        │                       export type AppType = typeof app
        ▼
@teleb/server  (package.json `exports` exposes a **types-only** entry: ./src/index.ts)
        │  import type { AppType } from "@teleb/server"   ← erased at compile time
        ▼
@teleb/api-client               hc<AppType>(origin)
        ▼
apps/client, apps/dashboard
```

* The server package export declares **only** a `types` condition. A runtime
  `import ... from "@teleb/server"` cannot resolve, so the server can never be pulled into a browser
  bundle by accident.
* `@teleb/api-client` imports the app type with `import type`, which TypeScript and SWC strip, so the
  dependency is a compile-time-only edge.
* There are no circular dependencies: `api-client → server` is one-way, and the server never imports the
  frontend packages.

## Base URL

`getApiOrigin()` reads `NEXT_PUBLIC_API_URL` and falls back to `https://api.teleb-furniture.com`.
Set it per environment (the `/v1` prefix comes from the server's `basePath` and is already in the
generated types, so **do not** include it):

```bash
# apps/client/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8080
```

Only public (`NEXT_PUBLIC_*`) variables are read. Server secrets stay in `apps/server`.

## Custom client

```ts
import { createApiClient } from "@teleb/api-client"

const serverApi = createApiClient({
  origin: process.env.API_ORIGIN,
  headers: () => ({ cookie: (await cookies()).toString() }),
})
```

## Service layer pattern

Both Next apps' service files call the RPC client directly and share three helpers:

```ts
import { api, compactQuery, readResponse, requestOptions, withBody } from "@teleb/api-client"

// GET with the locale header and `cache: "no-store"` (as the old fetch wrapper did)
const body = await readResponse(api.v1.products.$get({ query: compactQuery(params) }, requestOptions({ locale })))

if (body.success === false) {
  throw new Error(body.message || "Failed to fetch products")
}

return { products: body.data ?? [], total: body.total ?? 0 }
```

```ts
// POST/PATCH
const body = await readResponse(api.v1.banner.create.$post({ json: payload }, requestOptions({ locale, method: "POST" })))

// Routes with both a path param and a JSON body (Hono's input inference only keeps `param`
// when a route uses several middleware, so `withBody` supplies the payload)
const body = await readResponse(
  api.v1.banner.update[":id"].$patch(withBody({ param: { id: String(id) } }, payload), requestOptions({ locale, method: "PATCH" })),
)
```

* `readResponse(response)` accepts the promise `hc` returns; a non-2xx status throws `ApiClientError`
  (same class as the apps' legacy `ApiRequestError`, so `instanceof` checks keep working), while
  application failures arrive as `{ success: false, message }` with status 200 for the caller to handle.
* `requestOptions({ locale, method })` mirrors the old wrapper: `Accept-Language` when a locale is
  given and `cache: "no-store"` for GETs. `credentials: "include"` is the client default.
* `compactQuery(query)` drops `undefined`/`null`/`""` values, which is what each service filtered by hand.
* `withBody(args, body)` exists only because of the inference gap described above; runtime behaviour is
  identical to inlining `{ ...args, json: body }`.
* Path params are strings; slugs must already be `encodeURIComponent`-ed because Hono's client inserts
  param values into the path verbatim.
