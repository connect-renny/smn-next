"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type ActiveLinkProps = React.ComponentProps<typeof Link> & {
  /** Path prefixes (after the locale) that mark this link as current. */
  match?: readonly string[];
  /** Mark current only on an exact match of the locale root. */
  exactHome?: boolean;
};

function useIsActive(match: readonly string[], exactHome = false) {
  const pathname = usePathname();
  const rest = pathname.split("/").slice(2).join("/");
  return exactHome ? rest === "" : match.some((m) => rest === m || rest.startsWith(`${m}/`));
}

/** Link that flags itself `data-active` for the section the visitor is in. */
export function ActiveLink({ match = [], exactHome = false, ...props }: ActiveLinkProps) {
  const active = useIsActive(match, exactHome);

  return (
    <Link {...props} data-active={active || undefined} aria-current={active ? "page" : undefined} />
  );
}

/**
 * Top-level nav item. Its dropdown opens on CSS hover and focus, and the header
 * survives navigation, so picking a link would leave the menu open under a
 * still pointer. A click dismisses it until the pointer leaves or focus returns.
 */
export function NavItem(props: React.ComponentProps<"li">) {
  const [dismissed, setDismissed] = useState(false);

  return (
    <li
      {...props}
      data-dismissed={dismissed || undefined}
      onClick={(event) => {
        if (!(event.target as Element).closest("ul a")) return;
        setDismissed(true);
        if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
      }}
      onPointerLeave={() => setDismissed(false)}
      onFocus={() => setDismissed(false)}
    />
  );
}

type ActiveMenuLabelProps = React.ComponentProps<"button"> & { match: readonly string[] };

/** Top-level item with no page of its own: hover or keyboard focus opens its menu. */
export function ActiveMenuLabel({ match, ...props }: ActiveMenuLabelProps) {
  const active = useIsActive(match);

  return <button type="button" {...props} data-active={active || undefined} />;
}
