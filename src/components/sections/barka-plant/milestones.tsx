"use client";

import Image from "next/image";
import { useRef } from "react";

import { Droplet } from "@/components/ui/droplet";
import { Lines } from "@/components/ui/lines";
import type { Dictionary } from "@/i18n/get-dictionary";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

/** Keep in step with the pinned media query of `.mile-stage` in sections.css. */
const PINNED =
  "(min-width: 64rem) and (min-height: 600px) and (prefers-reduced-motion: no-preference)";
const STACKED = `(max-width: 63.99rem) and ${MOTION_OK}`;

/** Timeline units: the drop takes 1 to run between two milestones. */
const LEAD = 0.5;
const TAIL = 0.9;
const SCREENS_PER_UNIT = 0.3;

const yearOf = (date: string) => date.match(/\d{4}/)?.[0] ?? "";

/**
 * One reel per digit of the background year, with each digit listed once in the
 * order it appears, so a digit that doesn't change between two years stays still.
 */
function buildReels(years: readonly string[]) {
  return [0, 1, 2, 3].map((position) => {
    const digits: string[] = [];
    const rowOfYear = years.map((year) => {
      const digit = year[position] ?? "";
      if (digits.at(-1) !== digit) digits.push(digit);
      return digits.length - 1;
    });
    return { digits, rowOfYear };
  });
}

/**
 * The milestones as one journey: a drop of water runs along the line, and each
 * milestone it reaches sends out a ripple, grows its stem and raises its date,
 * while the outlined year behind turns like an odometer. On a large screen the
 * section pins for the run; on small screens the line runs down the page as it
 * scrolls. Without motion, or on a short large screen, it is simply the full timeline.
 */
