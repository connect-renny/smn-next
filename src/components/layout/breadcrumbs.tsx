import { Fragment } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

type BreadcrumbsProps = React.ComponentProps<"nav"> & {
  label: string;
  /** The last item is the current page, so it takes no link. */
  items: readonly { label: string; href?: string }[];
};

export function Breadcrumbs({ label, items, className, ...props }: BreadcrumbsProps) {
  return (
    <nav
      aria-label={label}
      className={cn("text-utility font-medium uppercase", className)}
      {...props}
    >
      <ol className="flex flex-wrap items-center gap-[clamp(8px,0.75vw,14px)]">
        {items.map((item, i) => (
          <Fragment key={item.label}>
            {i > 0 && (
              <li aria-hidden>
                <ChevronRight className="size-3 rtl:-scale-x-100" />
              </li>
            )}
            <li>
              {item.href ? (
                <Link href={item.href} className="transition-colors hover:text-orange">
                  {item.label}
                </Link>
              ) : (
                <span aria-current="page">{item.label}</span>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
