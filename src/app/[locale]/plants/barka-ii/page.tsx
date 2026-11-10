import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AnimatedSection } from "@/components/animations/animated-section";
import { InnerHero } from "@/components/layout/inner-hero";
import { ExploreFurther } from "@/components/sections/explore-further";
import { PlantDescription } from "@/components/sections/plant/plant-description";
import { PlantMilestones } from "@/components/sections/plant/plant-milestones";
import { PlantStats } from "@/components/sections/plant/plant-stats";
import { barkaImages, barkaStats, plantExploreLinks } from "@/content/barka-plant";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { pageMetadata } from "@/lib/metadata";

const AFTER_HERO_ID = "barka-details";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/plants/barka-ii">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  const t = dict.barkaPlant.hero;
  return pageMetadata(locale, dict, {
    path: "plants/barka-ii",
    title: t.current,
    description: t.text[0],
    // Stays out of search results (and the sitemap) until the client confirms the open figures.
    noIndex: true,
  });
}

export default async function BarkaPlantPage({ params }: PageProps<"/[locale]/plants/barka-ii">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.barkaPlant.hero;

  return (
    <main id="main">
      <InnerHero
        locale={locale}
        dict={dict}
        current={t.current}
        titleLines={t.titleLines}
        text={t.text}
        textClassName="lg:max-w-[40vw]"
        nextSectionId={AFTER_HERO_ID}
      >
        <PlantStats stats={barkaStats} copy={t.stats} />
      </InnerHero>
      <PlantDescription
        copy={dict.barkaPlant.description}
        images={barkaImages}
        id={AFTER_HERO_ID}
      />
      <AnimatedSection ink="light" snap={false}>
        <PlantMilestones copy={dict.barkaPlant.milestones} />
      </AnimatedSection>
      <ExploreFurther
        locale={locale}
        title={dict.ourCompany.explore.title}
        links={[
          { ...plantExploreLinks.barka, label: t.current },
          { ...plantExploreLinks.rusail, label: dict.labels.rusailPlant },
        ]}
      />
    </main>
  );
}
