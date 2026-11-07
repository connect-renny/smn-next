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
        const lines = gsap.utils.toArray<HTMLElement>("[data-hero-line]", scope.current);
        const rest = gsap.utils.toArray<HTMLElement>("[data-hero-fade]", scope.current);

        // Start far enough down to stay hidden behind the mask's deeper bottom padding.
        // `y` is pinned to 0 at both ends: when this effect re-runs mid-flight (React can run
        // it twice on a client navigation), GSAP re-reads the shifted line as a pixel `y`,
        // which would otherwise stay on top of the percent and leave the title below its mask.
        gsap.set(lines, { y: 0, yPercent: 135 });
        gsap.set(rest, { autoAlpha: 0, y: 24 });

        const tl = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
        tl.to(lines, { y: 0, yPercent: 0, duration: 1.2, stagger: 0.14 }).to(
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
