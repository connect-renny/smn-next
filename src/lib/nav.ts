import { footerAboutLinks, mainNav, utilityNav, type NavLink } from "@/config/navigation";
import { resolveHref, type Href } from "@/config/routes";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";

export type ResolvedLink = { label: string; href: string };
export type ResolvedGroup = ResolvedLink & { children: ResolvedLink[]; match: string[] };

/** Path prefixes (after the locale) that light up each top-level item. */
function matchFor(href: Href, children: NavLink[] = []): string[] {
  const pages = [href, ...children.map((c) => c.href)].flatMap((h) =>
    "page" in h ? [h.page] : [],
  );
  const prefixes = new Set(pages.map((p) => p.split("/")[0]));
  if (prefixes.has("about")) prefixes.add("plants");
  return [...prefixes];
}

export function resolveLink(locale: Locale, dict: Dictionary, link: NavLink): ResolvedLink {
  return { label: dict.labels[link.label], href: resolveHref(locale, link.href) };
}

export function resolveNavigation(locale: Locale, dict: Dictionary) {
  return {
    utility: utilityNav.map((l) => resolveLink(locale, dict, l)),
    main: mainNav.map<ResolvedGroup>((group) => ({
      ...resolveLink(locale, dict, group),
      match: matchFor(group.href, group.children),
      children: (group.children ?? []).map((c) => resolveLink(locale, dict, c)),
    })),
    footerAbout: footerAboutLinks.map((l) => resolveLink(locale, dict, l)),
  };
}

export type ResolvedNavigation = ReturnType<typeof resolveNavigation>;
