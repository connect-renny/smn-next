import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AnimatedSection } from "@/components/animations/animated-section";
import { InnerHero } from "@/components/layout/inner-hero";
import { ExploreFurther } from "@/components/sections/explore-further";
import { StatementPanels } from "@/components/sections/vision-mission/statement-panels";
import { visionMissionExploreLinks } from "@/content/vision-mission";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { pageMetadata } from "@/lib/metadata";

const AFTER_HERO_ID = "statements";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/about/vision-mission">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  const copy = dict.visionMission;
  return pageMetadata(locale, dict, {
    path: "about/vision-mission",
    title: dict.labels.visionMission,
    description: copy.intro,
    // Stays out of search results (and the sitemap) until the design is approved.
    noIndex: true,
  });
}

export default async function VisionMissionPage({
  params,
}: PageProps<"/[locale]/about/vision-mission">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const copy = dict.visionMission;

  return (
    <main id="main">
      <InnerHero
        locale={locale}
        dict={dict}
        parent={{ label: dict.labels.aboutUs }}
        current={dict.labels.visionMission}
        titleLines={copy.titleLines}
        text={copy.intro}
        nextSectionId={AFTER_HERO_ID}
      />
      <AnimatedSection
        id={AFTER_HERO_ID}
        ink="dark"
        snap={false}
        className="overflow-hidden bg-white py-[clamp(56px,6vw,115px)] text-about-ink"
      >
        <div className="company-column">
          <StatementPanels copy={copy} />
        </div>
      </AnimatedSection>
      <ExploreFurther
        locale={locale}
        title={dict.ourCompany.explore.title}
        links={visionMissionExploreLinks.map((link) => ({
          ...link,
          label: dict.labels[link.label],
        }))}
      />
    </main>
  );
}
