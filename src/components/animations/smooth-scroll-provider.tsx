"use client";

import { createContext, useCallback, useContext, useEffect, useRef } from "react";
import Lenis from "lenis";

import { gsap, ScrollTrigger } from "@/lib/gsap";

type ScrollTarget = number | string | HTMLElement;
type ScrollOptions = { duration?: number };

type SmoothScrollContextValue = {
  scrollTo: (target: ScrollTarget, options?: ScrollOptions) => void;
};

const SmoothScrollContext = createContext<SmoothScrollContextValue>({
  scrollTo: () => {},
});

export const useSmoothScroll = () => useContext(SmoothScrollContext);

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Settle snap tuning — ported from the demo's main.js. */
const SETTLE_DELAY = 140; // ms of stillness that counts as "they stopped"
const SETTLE_RANGE = 0.38; // how near an edge must be, as a share of the screen
const SETTLE_DURATION = 0.6;

/**
 * Lenis smooth scrolling, driven by GSAP's ticker (one animation loop) and
 * synced to ScrollTrigger. Disabled for reduced-motion and touch devices,
 * where native scrolling is the better experience.
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const glidingRef = useRef(false);

  const scrollTo = useCallback((target: ScrollTarget, options?: ScrollOptions) => {
    const lenis = lenisRef.current;
    const duration = options?.duration ?? 1.6;

    if (lenis) {
      glidingRef.current = true;
      lenis.scrollTo(target, {
        duration,
        easing: easeInOutCubic,
        onComplete: () => {
          glidingRef.current = false;
        },
      });
      // Fallback for a glide that gets interrupted and never reports back.
      window.setTimeout(() => (glidingRef.current = false), duration * 1000 + 400);
      return;
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const behavior: ScrollBehavior = reduce ? "auto" : "smooth";
    if (typeof target === "number") window.scrollTo({ top: target, behavior });
    else {
      const el = typeof target === "string" ? document.querySelector(target) : target;
      el?.scrollIntoView({ behavior });
    }
  }, []);

  // ─── Lenis lifecycle ───
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduce || coarse) return;

    const instance = new Lenis({ lerp: 0.09, autoRaf: false });
    lenisRef.current = instance;

    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    instance.on("scroll", ScrollTrigger.update);

    // Real input means the reader has taken over from any running glide.
    const release = () => (glidingRef.current = false);
    const inputs = ["wheel", "touchstart", "keydown"] as const;
    inputs.forEach((type) => window.addEventListener(type, release, { passive: true }));

    // ─── Settle snap: ease the last stretch to a section edge (desktop only) ───
    const desktop = window.matchMedia("(min-width: 1024px)");

    let timer = 0;
    let lastY = window.scrollY;
    let direction = 0;

    const stopOffsets = () => {
      const limit = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const offsets = Array.from(document.querySelectorAll<HTMLElement>("[data-snap]")).map((el) =>
        Math.max(0, Math.min(limit, Math.round(el.getBoundingClientRect().top + window.scrollY))),
      );
      // The footer is a band, not a screen: its stop is the foot of the page.
      if (!offsets.length || limit > offsets[offsets.length - 1] + 8) offsets.push(limit);
      return offsets;
    };

    const settle = () => {
      if (glidingRef.current || !desktop.matches) return;
      const y = window.scrollY;
      const offsets = stopOffsets();
      if (offsets.length < 2) return;
      const range = window.innerHeight * SETTLE_RANGE;

      let ahead: number | null = null;
      let nearest: number | null = null;
      let nearestGap = Infinity;

      for (const offset of offsets) {
        const gap = Math.abs(offset - y);
        if (gap < nearestGap) {
          nearestGap = gap;
          nearest = offset;
        }
        if (direction > 0 && offset > y && (ahead === null || offset < ahead)) ahead = offset;
        if (direction < 0 && offset < y && (ahead === null || offset > ahead)) ahead = offset;
      }

      const target = ahead !== null && Math.abs(ahead - y) <= range ? ahead : nearest;
      if (target === null) return;

      const travel = Math.abs(target - y);
      if (travel <= 2 || travel > range) return;

      scrollTo(target, { duration: SETTLE_DURATION });
    };

    const onScroll = () => {
      const y = window.scrollY;
      if (y !== lastY) direction = y > lastY ? 1 : -1;
      lastY = y;
      window.clearTimeout(timer);
      timer = window.setTimeout(settle, SETTLE_DELAY);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      inputs.forEach((type) => window.removeEventListener(type, release));
      gsap.ticker.remove(tick);
      instance.destroy();
      lenisRef.current = null;
    };
  }, [scrollTo]);

  // ─── Smooth in-page anchors (delegated) ───
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const link = (event.target as Element | null)?.closest?.("a[href*='#']");
      if (!(link instanceof HTMLAnchorElement) || link.target === "_blank") return;

      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname.replace(/\/$/, "") !== window.location.pathname.replace(/\/$/, "")) return;

      const id = decodeURIComponent(url.hash.slice(1));
      const target = id ? document.getElementById(id) : null;
      if (!target) return;

      event.preventDefault();
      scrollTo(target);
      history.replaceState(history.state, "", url.hash);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [scrollTo]);

  // Late-settling images/fonts move trigger positions; re-measure once loaded.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    if (document.readyState === "complete") refresh();
    else window.addEventListener("load", refresh, { once: true });
    document.fonts?.ready.then(refresh);
    return () => window.removeEventListener("load", refresh);
  }, []);

  return (
    <SmoothScrollContext.Provider value={{ scrollTo }}>{children}</SmoothScrollContext.Provider>
  );
}
