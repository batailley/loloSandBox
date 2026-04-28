/**
 * Utilitaires partagés. Garder pur (pas de DOM, pas de Node-only API)
 * pour rester utilisable côté navigateur ET côté Bun/Node.
 */

export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const isDefined = <T>(value: T | null | undefined): value is T =>
  value !== null && value !== undefined;

/** Tagged template no-op pour activer la coloration "html" / "css" dans certains éditeurs. */
export const html = (strings: TemplateStringsArray, ...values: unknown[]): string =>
  strings.reduce((acc, str, i) => acc + str + (values[i] ?? ''), '');
