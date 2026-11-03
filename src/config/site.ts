/**
 * Site-wide settings. Everything that is still missing for launch lives here,
 * so it can be switched on in one place without touching components.
 */
export const siteConfig = {
  /** Production origin, used for canonical URLs, sitemap and Open Graph. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.smnpower.com",

  contact: {
    phone: { display: "+968  2493 5800", href: "tel:+96824935800" },
    fax: { display: "+968  2493 5830", local: "2493 5830" },
    email: "info@smnpower.com",
    website: { display: "www.smnpower.com", href: "https://www.smnpower.com" },
  },

  /**
   * Annual report PDF. While `href` is null the footer card links to the
   * Annual Report page instead of offering a download.
   * Example: { href: "/documents/annual-report-2025.pdf", meta: "PDF, 6 MB" }
   */
  annualReport: null as { href: string; meta: string } | null,

  /** Social profiles. Icons render only for entries with a URL. */
  social: {
    facebook: null as string | null,
    instagram: null as string | null,
    x: null as string | null,
  },

  /** Agency credit link in the footer (renders as text while null). */
  creditUrl: null as string | null,
} as const;

export type SocialNetwork = keyof typeof siteConfig.social;

/** Social profiles that have a URL, in config order (icons render only for these). */
export function activeSocialLinks() {
  return (Object.entries(siteConfig.social) as [SocialNetwork, string | null][]).filter(
    (entry): entry is [SocialNetwork, string] => !!entry[1],
  );
}
