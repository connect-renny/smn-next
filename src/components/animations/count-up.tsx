"use client";

import { useRef } from "react";

import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

/** Formatting (decimals, thousands separators) is inferred from the authored text. */
function readSpec(raw: string) {
  const dot = raw.indexOf(".");
  return {
    value: parseFloat(raw.replace(/,/g, "")),
    decimals: dot === -1 ? 0 : raw.length - dot - 1,
    grouped: raw.includes(","),
  };
}

function format(n: number, spec: ReturnType<typeof readSpec>) {
  const [int, frac] = n.toFixed(spec.decimals).split(".");
  const grouped = spec.grouped ? int.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : int;
  return frac ? `${grouped}.${frac}` : grouped;
}

/**
 * Counts up to `value` when scrolled into view. The final figure is rendered on
 * the server (SEO, no-JS, reduced motion) and an invisible copy reserves its
 * width, so nothing beside the number shifts while the digits climb.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const scope = useRef<HTMLSpanElement>(null);
  const output = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = output.current;
      const spec = readSpec(value);
      if (!el || Number.isNaN(spec.value)) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const counter = { n: 0 };
        el.textContent = format(0, spec);
        gsap.to(counter, {
          n: spec.value,
          duration: 1.8,
          ease: "power3.out",
          scrollTrigger: { trigger: scope.current, start: "top 85%", once: true },
          onUpdate: () => {
            el.textContent = format(counter.n, spec);
          },
          onComplete: () => {
            el.textContent = value;
          },
        });
        return () => {
          el.textContent = value;
        };
      });
      return () => mm.revert();
    },
    { scope, dependencies: [value] },
  );

  return (
    <span ref={scope} className={`inline-grid tabular-nums ${className ?? ""}`}>
      <span className="sr-only">{value}</span>
      <span aria-hidden className="invisible col-start-1 row-start-1">
        {value}
      </span>
      <span ref={output} aria-hidden className="col-start-1 row-start-1">
        {value}
      </span>
    </span>
  );
}
