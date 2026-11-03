"use client";

import { cn } from "@/lib/utils";

/** The reference's 2×2 dot glyph inside the Close pill. */
export function CloseDots() {
  return (
    <span aria-hidden className="grid size-4 grid-cols-2 place-items-center">
      {Array.from({ length: 4 }, (_, i) => (
        <span key={i} className="size-[3px] rounded-full bg-current" />
      ))}
    </span>
  );
}

/** 2×2 dots: the contact drawer's trigger. */
export function DotsTrigger() {
  return (
    <span aria-hidden className="grid grid-cols-[repeat(2,7px)] gap-1.5 p-1">
      {Array.from({ length: 4 }, (_, i) => (
        <span
          key={i}
          className="size-1.75 rounded-full bg-white transition-colors group-hover:bg-orange"
        />
      ))}
    </span>
  );
}

const bar =
  "absolute end-0 h-0.5 rounded-full bg-current transition-[top,bottom,width,rotate,translate,opacity] duration-400 ease-[cubic-bezier(0.68,-0.4,0.27,1.4)] motion-reduce:transition-none";

/**
 * Hamburger: staggered bars (full · ⅔ · ⅓) that even out on hover and fold
 * into an ✕ while the drawer is open (Radix sets data-state on the trigger).
 */
export function BurgerTrigger() {
  return (
    <span
      aria-hidden
      className="relative grid size-10 place-items-center rounded-full border border-white/35 text-white transition-[background-color,border-color,scale] duration-300 group-hover:border-orange group-hover:bg-orange group-active:scale-90 group-data-[state=open]:border-orange group-data-[state=open]:bg-orange"
    >
      <span className="relative block h-3 w-[18px]">
        <span
          className={cn(
            bar,
            "top-0 w-full group-data-[state=open]:top-1/2 group-data-[state=open]:-translate-y-1/2 group-data-[state=open]:rotate-45",
          )}
        />
        <span
          className={cn(
            bar,
            "top-1/2 w-2/3 -translate-y-1/2 group-hover:w-full group-data-[state=open]:w-0 group-data-[state=open]:opacity-0",
          )}
        />
        <span
          className={cn(
            bar,
            "bottom-0 w-1/3 group-hover:w-full group-data-[state=open]:bottom-1/2 group-data-[state=open]:w-full group-data-[state=open]:translate-y-1/2 group-data-[state=open]:-rotate-45",
          )}
        />
      </span>
    </span>
  );
}
