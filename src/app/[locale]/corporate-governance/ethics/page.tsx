import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AnimatedSection } from "@/components/animations/animated-section";
import { InnerHero } from "@/components/layout/inner-hero";
import { EthicsCharter } from "@/components/sections/ethics/ethics-charter";
import { EthicsStage } from "@/components/sections/ethics/ethics-stage";
import { ExploreFurther } from "@/components/sections/explore-further";
import { resolveHref } from "@/config/routes";
import { ethicsExploreLinks } from "@/content/ethics";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { pageMetadata } from "@/lib/metadata";

const AFTER_HERO_ID = "principles";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/corporate-governance/ethics">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return pageMetadata(locale, dict, {
    path: "corporate-governance/ethics",
    title: dict.labels.ethics,
    description: dict.ethics.text,
    // Stays out of search results (and the sitemap) until the design is approved.
    noIndex: true,
  });
}

export default async function EthicsPage({
  params,
}: PageProps<"/[locale]/corporate-governance/ethics">) {
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
        current={dict.labels.ethics}
        titleLines={dict.ethics.titleLines}
        text={dict.ethics.text}
        nextSectionId={AFTER_HERO_ID}
      />
      <section id={AFTER_HERO_ID} data-ql-ink="light">
        <EthicsStage copy={dict.ethics} />
      </section>
      <AnimatedSection
        ink="dark"
        snap={false}
        className="overflow-hidden bg-page-tint py-[clamp(64px,7vw,134px)] text-about-ink"
      >
        <EthicsCharter copy={dict.ethics.charter} />
      </AnimatedSection>
      <ExploreFurther
        locale={locale}
        title={dict.ourCompany.explore.title}
        links={ethicsExploreLinks.map((link) => ({ ...link, label: dict.labels[link.label] }))}
      />
    </main>
  );
}
