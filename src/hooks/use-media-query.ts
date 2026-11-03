"use client";

import { useSyncExternalStore } from "react";

/**
 * Subscribes to a CSS media query. Returns `serverValue` during SSR and
 * hydration, then the live value — no effect-driven re-render needed.
 */
export function useMediaQuery(query: string, serverValue = false) {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

const noop = () => () => {};

/** Visitor asked the browser to save data (Network Information API). */
export function useSaveData() {
  return useSyncExternalStore(
    noop,
    () =>
      (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData ??
      false,
    () => false,
  );
}

/** A value that is only known in the browser (feature detection). */
export function useClientValue<T>(get: () => T, serverValue: T) {
  return useSyncExternalStore(noop, get, () => serverValue);
}
