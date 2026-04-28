# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun install                          # install all deps (run from root)
bun run dev                          # start BFF + web in parallel
bun run --filter @lolo/bff dev       # BFF only → http://localhost:3001
bun run --filter @lolo/web dev       # web only → http://localhost:5173
bun run build                        # build all apps + libs (Nx-cached)
bun run typecheck                    # typecheck full monorepo
bun run lint                         # Biome check (lint + format)
bun run lint:fix                     # Biome autofix
bun run test                         # run all tests
bun run --filter @lolo/bff test      # test single workspace
bun run clean                        # rm node_modules, dist, .nx
```

Run a single test file:
```bash
bun test apps/bff/src/routes/ping.test.ts
```

## Architecture

TypeScript + Bun monorepo orchestrated by Nx. All workspaces are scoped `@lolo/*`.

```
apps/web   (React 18 + Vite 5)   → http://localhost:5173
apps/bff   (Hono 4 + Bun)        → http://localhost:3001
packages/shared                   Zod schemas + types + utils (no build step)
packages/ui                       React component kit (Radix + Tailwind + cva)
packages/tsconfig                 Shared TS configs (base / react / node-bun)
```

**Data flow:** `apps/web` fetches `/api/*` → Vite proxies to `apps/bff` in dev. The HTTP contract lives entirely in `@lolo/shared/schemas` as Zod schemas. The BFF validates responses out, the front validates responses in — no type drift.

**No build step for internal libs.** `packages/shared` and `packages/ui` export their `./src/index.ts` directly. Vite and `bun build` compile them as part of their own build. Path aliases in `tsconfig.base.json` wire `@lolo/ui` and `@lolo/shared` to source.

**UI kit pattern:** Components use `cva` (class-variance-authority) for variant definitions, `cn` (clsx + tailwind-merge) for className merging, and Radix primitives for accessibility. The shared Tailwind preset in `packages/ui/tailwind.preset.ts` defines design tokens as CSS variables — apps extend it via `presets: [uiPreset]`.

## Code conventions

- Use `import type` for type-only imports (`verbatimModuleSyntax: true` enforces this; Biome `useImportType` rule errors otherwise).
- TypeScript strict mode + `noUncheckedIndexedAccess` — array index access returns `T | undefined`.
- Biome replaces ESLint + Prettier: single quotes, 2-space indent, 100-char line width, trailing commas everywhere.
- New BFF routes: add a `Hono()` sub-app in `apps/bff/src/routes/`, mount it in `apps/bff/src/index.ts` via `app.route()`, and define request/response schemas in `packages/shared/src/schemas/`.
- New workspace: create `package.json` (name `@lolo/<name>`, `"main": "./src/index.ts"`), a `tsconfig.json` extending the appropriate `@lolo/tsconfig` base, and a `project.json` (copy from `packages/shared/project.json`). Then `bun install`.
