"use client";

import { useRef } from "react";

import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { onPageRevealed } from "@/lib/page-ready";

/** The point the three inner blades turn around, in viewBox units. */
const SWIRL_ORIGIN = "26.4 44";

/** Re-spaced from the SVG file, whose rounded offsets paint hard bands at this size. */
const BLADE_STOPS = [
  [0, "#1a478c"],
  [0.14, "#1a478c"],
  [0.3, "#246a76"],
  [0.44, "#30945c"],
  [0.54, "#41b448"],
  [0.8, "#7bc23f"],
  [0.9, "#9fcb39"],
  [1, "#adcf37"],
] as const;

const stops = BLADE_STOPS.map(([offset, color], i) => (
  <stop key={i} offset={offset} stopColor={color} />
));

/**
 * The large cropped SMN mark. Inlined (from /images/our-company/hero-droplet.svg)
 * because each part animates on its own: once the page is revealed the mark
 * glides in from the edge while the blades spin up like a turbine and settle
 * into the orange shell, which closes around them from the other direction.
 */
export function CompanyHeroMark() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const svg = scope.current?.querySelector("svg");
        const blades = gsap.utils.toArray<SVGGElement>("[data-mark-blade]");
        const shell = gsap.utils.toArray<SVGPathElement>("[data-mark-shell]");

        gsap.set([...blades, ...shell], { svgOrigin: SWIRL_ORIGIN });
        gsap.set(svg ?? [], { xPercent: 9 });
        gsap.set(blades, { rotation: -150, scale: 0.3, autoAlpha: 0 });
        gsap.set(shell, { rotation: 42, scale: 1.14, autoAlpha: 0 });

        const tl = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
        tl.to(svg ?? [], { xPercent: 0, duration: 2.2 }, 0)
          .to(shell, { rotation: 0, scale: 1, duration: 2, stagger: 0.08 }, 0)
          .to(shell, { autoAlpha: 1, duration: 0.7, ease: "power1.out", stagger: 0.08 }, 0)
          .to(blades, { rotation: 0, scale: 1, duration: 2.1, stagger: 0.12 }, 0.15)
          .to(blades, { autoAlpha: 1, duration: 0.6, ease: "power1.out", stagger: 0.12 }, 0.15);

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
    <div ref={scope} aria-hidden className="company-hero-mark">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52.8 71.8">
        <defs>
          <clipPath id="company-mark-c1">
            <path d="M41.7,38.8c-.2,11.4-6.8,21-16.4,25.6,1.3.1,2.6.2,3.8.3,3.4.2,6.7.2,10,.1,1.3-1.9,2.4-4.1,3.3-6.4,2.9-7.9,2.3-16.4-.9-23.7.2,1.4.2,2.8.2,4.2" />
          </clipPath>
          <clipPath id="company-mark-c2">
            <rect x=".7" y="33.2" width="25" height="28.8" />
          </clipPath>
          <clipPath id="company-mark-c3">
            <path d="M5.8,36.3c-1.9,2.8-3.5,5.7-5.1,8.6,1,2.1,2.3,4.2,3.9,6.1,5.4,6.5,13.1,10.2,21,11-1.3-.5-2.5-1.2-3.7-1.9-9.8-5.9-14.8-16.4-14-26.9-.7,1-1.5,2.1-2.2,3.2" />
          </clipPath>
          <clipPath id="company-mark-c4">
            <rect x="9.9" y="21.5" width="33.8" height="13.1" />
          </clipPath>
          <clipPath id="company-mark-c5">
            <path d="M35,21.5c-1.7,0-3.3.1-5,.4-8.3,1.4-15.4,6.2-20.1,12.7,1.1-.8,2.3-1.6,3.5-2.3,10-5.6,21.6-4.6,30.3,1.4-.5-1.2-1.1-2.3-1.6-3.5-1.5-3-3.1-5.9-4.9-8.7-.7,0-1.4,0-2.1,0h0Z" />
          </clipPath>
          <linearGradient
            id="company-mark-g1"
            x1="-131.3"
            y1="813.6"
            x2="-130.3"
            y2="813.6"
            gradientTransform="translate(4459.5 27565) scale(33.8 -33.8)"
            gradientUnits="userSpaceOnUse"
          >
            {stops}
          </linearGradient>
          <linearGradient
            id="company-mark-g2"
            x1="-131.5"
            y1="814.3"
            x2="-130.5"
            y2="814.3"
            gradientTransform="translate(-27527.1 4480.3) rotate(90) scale(33.8 -33.8)"
            gradientUnits="userSpaceOnUse"
          >
            {stops}
          </linearGradient>
          <linearGradient
            id="company-mark-g3"
            x1="-132.1"
            y1="813.7"
            x2="-131.1"
            y2="813.7"
            gradientTransform="translate(-4423.9 -27490.8) rotate(-180) scale(33.8 -33.8)"
            gradientUnits="userSpaceOnUse"
          >
            {stops}
          </linearGradient>
        </defs>

        <g style={{ isolation: "isolate" }}>
          <g data-mark-blade="">
            <g clipPath="url(#company-mark-c1)">
              <rect
                fill="url(#company-mark-g1)"
                x="17.2"
                y="33.5"
                width="36.2"
                height="32.5"
                transform="translate(-25.4 55.5) rotate(-60)"
              />
            </g>
          </g>
          <g data-mark-blade="" style={{ mixBlendMode: "multiply" }}>
            <g clipPath="url(#company-mark-c2)">
              <g clipPath="url(#company-mark-c3)">
                <rect
                  fill="url(#company-mark-g2)"
                  x="-4.9"
                  y="28.8"
                  width="36.1"
                  height="37.5"
                  transform="translate(-22.1 13) rotate(-30.1)"
                />
              </g>
            </g>
          </g>
          <path
            data-mark-shell=""
            fill="#f7941e"
            d="M27.2,68.6c-1.5,0-3-.2-4.6-.4l-4.6-.5,4.1-2c.2-.1.5-.2.7-.3-8.6-1.8-16.3-6.3-21.9-13-.3-.3-.5-.7-.8-1,2.4,11.5,12.6,20.2,24.9,20.2s8.2-1,11.7-2.8c-3.2,0-6.4,0-9.5-.2"
          />
          <path
            data-mark-shell=""
            fill="#f7941e"
            d="M18,19c-1.4,0-2.8.1-4.2.3,7.3-3.4,15.8-4.2,23.8-1.5C31.3,8.1,26.2.2,26.2.2c0,0-8.9,10.8-16.6,22.3h0s-.1.2-.4.7c-.6.9-1.1,1.8-1.6,2.7h0c-1.9,3.1-4.5,8-5.9,11.8,0,0,3.1-3.9,6-7.2,4.5-5.1,10.1-8.7,16.4-10.8-2-.4-4.1-.6-6.2-.6"
          />
          <g data-mark-blade="" style={{ mixBlendMode: "multiply" }}>
            <g clipPath="url(#company-mark-c4)">
              <g clipPath="url(#company-mark-c5)">
                <rect fill="url(#company-mark-g3)" x="9.9" y="21.5" width="33.8" height="13.1" />
              </g>
            </g>
          </g>
          <path
            data-mark-shell=""
            fill="#f7941e"
            d="M50.5,37.5s-2.6-7.5-10.1-16.1c0,0,4.2,7.8,6.2,13.4,2.8,8.4,2.5,17.2-.5,25.4-1.1,3-2,4.1-2.9,5.7,5.8-4.6,9.4-12.2,9.4-19.7s-.8-5.4-2.1-8.7"
          />
        </g>
      </svg>
    </div>
  );
}
