"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dialog } from "radix-ui";

import { useSmoothScroll } from "@/components/animations/smooth-scroll-provider";
import { BrandIcon } from "@/components/ui/brand-icons";
import { activeSocialLinks } from "@/config/site";
import { useGsapPresence } from "@/hooks/use-gsap-presence";
import { localeMeta, locales, type Locale } from "@/i18n/config";
import { gsap } from "@/lib/gsap";
import type { ResolvedNavigation } from "@/lib/nav";
import { cn } from "@/lib/utils";

import { rememberLocale, swapLocale } from "../header/language-switcher";
import { ContactCard, type DrawerContact } from "./contact-card";
import { DrawerNav } from "./drawer-nav";
import { BurgerTrigger, CloseDots, DotsTrigger } from "./triggers";

type SiteDrawerProps = {
  /**
   * `contact`: the 4-dot drawer — contact card only, height fits the content.
   * `nav`: the hamburger drawer (below 1024px) — full menu, full height.
   */
  variant: "contact" | "nav";
  /** Accessible name of the trigger button. */
  triggerLabel: string;
  triggerClassName?: string;
  locale: Locale;
  nav: ResolvedNavigation;
  homeHref: string;
  labels: {
    close: string;
    closeText: string;
    title: string;
    home: string;
    getInTouch: string;
    social: string;
    opensInNewTab: string;
  };
  contact: DrawerContact;
};

/** The drawer leaves through the end edge: right in English, left in Arabic. */
function parts(root: HTMLElement) {
  return {
    backdrop: root.querySelector("[data-backdrop]"),
    drawer: root.querySelector("[data-drawer]"),
    side: getComputedStyle(root).direction === "rtl" ? -1 : 1,
  };
}

// Timings from the client's reference build: 0.6s cubic-bezier(0.16,1,0.3,1)
// slide (≈ expo.out) and a 0.5s backdrop fade.
function enterDrawer(root: HTMLElement) {
  const { backdrop, drawer, side } = parts(root);
  return gsap
    .timeline()
    .fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power1.out" }, 0)
    .fromTo(
      drawer,
      { xPercent: 120 * side, scale: 0.98 },
      { xPercent: 0, scale: 1, duration: 0.6, ease: "expo.out" },
      0,
    );
}

function exitDrawer(root: HTMLElement) {
  const { backdrop, drawer, side } = parts(root);
  return gsap
    .timeline()
    .to(drawer, { xPercent: 120 * side, scale: 0.98, duration: 0.45, ease: "power3.in" }, 0)
    .to(backdrop, { opacity: 0, duration: 0.4, ease: "power1.out" }, 0.1);
}

/**
 * Drawer after the client's reference build (end edge, rounded, blurred
 * backdrop) with the language link and close pill. The `contact` variant
 * holds the contact card; the `nav` variant holds the accordion menu.
 */
export function SiteDrawer({
  variant,
  triggerLabel,
  triggerClassName,
  locale,
  nav,
  homeHref,
  labels,
  contact,
}: SiteDrawerProps) {
  const withNav = variant === "nav";
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { scrollTo } = useSmoothScroll();
  const pendingTarget = useRef<HTMLElement | null>(null);

  const [rootRef, mounted] = useGsapPresence<HTMLDivElement>(open, {
    enter: enterDrawer,
    exit: exitDrawer,
    onExited: () => {
      if (pendingTarget.current) scrollTo(pendingTarget.current);
      pendingTarget.current = null;
    },
  });

  // Same-page anchors scroll after the drawer has gone (scroll lock lifted).
  const onNavigate = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const url = new URL(href, window.location.href);
    const target =
      url.pathname === pathname && url.hash ? document.getElementById(url.hash.slice(1)) : null;
    if (target) {
      event.preventDefault();
      pendingTarget.current = target;
    }
    setOpen(false);
  };

  const otherLocale = locales.find((l) => l !== locale) ?? locale;
  const social = activeSocialLinks();

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger aria-label={triggerLabel} className={cn("group", triggerClassName)}>
        {withNav ? <BurgerTrigger /> : <DotsTrigger />}
      </Dialog.Trigger>

      {mounted && (
        <Dialog.Portal forceMount>
          <div ref={rootRef} className="fixed inset-0 z-200">
            <Dialog.Overlay
              forceMount
              data-backdrop
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <Dialog.Content
              forceMount
              aria-describedby={undefined}
              data-drawer
              data-lenis-prevent
              className={cn(
                "absolute end-2 top-2 flex max-h-[calc(100%-16px)] w-[calc(100%-16px)] flex-col overflow-hidden rounded-3xl bg-white text-ink shadow-2xl sm:w-[450px] lg:w-[500px]",
                withNav && "bottom-2",
              )}
            >
              {/* Head: label · language · close */}
              <div className="flex shrink-0 items-center justify-between border-b border-[#f3f4f6] p-6 pb-4 md:px-10 md:pt-10">
                <Dialog.Title className="flex items-center gap-3 text-xs font-semibold tracking-widest text-[#6b7280] uppercase">
                  <span aria-hidden className="h-px w-6 bg-[#9ca3af]" />
                  {labels.title}
                </Dialog.Title>
                <div className="flex items-center gap-4">
                  <Link
                    href={swapLocale(pathname, otherLocale)}
                    hrefLang={otherLocale}
                    lang={otherLocale}
                    onClick={() => rememberLocale(otherLocale)}
                    className="text-sm font-semibold text-ink transition-colors hover:text-orange"
                  >
                    {localeMeta[otherLocale].label}
                  </Link>
                  <Dialog.Close
                    aria-label={labels.close}
                    className="flex items-center gap-2.5 rounded-full bg-orange px-4 py-2 text-xs font-semibold text-white uppercase transition-colors hover:bg-ink"
                  >
                    {labels.closeText}
                    <CloseDots />
                  </Dialog.Close>
                </div>
              </div>

              {/* Body: menu (nav) or contact card (contact), social row */}
              <div className="flex flex-1 [scrollbar-width:none] flex-col overflow-y-auto overscroll-contain px-6 py-6 md:px-10 md:pb-8">
                {withNav && (
                  <DrawerNav
                    nav={nav}
                    home={{ label: labels.home, href: homeHref, external: false }}
                    label={labels.title}
                    onNavigate={onNavigate}
                  />
                )}

                {social.length > 0 && (
                  <ul
                    aria-label={labels.social}
                    className={cn("mb-4 flex justify-end gap-5", withNav && "mt-auto pt-10")}
                  >
                    {social.map(([network, href]) => (
                      <li key={network}>
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${network} ${labels.opensInNewTab}`}
                          className="text-ink transition-colors hover:text-orange"
                        >
                          <BrandIcon network={network} className="size-[18px]" />
                        </a>
                      </li>
                    ))}
                  </ul>
                )}

                {!withNav && (
                  <ContactCard
                    title={labels.getInTouch}
                    contact={contact}
                    opensInNewTab={labels.opensInNewTab}
                  />
                )}
              </div>
            </Dialog.Content>
          </div>
        </Dialog.Portal>
      )}
    </Dialog.Root>
  );
}
