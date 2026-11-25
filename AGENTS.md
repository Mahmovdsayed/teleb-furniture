<!-- BEGIN:turborepo-agent-rules -->

# This is NOT the Turborepo you know

Turborepo configuration, task behavior, and CLI commands can vary between installed versions and may differ from your training data. Resolve the `turbo` package from this file's directory or relevant workspace; in monorepos, it may not be visible from the repository root. For example, run `node -p "require.resolve('turbo/package.json')"` from a workspace that depends on `turbo`.

Read `docs/README.md` inside that installed package first, then read the relevant pages from its `docs/` directory before changing Turborepo configuration or commands. Heed deprecation notices. These bundled docs match the installed package version and are available without network access.

This block is written and re-added by `turbo` before repository-scoped commands when an AI agent is detected. In the Turborepo source repository, its template is defined in `crates/turborepo-cli/src/cli/agent_guidance.rs`. Removing the managed block while updates are enabled means a later qualifying invocation will add it again. Set `"agentGuidance": true` in the root `turbo.json` or `turbo.jsonc` to opt in; this does not remove an existing block. Keep the block committed with your work to avoid an uncommitted change on the next agent invocation.
<!-- END:turborepo-agent-rules -->

## Monorepo conventions

* Bun workspaces only. Exactly one lockfile at the repo root (`bun.lock`); never commit per-app lockfiles.
* Shared code lives in `packages/*` under the `@teleb/*` namespace and is imported by package name
  through each package's `exports` map — do not add cross-app relative imports or TS path aliases for them.
* `apps/server` is the API source of truth and exports `AppType` (`typeof app`). Keep route registration
  chained, otherwise Hono RPC loses the route types.
* `apps/server`'s package export is **types-only**: frontends must import it as
  `import type { AppType } from "@teleb/server"` (via `@teleb/api-client`), never at runtime.
* Shared Zod schemas used by two or more apps belong in `@teleb/validations`; keep divergent schemas
  app-local rather than silently changing validation behaviour.
* Tailwind must be able to scan `packages/ui`. The `@source` directive in
  `packages/ui/src/styles/globals.css` is what makes that work — do not remove it.
* Root scripts: `bun dev`, `bun build`, `bun lint`, `bun typecheck`, `bun format`, all via Turborepo.

