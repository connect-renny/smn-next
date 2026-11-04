/**
 * Non-translatable Our Company page data. Copy lives in the dictionaries; the hero
 * facts reuse `about.facts`, so the figures stay the same as on the home page.
 */
import type { Href } from "@/config/routes";
import type { Dictionary } from "@/i18n/get-dictionary";

export const companyPlants: Record<
  keyof Dictionary["ourCompany"]["plants"],
  { image: string; href: Href; imageEnd: boolean }
> = {
  barka: {
    image: "/images/our-company/barka-plant.jpg",
    href: { page: "plants/barka-ii" },
    imageEnd: false,
  },
  rusail: {
    image: "/images/our-company/al-rusail-plant.jpg",
    href: { page: "plants/al-rusail" },
    imageEnd: true,
  },
};

export const companyHeroFacts: Record<keyof Dictionary["about"]["facts"], { icon: string }> = {
  established: { icon: "/images/our-company/hero-facts-icon-01.png" },
  barka: { icon: "/images/our-company/hero-facts-icon-02.png" },
  rusail: { icon: "/images/our-company/hero-facts-icon-03.png" },
};

export const companyExploreLinks: Record<
  keyof Dictionary["ourCompany"]["explore"]["links"],
  { image: string; href: Href }
> = {
  mission: {
    image: "/images/our-company/explore-mission-vision.jpg",
    href: { page: "about/vision-mission" },
  },
  shareholders: {
    image: "/images/our-company/explore-main-shareholders.jpg",
    href: { page: "about/main-shareholders" },
  },
};

export type OmanPlaceKind = "town" | "capital" | "power" | "desalination";

/**
 * The places on the client's map, at their true coordinates. Barka's two plants share
 * one site, so they sit a touch apart to stay readable, as they do on the client's map.
 */
export const omanPlaces: {
  id: string;
  label: keyof Dictionary["ourCompany"]["map"]["places"] | null;
  lon: number;
  lat: number;
  kind: OmanPlaceKind;
  side: "end-or-start" | "end-or-top" | "top" | "bottom" | "top-end";
  capital?: boolean;
}[] = [
  { id: "musandam", label: "musandam", lon: 56.25, lat: 26.18, kind: "town", side: "end-or-start" },
  { id: "madha", label: "madha", lon: 56.33, lat: 25.28, kind: "town", side: "end-or-start" },
  { id: "suhar", label: "suhar", lon: 56.71, lat: 24.36, kind: "town", side: "top-end" },
  { id: "barka-desal", label: null, lon: 57.62, lat: 23.72, kind: "desalination", side: "top" },
  { id: "barka", label: "barka", lon: 57.92, lat: 23.68, kind: "power", side: "top" },
  {
    id: "muscat",
    label: "muscat",
    lon: 58.41,
    lat: 23.59,
    kind: "capital",
    side: "top-end",
    capital: true,
  },
  { id: "rusayl", label: "rusayl", lon: 58.16, lat: 23.5, kind: "power", side: "bottom" },
  { id: "ibri", label: "ibri", lon: 56.5, lat: 23.23, kind: "town", side: "top" },
  { id: "nizwa", label: "nizwa", lon: 57.53, lat: 22.93, kind: "town", side: "bottom" },
  { id: "sur", label: "sur", lon: 59.53, lat: 22.57, kind: "town", side: "end-or-top" },
  { id: "salalah", label: "salalah", lon: 54.09, lat: 17.02, kind: "town", side: "top" },
];
