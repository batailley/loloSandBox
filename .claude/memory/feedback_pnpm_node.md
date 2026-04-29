---
name: Use pnpm + node, not bun
description: Project migrated to pnpm+node; all bun references should be removed
type: feedback
---

Do NOT use bun. The project uses pnpm + node for package management and scripts.

**Why:** The project was migrated (`feat: back to basics: pnpm-node` commit). Bun was dropped entirely.

**How to apply:** Use `pnpm` for all package manager commands, `node`/`tsx`/`ts-node` for scripts. Remove any `bun` references in code, configs, and documentation (including CLAUDE.md). When running scripts, use `pnpm run <script>` not `bun run <script>`.
