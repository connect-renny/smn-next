import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { InnerHero } from "@/components/layout/inner-hero";
import { MediaList } from "@/components/sections/media/media-list";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { pageMetadata } from "@/lib/metadata";
import { getNewsList } from "@/lib/news";

const AFTER_HERO_ID = "news";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/media">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return pageMetadata(locale, dict, {
    path: "media",
    title: dict.labels.mediaCentre,
    description: dict.mediaPage.intro,
    // Stays out of search results (and the sitemap) until the design is approved.
    noIndex: true,
  });
}

export default async function MediaPage({ params }: PageProps<"/[locale]/media">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const items = await getNewsList(locale);

  return (
    <main id="main">
      <InnerHero
        locale={locale}
        dict={dict}
        current={dict.labels.mediaCentre}
        titleLines={dict.mediaPage.titleLines}
        text={dict.mediaPage.intro}
        nextSectionId={AFTER_HERO_ID}
      />
      <MediaList locale={locale} dict={dict} items={items} id={AFTER_HERO_ID} />
    </main>
  );
}
