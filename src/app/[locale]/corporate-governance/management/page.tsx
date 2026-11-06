import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { InnerHero } from "@/components/layout/inner-hero";
import { BoardMembers } from "@/components/sections/board-of-directors/board-members";
import { ExploreFurther } from "@/components/sections/explore-further";
import { resolveHref } from "@/config/routes";
import { managementExploreLinks, managementTeam } from "@/content/management";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { pageMetadata } from "@/lib/metadata";

const AFTER_HERO_ID = "management-team";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/corporate-governance/management">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return pageMetadata(locale, dict, {
    path: "corporate-governance/management",
    title: dict.labels.management,
    description: dict.management.text,
    // Stays out of search results (and the sitemap) until the design is approved.
    noIndex: true,
  });
}

export default async function ManagementPage({
  params,
}: PageProps<"/[locale]/corporate-governance/management">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <main id="main">
      <InnerHero
        locale={locale}
        dict={dict}
        parent={{
          label: dict.labels.governance,
          href: resolveHref(locale, { section: "governance" }),
        }}
        current={dict.labels.management}
        titleLines={dict.management.titleLines}
        text={dict.management.text}
        nextSectionId={AFTER_HERO_ID}
      />
      <BoardMembers copy={dict.management} members={managementTeam} id={AFTER_HERO_ID} />
      <ExploreFurther
        locale={locale}
        title={dict.ourCompany.explore.title}
        links={managementExploreLinks.map((link) => ({ ...link, label: dict.labels[link.label] }))}
      />
    </main>
  );
}
