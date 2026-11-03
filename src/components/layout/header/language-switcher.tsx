"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGsapPresence } from "@/hooks/use-gsap-presence";
import { LOCALE_COOKIE, localeMeta, locales, type Locale } from "@/i18n/config";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";

const hidden = { opacity: 0, y: 8 };
const tween = { duration: 0.2, ease: "power1.out" };

type LanguageSwitcherProps = {
  locale: Locale;
  /** Short label of the other language ("AR" on English pages). */
  shortLabel: string;
  ariaLabel: string;
  className?: string;
};

export function rememberLocale(next: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
}

export function swapLocale(pathname: string, next: Locale) {
  const parts = pathname.split("/");
  parts[1] = next;
  return parts.join("/") || `/${next}`;
}

export function LanguageSwitcher({
  locale,
  shortLabel,
  ariaLabel,
  className,
}: LanguageSwitcherProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const [menuRef, menuMounted] = useGsapPresence<HTMLUListElement>(open, {
    enter: (el) => gsap.fromTo(el, hidden, { opacity: 1, y: 0, ...tween }),
    exit: (el) => gsap.to(el, { ...hidden, ...tween }),
  });

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={root} className={cn("relative", className)}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 text-utility font-semibold tracking-[0.03em] whitespace-nowrap text-white uppercase transition-colors hover:text-orange max-lg:text-xs"
      >
        {shortLabel}
        <i className="caret" data-open={open || undefined} aria-hidden />
      </button>

      {menuMounted && (
        <ul
          ref={menuRef}
          id={menuId}
          className="absolute end-0 top-full z-10 mt-3 min-w-36 overflow-hidden rounded-2xl border-t-2 border-orange bg-navy-deep/95 py-2 shadow-2xl"
        >
          {locales.map((code) => (
            <li key={code}>
              <Link
                href={swapLocale(pathname, code)}
                hrefLang={code}
                lang={code}
                aria-current={code === locale ? "true" : undefined}
                onClick={() => {
                  rememberLocale(code);
                  setOpen(false);
                }}
                className={cn(
                  "block px-4 py-2 text-sm font-medium text-white/85 transition-colors hover:bg-white/5 hover:text-orange",
                  code === locale && "text-orange",
                )}
              >
                {localeMeta[code].label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
