import "server-only";

import { newsEntries, type NewsImage } from "@/content/news";
import type { Locale } from "@/i18n/config";

/** One news item, in one language, ready for the pages. */
export type NewsItem = {
  slug: string;
  date: string | null;
  /** The date as the page shows it, e.g. "31 August 2022". */
  dateLabel: string | null;
  title: string;
  cover: NewsImage;
  image: NewsImage;
  body: readonly string[];
};

/**
 * The only place the pages get news from. Today it reads `src/content/news.ts`;
 * when the CMS is connected, these two functions query it instead (cached, and
 * refreshed by the CMS's publish webhook), and nothing else has to change.
 */
export async function getNewsList(locale: Locale): Promise<NewsItem[]> {
  return newsEntries.map(({ slug, date, cover, image, title, body }) => ({
    slug,
    date,
    dateLabel: date ? formatDate(date, locale) : null,
    title: title[locale],
    cover,
    image: image ?? cover,
    body: body[locale],
  }));
}

export async function getNewsItem(slug: string, locale: Locale): Promise<NewsItem | null> {
  return (await getNewsList(locale)).find((item) => item.slug === slug) ?? null;
}

export async function getNewsSlugs(): Promise<string[]> {
  return newsEntries.map((entry) => entry.slug);
}

function formatDate(iso: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-OM" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
    numberingSystem: "latn",
  }).format(new Date(`${iso}T00:00:00Z`));
}
