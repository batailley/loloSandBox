import { zValidator } from '@hono/zod-validator';
import { type PingResponse, PingResponseSchema } from '@lolo/shared/schemas';
import { Hono } from 'hono';
import { z } from 'zod';

export const pingRoutes = new Hono();

const PingQuerySchema = z.object({
  echo: z.string().min(1).optional(),
});

pingRoutes.get('/', zValidator('query', PingQuerySchema), (c) => {
  const { echo } = c.req.valid('query');
  const response: PingResponse = {
    message: 'pong',
    ...(echo !== undefined ? { echo } : {}),
  };
  return c.json(PingResponseSchema.parse(response));
});
