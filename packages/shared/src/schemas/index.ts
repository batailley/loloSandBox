import { z } from 'zod';

/**
 * Schémas Zod partagés front + BFF.
 * Les types TypeScript sont dérivés via `z.infer<typeof ...>`.
 */

export const HealthResponseSchema = z.object({
  status: z.literal('ok'),
  uptime: z.number().nonnegative(),
  timestamp: z.string().datetime(),
});
export type HealthResponse = z.infer<typeof HealthResponseSchema>;

export const PingResponseSchema = z.object({
  message: z.string(),
  echo: z.string().optional(),
});
export type PingResponse = z.infer<typeof PingResponseSchema>;

export * from './host';
export * from './helloworld';
