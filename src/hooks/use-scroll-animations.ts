"use client";

import type { RefObject } from "react";

import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";

/** Photo zoom that gives the parallax its slack (same as the demo). */
const PARALLAX_ZOOM = 1.2;
/** Half the overhang each way, less a 5% guard against sub-pixel hairlines. */
const PARALLAX_TRAVEL = ((PARALLAX_ZOOM - 1) / 2) * 100 * 0.95;

const CLIP_OPEN = "inset(0% 0% 0% 0%)";
const CLIP_FROM = {
  up: "inset(0% 0% 100% 0%)",
  start: "inset(0% 100% 0% 0%)",
  startRtl: "inset(0% 0% 0% 100%)",
};

/**
 * Declarative scroll animations for everything inside `scope`:
 *
 *  - `data-animate="up"`        fade + rise, batched so siblings stagger
 *  - `data-animate="clip"`      image wipe from the bottom edge
 *  - `data-animate="clip-start"` image wipe from the reading edge (RTL aware)
 *  - `data-parallax`            the frame's <img> drifts through a 1.2× crop
 *  - `data-drift=".8"`          the frame's <img> moves at that share of scroll speed, uncropped
 *
 * Everything is reverted on unmount (useGSAP context) and skipped entirely for
 * reduced-motion users, who simply see the final state.
 */
export function useScrollAnimations(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const rtl = document.documentElement.dir === "rtl";

        // ─── Fade-up items, staggered per batch ───
        const items = gsap.utils.toArray<HTMLElement>('[data-animate="up"]', root);
        if (items.length) {
          gsap.set(items, { autoAlpha: 0, y: 24 });
          ScrollTrigger.batch(items, {
            start: "top 88%",
            once: true,
            onEnter: (batch) =>
              gsap.to(batch, {
                autoAlpha: 1,
                y: 0,
                duration: 0.8,
                ease: "expo.out",
                stagger: 0.08,
                overwrite: true,
                clearProps: "transform,opacity,visibility",
              }),
          });
        }

        // ─── Clip-path image reveals ───
        gsap.utils.toArray<HTMLElement>('[data-animate^="clip"]', root).forEach((el) => {
          const fromStart = el.dataset.animate === "clip-start";
          gsap.fromTo(
            el,
            { clipPath: fromStart ? (rtl ? CLIP_FROM.startRtl : CLIP_FROM.start) : CLIP_FROM.up },
            {
              clipPath: CLIP_OPEN,
              duration: 1.1,
              ease: "expo.out",
              scrollTrigger: { trigger: el, start: "top 80%", once: true },
            },
          );
        });

        // ─── Drifting photos: same size as their frame, moving at a share of scroll speed ───
        gsap.utils.toArray<HTMLElement>("[data-drift]", root).forEach((frame) => {
          const img = frame.querySelector("img");
          if (!img) return;
          const rate = 1 - Number(frame.dataset.drift);
          // Zero offset when the frame is centred on screen, ± half the trigger's travel.
          const reach = () => (rate * (window.innerHeight + frame.offsetHeight)) / 2;
          gsap.fromTo(
            img,
            { y: () => -reach() },
            {
              y: () => reach(),
              ease: "none",
              scrollTrigger: {
                trigger: frame,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
                invalidateOnRefresh: true,
              },
            },
          );
        });

        // ─── Parallax photos ───
        gsap.utils.toArray<HTMLElement>("[data-parallax]", root).forEach((frame) => {
          const img = frame.querySelector("img");
          if (!img) return;
          gsap.fromTo(
            img,
            { scale: PARALLAX_ZOOM, yPercent: -PARALLAX_TRAVEL },
            {
              yPercent: PARALLAX_TRAVEL,
              ease: "none",
              scrollTrigger: {
                trigger: frame,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.6,
                invalidateOnRefresh: true,
              },
            },
          );
        });
      });

      return () => mm.revert();
    },
    { scope },
  );
}
