import type { Href, LabelKey } from "@/config/routes";

/**
 * The two chapters, in the order of smnpower.com/founders.php. Wording is in the
 * dictionaries. The client asked for no shareholder logos, so the photos are
 * logo-free: the Kahrabel one is cropped above the sign on the building.
 */
export const shareholderChapters = [
  {
    id: "kahrabel",
    accent: "#f79431",
    accentSoft: "#ffc06a",
    image: "/images/main-shareholders/kahrabel-facade.jpg",
  },
  {
    id: "mubadala",
    accent: "#71bf44",
    accentSoft: "#adcf37",
    image: "/images/home/shareholder-mubadala.jpg",
  },
] as const;

export const shareholdersExploreLinks: readonly { label: LabelKey; image: string; href: Href }[] = [
  {
    label: "ourCompany",
    image: "/images/our-company/explore-main-shareholders.jpg",
    href: { page: "about/our-company" },
  },
  {
    label: "visionMission",
    image: "/images/our-company/explore-mission-vision.jpg",
    href: { page: "about/vision-mission" },
  },
];
