import Image from "next/image";
import Link from "next/link";

import { siteConfig } from "@/config/site";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { newTab, type ResolvedNavigation } from "@/lib/nav";

import { ActiveLink, ActiveMenuLabel, NavItem } from "./active-link";
import { LanguageSwitcher } from "./language-switcher";
import { SiteDrawer } from "../drawer/drawer";
import { StickyHeader } from "./sticky-header";

type HeaderProps = { locale: Locale; dict: Dictionary; nav: ResolvedNavigation };

const navLink =
  "inline-flex items-center gap-2 py-1.5 text-nav font-semibold tracking-[0.01em] whitespace-nowrap text-white uppercase transition-colors hover:text-orange data-active:text-orange";

export function Header({ locale, dict, nav }: HeaderProps) {
  const homeHref = `/${locale}`;
  const menuProps = {
    locale,
    nav,
    homeHref,
    labels: {
      close: dict.a11y.closeMenu,
      closeText: dict.menu.close,
      title: dict.menu.title,
      home: dict.a11y.home,
      getInTouch: dict.menu.getInTouch,
      social: dict.a11y.social,
      opensInNewTab: dict.a11y.opensInNewTab,
    },
    contact: {
      labels: dict.menu,
      phone: siteConfig.contact.phone,
      fax: siteConfig.contact.fax.local,
      email: siteConfig.contact.email,
      website: siteConfig.contact.website,
    },
  };
  const language = (
    <LanguageSwitcher
      locale={locale}
      shortLabel={dict.language.switchShort}
      ariaLabel={dict.a11y.language}
    />
  );

  return (
    <StickyHeader className="absolute inset-x-0 top-0 z-100 pt-header-top stuck:fixed stuck:animate-nav-down stuck:bg-navy-deep/94 stuck:py-2 stuck:shadow-[0_6px_24px_rgb(0_0_0/0.25)] motion-reduce:stuck:animate-none">
      <div className="site-container">
        <div className="flex items-center justify-between gap-6 border-b border-white/35 pb-header-bottom lg:items-start stuck:border-transparent">
          <Link
            href={homeHref}
            className="inline-flex shrink-0 pt-1"
            aria-label={dict.meta.siteName}
          >
            <Image
              src="/images/brand/smn-logo.png"
              alt={dict.meta.siteName}
              width={228}
              height={66}
              priority
              className="h-auto w-logo"
            />
          </Link>

          <div className="flex flex-col items-end gap-header-rows">
            {/* Utility bar (desktop) */}
            <nav aria-label={dict.a11y.utilityNav} className="max-lg:hidden">
              <ul className="flex items-center gap-utility">
                {nav.utility.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      {...(link.external && newTab)}
                      className="text-utility font-semibold tracking-[0.03em] whitespace-nowrap text-white uppercase transition-colors hover:text-orange"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li aria-hidden className="h-3.5 w-px bg-white/50" />
                <li>{language}</li>
              </ul>
            </nav>

            <div className="flex items-center gap-nav">
              {/* Main navigation (desktop) */}
              <nav aria-label={dict.a11y.primaryNav} className="max-lg:hidden">
                <ul className="flex items-center gap-nav">
                  <li className="nav-item">
                    <ActiveLink
                      href={homeHref}
                      exactHome
                      aria-label={dict.a11y.home}
                      className={navLink}
                    >
                      <svg viewBox="0 0 24 24" aria-hidden className="size-5 fill-current">
                        <path d="M12 3 2 11h3v10h6v-6h2v6h6V11h3L12 3z" />
                      </svg>
                    </ActiveLink>
                  </li>

                  {nav.main.map((group) => (
                    <NavItem key={group.label} className="nav-item group/nav relative">
                      {group.href ? (
                        <ActiveLink href={group.href} match={group.match} className={navLink}>
                          {group.label}
                          {group.children.length > 0 && <i className="caret" aria-hidden />}
                        </ActiveLink>
                      ) : (
                        <ActiveMenuLabel match={group.match} className={navLink}>
                          {group.label}
                          <i className="caret" aria-hidden />
                        </ActiveMenuLabel>
                      )}

                      {group.children.length > 0 && (
                        <ul className="invisible absolute -start-[18px] top-full min-w-66 translate-y-2.5 overflow-hidden rounded-2xl border-t-2 border-orange bg-navy-deep/96 py-2.5 opacity-0 shadow-2xl transition-[opacity,translate,visibility] duration-300 ease-out group-focus-within/nav:visible group-focus-within/nav:translate-y-0 group-focus-within/nav:opacity-100 group-hover/nav:visible group-hover/nav:translate-y-0 group-hover/nav:opacity-100">
                          {group.children.map((child) => (
                            <li key={child.label}>
                              <Link
                                href={child.href}
                                {...(child.external && newTab)}
                                className="block px-[18px] py-[9px] text-xs leading-[1.35] font-medium tracking-[0.02em] text-white/85 uppercase transition-colors hover:bg-white/5 hover:text-orange"
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </NavItem>
                  ))}
                </ul>
              </nav>

              <div className="lg:hidden">{language}</div>

              <SiteDrawer variant="contact" triggerLabel={dict.a11y.openMenu} {...menuProps} />
              {/* Below 1024px the header nav is hidden: the hamburger opens the full menu. */}
              <SiteDrawer
                variant="nav"
                triggerLabel={dict.a11y.openNav}
                triggerClassName="lg:hidden"
                {...menuProps}
              />
            </div>
          </div>
        </div>
      </div>
    </StickyHeader>
  );
}
