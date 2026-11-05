"use client";

import { useRef } from "react";

import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";

/** Each cash bar grows from the reading edge as its row is reached. */
export function DividendsMotion({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const bars = gsap.utils.toArray<HTMLElement>("[data-dividend-bar]");
        gsap.set(bars, { scaleX: 0 });
        ScrollTrigger.batch(bars, {
          start: "top 92%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, { scaleX: 1, duration: 1.2, ease: "expo.out", stagger: 0.07 }),
        });
      });
      return () => mm.revert();
    },
    { scope },
  );

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}
