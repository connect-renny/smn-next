import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { InnerHero } from "@/components/layout/inner-hero";
import { BoardMembers } from "@/components/sections/board-of-directors/board-members";
import { ExploreFurther } from "@/components/sections/explore-further";
import { resolveHref } from "@/config/routes";
import { nominationExploreLinks, nominationMembers } from "@/content/nomination-committee";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { pageMetadata } from "@/lib/metadata";

const AFTER_HERO_ID = "committee-members";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/corporate-governance/nomination-remuneration-committee">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return pageMetadata(locale, dict, {
    path: "corporate-governance/nomination-remuneration-committee",
    title: dict.labels.nominationCommittee,
    description: dict.nominationCommittee.text,
    // Stays out of search results (and the sitemap) until the design is approved.
    noIndex: true,
  });
}

export default async function NominationCommitteePage({
  params,
}: PageProps<"/[locale]/corporate-governance/nomination-remuneration-committee">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const copy = dict.nominationCommittee;
  const board = dict.boardOfDirectors.members;

  // Board bios with the committee role in place of the board one.
  const members = Object.fromEntries(
    nominationMembers.map(({ id }) => [id, { ...board[id], role: copy.roles[id] }]),
  );

  return (
    <main id="main">
      <InnerHero
        locale={locale}
        dict={dict}
        parent={{
          label: dict.labels.governance,
          href: resolveHref(locale, { section: "governance" }),
        }}
        current={dict.labels.nominationCommittee}
        titleLines={copy.titleLines}
        text={copy.text}
        nextSectionId={AFTER_HERO_ID}
      />
      <BoardMembers copy={{ ...copy, members }} members={nominationMembers} id={AFTER_HERO_ID} />
      <ExploreFurther
        locale={locale}
        title={dict.ourCompany.explore.title}
        links={nominationExploreLinks.map((link) => ({ ...link, label: dict.labels[link.label] }))}
      />
    </main>
  );
}
