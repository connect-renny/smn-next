import { describe, expect, it } from "vitest";

import { createAssistSearch, type AssistEntry } from "@/components/assist/assist-search";
import { assistTargets } from "@/content/home";
import ar from "@/i18n/dictionaries/ar.json";
import en from "@/i18n/dictionaries/en.json";

/** Same shape the layout builds for the Ask SMN panel (hrefs don't matter here). */
function searchFor(dict: typeof en) {
  const ids = Object.keys(assistTargets) as (keyof typeof assistTargets)[];
  const index: AssistEntry[] = ids.map((id) => ({ id, href: `#${id}`, ...dict.assist.index[id] }));
  return createAssistSearch(index, dict.assist.stopWords, dict.assist.softWords);
}

const topHit = (search: ReturnType<typeof searchFor>, query: string) => search(query)[0]?.id;

describe("Ask SMN search (English)", () => {
  const search = searchFor(en);

  it.each([
    ["shareholders", "shareholders"],
    ["who owns the company", "shareholders"],
    ["barka", "barka"],
    ["rusail plant", "rusail"],
    ["board of directors", "board"],
    ["annual report", "annualReport"],
    ["phone number", "contact"],
    ["latest news", "media"],
  ])("%s → %s", (query, id) => {
    expect(topHit(search, query)).toBe(id);
  });

  it("every topic chip finds something", () => {
    for (const tag of en.assist.tags) expect(search(tag), tag).not.toHaveLength(0);
  });

  it("nonsense finds nothing (the panel then offers Contact)", () => {
    expect(search("xyzzy qwerty")).toEqual([]);
  });
});

describe("Ask SMN search (Arabic)", () => {
  const search = searchFor(ar as typeof en);

  it.each([
    ["المساهمين", "shareholders"],
    ["بركاء", "barka"],
    ["مجلس الإدارة", "board"],
  ])("%s → %s", (query, id) => {
    expect(topHit(search, query)).toBe(id);
  });

  it("every topic chip finds something", () => {
    for (const tag of ar.assist.tags) expect(search(tag), tag).not.toHaveLength(0);
  });
});
