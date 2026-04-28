import type { HelloWorldGreeting } from '@lolo/shared/schemas';
import { useEffect, useState } from 'react';
import { fetchHelloWorldGreeting } from '../../api/bff';
import { HelloWorldFeature } from './HelloWorldFeature';

export function HelloWorldPage() {
  const [greeting, setGreeting] = useState<HelloWorldGreeting | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHelloWorldGreeting('World')
      .then(setGreeting)
      .catch((e: unknown) => setError(String(e)));
  }, []);

  if (error) {
    return <div className="px-6 py-12 text-sm text-destructive">{error}</div>;
  }
  if (!greeting) {
    return <div className="px-6 py-12 text-sm text-muted-foreground">Loading…</div>;
  }
  return <HelloWorldFeature greeting={greeting} />;
}
