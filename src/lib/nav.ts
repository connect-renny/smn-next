import { footerAboutLinks, mainNav, utilityNav, type NavLink } from "@/config/navigation";
import { resolveHref, type Href } from "@/config/routes";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";

/** `external` links (other sites, PDFs) open in a new tab. */
export type ResolvedLink = { label: string; href: string; external: boolean };

/** Props that open a link in a new tab, as the live site does for PDFs. */
export const newTab = { target: "_blank", rel: "noopener noreferrer" } as const;

export const isExternal = (href: string) => /^https?:\/\//.test(href);
/** `href` is null for a label that only opens its menu (About Us). */
export type ResolvedGroup = Omit<ResolvedLink, "href"> & {
  href: string | null;
  children: ResolvedLink[];
  match: string[];
};

/** Path prefixes (after the locale) that light up each top-level item. */
function matchFor(href: Href | undefined, children: NavLink[] = []): string[] {
  const pages = [...(href ? [href] : []), ...children.map((c) => c.href)].flatMap((h) =>
    "page" in h ? [h.page] : [],
  );
  const prefixes = new Set(pages.map((p) => p.split("/")[0]));
  if (prefixes.has("about")) prefixes.add("plants");
  return [...prefixes];
}

export function resolveLink(locale: Locale, dict: Dictionary, link: NavLink): ResolvedLink {
  const href = resolveHref(locale, link.href);
  return { label: dict.labels[link.label], href, external: isExternal(href) };
}

export function resolveNavigation(locale: Locale, dict: Dictionary) {
  return {
    utility: utilityNav.map((l) => resolveLink(locale, dict, l)),
    main: mainNav.map<ResolvedGroup>((group) => ({
      ...(group.href
        ? resolveLink(locale, dict, { label: group.label, href: group.href })
        : { label: dict.labels[group.label], href: null, external: false }),
      match: matchFor(group.href, group.children),
      children: (group.children ?? []).map((c) => resolveLink(locale, dict, c)),
    })),
    footerAbout: footerAboutLinks.map((l) => resolveLink(locale, dict, l)),
  };
}

export type ResolvedNavigation = ReturnType<typeof resolveNavigation>;
