import { type HealthResponse, HealthResponseSchema } from '@lolo/shared/schemas';
import { Hono } from 'hono';

export const healthRoutes = new Hono();

const startedAt = Date.now();

healthRoutes.get('/', (c) => {
  const payload: HealthResponse = {
    status: 'ok',
    uptime: (Date.now() - startedAt) / 1000,
    timestamp: new Date().toISOString(),
  };
  // Validation runtime — assure que le contrat partagé est respecté avant d'envoyer
  return c.json(HealthResponseSchema.parse(payload));
});
