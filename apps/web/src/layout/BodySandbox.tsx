import type { ReactNode } from 'react';

interface BodySandboxProps {
  children: ReactNode;
}

export function BodySandbox({ children }: BodySandboxProps) {
  return (
    <main className="mt-14 min-h-[calc(100vh-3.5rem)] bg-background text-foreground">
      {children}
    </main>
  );
}
