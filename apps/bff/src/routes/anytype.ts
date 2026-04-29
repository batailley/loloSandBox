import { zValidator } from '@hono/zod-validator';
import {
  AnytypeCreateObjectBodySchema,
  AnytypeSearchBodySchema,
  AnytypeUpdateObjectBodySchema,
} from '@lolo/shared/schemas';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';
import { AnytypeError, anytypeClient } from '../lib/anytype-client';

export const anytypeRoutes = new Hono();

const PaginationQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).optional(),
  offset: z.coerce.number().int().min(0).optional(),
});

function wrapAnytypeError(err: unknown): never {
  if (err instanceof AnytypeError) {
    const status = err.status >= 400 && err.status < 600 ? err.status : 502;
    throw new HTTPException(status as ConstructorParameters<typeof HTTPException>[0], {
      message: err.message,
    });
  }
  throw err;
}

// GET /apiv1/anytype/spaces  — discovery: liste les espaces pour récupérer ANYTYPE_SPACE_ID
anytypeRoutes.get('/spaces', zValidator('query', PaginationQuerySchema), async (c) => {
  const { limit, offset } = c.req.valid('query');
  const data = await anytypeClient.listSpaces({ limit, offset }).catch(wrapAnytypeError);
  return c.json(data);
});

// GET /apiv1/anytype/objects
anytypeRoutes.get('/objects', zValidator('query', PaginationQuerySchema), async (c) => {
  const { limit, offset } = c.req.valid('query');
  const data = await anytypeClient
    .listObjects(anytypeClient.spaceId, { limit, offset })
    .catch(wrapAnytypeError);
  return c.json(data);
});

// GET /apiv1/anytype/objects/:id
anytypeRoutes.get('/objects/:id', async (c) => {
  const id = c.req.param('id');
  const data = await anytypeClient
    .getObject(anytypeClient.spaceId, id)
    .catch(wrapAnytypeError);
  return c.json(data);
});

// POST /apiv1/anytype/objects
anytypeRoutes.post('/objects', zValidator('json', AnytypeCreateObjectBodySchema), async (c) => {
  const body = c.req.valid('json');
  const data = await anytypeClient
    .createObject(anytypeClient.spaceId, body)
    .catch(wrapAnytypeError);
  return c.json(data, 201);
});

// PATCH /apiv1/anytype/objects/:id
anytypeRoutes.patch(
  '/objects/:id',
  zValidator('json', AnytypeUpdateObjectBodySchema),
  async (c) => {
    const id = c.req.param('id');
    const body = c.req.valid('json');
    const data = await anytypeClient
      .updateObject(anytypeClient.spaceId, id, body)
      .catch(wrapAnytypeError);
    return c.json(data);
  },
);

// DELETE /apiv1/anytype/objects/:id
anytypeRoutes.delete('/objects/:id', async (c) => {
  const id = c.req.param('id');
  const data = await anytypeClient
    .deleteObject(anytypeClient.spaceId, id)
    .catch(wrapAnytypeError);
  return c.json(data);
});

// POST /apiv1/anytype/search
anytypeRoutes.post('/search', zValidator('json', AnytypeSearchBodySchema), async (c) => {
  const body = c.req.valid('json');
  const data = await anytypeClient
    .searchObjects(anytypeClient.spaceId, body)
    .catch(wrapAnytypeError);
  return c.json(data);
});
