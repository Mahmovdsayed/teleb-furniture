# @teleb/config

Shared tooling configuration for the Teleb monorepo. Configuration only — no runtime code.

```jsonc
// packages/foo/tsconfig.json
{ "extends": "@teleb/config/tsconfig/react-library.json" }
```

```js
// packages/foo/eslint.config.mjs
import { config } from "@teleb/config/eslint/react-internal"
export default config
```

* `tsconfig/base.json`, `tsconfig/react-library.json`, `tsconfig/nextjs.json` — TypeScript bases used by
  `packages/*`. `nextjs.json` is available for Next.js apps; `apps/client`, `apps/dashboard` and
  `apps/server` keep their existing hand-tuned, standalone `tsconfig.json` files untouched (they already
  set the options Next.js 16 requires, and inheriting a stricter base would have changed type-checks in
  existing application code).
* `eslint/base` and `eslint/react-internal` — flat ESLint configs for React/TS workspace packages
  (ESLint 10). The apps keep their own `eslint.config.mjs`: the client is on ESLint 9 with
  `eslint-config-next` flat configs while the dashboard is on ESLint 10, so forcing one shared config
  would require an ESLint major upgrade.
* `prettier` — the formatting options both apps already used (`printWidth: 180`, no semicolons). The root
  `.prettierrc.json` extends it.
