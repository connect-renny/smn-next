import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AnimatedSection } from "@/components/animations/animated-section";
import { InnerHero } from "@/components/layout/inner-hero";
import { BarkaPlantDescription } from "@/components/sections/barka-plant/description";
import { BarkaMilestones } from "@/components/sections/barka-plant/milestones";
import { BarkaPlantStats } from "@/components/sections/barka-plant/plant-stats";
import { ExploreFurther } from "@/components/sections/explore-further";
import { barkaExploreLinks } from "@/content/barka-plant";
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
        <BarkaPlantStats dict={dict} />
      </InnerHero>
      <BarkaPlantDescription dict={dict} id={AFTER_HERO_ID} />
      <AnimatedSection ink="light" snap={false}>
        <BarkaMilestones copy={dict.barkaPlant.milestones} />
      </AnimatedSection>
      <ExploreFurther
        locale={locale}
        title={dict.ourCompany.explore.title}
        links={[
          { ...barkaExploreLinks.barka, label: t.current },
          { ...barkaExploreLinks.rusail, label: dict.labels.rusailPlant },
        ]}
      />
    </main>
  );
}
