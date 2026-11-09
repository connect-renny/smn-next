import type { Href, LabelKey } from "@/config/routes";

/**
 * The two chapters, in the order of smnpower.com/founders.php. Wording is in the
 * dictionaries. The photos stay logo-free (the Kahrabel one is cropped above the
 * sign on the building); the logos the client supplied sit in their own place.
 * Kahrabel manages ENGIE's MENA business, so its logo is ENGIE's. `onLight` is
 * for the pale band below the hero, `onDark` for the navy chapters.
 */
export const shareholderChapters = [
  {
    id: "kahrabel",
    accent: "#f79431",
    accentSoft: "#ffc06a",
    image: "/images/main-shareholders/kahrabel-facade.jpg",
    logo: {
      name: "ENGIE",
      onLight: "/images/main-shareholders/engie-logo.svg",
      onDark: "/images/main-shareholders/engie-logo.svg",
      width: 383,
      height: 138,
    },
  },
  {
    id: "mubadala",
    accent: "#71bf44",
    accentSoft: "#adcf37",
    image: "/images/home/shareholder-mubadala.jpg",
    logo: {
      name: "Mubadala",
      onLight: "/images/main-shareholders/mubadala-logo-dark.svg",
      onDark: "/images/main-shareholders/mubadala-logo-light.svg",
      width: 249,
      height: 37,
    },
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
