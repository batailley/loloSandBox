import { HostFeaturesSchema, HostMeSchema } from '@lolo/shared/schemas';
import { Hono } from 'hono';

export const hostRoutes = new Hono();

hostRoutes.get('/me', (c) => {
  return c.json(
    HostMeSchema.parse({
      name: 'Laurent Batailley',
      email: 'laurent.batailley@gmail.com',
      avatarInitials: 'LB',
    }),
  );
});

hostRoutes.get('/features', (c) => {
  return c.json(
    HostFeaturesSchema.parse({
      features: [
        {
          id: 'hello-world',
          name: 'Hello World',
          route: '/features/hello-world',
          description: 'A minimal greeting feature — the sandbox starting point.',
        },
      ],
    }),
  );
});
