const BASE_URL = process.env.ANYTYPE_API_URL ?? 'http://127.0.0.1:31009';
const API_KEY = process.env.ANYTYPE_API_KEY ?? '';
const ANYTYPE_VERSION = '2025-05-20';

class AnytypeError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'AnytypeError';
  }
}

async function anytypeFetch(path: string, init: RequestInit = {}): Promise<unknown> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Anytype-Version': ANYTYPE_VERSION,
      'Content-Type': 'application/json',
      ...(init.headers as Record<string, string> | undefined),
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new AnytypeError(res.status, `Anytype API ${res.status}: ${body}`);
  }

  return res.json();
}

function buildQs(params: Record<string, number | string | undefined>): string {
  const qs = new URLSearchParams();
  for (const [key, val] of Object.entries(params)) {
    if (val !== undefined) qs.set(key, String(val));
  }
  const s = qs.toString();
  return s ? `?${s}` : '';
}

export { AnytypeError };

export const anytypeClient = {
  get spaceId(): string {
    const id = process.env.ANYTYPE_SPACE_ID ?? '';
    if (!id) throw new AnytypeError(500, 'ANYTYPE_SPACE_ID is not configured');
    return id;
  },

  listSpaces(params?: { limit?: number; offset?: number }) {
    return anytypeFetch(`/v1/spaces${buildQs({ ...params })}`);
  },

  listObjects(spaceId: string, params?: { limit?: number; offset?: number }) {
    return anytypeFetch(`/v1/spaces/${spaceId}/objects${buildQs({ ...params })}`);
  },

  getObject(spaceId: string, objectId: string) {
    return anytypeFetch(`/v1/spaces/${spaceId}/objects/${objectId}`);
  },

  createObject(spaceId: string, body: unknown) {
    return anytypeFetch(`/v1/spaces/${spaceId}/objects`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  updateObject(spaceId: string, objectId: string, body: unknown) {
    return anytypeFetch(`/v1/spaces/${spaceId}/objects/${objectId}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  deleteObject(spaceId: string, objectId: string) {
    return anytypeFetch(`/v1/spaces/${spaceId}/objects/${objectId}`, {
      method: 'DELETE',
    });
  },

  searchObjects(spaceId: string, body: unknown) {
    return anytypeFetch(`/v1/spaces/${spaceId}/search`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },
};
