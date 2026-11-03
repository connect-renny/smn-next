/**
 * Tiny client-side search over the site's topics — a straight port of the
 * demo's scoring: title hits outweigh keyword hits, and a prefix counts so
 * "share" finds "shareholders" and a half-spoken word still lands.
 * Unicode-aware, so the same index works for Arabic keywords.
 */
export type AssistEntry = {
  id: string;
  title: string;
  path: string;
  keywords: string;
  href: string;
};

const words = (s: string) =>
  s
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1);

export function createAssistSearch(index: AssistEntry[], stopWords: string, softWords: string) {
  const stop = new Set(words(stopWords));
  const soft = new Set(words(softWords));
  const prepared = index.map((entry) => ({
    entry,
    title: words(entry.title),
    keys: words(`${entry.keywords} ${entry.path}`),
  }));

  return function search(query: string, limit = 3): AssistEntry[] {
    let terms = words(query).filter((w) => !stop.has(w));
    // A chip like "About SMN" is nearly all filler — fall back to it raw.
    if (!terms.length) terms = words(query);
    if (!terms.length) return [];

    return prepared
      .map(({ entry, title, keys }) => {
        let score = 0;
        for (const w of terms) {
          let hit = 0;
          for (const x of title) {
            if (x === w) hit += 4;
            else if (x.startsWith(w)) hit += 2;
          }
          for (const x of keys) {
            if (x === w) hit += 3;
            else if (x.startsWith(w) && w.length > 2) hit += 1;
          }
          score += soft.has(w) ? hit * 0.4 : hit;
        }
        return { entry, score };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((r) => r.entry);
  };
}
