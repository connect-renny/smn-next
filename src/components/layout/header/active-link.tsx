"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type ActiveLinkProps = React.ComponentProps<typeof Link> & {
  /** Path prefixes (after the locale) that mark this link as current. */
  match?: readonly string[];
  /** Mark current only on an exact match of the locale root. */
  exactHome?: boolean;
};

/** Link that flags itself `data-active` for the section the visitor is in. */
export function ActiveLink({ match = [], exactHome = false, ...props }: ActiveLinkProps) {
  const pathname = usePathname();
  const rest = pathname.split("/").slice(2).join("/");
  const active = exactHome
    ? rest === ""
    : match.some((m) => rest === m || rest.startsWith(`${m}/`));

  return (
    <Link {...props} data-active={active || undefined} aria-current={active ? "page" : undefined} />
  );
}
