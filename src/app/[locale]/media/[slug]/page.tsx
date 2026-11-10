import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { InnerHero } from "@/components/layout/inner-hero";
import { NewsArticle } from "@/components/sections/media/news-article";
import { resolveHref } from "@/config/routes";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { pageMetadata } from "@/lib/metadata";
import { getNewsItem, getNewsList, getNewsSlugs } from "@/lib/news";

const AFTER_HERO_ID = "article";

// Unknown slugs must 404 (not a soft 404 inside a Suspense stream), so this segment
// may block, as the catch-all route does.
export const instant = false;

/** Every article is built ahead of time; one added later is built on its first visit. */
export async function generateStaticParams() {
  return (await getNewsSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/media/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const item = await getNewsItem(slug, locale);
  if (!item) return {};
  const dict = await getDictionary(locale);
  return pageMetadata(locale, dict, {
    path: `media/${slug}`,
    title: item.title,
    description: item.body[0] ?? item.title,
    // Stays out of search results (and the sitemap) until the design is approved.
    noIndex: true,
  });
}

export default async function NewsPage({ params }: PageProps<"/[locale]/media/[slug]">) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const item = await getNewsItem(slug, locale);
  if (!item) notFound();
  const dict = await getDictionary(locale);
  const others = (await getNewsList(locale)).filter((other) => other.slug !== slug);

  return (
    <main id="main">
      <InnerHero
        locale={locale}
        dict={dict}
        parent={{ label: dict.labels.mediaCentre, href: resolveHref(locale, { page: "media" }) }}
        current={dict.mediaPage.news}
        titleLines={dict.mediaPage.titleLines}
        text={dict.mediaPage.intro}
        nextSectionId={AFTER_HERO_ID}
      />
      <NewsArticle locale={locale} dict={dict} item={item} others={others} id={AFTER_HERO_ID} />
    </main>
  );
}
