import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { InnerHero } from "@/components/layout/inner-hero";
import { BoardMembers } from "@/components/sections/board-of-directors/board-members";
import { ExploreFurther } from "@/components/sections/explore-further";
import { resolveHref } from "@/config/routes";
import { auditExploreLinks, auditMembers } from "@/content/audit-committee";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { pageMetadata } from "@/lib/metadata";

const AFTER_HERO_ID = "committee-members";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/corporate-governance/audit-committee">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return pageMetadata(locale, dict, {
    path: "corporate-governance/audit-committee",
    title: dict.labels.auditCommittee,
    description: dict.auditCommittee.text,
    // Stays out of search results (and the sitemap) until the design is approved.
    noIndex: true,
  });
}

export default async function AuditCommitteePage({
  params,
}: PageProps<"/[locale]/corporate-governance/audit-committee">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const copy = dict.auditCommittee;
  const board = dict.boardOfDirectors.members;

  // Board bios with the committee role in place of the board one.
  const members = Object.fromEntries(
    auditMembers.map(({ id }) => [id, { ...board[id], role: copy.roles[id] }]),
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
        current={dict.labels.auditCommittee}
        titleLines={copy.titleLines}
        text={copy.text}
        nextSectionId={AFTER_HERO_ID}
      />
      <BoardMembers copy={{ ...copy, members }} members={auditMembers} id={AFTER_HERO_ID} />
      <ExploreFurther
        locale={locale}
        title={dict.ourCompany.explore.title}
        links={auditExploreLinks.map((link) => ({ ...link, label: dict.labels[link.label] }))}
      />
    </main>
  );
}
