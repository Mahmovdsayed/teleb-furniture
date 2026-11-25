# @teleb/utils

Framework-agnostic helpers shared by the client and dashboard. No app-specific logic and no server
imports.

```ts
import { formatDate } from "@teleb/utils/format-date"
import { ConfettiFireworks } from "@teleb/utils/confetti-fireworks"
```

Both helpers were byte-identical in `apps/client/functions` and `apps/dashboard/functions`; those files
are now thin re-exports, so `@/functions/format-date` and `@/functions/ConfettiFireworks` keep working
unchanged.

`getValidationErrorMap`, `lib/utils` (`cn`) and the other `functions/*` helpers are **not** shared:
the client and dashboard validation error maps diverge (the dashboard has no Egyptian-phone branches),
so sharing them would change user-visible messages.
