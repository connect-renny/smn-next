import "server-only";

import en from "./dictionaries/en";
import type { Locale } from "./config";

export type Dictionary = typeof en;

/**
 * Arabic ships as a key-for-key copy of English with empty strings, ready for
 * the translator. Any value that is still empty falls back to English, so the
 * Arabic site is always complete (RTL layout, English copy until translated).
 */
function withFallback<T>(base: T, override: unknown): T {
  if (typeof base === "string") {
    return (typeof override === "string" && override.trim() !== "" ? override : base) as T;
  }
  if (Array.isArray(base)) {
    const list = Array.isArray(override) ? override : [];
    return base.map((item, i) => withFallback(item, list[i])) as T;
  }
  if (base && typeof base === "object") {
    const source = (override ?? {}) as Record<string, unknown>;
    return Object.fromEntries(
      Object.entries(base).map(([key, value]) => [key, withFallback(value, source[key])]),
    ) as T;
  }
  return base;
}

const loaders: Record<Locale, () => Promise<Dictionary>> = {
  en: async () => en,
  ar: async () => withFallback(en, (await import("./dictionaries/ar")).default),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return loaders[locale]();
}
