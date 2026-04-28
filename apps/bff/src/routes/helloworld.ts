import { zValidator } from '@hono/zod-validator';
import { HelloWorldGreetingSchema } from '@lolo/shared/schemas';
import { Hono } from 'hono';
import { z } from 'zod';

export const helloworldRoutes = new Hono();

const GreetingQuerySchema = z.object({
  name: z.string().min(1).optional(),
});

helloworldRoutes.get('/greeting', zValidator('query', GreetingQuerySchema), (c) => {
  const { name } = c.req.valid('query');
  return c.json(
    HelloWorldGreetingSchema.parse({
      message: `Hello, ${name ?? 'World'}!`,
      timestamp: new Date().toISOString(),
    }),
  );
});
