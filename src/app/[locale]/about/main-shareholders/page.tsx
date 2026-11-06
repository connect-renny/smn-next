import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { InnerHero } from "@/components/layout/inner-hero";
import { ExploreFurther } from "@/components/sections/explore-further";
import { ShareholderChapter } from "@/components/sections/main-shareholders/shareholder-chapter";
import { ShareholdersConfluence } from "@/components/sections/main-shareholders/shareholders-confluence";
import { shareholderChapters, shareholdersExploreLinks } from "@/content/main-shareholders";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { pageMetadata } from "@/lib/metadata";

const AFTER_HERO_ID = "shareholders-overview";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/about/main-shareholders">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return pageMetadata(locale, dict, {
    path: "about/main-shareholders",
    title: dict.labels.mainShareholders,
    description: dict.mainShareholders.text,
    // Stays out of search results (and the sitemap) until the design is approved.
    noIndex: true,
  });
}

export default async function MainShareholdersPage({
  params,
}: PageProps<"/[locale]/about/main-shareholders">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <main id="main">
      <InnerHero
        locale={locale}
        dict={dict}
        parent={{ label: dict.labels.aboutUs }}
        current={dict.labels.mainShareholders}
        titleLines={dict.mainShareholders.titleLines}
        text={dict.mainShareholders.text}
        nextSectionId={AFTER_HERO_ID}
      />
      <ShareholdersConfluence copy={dict.mainShareholders} id={AFTER_HERO_ID} />
      {shareholderChapters.map((chapter, i) => (
        <ShareholderChapter key={chapter.id} chapter={chapter} number={i + 1} dict={dict} />
      ))}
      <ExploreFurther
        locale={locale}
        title={dict.ourCompany.explore.title}
        links={shareholdersExploreLinks.map((link) => ({
          ...link,
          label: dict.labels[link.label],
        }))}
      />
    </main>
  );
}
