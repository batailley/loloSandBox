# loloSandBox

Monorepo d'expérimentations en **TypeScript + Bun**, orchestré par **Nx**.

## Stack

| Couche       | Choix                                       |
| ------------ | ------------------------------------------- |
| Runtime      | Bun (>=1.1)                                 |
| Monorepo     | Nx + workspaces Bun                         |
| Front        | React 18 + Vite 5                           |
| BFF          | Hono 4 (sur Bun)                            |
| UI kit       | Radix UI primitives + Tailwind + cva        |
| Validation   | Zod (schémas partagés front ↔ BFF)          |
| Lint/format  | Biome (remplace ESLint + Prettier)          |
| TypeScript   | 5.6, mode strict, configs partagées         |

## Structure

```
loloSandBox/
├── apps/
│   ├── web/             # React + Vite (client)
│   └── bff/             # Hono + Bun (backend-for-frontend)
├── packages/
│   ├── ui/              # Kit UI (composants React + preset Tailwind)
│   ├── shared/          # Schémas Zod, types, utils partagés
│   └── tsconfig/        # Configs TS partagées (base / react / node-bun)
├── biome.json           # Config lint + format
├── nx.json              # Config Nx (cache, pipelines)
├── tsconfig.base.json   # Path aliases globaux
├── bunfig.toml          # Config Bun
└── package.json         # Workspaces
```

### Conventions de nommage

Tous les workspaces sont scopés `@lolo/*` (changeable via find/replace si besoin).

| Workspace        | Scope            |
| ---------------- | ---------------- |
| apps/web         | `@lolo/web`      |
| apps/bff         | `@lolo/bff`      |
| packages/ui      | `@lolo/ui`       |
| packages/shared  | `@lolo/shared`   |
| packages/tsconfig| `@lolo/tsconfig` |

## Démarrage

```bash
# 1. Installer les deps (à la racine)
bun install

# 2. Lancer le BFF + le front en parallèle
bun run dev

# Ou séparément :
bun run --filter @lolo/bff dev    # http://localhost:3001
bun run --filter @lolo/web dev    # http://localhost:5173 (proxy /api → BFF)
```

## Scripts racine

| Script             | Effet                                          |
| ------------------ | ---------------------------------------------- |
| `bun run dev`      | Lance tout ce qui a une cible `dev` (parallèle)|
| `bun run build`    | Build toutes les apps + libs                   |
| `bun run typecheck`| Typecheck l'ensemble du monorepo               |
| `bun run lint`     | Biome check (lint + format)                    |
| `bun run lint:fix` | Biome avec autofix                             |
| `bun run format`   | Biome format                                   |
| `bun run test`     | Bun test sur tous les projets                  |
| `bun run graph`    | Ouvre le graphe de dépendances Nx              |
| `bun run clean`    | Supprime tous les `node_modules`, `dist`, etc. |

## Comment ça communique

```
┌──────────────┐   /api/*   ┌──────────────┐
│  apps/web    │ ────────▶  │  apps/bff    │
│  (Vite)      │            │  (Hono/Bun)  │
└──────┬───────┘            └──────┬───────┘
       │                           │
       └─── consomment ────────────┘
                  │
        ┌─────────▼─────────┐
        │ packages/shared   │  schémas Zod = contrat
        │ packages/ui       │  composants React
        └───────────────────┘
```

Le contrat HTTP est défini par les schémas Zod dans `@lolo/shared/schemas`. Le BFF
les valide en sortie, le front les valide en entrée — pas de drift possible.

En dev, Vite proxifie `/api` vers `http://localhost:3001` (cf. `vite.config.ts`).

## Ajouter un nouveau workspace

```bash
# Lib partagée
mkdir -p packages/ma-lib/src
# Créer packages/ma-lib/package.json avec "name": "@lolo/ma-lib", "private": true
# Créer packages/ma-lib/tsconfig.json étendant @lolo/tsconfig/base.json
# Créer packages/ma-lib/project.json (cf. packages/shared/project.json)

# Puis :
bun install
```

Pour qu'une app/lib utilise `@lolo/ma-lib` : ajouter `"@lolo/ma-lib": "workspace:*"`
dans ses dépendances.

## Décisions techniques notables

- **Pas de build émis pour les libs internes.** Les apps consomment directement le
  source TypeScript (`main: ./src/index.ts`), c'est leur bundler (Vite, `bun build`)
  qui compile. Plus rapide en dev, source maps natifs.
- **Biome plutôt que ESLint+Prettier.** Tout-en-un, ~100x plus rapide, config unique.
- **`verbatimModuleSyntax: true`** : oblige `import type` explicite — meilleure
  détection des deps non utilisées et compatibilité ESM stricte.
- **Hono runtime-agnostic.** Tourne sur Bun ici, mais portable sur Node, Cloudflare
  Workers, Deno sans changement de code.
- **Tailwind preset partagé** dans `@lolo/ui` : design tokens définis une fois,
  réutilisés par toutes les apps qui ajoutent `presets: [uiPreset]`.

## Prochaines étapes possibles

- Tests : Vitest pour le front, `bun test` pour le BFF et les libs.
- Storybook (ou Ladle, plus léger) pour le kit UI.
- CI : GitHub Actions avec `nx affected` pour ne builder que ce qui a changé.
- Husky + lint-staged sur pre-commit.
- Génération de types OpenAPI depuis Hono (via `hono/openapi` ou `@hono/zod-openapi`).
