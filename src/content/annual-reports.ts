import type { Locale } from "@/i18n/config";

/** The latest edition. Its PDF links live in `siteConfig.annualReport`. */
export const latestReport: {
  year: string;
  pages: Record<Locale, number>;
  cover: Record<Locale, string>;
} = {
  year: "2025",
  pages: { en: 112, ar: 104 },
  cover: {
    en: "/images/annual-report/cover-2025-en.jpg",
    ar: "/images/annual-report/cover-2025-ar.jpg",
  },
};

export type ArchivedReport = {
  year: string;
  /** Cover colours for a generated cover. */
  tones: readonly [string, string];
  /** The real PDF per language. Null marks a sample: tagged, and not a link. */
  href: Record<Locale, string> | null;
};

/**
 * DUMMY DATA: placeholders until the client supplies the real reports. Give an
 * entry its `href` and it becomes a real link and loses its "Sample" tag.
 */
export const archivedReports: readonly ArchivedReport[] = [
  { year: "2024", tones: ["#0f5f6e", "#0a1e51"], href: null },
  { year: "2023", tones: ["#2f8f55", "#0d3d4f"], href: null },
  { year: "2022", tones: ["#c9661a", "#0a1e51"], href: null },
  { year: "2021", tones: ["#1f4f9e", "#0b1c39"], href: null },
  { year: "2020", tones: ["#14918b", "#12294f"], href: null },
  { year: "2019", tones: ["#5a4a9c", "#0a1e51"], href: null },
];
