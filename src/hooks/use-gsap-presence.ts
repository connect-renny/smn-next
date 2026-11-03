"use client";

import { useRef, useState } from "react";

import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

type Build = (el: HTMLElement) => gsap.core.Animation;

/**
 * Mount/unmount with GSAP enter + exit animations (what Motion's
 * AnimatePresence used to do). The element stays mounted until `exit`
 * finishes; reopening mid-exit kills it and plays `enter` again.
 * Reduced motion jumps straight to each end state.
 *
 * Returns a callback ref rather than a ref object: portals (Radix Dialog)
 * attach their content a render late, and the element arriving must be
 * what starts `enter`. Build `enter` with `fromTo` so it never depends on
 * where an interrupted exit left off.
 */
export function useGsapPresence<T extends HTMLElement>(
  open: boolean,
  { enter, exit, onExited }: { enter: Build; exit: Build; onExited?: () => void },
) {
  const [el, setEl] = useState<T | null>(null);
  const [mounted, setMounted] = useState(open);
  const current = useRef<gsap.core.Animation | null>(null);

  // Mount in the same render that opens.
  if (open && !mounted) setMounted(true);

  useGSAP(
    () => {
      if (!el || !mounted) return;

      current.current?.kill();
      const anim = open
        ? enter(el)
        : exit(el).eventCallback("onComplete", () => {
            setMounted(false);
            onExited?.();
          });
      current.current = anim;
      if (prefersReducedMotion()) anim.progress(1);
    },
    { dependencies: [open, mounted, el] },
  );

  return [setEl, mounted] as const;
}
