"use client";

import { useId, useState } from "react";
import Link from "next/link";

import { newTab, type ResolvedLink, type ResolvedNavigation } from "@/lib/nav";
import { cn } from "@/lib/utils";

type DrawerNavProps = {
  nav: ResolvedNavigation;
  home: ResolvedLink;
  label: string;
  /** Called on every link click (the drawer closes / defers same-page scrolls). */
  onNavigate: (event: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
  className?: string;
};

const topLink =
  "block text-[17px] font-medium text-ink uppercase transition-colors hover:text-orange md:text-lg";
const subLink = "text-sm font-normal text-[#5f6368] uppercase transition-colors hover:text-orange";

/**
 * Accordion navigation for the hamburger drawer (styled after the client's
 * reference). Used below 1024px only, where the header's own nav is hidden.
 */
export function DrawerNav({ nav, home, label, onNavigate, className }: DrawerNavProps) {
  const baseId = useId();
  const [expanded, setExpanded] = useState<string | null>(null);
  const groups = nav.main.filter((group) => group.children.length);
  const flatLinks = [
    ...nav.main.flatMap((group) =>
      group.href && !group.children.length ? [{ ...group, href: group.href }] : [],
    ),
    ...nav.utility,
  ];

  const renderLink = (link: ResolvedLink, linkClass: string) => (
    <Link
      href={link.href}
      {...(link.external && newTab)}
      className={linkClass}
      onClick={(e) => onNavigate(e, link.href)}
    >
      {link.label}
    </Link>
  );

  return (
    <nav aria-label={label} className={cn("flex flex-col gap-3.5", className)}>
      {renderLink(home, topLink)}

      {groups.map((group, index) => {
        const isOpen = expanded === group.label;
        const panelId = `${baseId}-${index}`;
        return (
          <div key={group.label}>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setExpanded(isOpen ? null : group.label)}
              className={cn(
                topLink,
                "flex w-full items-center justify-between py-1 text-start",
                isOpen && "text-orange",
              )}
            >
              {group.label}
              <span aria-hidden className="text-xl leading-none font-light">
                {isOpen ? "−" : "+"}
              </span>
            </button>
            {/* Height animates via grid rows (0fr → 1fr), no measuring. */}
            <div
              id={panelId}
              inert={!isOpen}
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-in-out motion-reduce:transition-none",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="min-h-0 overflow-hidden">
                <ul className="my-2 flex flex-col gap-2.5 border-s-2 border-[#f3f4f6] ps-4">
                  {group.children.map((child) => (
                    <li key={child.label}>{renderLink(child, subLink)}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      })}

      {flatLinks.map((link) => (
        <div key={link.href}>{renderLink(link, topLink)}</div>
      ))}
    </nav>
  );
}
