"use client";

import { useRef } from "react";

import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";

const CLIP_CLOSED = "inset(0% 100% 0% 0% round 14px)";
const CLIP_CLOSED_RTL = "inset(0% 0% 0% 100% round 14px)";

/**
 * Entrance for the whole contact page. The map's own ripple lives in the stylesheet:
 * this only arms it, then says when, so without motion it simply shows finished.
 */
export function ContactMotion({
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
        const q = gsap.utils.selector(scope);
        const rtl = document.documentElement.dir === "rtl";

        // The cards float up over the hero as the page opens.
        gsap.set(q("[data-contact-card]"), { autoAlpha: 0, y: 70 });
        gsap.set(q("[data-contact-icon]"), { scale: 0.4, rotate: -25 });
        gsap
          .timeline({
            defaults: { ease: "expo.out" },
            // Measured from the list, which holds still: the cards start lower, for their rise.
            scrollTrigger: { trigger: q(".contact-cards")[0], start: "top 98%", once: true },
          })
          .to(
            q("[data-contact-card]"),
            { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.12, clearProps: "all" },
            0,
          )
          .to(
            q("[data-contact-icon]"),
            {
              scale: 1,
              rotate: 0,
              duration: 1.1,
              ease: "back.out(2.2)",
              stagger: 0.12,
              clearProps: "all",
            },
            0.25,
          );

        // The office details arrive line by line, then the map starts its ripple.
        const panel = q("[data-contact-office]")[0];
        const map = q("[data-contact-map]")[0];
        gsap.set(q("[data-contact-row]"), { autoAlpha: 0, x: rtl ? 26 : -26 });
        map?.setAttribute("data-armed", "");
        ScrollTrigger.create({
          trigger: panel,
          start: "top 72%",
          once: true,
          onEnter: () => {
            map?.setAttribute("data-on", "");
            gsap.to(q("[data-contact-row]"), {
              autoAlpha: 1,
              x: 0,
              duration: 0.9,
              ease: "expo.out",
              stagger: 0.08,
              clearProps: "all",
            });
          },
        });

        // Each plant photo wipes open from the reading edge.
        gsap.fromTo(
          q("[data-contact-plant]"),
          { clipPath: rtl ? CLIP_CLOSED_RTL : CLIP_CLOSED },
          {
            clipPath: "inset(0% 0% 0% 0% round 14px)",
            duration: 1.3,
            ease: "expo.out",
            stagger: 0.14,
            clearProps: "clipPath",
            scrollTrigger: { trigger: q("[data-contact-plant]")[0], start: "top 86%", once: true },
          },
        );

        return () => {
          map?.removeAttribute("data-armed");
          map?.removeAttribute("data-on");
        };
      });
      return () => mm.revert();
    },
    { scope },
  );

  return (
    <div ref={scope} data-contact-root className={className}>
      {children}
    </div>
  );
}
