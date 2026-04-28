import { Button } from '@lolo/ui';
import { useEffect, useState } from 'react';
import { fetchHealth, fetchPing } from './api/bff';

export function App() {
  const [health, setHealth] = useState<string>('…');
  const [pong, setPong] = useState<string>('');

  useEffect(() => {
    fetchHealth()
      .then((r) => setHealth(`${r.status} (uptime ${r.uptime.toFixed(1)}s)`))
      .catch((e: unknown) => setHealth(`erreur: ${String(e)}`));
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-16">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">loloSandBox</h1>
          <p className="text-muted-foreground text-sm">
            Monorepo TypeScript / Bun / Nx — front (Vite + React), BFF (Hono), kit UI maison
            (Radix + Tailwind).
          </p>
        </header>

        <section className="rounded-lg border border-border p-4">
          <h2 className="mb-2 font-medium">État du BFF</h2>
          <p className="text-muted-foreground text-sm">/health → {health}</p>
          {pong ? <p className="text-muted-foreground text-sm">/ping → {pong}</p> : null}
        </section>

        <section className="flex flex-wrap gap-2">
          <Button
            onClick={async () => {
              const r = await fetchPing('hello');
              setPong(`${r.message}${r.echo ? ` (${r.echo})` : ''}`);
            }}
          >
            Ping le BFF
          </Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive" size="sm">
            Petit
          </Button>
        </section>
      </div>
    </main>
  );
}
