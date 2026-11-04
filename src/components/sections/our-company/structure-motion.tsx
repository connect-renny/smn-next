"use client";

import { useRef } from "react";

import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

const OPEN = "inset(0% 0% 0% 0%)";
const FROM_TOP = "inset(0% 0% 100% 0%)";
const FROM_LEFT = "inset(0% 100% 0% 0%)";
const FROM_RIGHT = "inset(0% 0% 0% 100%)";

/**
 * Assembles the relationship diagram. The diagram is taller than most screens,
 * so on desktop the build is tied to scroll position: it runs top to bottom,
 * the hub's side arms growing outward, finishes as the diagram's foot comes
 * into view and rewinds on the way back up. Stacked layouts reveal arm by arm.
 */
export function StructureMotion({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      const arm = (side: string) => {
        const el = root.querySelector<HTMLElement>(`[data-arm="${side}"]`)!;
        return {
          el,
          party: el.querySelector("[data-party]"),
          note: el.querySelector("[data-note]"),
          outer: el.querySelector('[data-link="outer"]'),
          inner: el.querySelector('[data-link="inner"]'),
        };
      };
      const hub = root.querySelector("[data-hub]");
      const badge = root.querySelector("[data-badge]");

      const mm = gsap.matchMedia();

      mm.add(`${MOTION_OK} and (min-width: 64rem)`, () => {
        const rtl = document.documentElement.dir === "rtl";
        const tl = gsap.timeline({
          defaults: { duration: 1, ease: "power2.out" },
          scrollTrigger: { trigger: root, start: "top 78%", end: "bottom 92%", scrub: 0.6 },
        });

        const link = (el: Element | null, from: string, at?: number | string) =>
          tl.fromTo(el, { clipPath: from }, { clipPath: OPEN, duration: 0.5, ease: "none" }, at);
        const party = (el: Element | null, at?: number | string) =>
          tl.fromTo(
            el,
            { autoAlpha: 0, scale: 0.45 },
            { autoAlpha: 1, scale: 1, ease: "back.out(1.7)" },
            at,
          );
        const note = (el: Element | null, x: number, y: number, at?: number | string) =>
          tl.fromTo(el, { autoAlpha: 0, x, y }, { autoAlpha: 1, x: 0, y: 0 }, at);

        const top = arm("top");
        party(top.party);
        link(top.outer, FROM_TOP);
        note(top.note, 0, -36);
        link(top.inner, FROM_TOP);

        tl.fromTo(
          hub,
          { autoAlpha: 0, scale: 0.8 },
          { autoAlpha: 1, scale: 1, ease: "back.out(1.5)" },
        );
        tl.fromTo(
          badge,
          { scale: 0, rotation: -140 },
          { scale: 1, rotation: 0, ease: "back.out(2)" },
          "<0.3",
        );

        // Both side arms grow out of the hub together.
        tl.addLabel("sides", "-=0.2");
        (["start", "end"] as const).forEach((side) => {
          const parts = arm(side);
          const physicalLeft = (side === "start") !== rtl;
          const out = physicalLeft ? FROM_RIGHT : FROM_LEFT;
          link(parts.inner, out, "sides");
          note(parts.note, physicalLeft ? 48 : -48, 0, "sides+=0.3");
          link(parts.outer, out, "sides+=0.9");
          party(parts.party, "sides+=1.2");
        });

        const bottom = arm("bottom");
        link(bottom.inner, FROM_TOP);
        note(bottom.note, 0, -36);
        link(bottom.outer, FROM_TOP);
        party(bottom.party);

        return () => tl.kill();
      });

      mm.add(`${MOTION_OK} and (max-width: 63.99rem)`, () => {
        ["hub", "top", "start", "end", "bottom"].forEach((name) => {
          const el = name === "hub" ? hub : arm(name).el;
          if (!el) return;
          gsap.from(name === "hub" ? el : el.children, {
            autoAlpha: 0,
            y: 28,
            duration: 0.8,
            ease: "expo.out",
            stagger: 0.1,
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
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
