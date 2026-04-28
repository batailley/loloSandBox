import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { healthRoutes } from './routes/health';
import { helloworldRoutes } from './routes/helloworld';
import { hostRoutes } from './routes/host';
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

const apiv1 = new Hono();
apiv1.route('/host', hostRoutes);
apiv1.route('/helloworld', helloworldRoutes);
app.route('/apiv1', apiv1);

app.notFound((c) => c.json({ error: 'not_found' }, 404));
app.onError((err, c) => {
  console.error(err);
  return c.json({ error: 'internal_error' }, 500);
});

const port = Number(process.env.PORT ?? 3001);
console.log(`🚀 BFF en écoute sur http://localhost:${port}`);

export default {
  port,
  fetch: app.fetch,
};
