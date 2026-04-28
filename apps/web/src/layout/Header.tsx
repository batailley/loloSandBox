import type { HostMe } from '@lolo/shared/schemas';
import { cn } from '@lolo/ui';
import type { ReactNode } from 'react';

interface HeaderProps {
  user: HostMe | null;
  onBurgerClick: () => void;
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
}

export function Header({ user, onBurgerClick, leftSlot, rightSlot }: HeaderProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background px-4">
      <button
        type="button"
        onClick={onBurgerClick}
        aria-label="Open navigation"
        className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted"
      >
        <span className="flex flex-col gap-1">
          <span className="block h-0.5 w-5 bg-foreground" />
          <span className="block h-0.5 w-5 bg-foreground" />
          <span className="block h-0.5 w-5 bg-foreground" />
        </span>
      </button>

      <span className="font-semibold tracking-tight">loloSandBox</span>

      {leftSlot}

      <div className="flex-1" />

      {rightSlot}

      {user && (
        <div
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-full',
            'bg-primary text-primary-foreground text-xs font-semibold',
          )}
          title={user.name}
          aria-label={`Logged in as ${user.name}`}
        >
          {user.avatarInitials}
        </div>
      )}
    </header>
  );
}
