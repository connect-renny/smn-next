/**
 * Non-translatable home-page data (assets, URLs, link targets). Copy for each
 * item lives in the dictionaries at the same index / key.
 */
import type { Href, LabelKey } from "@/config/routes";
import type { Dictionary } from "@/i18n/get-dictionary";

export const heroMedia = {
  video: "/videos/hero.mp4",
  poster: "/images/home/hero-video-poster.jpg",
};

export const heroTabs: { key: "barka" | "rusail" | "news"; href: Href }[] = [
  { key: "barka", href: { page: "plants/barka-ii" } },
  { key: "rusail", href: { page: "plants/al-rusail" } },
  { key: "news", href: { section: "media" } },
];

export const sectionVideos = {
  about: "/videos/section-bg.mp4",
  links: "/videos/useful-bg.mp4",
};

/**
 * Each record below is keyed like its dictionary section, so copy and data
 * are matched by name, never by position. The type makes a missing or extra
 * key a compile error; insertion order is the render order.
 */
type Keyed<T, V> = Record<keyof T, V>;

export const aboutFacts: Keyed<Dictionary["about"]["facts"], { icon: string }> = {
  established: { icon: "/images/home/facts-icon-01.png" },
  barka: { icon: "/images/home/facts-icon-02.png" },
  rusail: { icon: "/images/home/facts-icon-03.png" },
};

export const aboutMoreHref: Href = { page: "about/our-company" };

// The comp treats the two panels as separate compositions (see `variants`
// in the Shareholders section, keyed the same way).
export const shareholders: Keyed<
  Dictionary["shareholders"]["items"],
  { image: string; website: { href: string; label: string } }
> = {
  kahrabel: {
    image: "/images/home/shareholder-kahrabel.jpg",
    website: { href: "https://www.engie.com", label: "www.engie.com" },
  },
  mubadala: {
    image: "/images/home/shareholder-mubadala.jpg",
    website: { href: "https://www.mubadala.com", label: "www.mubadala.com" },
  },
};

export const shareholdersMoreHref: Href = { page: "about/main-shareholders" };

export const governanceCells: Keyed<
  Dictionary["governance"]["cells"],
  { image: string; href: Href }
> = {
  board: {
    image: "/images/home/leadership-philosophy.jpg",
    href: { page: "corporate-governance/board-of-directors" },
  },
  philosophy: {
    image: "/images/home/leadership-management.jpg",
    href: { page: "corporate-governance/companys-philosophy" },
  },
  management: {
    image: "/images/home/leadership-directors.jpg",
    href: { page: "corporate-governance/management" },
  },
};

type UsefulLink = { href: string; label: string; logo: string; width: number; height: number };

/** Logos were exported at their 1920-comp display width (`width`). */
export const usefulLinks: Keyed<Dictionary["links"]["items"], UsefulLink> = {
  nama: {
    href: "https://www.omanpwp.om",
    label: "www.omanpwp.om",
    logo: "/images/links/nama.png",
    width: 151,
    height: 91,
  },
  apsr: {
    href: "https://www.apsr.om",
    label: "www.apsr.om",
    logo: "/images/links/apsr.png",
    width: 217,
    height: 95,
  },
  mubadala: {
    href: "https://www.mubadala.com",
    label: "www.mubadala.com",
    logo: "/images/links/mubadala.png",
    width: 361,
    height: 53,
  },
  engie: {
    href: "https://www.engie.com",
    label: "www.engie.com",
    logo: "/images/links/engie.png",
    width: 136,
    height: 48,
  },
  stomo: {
    href: "https://www.stomo.com.om",
    label: "www.stomo.com.om",
    logo: "/images/links/stomo.png",
    width: 160,
    height: 89,
  },
  mem: {
    href: "https://www.mem.gov.om",
    label: "www.mem.gov.om",
    logo: "/images/links/mem.png",
    width: 312,
    height: 86,
  },
  msx: {
    href: "https://www.msx.om",
    label: "www.msx.om",
    logo: "/images/links/msx.png",
    width: 237,
    height: 59,
  },
};

type NewsKey = keyof Dictionary["media"]["dates"] & LabelKey;

export const newsItems: { key: NewsKey; image: string; href: Href }[] = [
  { key: "newsOpalMou", image: "/images/home/news-opal-mou.jpg", href: { page: "media/opal-mou" } },
  {
    key: "newsCsrSolar",
    image: "/images/home/news-solar-school.jpg",
    href: { page: "media/csr-solar-power-initiative" },
  },
  {
    key: "newsOerTop20",
    image: "/images/home/news-oer-top20.jpg",
    href: { page: "media/oer-top-20" },
  },
];

/** Where each Assist search result leads (keys match `assist.index`). */
export const assistTargets: Record<keyof Dictionary["assist"]["index"], Href> = {
  about: { page: "about/our-company" },
  vision: { page: "about/vision-mission" },
  barka: { page: "plants/barka-ii" },
  rusail: { page: "plants/al-rusail" },
  facts: { section: "about" },
  shareholders: { section: "shareholders" },
  kahrabel: { section: "shareholders" },
  mubadala: { section: "shareholders" },
  governance: { section: "governance" },
  board: { page: "corporate-governance/board-of-directors" },
  philosophy: { page: "corporate-governance/companys-philosophy" },
  management: { page: "corporate-governance/management" },
  links: { section: "links" },
  media: { section: "media" },
  csrSolar: { page: "media/csr-solar-power-initiative" },
  opal: { page: "media/opal-mou" },
  oer: { page: "media/oer-top-20" },
  annualReport: { document: "annualReport" },
  contact: { section: "contact" },
};
