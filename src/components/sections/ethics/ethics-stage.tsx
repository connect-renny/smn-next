"use client";

import { useRef, useState } from "react";

import { useSmoothScroll } from "@/components/animations/smooth-scroll-provider";
import { Droplet } from "@/components/ui/droplet";
import { ethicsPrinciples } from "@/content/ethics";
import type { Dictionary } from "@/i18n/get-dictionary";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";

import { EthicsEmblem, principleIcons } from "./ethics-emblem";

/** Keep in step with the `.ethics-*` media queries in sections.css. */
const PINNED =
  "(min-width: 64rem) and (min-height: 600px) and (prefers-reduced-motion: no-preference)";

/** Timeline units: one principle is 1, of which this much is the change to the next. */
const CHANGE = 0.45;
const FINALE = 0.8;
const COUNT = ethicsPrinciples.length;
const DURATION = COUNT - 1 + FINALE;
const SCREENS_PER_UNIT = 1.15;

const padded = (n: number) => String(n).padStart(2, "0");

/**
 * The four principles. On a large screen the section pins while the emblem turns
 * each petal towards its text and fills it in, so the flower is whole by the end.
 * Elsewhere, and for reduced motion, the principles are a plain list.
 */
export function EthicsStage({ copy }: { copy: Dictionary["ethics"] }) {
  const stage = useRef<HTMLDivElement>(null);
  const pin = useRef<ScrollTrigger | null>(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const { scrollTo } = useSmoothScroll();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ pinned: PINNED, motion: MOTION_OK }, (context) => {
        const root = stage.current;
        if (!root) return;
        const q = gsap.utils.selector(root);
        const emblem = q("[data-emblem]")[0];
        const spinner = q("[data-emblem-spin]")[0];
        const ring = q("[data-emblem-ring]")[0];
        const icons = q("[data-emblem-icon]");

        // Rotation is written as an SVG attribute so the icons can stay upright.
        const spin = { angle: 0 };
        const paint = () => {
          spinner.setAttribute("transform", `rotate(${spin.angle})`);
          ring.setAttribute("transform", `rotate(${spin.angle * -0.5})`);
          icons.forEach((icon, i) =>
            icon.setAttribute("transform", `rotate(${-(spin.angle + i * 90)})`),
          );
        };

        if (!context.conditions?.pinned) {
          // The list: the emblem turns once as it passes, the principles rise in.
          gsap.to(spin, {
            angle: 360,
            ease: "none",
            onUpdate: paint,
            scrollTrigger: {
              trigger: emblem,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
            },
          });
          q("[data-principle]").forEach((article) => {
            gsap.from(article, {
              opacity: 0,
              y: 36,
              duration: 0.9,
              ease: "expo.out",
              scrollTrigger: { trigger: article, start: "top 88%", once: true },
            });
          });
          return () => {
            spinner.removeAttribute("transform");
            ring.removeAttribute("transform");
            icons.forEach((icon, i) => icon.setAttribute("transform", `rotate(${-i * 90})`));
          };
        }

        const articles = q("[data-principle]");
        const fills = q("[data-emblem-fill]");
        const glows = q("[data-glow]");
        // The active petal points across the stage at its own text.
        const facing = document.documentElement.dir === "rtl" ? -90 : 90;
        const angleFor = (i: number) => facing - i * 90;

        spin.angle = angleFor(0);
        paint();
        gsap.set(articles.slice(1), { opacity: 0, y: 48 });
        gsap.set(fills.slice(1), { opacity: 0 });
        gsap.set(icons.slice(1), { opacity: 0.35 });
        gsap.set(glows.slice(1), { opacity: 0 });

        gsap.from(emblem, {
          scale: 0.7,
          opacity: 0,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top 80%", end: "top 15%", scrub: 0.5 },
        });

        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root,
            pin: true,
            start: "top top",
            end: () => `+=${window.innerHeight * DURATION * SCREENS_PER_UNIT}`,
            scrub: 0.5,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const next = Math.min(COUNT - 1, Math.floor(self.progress * DURATION + CHANGE / 2));
              if (next !== activeRef.current) {
                activeRef.current = next;
                setActive(next);
              }
            },
          },
        });
        pin.current = timeline.scrollTrigger ?? null;

        for (let i = 1; i < COUNT; i++) {
          const at = i - CHANGE;
          timeline
            .to(articles[i - 1], { opacity: 0, y: -48, duration: 0.2, ease: "power2.in" }, at)
            .to(articles[i], { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" }, at + 0.2)
            .to(
              spin,
              { angle: angleFor(i), duration: CHANGE, ease: "power2.inOut", onUpdate: paint },
              at,
            )
            .to(fills[i - 1], { opacity: 0.45, duration: CHANGE }, at)
            .to(fills[i], { opacity: 1, duration: CHANGE }, at)
            .to(icons[i - 1], { opacity: 0.6, duration: CHANGE }, at)
            .to(icons[i], { opacity: 1, duration: CHANGE }, at)
            .to(glows[i - 1], { opacity: 0, duration: CHANGE }, at)
            .to(glows[i], { opacity: 1, duration: CHANGE }, at);
        }

        // Every principle lit: the flower is whole before the section lets go.
        timeline
          .to(fills, { opacity: 1, duration: 0.3 }, COUNT - 1 + 0.35)
          .to(icons, { opacity: 1, duration: 0.3 }, COUNT - 1 + 0.35)
          .set({}, {}, DURATION);

        return () => {
          pin.current = null;
          activeRef.current = 0;
          setActive(0);
          spinner.removeAttribute("transform");
          ring.removeAttribute("transform");
          icons.forEach((icon, i) => icon.setAttribute("transform", `rotate(${-i * 90})`));
        };
      });
      return () => mm.revert();
    },
    { scope: stage },
  );

  const goTo = (i: number) => {
    const trigger = pin.current;
    if (!trigger) return;
    // Land just past the change, where this principle is fully in place.
    const time = i === 0 ? 0 : i + 0.04;
    scrollTo(trigger.start + (trigger.end - trigger.start) * (time / DURATION), { duration: 1.1 });
  };

  return (
    <div ref={stage} className="ethics-stage">
      {ethicsPrinciples.map(({ id, colors }) => (
        <span
          key={id}
          data-glow
          aria-hidden
          className="ethics-glow"
          style={{ "--glow": colors[0] } as React.CSSProperties}
        />
      ))}

      <div data-emblem className="ethics-emblem">
        <EthicsEmblem idPrefix="ethics-stage" className="block size-full overflow-visible" />
      </div>

      <div className="ethics-copy">
        <h2 className="ethics-eyebrow">
          <Droplet />
          {copy.principlesLabel}
        </h2>

        <div className="ethics-principles">
          {ethicsPrinciples.map(({ id, colors }, i) => {
            const Icon = principleIcons[id];
            const principle = copy.principles[id];
            return (
              <article
                key={id}
                data-principle
                className="ethics-principle"
                style={{ "--accent": colors[1] } as React.CSSProperties}
              >
                <p aria-hidden className="ethics-principle-mark">
                  <span dir="ltr" className="ethics-principle-number">
                    {padded(i + 1)}
                  </span>
                  <span className="ethics-principle-icon">
                    <Icon className="size-1/2" strokeWidth={1.7} />
                  </span>
                </p>
                <h3 className="ethics-principle-title">{principle.title}</h3>
                <p className="ethics-principle-text">{principle.text}</p>
              </article>
            );
          })}
        </div>

        <div role="group" aria-label={copy.railLabel} className="ethics-rail">
          {ethicsPrinciples.map(({ id, colors }, i) => (
            <button
              key={id}
              type="button"
              className="ethics-rail-step"
              aria-label={copy.principles[id].title}
              aria-current={active === i ? "step" : undefined}
              data-done={i < active || undefined}
              style={{ "--accent": colors[1] } as React.CSSProperties}
              onClick={() => goTo(i)}
            >
              <span dir="ltr">{padded(i + 1)}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