export function BarkaMilestones({ copy }: { copy: Dictionary["barkaPlant"]["milestones"] }) {
  const stage = useRef<HTMLDivElement>(null);
  const years = copy.items.map((item) => yearOf(item.date));
  const reels = buildReels(years);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ pinned: PINNED, stacked: STACKED }, (context) => {
        const root = stage.current;
        if (!root) return;
        const pinned = Boolean(context.conditions?.pinned);
        const q = gsap.utils.selector(root);
        const direction = document.documentElement.dir === "rtl" ? -1 : 1;

        const fill = q("[data-mile-fill]");
        const rider = q("[data-mile-rider]");
        const drop = q("[data-mile-drop]");
        const nodes = q("[data-mile-node]");
        const ripples = q("[data-mile-ripple]");
        const stems = q("[data-mile-stem]");
        const dates = q("[data-mile-date]");
        const labels = q("[data-mile-label]");
        const reelEls = q("[data-mile-reel]");
        const last = copy.items.length - 1;

        gsap.set([rider, q("[data-mile-year]")], { visibility: "visible" });
        gsap.set(fill, pinned ? { scaleX: 0 } : { scaleY: 0 });
        gsap.set(nodes, { backgroundColor: "rgba(255,255,255,1)" });
        gsap.set(stems, { scaleY: 0 });
        gsap.set(dates, { yPercent: 110 });
        gsap.set(labels, { autoAlpha: 0, y: 14 });

        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: pinned
            ? {
                trigger: root,
                pin: true,
                start: "top top",
                end: () => `+=${window.innerHeight * (LEAD + last + TAIL) * SCREENS_PER_UNIT}`,
                scrub: 0.5,
                anticipatePin: 1,
                invalidateOnRefresh: true,
              }
            : {
                trigger: q("[data-mile-track]")[0],
                start: "top 70%",
                end: "bottom 70%",
                scrub: 0.5,
              },
        });

        // A milestone answers as the drop arrives at it.
        const arrive = (i: number, at: number) => {
          timeline
            .to(nodes[i], { backgroundColor: "rgba(255,255,255,0)", duration: 0.2 }, at)
            .to(nodes[i], { scale: 1.7, duration: 0.12, ease: "power2.out" }, at)
            .to(nodes[i], { scale: 1, duration: 0.3, ease: "power2.inOut" }, at + 0.12)
            .fromTo(
              ripples[i],
              { scale: 0.4, opacity: 0.9 },
              { scale: 1, opacity: 0, duration: 0.8, ease: "power2.out", immediateRender: false },
              at,
            )
            .to(stems[i], { scaleY: 1, duration: 0.35, ease: "power2.out" }, at + 0.02)
            .to(dates[i], { yPercent: 0, duration: 0.35, ease: "power3.out" }, at + 0.18)
            .to(labels[i], { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out" }, at + 0.26);

          reels.forEach(({ digits, rowOfYear }, reel) => {
            if (i > 0 && rowOfYear[i] === rowOfYear[i - 1]) return;
            timeline.to(
              reelEls[reel],
              {
                yPercent: (-100 * (rowOfYear[i] ?? 0)) / digits.length,
                duration: 0.55,
                ease: "power3.inOut",
              },
              at + reel * 0.05,
            );
          });
        };

        arrive(0, LEAD * 0.2);

        for (let i = 1; i <= last; i++) {
          const leaves = LEAD + i - 1;
          const share = i / last;
          timeline
            .to(
              fill,
              {
                ...(pinned ? { scaleX: share } : { scaleY: share }),
                duration: 1,
                ease: "sine.inOut",
              },
              leaves,
            )
            .to(
              rider,
              {
                ...(pinned ? { xPercent: direction * 100 * share } : { yPercent: 100 * share }),
                duration: 1,
                ease: "sine.inOut",
              },
              leaves,
            );
          arrive(i, leaves + 0.92);
        }

        // At the first milestone of all the drop sinks into the line, and the mark turns slowly.
        timeline
          .to(
            drop,
            { scale: 0, autoAlpha: 0, duration: 0.3, ease: "power2.in" },
            LEAD + last - 0.05,
          )
          .set({}, {}, LEAD + last + TAIL);

        if (pinned) {
          timeline.to(
            q("[data-mile-art]"),
            { rotate: direction * 16, duration: LEAD + last + TAIL },
            0,
          );
        }
      });
      return () => mm.revert();
    },
    { scope: stage, dependencies: [] },
  );

  return (
    <div ref={stage} className="mile-stage company-band text-white">
      <Image
        data-mile-art
        src="/images/our-company/hero-droplet.svg"
        alt=""
        width={528}
        height={718}
        className="mile-art"
      />

      <h2 data-animate="up" className="mile-title">
        <span dir="auto">{copy.title}</span>
      </h2>

      <div data-mile-track className="mile-track">
        <div data-mile-year aria-hidden dir="ltr" className="mile-year">
          {reels.map(({ digits }, reel) => (
            <span key={reel} className="mile-reel-window">
              <span data-mile-reel className="mile-reel">
                {digits.map((digit, row) => (
                  <span key={row}>{digit}</span>
                ))}
              </span>
            </span>
          ))}
        </div>

        <span aria-hidden className="mile-rail" />
        <span aria-hidden data-mile-fill className="mile-rail mile-fill" />
        <span aria-hidden data-mile-rider className="mile-rail mile-rider">
          <span data-mile-drop className="mile-drop-wrap">
            <span className="mile-trail" />
            <Droplet className="mile-drop w-(--mile-drop)!" />
          </span>
        </span>

        <ol className="mile-list">
          {copy.items.map((item) => (
            <li key={item.date} data-mile-item className="mile-item">
              <span aria-hidden data-mile-ripple className="mile-ripple" />
              <span aria-hidden data-mile-node className="mile-node" />
              <span aria-hidden data-mile-stem className="mile-stem" />
              <div className="mile-text">
                <p className="mile-date-mask">
                  <span data-mile-date className="mile-date">
                    <span dir="auto">{item.date}</span>
                  </span>
                </p>
                <p data-mile-label className="mile-label">
                  <Lines lines={[item.label]} />
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
