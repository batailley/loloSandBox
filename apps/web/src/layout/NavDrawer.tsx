import type { HostFeature } from '@lolo/shared/schemas';
import { cn } from '@lolo/ui';
import { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';

interface NavDrawerProps {
  open: boolean;
  onClose: () => void;
  features: HostFeature[];
}

export function NavDrawer({ open, onClose, features }: NavDrawerProps) {
  const drawerRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-40 bg-foreground/20 transition-opacity duration-200',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
        onKeyDown={(e) => e.key === 'Enter' && onClose()}
        role="presentation"
        aria-hidden="true"
      />
      <dialog
        ref={drawerRef}
        aria-label="Navigation"
        className={cn(
          'fixed inset-y-0 left-0 z-50 m-0 w-64 border-r border-border bg-background',
          'flex flex-col gap-1 p-4 pt-16',
          'transition-transform duration-200',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
        open={open}
      >
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Features
        </p>
        {features.map((f) => (
          <NavLink
            key={f.id}
            to={f.route}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                'rounded-md px-3 py-2 text-sm transition-colors',
                isActive ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted',
              )
            }
          >
            {f.name}
          </NavLink>
        ))}
      </dialog>
    </>
  );
}
