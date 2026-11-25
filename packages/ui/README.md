# @teleb/ui

Shared shadcn/ui foundation, design tokens and global styles for `apps/client` and `apps/dashboard`.

Configuration follows the official shadcn/ui monorepo convention: this package owns the components,
the Tailwind entry stylesheet and the component aliases, and the apps route new components here.

```
packages/ui
├── components.json          # shadcn aliases -> @teleb/ui/*
└── src
    ├── components/ui        # components are installed here (empty on purpose)
    ├── hooks
    ├── lib/utils.ts         # cn()
    └── styles/globals.css   # tailwind + tokens; @source registers this package
```

## Adding a component

Run the CLI **from the app** so it routes files into this package:

```bash
cd apps/client
bunx shadcn@latest add button
```

The generated `src/components/ui/button.tsx` is then imported through the package export map:

```tsx
// apps/client/components/... or apps/dashboard/components/...
import { Button } from "@teleb/ui/components/button"
import { cn } from "@teleb/ui/lib/utils"
```

`./components/*` maps to `./src/components/*.tsx`, `./hooks/*` to `./src/hooks/*.ts` and `./lib/*` to
`./src/lib/*.ts` in `package.json`, so no TS path aliases are needed in the apps.

No components are shipped yet — that is intentional.

## Styles

`src/styles/globals.css` holds the Tailwind v4 imports (`tailwindcss`, `tw-animate-css`,
`shadcn/tailwind.css`), the `@theme inline` token mapping, the `:root` / `.dark` variables and the shared
`@layer base` rules. Each app's `app/globals.css` imports it and only keeps what is app-specific
(font variables and the client's view-transition animations):

```css
@import "@teleb/ui/globals.css";
```

`@source "../**/*.{ts,tsx}"` inside the shared stylesheet is what makes Tailwind generate the classes
used by components in this package for the consuming app's build.

## Hooks

Shared React hooks live in `src/hooks` and are consumed through the package export map:

```tsx
import { useFormHandler } from "@teleb/ui/hooks/use-form-handler"
import { useAppQuery, keepPreviousData } from "@teleb/ui/hooks/use-app-query"
import { useIsMobile } from "@teleb/ui/hooks/use-mobile"
```

| Hook | Notes |
| --- | --- |
| `useFormHandler` | react-hook-form + the locale-aware Zod error map. Takes `locale: Lang` (the app injects `useLocale()`) and an optional `notify` sink (the app injects its `toast.add`), so the package never bundles next-intl or the app's UI. |
| `useAppQuery` | react-query wrapper with the shared defaults (1-day stale/gc, no retry, no refetch on focus). `refetchOnMount` defaults to `true`; the dashboard passes `"always"` to preserve its behaviour. |
| `useIsMobile` | shadcn-compatible mobile breakpoint hook. |

Both apps keep `apps/*/hooks/{useAppQuery,useFormHandler}.ts` as thin shims that inject the app's locale and
toast; every existing import site (`@/hooks/useFormHandler`, `@/hooks/useAppQuery`) keeps working.

`@hookform/resolvers`, `@tanstack/react-query`, `react-hook-form` and `zod` are **peer + dev** dependencies:
the apps provide the single instance (verified: one resolved copy of each across `packages/ui`,
`apps/client`, `apps/dashboard`), which matters because react-query's cache and react-hook-form's context
must be the same module the app created.

Dashboard-only hooks (`usePageSync`, `useResourceFilters`, tooltip gesture hooks) stay app-local: they depend
on `next/navigation`, the dashboard URL contract or dashboard-only helpers.
