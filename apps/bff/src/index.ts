import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { healthRoutes } from './routes/health';
import { pingRoutes } from './routes/ping';

const app = new Hono();

app.use('*', logger());
app.use(
  '*',
  cors({
    origin: (origin) => origin ?? '*', // À restreindre en prod
    credentials: true,
  }),
);

app.route('/health', healthRoutes);
app.route('/ping', pingRoutes);

app.notFound((c) => c.json({ error: 'not_found' }, 404));
app.onError((err, c) => {
  console.error(err);
  return c.json({ error: 'internal_error' }, 500);
});

const port = Number(Bun.env.PORT ?? 3001);
console.log(`🚀 BFF en écoute sur http://localhost:${port}`);

export default {
  port,
  fetch: app.fetch,
};
