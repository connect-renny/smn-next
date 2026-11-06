"use client";

import { useRef } from "react";
import { ArrowUpRight, FileText } from "lucide-react";

import { Droplet } from "@/components/ui/droplet";
import { ethicsCharterHref } from "@/content/ethics";
import type { Dictionary } from "@/i18n/get-dictionary";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

import { EthicsEmblem } from "./ethics-emblem";

/** Where the principles are written down: three sheets that fan out as they are reached. */
export function EthicsCharter({ copy }: { copy: Dictionary["ethics"]["charter"] }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(scope);
        gsap.from(q("[data-sheet]"), {
          rotate: 0,
          x: 0,
          y: 24,
          ease: "power2.out",
          scrollTrigger: { trigger: scope.current, start: "top 85%", end: "top 40%", scrub: 0.6 },
        });
        gsap.from(q("[data-charter-copy]"), {
          opacity: 0,
          y: 32,
          duration: 1,
          ease: "expo.out",
          stagger: 0.09,
          scrollTrigger: { trigger: scope.current, start: "top 72%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope },
  );

  return (
    <div ref={scope} className="company-column ethics-charter">
      <a
        href={ethicsCharterHref}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={-1}
        aria-hidden
        className="ethics-sheets"
      >
        <span data-sheet className="ethics-sheet ethics-sheet-back" />
        <span data-sheet className="ethics-sheet ethics-sheet-middle" />
        <span data-sheet className="ethics-sheet ethics-sheet-front">
          <EthicsEmblem idPrefix="ethics-sheet" icons={false} className="ethics-sheet-emblem" />
          <span dir="auto" className="ethics-sheet-title">
            {copy.sheetTitle}
          </span>
          <span aria-hidden className="ethics-sheet-lines">
            <i />
            <i />
            <i />
          </span>
        </span>
      </a>

      <div>
        <Droplet />
        <h2 data-charter-copy className="ethics-charter-title">
          {copy.title}
        </h2>
        <a
          data-charter-copy
          href={ethicsCharterHref}
          target="_blank"
          rel="noopener noreferrer"
          className="ethics-charter-link"
        >
          <span className="ethics-charter-type">
            <FileText aria-hidden className="size-[1.2em]" strokeWidth={1.8} />
            <b dir="ltr">PDF</b>
          </span>
          <span>{copy.action}</span>
          <ArrowUpRight aria-hidden className="ethics-charter-arrow rtl:-scale-x-100" />
        </a>
      </div>
    </div>
  );
}
