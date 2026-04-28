import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge intelligent de classes Tailwind (gère les conflits style `p-2 p-4`). */
export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));
