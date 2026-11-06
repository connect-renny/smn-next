"use client";

import { useRef } from "react";

import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

/** Keep in step with the `.holder-aside` media query in sections.css. */
const STICKY =
  "(min-width: 64rem) and (min-height: 680px) and (prefers-reduced-motion: no-preference)";

type MotionProps = { children: React.ReactNode; className?: string };

/** The ownership line draws down as the chapter is read, lighting each owner as it arrives. */
export function ChapterMotion({ children, className }: MotionProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ sticky: STICKY, motion: MOTION_OK }, (context) => {
        const root = scope.current;
        if (!root) return;
        const q = gsap.utils.selector(root);
        const chain = q("[data-chain]")[0];
        const line = q("[data-chain-line]")[0];
        const fill = q("[data-chain-fill]")[0];
        const drop = q("[data-chain-drop]")[0];
        const owners = q("[data-chain-owner]");

        const state = { progress: 0 };
        const paint = () => {
          const height = line.offsetHeight;
          const reached = state.progress * height;
          fill.style.transform = `scaleY(${state.progress})`;
          drop.style.transform = `translateY(${reached}px)`;
          owners.forEach((owner) => {
            const dot = owner.offsetTop + owner.offsetHeight - chain.clientHeight + height;
            owner.toggleAttribute("data-lit", dot <= reached + 2);
          });
        };
        paint();

        const pinnedAside = context.conditions?.sticky;
        gsap.to(state, {
          progress: 1,
          ease: "none",
          onUpdate: paint,
          scrollTrigger: {
            trigger: pinnedAside ? root : chain,
            start: pinnedAside ? "top 25%" : "top 72%",
            end: pinnedAside ? "bottom 85%" : "bottom 45%",
            scrub: 0.5,
            onRefresh: paint,
          },
        });

        return () => {
          fill.style.transform = "";
          drop.style.transform = "";
          owners.forEach((owner) => owner.setAttribute("data-lit", ""));
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

/** Two lines draw in from the shareholders and meet at the SMN mark. */
export function ConfluenceMotion({ children, className }: MotionProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(scope);
        const lines = q("[data-confluence-line]");
        const pulses = q("[data-confluence-pulse]");
        const mark = q("[data-confluence-mark]");

        gsap.set(lines, { strokeDasharray: 1, strokeDashoffset: 1 });
        gsap.set(pulses, { opacity: 0 });
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: scope.current,
              start: "top 75%",
              end: "bottom 80%",
              scrub: 0.6,
            },
          })
          .to(lines, { strokeDashoffset: 0, duration: 0.75 }, 0)
          .from(mark, { scale: 0.55, opacity: 0, duration: 0.3, ease: "back.out(1.6)" }, 0.65)
          .to(pulses, { opacity: 1, duration: 0.15 }, 0.85);
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
