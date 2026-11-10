import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { InnerHero } from "@/components/layout/inner-hero";
import { GovernanceFramework } from "@/components/sections/companys-philosophy/governance-framework";
import { PhilosophyComponents } from "@/components/sections/companys-philosophy/philosophy-components";
import { ExploreFurther } from "@/components/sections/explore-further";
import { resolveHref } from "@/config/routes";
import { philosophyExploreLinks } from "@/content/companys-philosophy";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { pageMetadata } from "@/lib/metadata";

const AFTER_HERO_ID = "governance-framework";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/corporate-governance/companys-philosophy">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  const copy = dict.companysPhilosophy;
  return pageMetadata(locale, dict, {
    path: "corporate-governance/companys-philosophy",
    title: dict.labels.companysPhilosophy,
    description: `${copy.text} ${copy.components.join(" ")}`,
    // Stays out of search results (and the sitemap) until the design is approved.
    noIndex: true,
  });
}

export default async function CompanysPhilosophyPage({
  params,
}: PageProps<"/[locale]/corporate-governance/companys-philosophy">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const copy = dict.companysPhilosophy;

  return (
    <main id="main">
      <InnerHero
        locale={locale}
        dict={dict}
        parent={{
          label: dict.labels.governance,
          href: resolveHref(locale, { section: "governance" }),
        }}
        current={dict.labels.companysPhilosophy}
        titleLines={copy.titleLines}
        text={copy.text}
        nextSectionId={AFTER_HERO_ID}
      >
        <PhilosophyComponents items={copy.components} label={copy.componentsLabel} />
      </InnerHero>
      <GovernanceFramework dict={dict} id={AFTER_HERO_ID} />
      <ExploreFurther
        locale={locale}
        title={dict.ourCompany.explore.title}
        links={philosophyExploreLinks.map((link) => ({ ...link, label: dict.labels[link.label] }))}
      />
    </main>
  );
}
