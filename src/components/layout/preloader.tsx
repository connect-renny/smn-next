"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Image from "next/image";

import { markPageReady, markPageRevealed } from "@/lib/page-ready";

const MIN_VISIBLE = 1600; // ms — long enough for the drop to land and the ring to run
const MAX_WAIT = 3500; // ms — never hold the page hostage to a slow asset
const TOP_UP = 500; // ms — progress ring closes before the reveal (matches CSS)
const REVEAL = 1100; // ms — iris opens from the centre (delay + duration in CSS)
const IDLE_PROGRESS = 72; // % — the ring creeps to here while waiting, then closes

/**
 * Branded first-load overlay. The SMN droplet mark drops in, lands with a
 * squash, sends out ripples and then floats while a progress ring runs round
 * it; once the page is ready the ring closes and an iris opens from the
 * centre onto the site. Server-rendered so it covers the very first paint
 * (the idle motion is pure CSS and runs before hydration); hidden by
 * <noscript> CSS without JS.
 */
export function Preloader({ alt }: { alt: string }) {
  const [state, setState] = useState<"loading" | "full" | "leaving" | "gone">("loading");
  const [progress, setProgress] = useState(0);

  // Start the ring on the frame after hydration so the CSS transition runs.
  useEffect(() => {
    const raf = requestAnimationFrame(() => setProgress(IDLE_PROGRESS));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const started = performance.now();
    let done = false;
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));

    const finish = () => {
      if (done) return;
      done = true;
      later(
        () => {
          setState("full");
          later(() => {
            setState("leaving");
            markPageReady();
            later(markPageRevealed, REVEAL);
            later(() => setState("gone"), REVEAL + 50);
          }, TOP_UP);
        },
        Math.max(0, MIN_VISIBLE - (performance.now() - started)),
      );
    };

    if (document.readyState === "complete") finish();
    else window.addEventListener("load", finish, { once: true });
    later(finish, MAX_WAIT);

    return () => {
      window.removeEventListener("load", finish);
      timers.forEach(window.clearTimeout);
    };
  }, []);

  if (state === "gone") return null;

  return (
    <div
      aria-hidden
      data-preloader
      data-state={state}
      className="preloader"
      style={{ "--pl-offset": state === "loading" ? 100 - progress : 0 } as CSSProperties}
    >
      <div className="preloader-stage">
        <svg viewBox="0 0 200 200" className="preloader-scene">
          <defs>
            <linearGradient id="pl-progress" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ffc35a" />
              <stop offset="1" stopColor="#f79431" />
            </linearGradient>
          </defs>

          {/* Orbit: dashed ring with a little droplet and a spark riding it */}
          <g className="pl-orbit">
            <circle cx="100" cy="100" r="92" className="pl-orbit-ring" />
            <path
              d="M100 1 C103.5 6 107 9.5 107 13.5 a7 7 0 0 1 -14 0 C93 9.5 96.5 6 100 1 Z"
              fill="#2f8fd8"
              stroke="#fff"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            <circle cx="100" cy="192" r="4.5" fill="#5cc163" stroke="#fff" strokeWidth="2.2" />
          </g>

          {/* Progress ring */}
          <circle cx="100" cy="100" r="74" className="pl-track" />
          <circle cx="100" cy="100" r="74" pathLength={100} className="pl-progress" />

          {/* Landing ripples */}
          <ellipse cx="100" cy="150" rx="26" ry="5" className="pl-ripple" />
          <ellipse cx="100" cy="150" rx="26" ry="5" className="pl-ripple pl-ripple-late" />

          {/* Twinkles */}
          <path
            d="M0 -9 Q1.5 -1.5 9 0 Q1.5 1.5 0 9 Q-1.5 1.5 -9 0 Q-1.5 -1.5 0 -9 Z"
            className="pl-spark"
            style={{ translate: "30px 52px", animationDelay: "0.9s" }}
          />
          <path
            d="M0 -7 Q1.2 -1.2 7 0 Q1.2 1.2 0 7 Q-1.2 1.2 -7 0 Q-1.2 -1.2 0 -7 Z"
            className="pl-spark"
            style={{ translate: "172px 62px", animationDelay: "1.4s" }}
          />
          <path
            d="M0 -6 Q1 -1 6 0 Q1 1 0 6 Q-1 1 -6 0 Q-1 -1 0 -6 Z"
            className="pl-spark"
            style={{ translate: "160px 160px", animationDelay: "1.9s" }}
          />
        </svg>

        {/* The mark: drop-in → squash → float */}
        <div className="pl-mark">
          <div className="pl-mark-float">
            <Image
              src="/images/brand/smn-mark.svg"
              alt={alt}
              width={53}
              height={72}
              priority
              unoptimized
            />
          </div>
        </div>
      </div>
    </div>
  );
}
