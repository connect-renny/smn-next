"use client";

import { useRef } from "react";

import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { onPageRevealed } from "@/lib/page-ready";

/**
 * Hero entrance, played once the preloader iris has fully opened:
 * headline lines rise out of their masks, then the play button, scroll cue
 * and shortcut tabs follow.
 */
export function HeroIntro({
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
        const lines = gsap.utils.toArray<HTMLElement>("[data-hero-line]");
        const rest = gsap.utils.toArray<HTMLElement>("[data-hero-fade]");

        // Start far enough down to stay hidden behind the mask's deeper bottom padding.
        gsap.set(lines, { yPercent: 135 });
        gsap.set(rest, { autoAlpha: 0, y: 24 });

        const tl = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
        tl.to(lines, { yPercent: 0, duration: 1.2, stagger: 0.14 }).to(
          rest,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.1,
            clearProps: "transform,opacity,visibility",
          },
          "-=0.75",
        );

        // Wait for the preloader's iris to fully open, so the rise is seen in full.
        const off = onPageRevealed(() => tl.play());
        return () => {
          off();
          tl.kill();
        };
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
