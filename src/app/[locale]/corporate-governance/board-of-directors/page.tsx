import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BoardHero } from "@/components/sections/board-of-directors/board-hero";
import { BoardMembers } from "@/components/sections/board-of-directors/board-members";
import { ExploreFurther } from "@/components/sections/explore-further";
import { boardExploreLinks } from "@/content/board-of-directors";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { pageMetadata } from "@/lib/metadata";

const AFTER_HERO_ID = "board-members";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/corporate-governance/board-of-directors">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return pageMetadata(locale, dict, {
    path: "corporate-governance/board-of-directors",
    title: dict.labels.boardOfDirectors,
    description: dict.boardOfDirectors.text,
    // Stays out of search results (and the sitemap) until the member list is confirmed.
    noIndex: true,
  });
}

export default async function BoardOfDirectorsPage({
  params,
}: PageProps<"/[locale]/corporate-governance/board-of-directors">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <main id="main">
      <BoardHero locale={locale} dict={dict} nextSectionId={AFTER_HERO_ID} />
      <BoardMembers dict={dict} id={AFTER_HERO_ID} />
      <ExploreFurther
        locale={locale}
        title={dict.ourCompany.explore.title}
        links={boardExploreLinks.map((link) => ({ ...link, label: dict.labels[link.label] }))}
      />
    </main>
  );
}
