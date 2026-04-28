# loloSandBox

Monorepo d'expérimentations en **TypeScript + pnpm**, orchestré par **Nx**.

## Stack

| Couche       | Choix                                       |
| ------------ | ------------------------------------------- |
| Runtime      | Node 24                                     |
| Monorepo     | Nx + pnpm workspaces                        |
| Front        | React 18 + Vite 8                           |
| BFF          | Hono 4 (sur Node)                           |
| UI kit       | Radix UI primitives + Tailwind + cva        |
| Validation   | Zod (schémas partagés front ↔ BFF)          |
| Lint/format  | Biome (remplace ESLint + Prettier)          |
| Tests        | Vitest                                      |
| TypeScript   | 5.6, mode strict, configs partagées         |

## Structure

```
loloSandBox/
├── apps/
│   ├── web/             # React + Vite (client)
│   └── bff/             # Hono + Node (backend-for-frontend)
├── packages/
│   ├── ui/              # Kit UI (composants React + preset Tailwind)
│   ├── shared/          # Schémas Zod, types, utils partagés
│   └── tsconfig/        # Configs TS partagées (base / react / node-bun)
├── biome.json           # Config lint + format
├── nx.json              # Config Nx (cache, pipelines)
├── pnpm-workspace.yaml  # Déclaration des workspaces pnpm
├── tsconfig.base.json   # Path aliases globaux
└── package.json         # Racine du monorepo
```

### Conventions de nommage

Tous les workspaces sont scopés `@lolo/*` (changeable via find/replace si besoin).

| Workspace         | Scope            |
| ----------------- | ---------------- |
| apps/web          | `@lolo/web`      |
| apps/bff          | `@lolo/bff`      |
| packages/ui       | `@lolo/ui`       |
| packages/shared   | `@lolo/shared`   |
| packages/tsconfig | `@lolo/tsconfig` |

## Démarrage

```bash
# 1. Activer corepack (gestionnaire de packageManagers)
corepack enable

# 2. Installer les deps (à la racine)
pnpm install

# 3. Lancer le BFF + le front en parallèle
pnpm dev

# Ou séparément :
pnpm --filter @lolo/bff dev    # http://localhost:3001
pnpm --filter @lolo/web dev    # http://localhost:5173 (proxy /api → BFF)
```

## Scripts racine

| Script              | Effet                                           |
| ------------------- | ----------------------------------------------- |
| `pnpm dev`          | Lance tout ce qui a une cible `dev` (parallèle) |
| `pnpm build`        | Build toutes les apps + libs                    |
| `pnpm typecheck`    | Typecheck l'ensemble du monorepo                |
| `pnpm lint`         | Biome check (lint + format)                     |
| `pnpm lint:fix`     | Biome avec autofix                              |
| `pnpm format`       | Biome format                                    |
| `pnpm test`         | Vitest sur tous les projets                     |
| `pnpm graph`        | Ouvre le graphe de dépendances Nx               |
| `pnpm clean`        | Supprime tous les `node_modules`, `dist`, etc.  |

## Comment ça communique

```
┌──────────────┐   /api/*   ┌──────────────┐
│  apps/web    │ ────────▶  │  apps/bff    │
│  (Vite)      │            │  (Hono/Node) │
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
pnpm install
```

Pour qu'une app/lib utilise `@lolo/ma-lib` : ajouter `"@lolo/ma-lib": "workspace:*"`
dans ses dépendances.

## Décisions techniques notables

- **Pas de build émis pour les libs internes.** Les apps consomment directement le
  source TypeScript (`main: ./src/index.ts`), c'est leur bundler (Vite, `tsup`)
  qui compile. Plus rapide en dev, source maps natifs.
- **Biome plutôt que ESLint+Prettier.** Tout-en-un, ~100x plus rapide, config unique.
- **`verbatimModuleSyntax: true`** : oblige `import type` explicite — meilleure
  détection des deps non utilisées et compatibilité ESM stricte.
- **Hono runtime-agnostic.** Tourne sur Node ici, mais portable sur Cloudflare
  Workers, Deno, Bun sans changement de code.
- **Tailwind preset partagé** dans `@lolo/ui` : design tokens définis une fois,
  réutilisés par toutes les apps qui ajoutent `presets: [uiPreset]`.

## Prochaines étapes possibles

- Storybook (ou Ladle, plus léger) pour le kit UI.
- CI : GitHub Actions avec `nx affected` pour ne builder que ce qui a changé.
- Husky + lint-staged sur pre-commit.
- Génération de types OpenAPI depuis Hono (via `@hono/zod-openapi`).
