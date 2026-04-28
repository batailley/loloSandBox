/**
 * Types partagés purement TypeScript (pas de runtime).
 * Pour des types liés à un schéma de validation, préférer schemas/.
 */

export type Brand<T, B extends string> = T & { readonly __brand: B };

export type UserId = Brand<string, 'UserId'>;

export type ApiResult<T, E = string> =
  | { ok: true; data: T }
  | { ok: false; error: E };
