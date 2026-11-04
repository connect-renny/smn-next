"use client";

import { useRef } from "react";

import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

/**
 * Timeline columns: each icon pops in, its dotted rule draws along the reading
 * direction, then the copy rises. Side-by-side columns follow one another.
 */
export function BackgroundMotion({
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
        const rtl = document.documentElement.dir === "rtl";
        const wide = window.matchMedia("(min-width: 64rem)").matches;

        gsap.utils.toArray<HTMLElement>("[data-bg-column]").forEach((column, i) => {
          const tl = gsap.timeline({
            delay: wide ? i * 0.22 : 0,
            scrollTrigger: { trigger: column, start: "top 85%", once: true },
          });
          tl.fromTo(
            column.querySelector("[data-bg-icon]"),
            { scale: 0, rotation: -120 },
            { scale: 1, rotation: 0, duration: 0.7, ease: "back.out(1.9)" },
          )
            .fromTo(
              column.querySelector("[data-bg-rule]"),
              { clipPath: rtl ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)" },
              { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "power2.inOut" },
              "-=0.35",
            )
            .fromTo(
              column.querySelectorAll("[data-bg-text]"),
              { autoAlpha: 0, y: 24 },
              { autoAlpha: 1, y: 0, duration: 0.8, ease: "expo.out", stagger: 0.1 },
              "-=0.6",
            );
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
