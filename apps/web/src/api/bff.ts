import {
  type HealthResponse,
  HealthResponseSchema,
  type PingResponse,
  PingResponseSchema,
} from '@lolo/shared/schemas';

/**
 * Wrapper minimal autour de fetch.
 * En dev, /api est proxifié vers le BFF par Vite (cf. vite.config.ts).
 * En prod, exposer le BFF derrière le même domaine ou définir VITE_API_BASE.
 */
const API_BASE = import.meta.env.VITE_API_BASE ?? '/api';

const json = async <T>(path: string, schema: { parse: (v: unknown) => T }): Promise<T> => {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`HTTP ${res.status} on ${path}`);
  const body = (await res.json()) as unknown;
  return schema.parse(body);
};

export const fetchHealth = (): Promise<HealthResponse> => json('/health', HealthResponseSchema);

export const fetchPing = (echo?: string): Promise<PingResponse> => {
  const qs = echo ? `?echo=${encodeURIComponent(echo)}` : '';
  return json(`/ping${qs}`, PingResponseSchema);
};
