import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AnimatedSection } from "@/components/animations/animated-section";
import { InnerHero } from "@/components/layout/inner-hero";
import { ExploreFurther } from "@/components/sections/explore-further";
import { PlantDescription } from "@/components/sections/plant/plant-description";
import { PlantMilestones } from "@/components/sections/plant/plant-milestones";
import { PlantStats } from "@/components/sections/plant/plant-stats";
import { RusailEquipment } from "@/components/sections/plant/rusail-equipment";
import { rusailImages, rusailStats } from "@/content/al-rusail-plant";
import { plantExploreLinks } from "@/content/barka-plant";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { pageMetadata } from "@/lib/metadata";

const AFTER_HERO_ID = "rusail-details";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/plants/al-rusail">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  const t = dict.rusailPlant.hero;
  return pageMetadata(locale, dict, {
    path: "plants/al-rusail",
    title: t.current,
    description: t.text[0],
    // Stays out of search results (and the sitemap) until the client confirms the figures.
    noIndex: true,
  });
}

/** Laid out like the Barka Plant page; the text is smnpower.com/al-rusail-plant.php. */
export default async function RusailPlantPage({ params }: PageProps<"/[locale]/plants/al-rusail">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.rusailPlant.hero;

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
        <PlantStats stats={rusailStats} copy={t.stats} />
      </InnerHero>
      <PlantDescription
        copy={dict.rusailPlant.description}
        images={rusailImages}
        id={AFTER_HERO_ID}
      >
        <RusailEquipment copy={dict.rusailPlant.equipment} />
      </PlantDescription>
      <AnimatedSection ink="light" snap={false}>
        <PlantMilestones copy={dict.rusailPlant.milestones} />
      </AnimatedSection>
      <ExploreFurther
        locale={locale}
        title={dict.ourCompany.explore.title}
        links={[
          { ...plantExploreLinks.barka, label: dict.barkaPlant.hero.current },
          { ...plantExploreLinks.rusail, label: t.current },
        ]}
      />
    </main>
  );
}
