import { describe, expect, it } from "vitest";

import ar from "@/i18n/dictionaries/ar.json";
import en from "@/i18n/dictionaries/en.json";

/**
 * Every key path in a dictionary ("about.facts.barka.label", …). Array items
 * that are objects are walked too (hero news items), so their fields must
 * match; plain string lists (title lines) may differ in length per language.
 */
function keyPaths(value: unknown, prefix = ""): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item) =>
      item && typeof item === "object" ? keyPaths(item, `${prefix}[]`) : [],
    );
  }
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, child]) => {
      const path = prefix ? `${prefix}.${key}` : key;
      return [path, ...keyPaths(child, path)];
    });
  }
  return [];
}

function strings(value: unknown, path = ""): [string, string][] {
  if (typeof value === "string") return [[path, value]];
  if (Array.isArray(value)) return value.flatMap((v, i) => strings(v, `${path}[${i}]`));
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([k, v]) => strings(v, path ? `${path}.${k}` : k));
  }
  return [];
}

describe("dictionaries", () => {
  const enKeys = new Set(keyPaths(en));
  const arKeys = new Set(keyPaths(ar));

  it("Arabic has every key English has", () => {
    expect([...enKeys].filter((k) => !arKeys.has(k))).toEqual([]);
  });

  it("Arabic has no keys English lacks (typos, leftovers)", () => {
    expect([...arKeys].filter((k) => !enKeys.has(k))).toEqual([]);
  });

  it("Arabic uses Western digits only (0-9), never Arabic-Indic digits", () => {
    const offenders = strings(ar).filter(([, text]) => /[٠-٩۰-۹]/.test(text));
    expect(offenders).toEqual([]);
  });
});
