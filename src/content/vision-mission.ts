/** Non-translatable Vision & Mission page data; the wording is in the dictionaries. */
import type { Href, LabelKey } from "@/config/routes";
import type { Dictionary } from "@/i18n/get-dictionary";

export type StatementId = keyof Dictionary["visionMission"]["statements"];

/** Mission first, as on smnpower.com/vision-mission.php. */
export const statementOrder: readonly StatementId[] = ["mission", "vision"];

export const visionMissionImage = {
  src: "/images/vision-mission/wind-solar-desert.jpg",
  width: 550,
  height: 800,
} as const;

export const visionMissionExploreLinks: readonly { label: LabelKey; image: string; href: Href }[] = [
  {
    label: "ourCompany",
    image: "/images/our-company/explore-main-shareholders.jpg",
    href: { page: "about/our-company" },
  },
  {
    label: "mainShareholders",
    image: "/images/our-company/explore-mission-vision.jpg",
    href: { page: "about/main-shareholders" },
  },
];
